const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        const filename = new Date().getTime() + '.' + file.originalname.split('.').pop();
        req.metadata = filename.split('.').shift() + '.json';
        cb(null, filename);
    },
});

const upload = multer({ storage });

const app = express();
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/", upload.single("file"), async (req, res) => {
    const metadataJson = JSON.stringify({
        image: `http://localhost:4000/images/${req.file.filename}`,
        ...req.body
    });

    fs.writeFile(`public/metadatas/${req.metadata}`, metadataJson, 'utf8', (err) => {
        if (err) {
            console.error('Lỗi khi ghi metadata vào tệp tin:', err);
            return;
        }
        console.log('Metadata đã được lưu trữ thành công trong tệp tin:');
    })
    return res.json({
        url: `http://localhost:4000/metadatas/${req.metadata}`
    });
});


app.get("/", async (req, res) => {
    res.send("imageUrl");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
