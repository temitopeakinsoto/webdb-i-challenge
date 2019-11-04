const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  db('accounts')
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ message: 'this went wrong: ' + error.message });
    });
});

module.exports = router;