import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectPostgres } from "./src/db/postgres.js";
import { connectMongo } from "./src/db/mongo.js";

const startServer = async () => {
  await connectPostgres();
  await connectMongo();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
