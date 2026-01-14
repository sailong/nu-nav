const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// Get all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { tags: { orderBy: { sortOrder: 'asc' } } }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Category (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { name, sortOrder } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name, sortOrder: sortOrder ? parseInt(sortOrder) : 0 },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Category (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, sortOrder } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, sortOrder: sortOrder ? parseInt(sortOrder) : undefined },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Category (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
