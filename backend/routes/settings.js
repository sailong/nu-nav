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

// Update Setting (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { key, value } = req.body;
  try {
    const setting = await prisma.setting.upsert({
      where: { id: key },
      update: { value },
      create: { id: key, value },
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
