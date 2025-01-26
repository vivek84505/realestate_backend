const express = require("express");
const Routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", Routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
