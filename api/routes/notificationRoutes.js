const express = require('express');
const router = express.Router();

let deviceTokens = []; // store temporarily in memory (MongoDB preferred)

router.post('/register', (req, res) => {
  const { token } = req.body;
  if (token && !deviceTokens.includes(token)) {
    deviceTokens.push(token);
    console.log('Token registered:', token);
  }
  res.sendStatus(200);
});

// Export this list for use elsewhere (like in order POST)
router.get('/tokens', (req, res) => {
  res.json(deviceTokens);
});

module.exports = router;