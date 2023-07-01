import express from "express";
import cors from "cors";
import { router } from "./routes/index.ts";

const port = 3001;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Typescript app is running on ${port}`);
});
