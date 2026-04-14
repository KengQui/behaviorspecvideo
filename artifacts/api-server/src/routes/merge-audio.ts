import { Router } from "express";
import multer from "multer";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const router = Router();
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 500 * 1024 * 1024 } });

const COMBINED_AUDIO = path.resolve(
  __dirname,
  "..",
  "..",
  "behavior-spec-video",
  "public",
  "combined-audio-v2.wav"
);

router.post("/merge-audio", upload.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No video file provided" });
    return;
  }

  const inputVideo = req.file.path;
  const outputId = crypto.randomBytes(8).toString("hex");
  const outputPath = path.join(os.tmpdir(), `merged-${outputId}.mp4`);

  try {
    await fs.access(COMBINED_AUDIO);
  } catch {
    await cleanup(inputVideo);
    res.status(500).json({ error: "Combined audio track not found on server" });
    return;
  }

  const ffmpegCmd = `ffmpeg -y -loglevel error -i "${inputVideo}" -i "${COMBINED_AUDIO}" -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart -c:a aac -b:a 192k -shortest -map 0:v:0 -map 1:a:0 "${outputPath}" 2>&1`;

  exec(ffmpegCmd, { timeout: 300000, maxBuffer: 10 * 1024 * 1024 }, async (error, stdout, _stderr) => {
    if (error) {
      console.error("ffmpeg error:", error.message, stdout);
      await cleanup(inputVideo, outputPath);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to merge audio with video", details: stdout?.slice(-500) });
      }
      return;
    }

    try {
      const stat = await fs.stat(outputPath);
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Disposition", 'attachment; filename="video-with-audio.mp4"');

      const { createReadStream } = await import("fs");
      const stream = createReadStream(outputPath);
      stream.pipe(res);
      stream.on("end", () => cleanup(inputVideo, outputPath));
      stream.on("error", () => {
        cleanup(inputVideo, outputPath);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to stream output" });
        }
      });

      res.on("close", () => {
        if (!res.writableFinished) {
          cleanup(inputVideo, outputPath);
        }
      });
    } catch {
      await cleanup(inputVideo, outputPath);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to read merged output" });
      }
    }
  });
});

async function cleanup(...files: string[]) {
  for (const f of files) {
    try { await fs.unlink(f); } catch {}
  }
}

export default router;
