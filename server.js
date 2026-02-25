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

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + ".pdf";
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Modern UI Home page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>PDF to URL Converter</title>
    <style>
      body {
        font-family: Arial;
        background: linear-gradient(135deg,#4facfe,#00f2fe);
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        margin:0;
      }
      .card {
        background:white;
        padding:30px;
        border-radius:12px;
        box-shadow:0 10px 25px rgba(0,0,0,0.2);
        text-align:center;
        width:350px;
      }
      h2 {margin-bottom:20px;}
      input {
        margin-bottom:15px;
      }
      button {
        background:#4facfe;
        color:white;
        border:none;
        padding:10px 20px;
        border-radius:6px;
        cursor:pointer;
      }
      button:hover {
        background:#00c6ff;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Upload PDF</h2>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="pdf" accept="application/pdf" required /><br>
        <button type="submit">Upload & Get URL</button>
      </form>
    </div>
  </body>
  </html>
  `);
});

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.send("No file uploaded");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

  res.send(`
    <h2>Upload Successful</h2>
    <p>Your PDF URL:</p>
    <a href="${fileUrl}" target="_blank">${fileUrl}</a>
    <br><br>
    <a href="/">Upload another PDF</a>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});