const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve files publicly
app.use("/files", express.static(uploadDir));

// Root route (IMPORTANT)
app.get("/", (req, res) => {
  res.send(`
    <h2>PDF to URL Converter</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="pdf" accept="application/pdf" required />
      <button type="submit">Upload PDF</button>
    </form>
  `);
});

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".pdf");
  },
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {

  if (!req.file) {
    return res.send("No file uploaded");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

  res.send(`
    <h3>Upload successful</h3>
    <a href="${fileUrl}" target="_blank">${fileUrl}</a>
    <br><br>
    <a href="/">Upload another</a>
  `);

});

// Listen
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});