const Session = require('../models/Session');

async function listPublic(req, res) {
  try {
    const sessions = await Session.find({ status: 'published' }).sort({ created_at: -1 }).limit(100);
    res.json(sessions);
  } catch (err) {
    console.error('listPublic error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function listMine(req, res) {
  try {
    const sessions = await Session.find({ user_id: req.user.id }).sort({ updated_at: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('listMine error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getMineById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id, user_id: req.user.id });
    if (!session) return res.status(404).json({ error: 'Not Found' });
    res.json(session);
  } catch (err) {
    console.error('getMineById error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function saveDraft(req, res) {
  try {
    const { id, title, tags, json_file_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    let tagsArr = [];
    if (typeof tags === 'string') {
      tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArr = tags.map((t) => String(t).trim()).filter(Boolean);
    }

    let s;
    if (id) {
      s = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user.id },
        { title, tags: tagsArr, json_file_url, status: 'draft' },
        { new: true }
      );
      if (!s) return res.status(404).json({ error: 'Not Found' });
    } else {
      s = await Session.create({ user_id: req.user.id, title, tags: tagsArr, json_file_url, status: 'draft' });
    }

    res.json(s);
  } catch (err) {
    console.error('saveDraft error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function publish(req, res) {
  try {
    const { id, title, tags, json_file_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    let tagsArr = [];
    if (typeof tags === 'string') {
      tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArr = tags.map((t) => String(t).trim()).filter(Boolean);
    }

    if (!id) {
      const s = await Session.create({ user_id: req.user.id, title, tags: tagsArr, json_file_url, status: 'published' });
      return res.status(201).json(s);
    }

    const s = await Session.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { title, tags: tagsArr, json_file_url, status: 'published' },
      { new: true }
    );
    if (!s) return res.status(404).json({ error: 'Not Found' });
    res.json(s);
  } catch (err) {
    console.error('publish error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { listPublic, listMine, getMineById, saveDraft, publish };
