import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5008;

app.get("/", (req, res) => {
  res.send("My server is working");
  console.log("hello sam!");
});

app.get("/demo", (req, res) => {
  res.send("this is demo server");
  // console.log("hello sam!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Server is helpful");
});
