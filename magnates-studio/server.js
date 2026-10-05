const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 5173;

// Directory setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Downloads folder
const userDownloads = process.env.USERPROFILE 
  ? path.join(process.env.USERPROFILE, 'Downloads')
  : path.join(__dirname, 'uploads');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media/uploads', express.static(uploadsDir));
if (fs.existsSync(userDownloads)) {
  app.use('/media/downloads', express.static(userDownloads));
}

// Batch file upload API
app.post('/api/upload', upload.array('files', 100), (req, res) => {
  try {
    const uploaded = (req.files || []).map(f => ({
      name: f.originalname,
      url: `/media/uploads/${encodeURIComponent(f.originalname)}`,
      size: f.size,
      path: f.path,
      isAudio: ['.wav', '.mp3', '.ogg', '.m4a', '.aac'].includes(path.extname(f.originalname).toLowerCase()),
      isVideo: ['.mp4', '.mov', '.webm', '.mkv'].includes(path.extname(f.originalname).toLowerCase()),
      isImage: ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(f.originalname).toLowerCase())
    }));
    res.json({ success: true, files: uploaded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all media from uploads + downloads
app.get('/api/media', (req, res) => {
  try {
    const result = [];
    const seen = new Set();

    // 1. Scan uploads directory
    if (fs.existsSync(uploadsDir)) {
      const uploadFiles = fs.readdirSync(uploadsDir);
      for (const f of uploadFiles) {
        const fullPath = path.join(uploadsDir, f);
        try {
          const stat = fs.statSync(fullPath);
          seen.add(f.toLowerCase());
          result.push({
            name: f,
            path: fullPath,
            url: `/media/uploads/${encodeURIComponent(f)}`,
            size: stat.size,
            modified: stat.mtimeMs,
            isAudio: ['.wav', '.mp3', '.ogg', '.m4a', '.aac'].includes(path.extname(f).toLowerCase()),
            isVideo: ['.mp4', '.mov', '.webm', '.mkv'].includes(path.extname(f).toLowerCase()),
            isImage: ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(f).toLowerCase())
          });
        } catch(e) {}
      }
    }

    // 2. Scan Downloads directory
    if (fs.existsSync(userDownloads)) {
      const dlFiles = fs.readdirSync(userDownloads);
      for (const f of dlFiles) {
        if (seen.has(f.toLowerCase())) continue;
        const ext = path.extname(f).toLowerCase();
        if (['.wav', '.mp3', '.mp4', '.mov', '.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
          const fullPath = path.join(userDownloads, f);
          try {
            const stat = fs.statSync(fullPath);
            result.push({
              name: f,
              path: fullPath,
              url: `/media/downloads/${encodeURIComponent(f)}`,
              size: stat.size,
              modified: stat.mtimeMs,
              isAudio: ['.wav', '.mp3'].includes(ext),
              isVideo: ['.mp4', '.mov'].includes(ext),
              isImage: ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
            });
          } catch(e) {}
        }
      }
    }

    result.sort((a, b) => b.modified - a.modified);
    res.json({ files: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Project persistence endpoints
const projectFile = path.join(__dirname, 'project_state.json');

app.get('/api/project/state', (req, res) => {
  try {
    if (fs.existsSync(projectFile)) {
      const data = fs.readFileSync(projectFile, 'utf8');
      res.json({ success: true, state: JSON.parse(data) });
    } else {
      res.json({ success: true, state: null });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/project/state', (req, res) => {
  try {
    const state = req.body;
    fs.writeFileSync(projectFile, JSON.stringify(state, null, 2), 'utf8');
    res.json({ success: true, message: 'Project state saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Server-side Universal Video Transcoder & Export Processor
const { exec } = require('child_process');

app.post('/api/export/transcode', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file received.' });
  }

  const {
    aspectRatio = '16:9',
    width = 1920,
    height = 1080,
    fps = 30,
    bitrate = '15M',
    format = 'mp4',
    projectName = 'Magnates_Project'
  } = req.body;

  const inputPath = req.file.path;
  const safeName = (projectName || 'Magnates_Project').replace(/[^a-zA-Z0-9_-]/g, '_');
  const outputFileName = `${safeName}_${String(aspectRatio).replace(':', 'x')}_${width}x${height}_${Date.now()}.${format}`;
  const outputPath = path.join(uploadsDir, outputFileName);

  const bitrateStr = typeof bitrate === 'string' && (bitrate.endsWith('M') || bitrate.endsWith('k')) 
    ? bitrate 
    : `${bitrate}M`;

  let ffmpegCmd = '';
  if (format === 'mp4') {
    ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black" -c:v libx264 -preset fast -b:v ${bitrateStr} -maxrate ${bitrateStr} -bufsize 20M -r ${fps} -pix_fmt yuv420p -c:a aac -b:a 192k "${outputPath}"`;
  } else {
    ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black" -c:v libvpx-vp9 -b:v ${bitrateStr} -r ${fps} -c:a libopus -b:a 192k "${outputPath}"`;
  }

  console.log(`[Export] Executing FFmpeg: ${ffmpegCmd}`);
  exec(ffmpegCmd, (error, stdout, stderr) => {
    // Delete temp raw file to prevent memory/disk leaks
    try { fs.unlinkSync(inputPath); } catch(e) {}

    if (error) {
      console.error('[Export] FFmpeg error:', stderr);
      return res.status(500).json({ error: 'FFmpeg transcode failed', details: stderr });
    }

    const stat = fs.statSync(outputPath);
    res.json({
      success: true,
      filename: outputFileName,
      url: `/media/uploads/${encodeURIComponent(outputFileName)}`,
      size: stat.size
    });
  });
});

app.listen(PORT, () => {
  console.log(`Magnates Studio running at http://localhost:${PORT}`);
});
