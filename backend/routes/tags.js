const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// Get all tags (Public)
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Tag (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { name, url, logo, description, categoryId, sortOrder } = req.body;
  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        url,
        logo,
        description,
        categoryId: parseInt(categoryId),
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Tag (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, url, logo, description, categoryId, sortOrder } = req.body;
  try {
    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name,
        url,
        logo,
        description,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
      },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Tag (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tag.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
