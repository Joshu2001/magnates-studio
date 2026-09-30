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

app.listen(PORT, () => {
  console.log(`Magnates Studio running at http://localhost:${PORT}`);
});
