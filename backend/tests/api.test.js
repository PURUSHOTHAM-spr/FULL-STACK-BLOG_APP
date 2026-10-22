import bcrypt from "bcrypt";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret";

const { users, articles, resetStores, UserTypeModel, ArticleModel } =
  vi.hoisted(() => {
    const users = new Map();
    const articles = new Map();
    let nextId = 1;

    class Query {
      constructor(value) {
        this.value = value;
      }

      select() {
        return this;
      }

      populate() {
        return this;
      }

      then(resolve, reject) {
        return Promise.resolve(this.value).then(resolve, reject);
      }
    }

    class UserModel {
      constructor(data) {
        this._id = data._id || `user-${nextId++}`;
        Object.assign(this, data);
        this.followers ??= [];
        this.isActive ??= true;
      }

      async validate() {
        if (!this.firstName || !this.email || !this.password || !this.role) {
          const error = new Error("Validation failed");
          error.name = "ValidationError";
          throw error;
        }
      }

      async save() {
        users.set(this._id, this);
        return this;
      }

      toObject() {
        return { ...this };
      }

      static findOne(filter) {
        return new Query(
          [...users.values()].find((user) => user.email === filter.email) ||
            null,
        );
      }

      static findById(id) {
        return new Query(users.get(String(id)) || null);
      }

      static findByIdAndUpdate(id, update) {
        const user = users.get(String(id));
        if (user) Object.assign(user, update);
        return new Query(user || null);
      }
    }

    class Article {
      constructor(data) {
        this._id = data._id || `article-${nextId++}`;
        Object.assign(this, data);
        this.comments ??= [];
        this.isArticleActive ??= true;
      }

      async save() {
        articles.set(this._id, this);
        return this;
      }
    }

    Article.find = (filter) =>
      new Query(
        [...articles.values()].filter(
          (article) =>
            (filter.isArticleActive === undefined ||
              article.isArticleActive === filter.isArticleActive) &&
            (!filter.author || String(article.author) === String(filter.author)),
        ),
      );
    Article.findOne = (filter) =>
      new Query(
        [...articles.values()].find(
          (article) =>
            String(article._id) === String(filter._id) &&
            (!filter.author || String(article.author) === String(filter.author)) &&
            (filter.isArticleActive === undefined ||
              article.isArticleActive === filter.isArticleActive),
        ) || null,
      );
    Article.findById = (id) => new Query(articles.get(String(id)) || null);
    Article.findByIdAndUpdate = (id, update) => {
      const article = articles.get(String(id));
      if (article && update.$set) Object.assign(article, update.$set);
      return new Query(article || null);
    };
    Article.countDocuments = (filter) =>
      [...articles.values()].filter(
        (article) =>
          String(article.author) === String(filter.author) &&
          article.isArticleActive === filter.isArticleActive,
      ).length;

    return {
      users,
      articles,
      UserTypeModel: UserModel,
      ArticleModel: Article,
      resetStores: () => {
        users.clear();
        articles.clear();
        nextId = 1;
      },
    };
  });

vi.mock("../Models/UserModel.js", () => ({ UserTypeModel }));
vi.mock("../Models/ArticleModel.js", () => ({ ArticleModel }));
vi.mock("../config/cloudinary.js", () => ({
  default: { uploader: { destroy: vi.fn() } },
}));
vi.mock("../config/cloudinaryUpload.js", () => ({
  uploadToCloudinary: vi.fn(),
}));

const { validateRuntimeConfig } = await import("../config/runtime.js");
const { app } = await import("../server.js");

const seedUser = async ({ email, role }) => {
  const user = new UserTypeModel({
    firstName: role === "AUTHOR" ? "Author" : "Reader",
    email,
    password: await bcrypt.hash("correct-password", 10),
    role,
  });
  await user.save();
  return user;
};

describe("authentication, authorization, and article lifecycle", () => {
  beforeEach(() => {
    resetStores();
  });

  it("rejects invalid credentials and missing protected credentials", async () => {
    await seedUser({ email: "author@example.com", role: "AUTHOR" });

    const invalidLogin = await request(app).post("/common-api/login").send({
      email: "author@example.com",
      password: "wrong-password",
    });
    expect(invalidLogin.status).toBe(401);

    const missingToken = await request(app).get("/author-api/articles");
    expect(missingToken.status).toBe(401);
    expect(missingToken.body.message).toBe("Token missing");
  });

  it("enforces roles before allowing author article access", async () => {
    await seedUser({ email: "reader@example.com", role: "USER" });
    const agent = request.agent(app);

    const readerLogin = await agent.post("/common-api/login").send({
      email: "reader@example.com",
      password: "correct-password",
    });
    expect(readerLogin.status).toBe(200);

    const forbidden = await agent.get("/author-api/articles");
    expect(forbidden.status).toBe(403);
  });

  it("rejects a previously issued cookie after the account is blocked", async () => {
    const author = await seedUser({
      email: "blocked@example.com",
      role: "AUTHOR",
    });
    const agent = request.agent(app);

    const login = await agent.post("/common-api/login").send({
      email: "blocked@example.com",
      password: "correct-password",
    });
    expect(login.status).toBe(200);

    author.isActive = false;
    users.set(author._id, author);

    const blocked = await agent.get("/author-api/articles");
    expect(blocked.status).toBe(403);
    expect(blocked.body.message).toBe("Account is blocked");
  });

  it("rejects unsafe cookie requests from an unapproved origin", async () => {
    await seedUser({ email: "origin@example.com", role: "AUTHOR" });
    const agent = request.agent(app);

    const login = await agent.post("/common-api/login").send({
      email: "origin@example.com",
      password: "correct-password",
    });
    expect(login.status).toBe(200);

    const response = await agent
      .post("/author-api/articles")
      .set("Origin", "https://malicious.example")
      .send({
        title: "Blocked",
        category: "Testing",
        content: "Blocked",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Origin not allowed by CORS");
  });

  it("does not allow a non-admin to use the admin login route", async () => {
    await seedUser({ email: "not-admin@example.com", role: "USER" });

    const response = await request(app)
      .post("/admin-api/authenticate")
      .send({
        email: "not-admin@example.com",
        password: "correct-password",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Admin access required");
  });

  it("fails production configuration validation without a JWT secret", () => {
    const originalEnvironment = process.env.NODE_ENV;
    const originalJwtSecret = process.env.JWT_SECRET;
    const originalDbUrl = process.env.DB_URL;
    const originalCloudinary = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      legacyCloudName: process.env.CLOUD_NAME,
      legacyApiKey: process.env.API_KEY,
      legacyApiSecret: process.env.API_SECRET,
    };

    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    process.env.DB_URL = "mongodb://test-only";
    process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
    process.env.CLOUDINARY_API_KEY = "test-key";
    process.env.CLOUDINARY_API_SECRET = "test-secret";

    expect(() => validateRuntimeConfig()).toThrow(
      "JWT_SECRET",
    );

    process.env.NODE_ENV = originalEnvironment;
    if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalJwtSecret;
    if (originalDbUrl === undefined) delete process.env.DB_URL;
    else process.env.DB_URL = originalDbUrl;
    for (const [name, value] of Object.entries({
      CLOUDINARY_CLOUD_NAME: originalCloudinary.cloudName,
      CLOUDINARY_API_KEY: originalCloudinary.apiKey,
      CLOUDINARY_API_SECRET: originalCloudinary.apiSecret,
      CLOUD_NAME: originalCloudinary.legacyCloudName,
      API_KEY: originalCloudinary.legacyApiKey,
      API_SECRET: originalCloudinary.legacyApiSecret,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it("creates, reads, updates, soft-deletes, and filters an author's article", async () => {
    const author = await seedUser({
      email: "author@example.com",
      role: "AUTHOR",
    });
    const agent = request.agent(app);

    const login = await agent.post("/common-api/login").send({
      email: "author@example.com",
      password: "correct-password",
    });
    expect(login.status).toBe(200);
    expect(login.headers["set-cookie"]).toBeDefined();

    const created = await agent.post("/author-api/articles").send({
      title: "Initial title",
      category: "Testing",
      content: "Initial content",
    });
    expect(created.status).toBe(201);
    const articleId = created.body.payload._id;
    expect(created.body.payload.author).toBe(author._id);

    const listed = await agent.get("/author-api/articles");
    expect(listed.status).toBe(200);
    expect(listed.body.payload).toHaveLength(1);
    expect(listed.body.payload[0].title).toBe("Initial title");

    const updated = await agent.put("/author-api/articles").send({
      articleId,
      title: "Updated title",
      category: "Testing",
      content: "Updated content",
    });
    expect(updated.status).toBe(200);
    expect(updated.body.payload.title).toBe("Updated title");

    const deleted = await agent
      .patch(`/author-api/articles/${articleId}/status`)
      .send({ isArticleActive: false });
    expect(deleted.status).toBe(200);
    expect(deleted.body.article.isArticleActive).toBe(false);

    const filtered = await agent.get("/author-api/articles");
    expect(filtered.status).toBe(200);
    expect(filtered.body.payload).toHaveLength(0);
    expect(articles.get(articleId).content).toBe("Updated content");
  });
});
