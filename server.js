const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // IMPORTANT for Render
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Serve uploaded PDFs
app.use("/files", express.static("uploads"));

// Home page
app.get("/", (req, res) => {
  res.send(`
    <h2>Upload PDF</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="pdf" accept="application/pdf" required />
      <button type="submit">Upload PDF</button>
    </form>
  `);
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

  res.send(`
    <p>PDF uploaded successfully!</p>
    <p>Public URL:</p>
    <a href="${fileUrl}" target="_blank">${fileUrl}</a>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});