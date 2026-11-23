const express = require('express');
const router = express.Router();
const {
  getShowcase,
  getAllShowcases,
  createShowcase,
  updateShowcase,
  deleteShowcase
} = require('../controllers/showcaseController');

router.route('/')
  .get(getShowcase)
  .post(createShowcase);

router.route('/all')
  .get(getAllShowcases);

router.route('/:id')
  .put(updateShowcase)
  .delete(deleteShowcase);

module.exports = router;
