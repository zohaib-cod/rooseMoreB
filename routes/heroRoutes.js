const express = require('express');
const router = express.Router();
const {
  getHero,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero
} = require('../controllers/heroController');

router.route('/')
  .get(getHero)
  .post(createHero);

router.route('/all')
  .get(getAllHeroes);

router.route('/:id')
  .put(updateHero)
  .delete(deleteHero);

module.exports = router;
