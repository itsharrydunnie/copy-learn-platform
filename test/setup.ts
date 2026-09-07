import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  jest,
} from "@jest/globals";

/**
 * Pacepard test environment
 *
 * Tests use an isolated in-memory MongoDB instance.
 * External infrastructure such as Redis, Bull, Paystack and ZeptoMail
 * should be mocked by individual tests when those integrations are involved.
 */

process.env.NODE_ENV = "test";
process.env.APP_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRE = "30d";
process.env.APP_PORT = "3000";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.PAYSTACK_SECRET_KEY = "test-paystack-secret";
process.env.PAYSTACK_CALLBACK_URL =
  "http://localhost:3000/api/v1/payment/callback";
process.env.ZEPTOMAIL_API_KEY = "test-zeptomail-api-key";
process.env.EMAIL_FROM_EMAIL = "test@example.com";
process.env.EMAIL_FROM_NAME = "Pacepard Test";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );

  jest.clearAllMocks();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongo) {
    await mongo.stop();
  }
});

jest.setTimeout(30000);
