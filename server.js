const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync("uploads")) {
fs.mkdirSync("uploads");
}

app.use(express.static("public"));

// FIX: open PDF in browser instead of download
app.get("/files/:filename", (req, res) => {

const filePath = path.join(__dirname, "uploads", req.params.filename);

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "inline");

res.sendFile(filePath);

});

const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, "uploads/"),
filename: (req, file, cb) =>
cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/upload", upload.single("pdf"), (req, res) => {

const url = `https://${req.get("host")}/files/${req.file.filename}`;

res.send(`
<p>Upload successful</p>
<a href="${url}" target="_blank">${url}</a>
`);

});

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});