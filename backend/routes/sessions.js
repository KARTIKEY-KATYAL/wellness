const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/auth');
const { listPublic, listMine, getMineById, saveDraft, publish } = require('../controllers/sessionController');

// Public
router.get('/sessions', listPublic);

// Authed
router.get('/my-sessions', authRequired, listMine);
router.get('/my-sessions/:id', authRequired, getMineById);
router.post('/my-sessions/save-draft', authRequired, saveDraft);
router.post('/my-sessions/publish', authRequired, publish);

module.exports = router;
