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
      res.status(500).json({ message: 'There was an error retrieving this data: ' + error.message });
    });
});

router.get('/:id', async (req, res) => {
    try {
      const result = await db('accounts').where({ id: req.params.id });
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ message: 'this went wrong: ' + error.message });
    }
  });

module.exports = router;