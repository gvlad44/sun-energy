import express from "express";

const port = 3001;

const app = express();

app.get("/", (req: any) => {
  console.log("Get request");
});

app.listen(port, () => {
  console.log(`Typescript app is running on ${port}`);
});
