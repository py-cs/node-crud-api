import { createServer } from "http";
import { router } from "./router/router";
import "dotenv/config";

const PORT = process.env.PORT || 4000;

export const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
