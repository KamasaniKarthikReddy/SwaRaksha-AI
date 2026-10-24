const express = require("express");
const { v4: uuid } = require("uuid");
const run = require("../chatAI/chat_api");
const { createWorker } = require('tesseract.js');
const router = express.Router();
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const corsConfig = require("../cors/corsConfig");

router.use(cors(corsConfig));

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (e) {
        console.error("Could not create uploads directory:", e.message);
    }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = fs.existsSync(uploadsDir) ? uploadsDir : "./";
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuid()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, uniqueName);
  },
});

router.use(bodyParser.json({ limit: "50mb" }));
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

router.get("/", (req, res) => {
  res.json({ message: "Image to Text API up and running :)" });
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG and WebP files are allowed!"), false);
  }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } 
});

router.post("/textract", upload.single("uploaded_files"), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
  }

  const filePath = req.file.path;
  console.log(`Processing medical report image: ${filePath}`);

  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();

    console.log(`OCR extraction complete. Extracted ${text?.length || 0} characters.`);

    let summaryData = "";
    if (text && text.trim().length > 0) {
        const prompt = `You are a medical assistant. Analyze the following medical report text and provide a comprehensive structured summary in Markdown format with sections for **Patient/Report Overview**, **Key Findings & Values**, **Interpretation**, and **Recommended Next Steps**:\n\n${text}`;
        summaryData = await run(prompt);
    } else {
        summaryData = `### Medical Report Summary\n\nNo readable text could be extracted from this image. Please ensure the document is clear, well-lit, and in high resolution.`;
    }

    res.json({ summaryData, rawText: text });
  } catch (err) {
    console.error("Error processing medical image:", err.message);
    res.status(200).json({
      summaryData: `### Report Processing Notice\n\nWe encountered an issue reading the text: ${err.message}. Please verify the file is a valid medical report image and try again.`,
    });
  } finally {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (cleanupErr) {
        console.warn("Failed to delete temp file:", cleanupErr.message);
    }
  }
});

module.exports = router;
