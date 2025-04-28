import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate API",
      version: "1.0.0",
      description: "Real Estate API Documentation",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
  },
  apis: [join(__dirname, "../models/*.js"), join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
