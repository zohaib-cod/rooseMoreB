const express = require('express');
const router = express.Router();
const {
  getFooter,
  getAllFooters,
  createFooter,
  updateFooter,
  deleteFooter
} = require('../controllers/footerController');

router.route('/')
  .get(getFooter)
  .post(createFooter);

router.route('/all')
  .get(getAllFooters);

router.route('/:id')
  .put(updateFooter)
  .delete(deleteFooter);

module.exports = router;
