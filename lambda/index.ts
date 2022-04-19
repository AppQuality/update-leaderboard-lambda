import { APIGatewayProxyResultV2 } from "aws-lambda";

import DB from "./db";

export async function main(): Promise<APIGatewayProxyResultV2> {
  const db = new DB({
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
  });
  // put the messages into the bucket from this lambda
  return {
    body: JSON.stringify({ message: "Hello World" }),
    statusCode: 200,
  };
}
