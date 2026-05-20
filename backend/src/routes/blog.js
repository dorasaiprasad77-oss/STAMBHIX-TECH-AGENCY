const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');

// ─── GET /api/blog — list published posts (public) ───
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;

    const filter = { published: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err.message);
    res.status(500).json({ message: 'Server error fetching blog posts' });
  }
});

// ─── GET /api/blog/:slug — single post (public) ───
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ post });
  } catch (err) {
    console.error('Error fetching blog post:', err.message);
    res.status(500).json({ message: 'Server error fetching blog post' });
  }
});

// ─── POST /api/blog — create post (admin) ───
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').isIn(['Tech', 'Design', 'Marketing', 'Home Services', 'Business']).withMessage('Invalid category'),
    body('author').trim().notEmpty().withMessage('Author is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, excerpt, content, author, category, tags, coverImage, readTime, published, featured } = req.body;

      // Auto-generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Ensure unique slug
      let finalSlug = slug;
      let counter = 1;
      while (await BlogPost.findOne({ slug: finalSlug })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      const post = new BlogPost({
        slug: finalSlug,
        title,
        excerpt: excerpt || content.substring(0, 300),
        content,
        author,
        category,
        tags: tags || [],
        coverImage: coverImage || '💻',
        readTime: readTime || Math.max(1, Math.ceil(content.split(' ').length / 200)),
        published: published || false,
        featured: featured || false,
      });

      await post.save();
      res.status(201).json({ post, message: 'Blog post created successfully' });
    } catch (err) {
      console.error('Error creating blog post:', err.message);
      res.status(500).json({ message: 'Server error creating blog post' });
    }
  }
);

// ─── PUT /api/blog/:id — update post (admin) ───
router.put('/:id', auth, async (req, res) => {
  try {
    const allowedFields = ['title', 'excerpt', 'content', 'author', 'category', 'tags', 'coverImage', 'readTime', 'published', 'featured'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ post, message: 'Blog post updated successfully' });
  } catch (err) {
    console.error('Error updating blog post:', err.message);
    res.status(500).json({ message: 'Server error updating blog post' });
  }
});

// ─── DELETE /api/blog/:id — delete post (admin) ───
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog post:', err.message);
    res.status(500).json({ message: 'Server error deleting blog post' });
  }
});

module.exports = router;
