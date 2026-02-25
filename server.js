const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Serve uploaded PDFs publicly
app.use("/files", express.static(path.join(__dirname, "uploads")));

// Home page
app.get("/", (req, res) => {
  res.send(`
    <h2>PDF to URL Converter</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="pdf" accept="application/pdf" required />
      <button type="submit">Upload PDF</button>
    </form>
  `);
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + ".pdf";
    cb(null, uniqueName);
  },
});

// PDF filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Generate public URL
  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

  res.send(`
    <h3>✅ PDF uploaded successfully!</h3>
    <p>Public URL:</p>
    <a href="${fileUrl}" target="_blank">${fileUrl}</a>
    <br><br>
    <a href="/">Upload another PDF</a>
  `);
});

// Start server (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});