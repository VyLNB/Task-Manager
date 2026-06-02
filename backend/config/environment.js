import dotenv from "dotenv";
dotenv.config({ path: "./secrets/.env.local" });

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_PORT: process.env.APP_PORT,
  APP_PUBLIC_PORT: process.env.APP_PUBLIC_PORT,
  APP_HOST: process.env.APP_HOST,
  JWT_SECRET: process.env.JWT_SECRET || "xLvEJ5LF93MVUEzrYiStpqvF7xup8GJ8MdGTLhAa7GoCFZPcaubI19ytTstTpcsB",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "1Y4uv8BQt3DGeAtpOhFs2Sz6eQIvWzJ0EIRCsM07wrsH9WPOr8vOHYCFlZobt8ts",
  CLIENT_URL: process.env.CLIENT_URL,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};

export default env;