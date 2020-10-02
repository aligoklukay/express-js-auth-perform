const express = require("express");
const multer = require('multer');
const upload = multer({ dest: process.env.UPLOAD_DESTINATION });

const router = express.Router();

//Upload a file to uploads folder
router.post('/upload', upload.single('statement'), (req, res) => {
    console.log(`new upload = ${req.file.filename}\n`);
    console.log(req.file);
    res.json({ msg: 'Upload Works' });
 });

module.exports = router;
