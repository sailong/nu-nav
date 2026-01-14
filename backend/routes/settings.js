const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// Get all settings (Public)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array to object for easier frontend consumption
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Setting (Protected) - Supports single object or array of objects
router.post('/', authenticateToken, async (req, res) => {
  const body = req.body;
  
  try {
    // Handle Batch Update
    if (Array.isArray(body)) {
      console.log('Processing batch update for:', body.length, 'items');
      // Use sequential execution with a loop to avoid SQLite concurrency/locking issues completely
      for (const item of body) {
        if (!item.key) continue;
        await prisma.setting.upsert({
          where: { id: item.key },
          update: { value: item.value || '' }, 
          create: { id: item.key, value: item.value || '' },
        });
      }
      return res.json({ message: 'Settings updated successfully' });
    }

    // Handle Single Update
    const { key, value } = body;
    if (!key) return res.status(400).json({ error: 'Key is required' });
    
    const setting = await prisma.setting.upsert({
      where: { id: key },
      update: { value: value || '' },
      create: { id: key, value: value || '' },
    });
    res.json(setting);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Database operation failed: ' + error.message });
  }
});

module.exports = router;
