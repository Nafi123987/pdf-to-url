const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// create uploads folder if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// serve public folder
app.use(express.static("public"));

// serve uploaded files
app.use("/files", express.static("uploads"));

// multer storage
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, "uploads/"),
filename: (req, file, cb) =>
cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// upload route
app.post("/upload", upload.single("pdf"), (req, res) => {

if(!req.file){
return res.send("Upload failed");
}

// IMPORTANT: use https always
const url = `https://${req.get("host")}/files/${req.file.filename}`;

res.send(`
<p>Upload successful</p>
<p><a href="${url}" target="_blank">${url}</a></p>
<button onclick="navigator.clipboard.writeText('${url}')">Copy Link</button>
`);

});

// start server
app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});