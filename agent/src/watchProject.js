import chokidar from "chokidar";
import { reindexFile } from "./reindex.js";

chokidar
  .watch([
    "../../src",
  ])
  .on("change", reindexFile);