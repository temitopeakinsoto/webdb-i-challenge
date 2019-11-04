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
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ message: 'this went wrong: ' + error.message });
    }
  });

  router.post('/', async (req, res) => {
      const { name, budget } = req.body;
    try {
      const result = await db('accounts')
        .insert({
          name,
          budget
        })
      res.status(201).json('New Account record got created with an id of ' + result[0]);
    } catch (error) {
      res.status(500).json({ message: 'this went wrong while trying to insert this account record ' + error.message });
    }
  });

  router.put('/:id', (req, res) => {
      const { name, budget } = req.body;
    db('accounts').where({ id: req.params.id })
      .update({
        name,
        budget
      })
      .then(affectedRecords => {
        console.log(affectedRecords);
        res.json(affectedRecords + ' records got changed!' );
      })
      .catch(error => {
        res.status(500).json({ message: 'this went wrong: ' + error.message });
      });
  });

module.exports = router;