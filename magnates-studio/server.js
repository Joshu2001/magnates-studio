const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5173;

// Directory setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const proxiesDir = path.join(uploadsDir, 'proxies');
if (!fs.existsSync(proxiesDir)) {
  fs.mkdirSync(proxiesDir, { recursive: true });
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
app.use('/media/uploads/proxies', express.static(proxiesDir));
if (fs.existsSync(userDownloads)) {
  app.use('/media/downloads', express.static(userDownloads));
}

// Background Proxy Transcoder for Zero-Lag Timeline Scrubbing
function generateVideoProxy(inputPath, originalName, callback) {
  try {
    const parsed = path.parse(originalName);
    const proxyFileName = `proxy_${parsed.name}.mp4`;
    const proxyPath = path.join(proxiesDir, proxyFileName);

    if (fs.existsSync(proxyPath)) {
      if (callback) callback(null, { filename: proxyFileName, url: `/media/uploads/proxies/${encodeURIComponent(proxyFileName)}` });
      return;
    }

    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale=-2:540" -c:v libx264 -preset ultrafast -tune fastdecode -crf 28 -g 15 -pix_fmt yuv420p -c:a aac -b:a 128k "${proxyPath}"`;
    console.log(`[Proxy] Generating proxy for ${originalName}...`);
    exec(cmd, (err) => {
      if (err) {
        console.error(`[Proxy] Error generating proxy for ${originalName}:`, err.message);
        if (callback) callback(err);
      } else {
        console.log(`[Proxy] Successfully generated proxy: ${proxyFileName}`);
        if (callback) callback(null, { filename: proxyFileName, url: `/media/uploads/proxies/${encodeURIComponent(proxyFileName)}` });
      }
    });
  } catch (err) {
    if (callback) callback(err);
  }
}

// Batch file upload API
app.post('/api/upload', upload.array('files', 100), (req, res) => {
  try {
    const uploaded = (req.files || []).map(f => {
      const isVid = ['.mp4', '.mov', '.webm', '.mkv'].includes(path.extname(f.originalname).toLowerCase());
      if (isVid) {
        // Trigger background proxy generation immediately
        generateVideoProxy(f.path, f.originalname);
      }
      return {
        name: f.originalname,
        url: `/media/uploads/${encodeURIComponent(f.originalname)}`,
        size: f.size,
        path: f.path,
        isAudio: ['.wav', '.mp3', '.ogg', '.m4a', '.aac'].includes(path.extname(f.originalname).toLowerCase()),
        isVideo: isVid,
        isImage: ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(f.originalname).toLowerCase())
      };
    });
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

// Templates persistence endpoints
const templatesFile = path.join(__dirname, 'templates_state.json');

app.get('/api/templates', (req, res) => {
  try {
    if (fs.existsSync(templatesFile)) {
      const data = fs.readFileSync(templatesFile, 'utf8');
      res.json({ success: true, templates: JSON.parse(data) });
    } else {
      res.json({ success: true, templates: [] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, templates: [] });
  }
});

app.post('/api/templates', (req, res) => {
  try {
    const newTemplate = req.body;
    if (!newTemplate || !newTemplate.id || !newTemplate.name) {
      return res.status(400).json({ success: false, error: 'Invalid template payload' });
    }
    let list = [];
    if (fs.existsSync(templatesFile)) {
      try {
        list = JSON.parse(fs.readFileSync(templatesFile, 'utf8'));
      } catch (e) { list = []; }
    }
    const existingIdx = list.findIndex(t => t.id === newTemplate.id);
    if (existingIdx >= 0) {
      list[existingIdx] = newTemplate;
    } else {
      list.unshift(newTemplate);
    }
    fs.writeFileSync(templatesFile, JSON.stringify(list, null, 2), 'utf8');
    res.json({ success: true, message: 'Template saved successfully', template: newTemplate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/templates/:id', (req, res) => {
  try {
    const templateId = req.params.id;
    if (!fs.existsSync(templatesFile)) {
      return res.json({ success: true });
    }
    let list = JSON.parse(fs.readFileSync(templatesFile, 'utf8'));
    list = list.filter(t => t.id !== templateId);
    fs.writeFileSync(templatesFile, JSON.stringify(list, null, 2), 'utf8');
    res.json({ success: true, message: 'Template deleted' });
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

// Proxy Status and Request API
app.get('/api/proxy/status', (req, res) => {
  const filename = req.query.filename;
  if (!filename) return res.status(400).json({ error: 'Filename query required' });

  const parsed = path.parse(filename);
  const proxyFileName = `proxy_${parsed.name}.mp4`;
  const proxyPath = path.join(proxiesDir, proxyFileName);

  if (fs.existsSync(proxyPath)) {
    return res.json({
      ready: true,
      filename: proxyFileName,
      url: `/media/uploads/proxies/${encodeURIComponent(proxyFileName)}`
    });
  }
  res.json({ ready: false });
});

app.post('/api/proxy/generate', (req, res) => {
  const { filename, path: clientPath } = req.body;
  if (!filename) return res.status(400).json({ error: 'Filename required' });

  // Locate input file in uploads or downloads
  let inputPath = clientPath;
  if (!inputPath || !fs.existsSync(inputPath)) {
    const uploadCandidate = path.join(uploadsDir, filename);
    const dlCandidate = path.join(userDownloads, filename);
    if (fs.existsSync(uploadCandidate)) inputPath = uploadCandidate;
    else if (fs.existsSync(dlCandidate)) inputPath = dlCandidate;
    else return res.status(404).json({ error: 'Source video file not found' });
  }

  generateVideoProxy(inputPath, filename, (err, proxyInfo) => {
    if (err) return res.status(500).json({ error: 'Failed to generate proxy', details: err.message });
    res.json({ success: true, ...proxyInfo });
  });
});

function startServer(port) {
  const server = app.listen(port);
  
  server.on('listening', () => {
    const actualPort = server.address().port;
    console.log(`Magnates Studio running at http://localhost:${actualPort}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
