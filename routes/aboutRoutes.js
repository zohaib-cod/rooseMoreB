const express = require('express');
const router = express.Router();
const {
  getAbout,
  getAllAbout,
  createAbout,
  updateAbout,
  deleteAbout
} = require('../controllers/aboutController');

router.route('/')
  .get(getAbout)
  .post(createAbout);

router.route('/all')
  .get(getAllAbout);

router.route('/:id')
  .put(updateAbout)
  .delete(deleteAbout);

module.exports = router;
