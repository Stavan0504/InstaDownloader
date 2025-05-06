import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/api/reels", (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "URL is required" });
  }
  //   (async () => {
  //     try {
  //       const browser = await puppeteer.launch({ headless: true });
  //       const page = await browser.newPage();
  //       await page.goto(url as string, { waitUntil: "networkidle2" });
  //       const reels = await page.evaluate(() => {
  //         const elements = document.querySelectorAll("video");
  //         console.log(document.querySelectorAll("video"))
  //         console.log(elements);
  //         return Array.from(elements).map((element) => element.src);
  //       });
  //       console.log(reels);
  //       return res.status(200).json({ reels: reels });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ error: "Failed to fetch reels" });
  //     }
  //   })();
  const ytDlpPath = `"C:\\Users\\Stavan\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python311\\Scripts\\yt-dlp.exe"`;
  exec(`${ytDlpPath} -g "${url}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).json({ error: 'Failed to get video URL' });
    }

    const videoUrl = stdout.trim();
    console.log(`Video URL: ${videoUrl}`);
    res.json({ videoUrl });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
