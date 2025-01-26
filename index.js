import express, { json } from "express";
import Routes from "./Routes";
import cors from "cors";
const app = express();
app.use(cors());

app.use(json());
app.use("/api", Routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
