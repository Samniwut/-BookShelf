import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle GET requests at the root URL
app.get("/home", (req, res) => {
  if (res == null) {
   res.sendStatus("Not Found!!!")
  }
  res.sendFile(path.join(__dirname,"index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/home`);
});
