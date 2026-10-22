const productionRequiredVariables = [
  "DB_URL",
  "JWT_SECRET",
];

const hasCloudinaryConfiguration = () =>
  Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME) &&
      (process.env.CLOUDINARY_API_KEY || process.env.API_KEY) &&
      (process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET),
  );

export const validateRuntimeConfig = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const missingVariables = productionRequiredVariables.filter(
    (name) => !process.env[name],
  );

  if (
    process.env.NODE_ENV === "production" &&
    !hasCloudinaryConfiguration()
  ) {
    missingVariables.push("CLOUDINARY_CLOUD_NAME/CLOUD_NAME");
    missingVariables.push("CLOUDINARY_API_KEY/API_KEY");
    missingVariables.push("CLOUDINARY_API_SECRET/API_SECRET");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required runtime configuration: ${missingVariables.join(", ")}`,
    );
  }
};
