const express = require('express');
const router = express.Router();
const {
  getSections,
  getSectionBySlug,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');

router.route('/')
  .get(getSections)
  .post(createSection);

router.route('/:id')
  .put(updateSection)
  .delete(deleteSection);

router.route('/slug/:slug')
  .get(getSectionBySlug);

module.exports = router;
