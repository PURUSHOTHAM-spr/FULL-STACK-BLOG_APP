import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./AuthStore";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("authentication store", () => {
  beforeEach(() => {
    useAuth.setState({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("logs in with credentials and preserves cookie-based requests", async () => {
    axios.post.mockResolvedValue({
      data: { payload: { _id: "user-1", role: "USER" } },
    });

    await useAuth.getState().login({
      email: "reader@example.com",
      password: "correct-password",
      role: "USER",
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/common-api/login"),
      { email: "reader@example.com", password: "correct-password" },
      { withCredentials: true },
    );
    expect(useAuth.getState().isAuthenticated).toBe(true);
    expect(useAuth.getState().currentUser.role).toBe("USER");
  });

  it("reports login failures and clears authenticated state", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Invalid password" } },
    });

    await useAuth.getState().login({
      email: "reader@example.com",
      password: "wrong-password",
      role: "USER",
    });

    expect(useAuth.getState().isAuthenticated).toBe(false);
    expect(useAuth.getState().error).toBe("Invalid password");
  });
});
