import express, { Express } from "express";
import dotEnvExtended from "dotenv-extended";
import { initSentry } from "./sentry";
import api from "./api/index";
import { addSwagger } from "./swagger";
import { clearVotdCache } from "./cache";
import logger from "./logger";
import { requestLogger } from "./middleware/requestLogger";

dotEnvExtended.load();

const app: Express = express();
const port = process.env.PORT ?? 3000;

clearVotdCache();

app.use(express.json());
app.use(requestLogger);
app.use("/api", api);

addSwagger(app);

initSentry(app);

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

export default app;
