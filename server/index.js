import "dotenv/config";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// 1. Примусово вказуємо шлях до .env відносно кореня
import dotenv from "dotenv";
dotenv.config({ path: path.join(root, ".env") });

const app = express();
const port = Number(process.env.PORT || 3001);

// 2. Дозволені типи файлів
const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed"
]);

// 3. Ініціалізація multer (Ось цей блок створює змінну upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, allowed.has(file.mimetype))
});

// 4. Налаштування SMTP транспортера для Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "://gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true", // поверне false для 587 порту
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// 5. Обробник маршруту (Тепер upload визначено і помилки не буде)
app.post("/api/contact", upload.single("attachment"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const project = String(req.body.project || "").trim();

  if (!name || !email || !project) {
    return res.status(422).json({ success: false, message: "Please fill in all fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ success: false, message: "Please enter a valid email." });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nProject:\n${project}`,
      attachments: req.file ? [{
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype
      }] : []
    });

    res.json({ success: true, message: "Thanks! Your message has been sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not send the form. Check your SMTP settings."
    });
  }
});

app.use(express.static(path.join(root, "dist")));

// 6. Запуск сервера з явною прив'язкою до IPv4 інтерфейсу
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});