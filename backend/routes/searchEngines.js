const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// Get all engines (Public)
router.get('/', async (req, res) => {
  try {
    const engines = await prisma.searchEngine.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(engines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Engine (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { name, url, icon, placeholder, sortOrder, isDefault } = req.body;
  try {
    // If setting as default, unset others
    if (isDefault) {
      await prisma.searchEngine.updateMany({ data: { isDefault: false } });
    }
    const engine = await prisma.searchEngine.create({
      data: { name, url, icon, placeholder, sortOrder: parseInt(sortOrder) || 0, isDefault: !!isDefault },
    });
    res.json(engine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Engine (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, url, icon, placeholder, sortOrder, isDefault } = req.body;
  try {
    if (isDefault) {
      await prisma.searchEngine.updateMany({ data: { isDefault: false } });
    }
    const engine = await prisma.searchEngine.update({
      where: { id: parseInt(id) },
      data: { name, url, icon, placeholder, sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined, isDefault: isDefault !== undefined ? !!isDefault : undefined },
    });
    res.json(engine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Engine (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.searchEngine.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Engine deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
