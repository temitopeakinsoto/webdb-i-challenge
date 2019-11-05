const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();


function validateAccount(req, res, next) {
    let account = req.body;
    if (!account) {
      res.status(400).json({ message: "missing account data" });
    } else if (!account.name) {
      res.status(400).json({ message: "missing required name field for account record to be created" });
    }
    else if (!account.budget) {
        res.status(400).json({ message: "missing required budget field for account record to be created" });
    } 
    else {
      next();
    }
  }

  function validateAccountId(req, res, next) {
    db('accounts').where({ id: req.params.id })
      .then(account => {
        if (account[0]) {            
          req.account = account;
          next();
        } else {
          res.status(400).json({ message: "invalid account id" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: `Something terrible happend while checking account id: ${error.message}`
        });
      });
  }

router.get('/', (req, res) => {
  db('accounts')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({ message: 'There was an error retrieving this data: ' + error.message });
    });
});

router.get('/:id', validateAccountId, async (req, res) => {
    try {
      res.status(200).json(req.account);
    } catch (error) {
      res.status(500).json({ message: 'this went wrong while trying to retrieve this account record: ' + error.message });
    }
  });

  router.post('/', validateAccount, async (req, res) => {
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

  router.put('/:id', validateAccountId, (req, res) => {
    const { name, budget } = req.body;
    db('accounts').where({ id: req.params.id })
      .update({
        name,
        budget
      })
      .then(affectedRecords => {
        res.json(affectedRecords + ' records got changed!' );
      })
      .catch(error => {
        res.status(500).json({ message: 'this went wrong: ' + error.message });
      });
  });

  router.delete('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).del()
      .then(affectedRows => {
        res.json(affectedRows + ' rows got deleted!!');
      })
      .catch(error => {
        res.status(500).json('Something went wrong with this delete operation: ' + error.message)
      })
  });

module.exports = router;