import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectPostgres } from "./src/db/postgres.js";

const startServer = async () => {
  await connectPostgres();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
