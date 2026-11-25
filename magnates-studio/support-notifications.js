const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

function readJsonArray(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeJsonArray(filePath, items) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
}

function createSupportAndNotificationsRouter({ dataDir, uploadsDir }) {
  const router = express.Router();
  const ticketsFile = path.join(dataDir, 'support_tickets.json');
  const notificationsFile = path.join(dataDir, 'notifications_state.json');
  const supportUploadsDir = path.join(uploadsDir, 'support');

  if (!fs.existsSync(supportUploadsDir)) {
    fs.mkdirSync(supportUploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, supportUploadsDir),
    filename: (_req, file, cb) => {
      const safeName = String(file.originalname || 'attachment').replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}_${safeName}`);
    }
  });
  const upload = multer({
    storage,
    limits: { files: 10, fileSize: 25 * 1024 * 1024 }
  });

  const sseClients = new Set();

  function getNotifications() {
    return readJsonArray(notificationsFile).slice(0, 50);
  }

  function broadcastSse(eventName, payload) {
    const line = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const res of sseClients) {
      try {
        res.write(line);
      } catch (_) {
        sseClients.delete(res);
      }
    }
  }

  function pushNotification({ title, message, kind = 'info', meta = null }) {
    const list = getNotifications();
    const item = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: String(title || 'Notification'),
      message: String(message || ''),
      kind: String(kind || 'info'),
      read: false,
      createdAt: new Date().toISOString(),
      meta
    };
    list.unshift(item);
    const trimmed = list.slice(0, 50);
    writeJsonArray(notificationsFile, trimmed);
    const unreadCount = trimmed.filter((n) => !n.read).length;
    broadcastSse('notification', { item, unreadCount });
    return item;
  }

  async function dispatchEmailRolloutHook(ticket) {
    const webhookUrl = process.env.SUPPORT_WEBHOOK_URL;
    const targetEmail = process.env.SUPPORT_NOTIFY_EMAIL || '';
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ticket, targetEmail })
        });
        return { status: res.ok ? 'forwarded_webhook' : 'webhook_error', targetEmail, code: res.status };
      } catch (err) {
        return { status: 'webhook_error', targetEmail, error: err.message };
      }
    }
    return {
      status: 'queued_for_email_rollout',
      targetEmail: targetEmail || 'set SUPPORT_NOTIFY_EMAIL / SUPPORT_WEBHOOK_URL to forward'
    };
  }

  // Real-time Server-Sent Events stream for Alerts bell
  router.get('/notifications/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    const list = getNotifications();
    const unreadCount = list.filter((n) => !n.read).length;
    res.write(`event: init\ndata: ${JSON.stringify({ notifications: list, unreadCount })}\n\n`);

    const keepAlive = setInterval(() => {
      try { res.write(': ping\n\n'); } catch (_) {}
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  router.get('/notifications', (_req, res) => {
    const notifications = getNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ ok: true, notifications, unreadCount });
  });

  router.post('/notifications', (req, res) => {
    const title = String(req.body?.title || '').trim();
    const message = String(req.body?.message || '').trim();
    if (!title) return res.status(400).json({ ok: false, error: 'title is required' });
    const item = pushNotification({ title, message, kind: req.body?.kind || 'info' });
    res.json({ ok: true, item });
  });

  router.post('/notifications/read', (req, res) => {
    const id = req.body?.id ? String(req.body.id) : null;
    const list = getNotifications().map((n) => (
      !id || n.id === id ? { ...n, read: true } : n
    ));
    writeJsonArray(notificationsFile, list);
    const unreadCount = list.filter((n) => !n.read).length;
    broadcastSse('sync', { notifications: list, unreadCount });
    res.json({ ok: true, notifications: list, unreadCount });
  });

  // Customer Support Tickets (supports title, category, email, message + file/image attachments)
  router.get('/support/tickets', (_req, res) => {
    const tickets = readJsonArray(ticketsFile);
    res.json({ ok: true, tickets });
  });

  router.post('/support/tickets', upload.array('attachments', 10), async (req, res) => {
    const title = String(req.body?.title || '').trim();
    const message = String(req.body?.message || '').trim();
    const category = String(req.body?.category || 'General').trim();
    const email = String(req.body?.email || '').trim();

    if (!title) {
      return res.status(400).json({ ok: false, error: 'Please enter a title for your support request.' });
    }
    if (!message && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ ok: false, error: 'Please describe your issue or attach a file.' });
    }

    const attachments = (req.files || []).map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      url: `/media/uploads/support/${encodeURIComponent(f.filename)}`
    }));

    const ticket = {
      id: `TKT-${Date.now().toString(36).toUpperCase()}`,
      title,
      category,
      email,
      message,
      attachments,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    ticket.emailDispatch = await dispatchEmailRolloutHook(ticket);

    const tickets = readJsonArray(ticketsFile);
    tickets.unshift(ticket);
    writeJsonArray(ticketsFile, tickets.slice(0, 200));

    pushNotification({
      title: `Support ticket ${ticket.id}`,
      message: `${title}${attachments.length ? ` (${attachments.length} attachment${attachments.length > 1 ? 's' : ''})` : ''}`,
      kind: 'support',
      meta: { ticketId: ticket.id }
    });

    res.json({ ok: true, ticket });
  });

  return router;
}

module.exports = { createSupportAndNotificationsRouter };
