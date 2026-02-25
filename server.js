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
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PDF to URL Converter</title>

<style>

body{
font-family: Arial, sans-serif;
background: linear-gradient(135deg,#667eea,#764ba2);
margin:0;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
color:#333;
}

.container{
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 10px 30px rgba(0,0,0,0.2);
width:400px;
text-align:center;
}

h2{
margin-bottom:10px;
color:#444;
}

.drop-area{
border:2px dashed #667eea;
padding:30px;
border-radius:10px;
cursor:pointer;
margin:15px 0;
transition:0.3s;
}

.drop-area:hover{
background:#f0f3ff;
}

button{
background:#667eea;
color:white;
border:none;
padding:10px 20px;
border-radius:6px;
cursor:pointer;
font-size:16px;
margin-top:10px;
}

button:hover{
background:#5a67d8;
}

.progress{
width:100%;
background:#eee;
border-radius:6px;
margin-top:10px;
display:none;
}

.progress-bar{
height:10px;
background:#667eea;
width:0%;
border-radius:6px;
}

.result{
margin-top:15px;
word-break:break-all;
}

.copy-btn{
background:#28a745;
margin-top:10px;
}

.copy-btn:hover{
background:#218838;
}

footer{
margin-top:15px;
font-size:12px;
color:#888;
}

</style>
</head>

<body>

<div class="container">

<h2>📄 PDF to URL Converter</h2>

<form id="uploadForm" enctype="multipart/form-data">

<div class="drop-area" onclick="fileInput.click()">
Click or Drag PDF here
<input type="file" name="pdf" accept="application/pdf" hidden id="fileInput">
</div>

<button type="submit">Upload PDF</button>

<div class="progress">
<div class="progress-bar" id="progressBar"></div>
</div>

</form>

<div class="result" id="result"></div>

<footer>
Secure • Fast • Free
</footer>

</div>

<script>

const form = document.getElementById("uploadForm");
const progress = document.querySelector(".progress");
const progressBar = document.getElementById("progressBar");
const result = document.getElementById("result");

form.addEventListener("submit", async (e)=>{
e.preventDefault();

const file = document.getElementById("fileInput").files[0];
if(!file){
alert("Select PDF first");
return;
}

const formData = new FormData();
formData.append("pdf", file);

progress.style.display="block";

const xhr = new XMLHttpRequest();

xhr.upload.onprogress = (e)=>{
let percent = (e.loaded/e.total)*100;
progressBar.style.width = percent + "%";
};

xhr.onload = ()=>{
if(xhr.status==200){

const url = xhr.responseText.match(/https?:\/\/[^"]+/)[0];

result.innerHTML = \`
<a href="\${url}" target="_blank">\${url}</a>
<br>
<button class="copy-btn" onclick="copyURL('\${url}')">Copy Link</button>
\`;

}else{
result.innerHTML="Upload failed";
}
};

xhr.open("POST","/upload");
xhr.send(formData);

});

function copyURL(url){
navigator.clipboard.writeText(url);
alert("Link copied!");
}

</script>

</body>
</html>
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