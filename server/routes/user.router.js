const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  // the password gets encrypted before being inserted
  const password = encryptLib.encryptPassword(req.body.password);

  // These are the access codes that correspond with admin or coach
  // used to authenicate when user registers as an admin or coach
  const ADMIN_ACCESS_CODE = '23646';
  const COACH_ACCESS_CODE = '26224';

  // 1. if the user is admin
  // 2. if the user is coach
  // 3. if the user is someone else
  if ( req.body.access_code === ADMIN_ACCESS_CODE ) {
    // POST user with 'admin' security clearance.
    const queryText = 'INSERT INTO "users" (username, password, security_clearance) VALUES ($1, $2, $3) RETURNING id';
    pool.query(queryText, [username, password, 1])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
  } else if ( req.body.access_code === COACH_ACCESS_CODE ) {
    // POST user with 'coach' security clearance.
    const queryText = 'INSERT INTO "users" (username, password, security_clearance) VALUES ($1, $2, $3) RETURNING id';
    pool.query(queryText, [username, password, 2])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));

  } else {
    // send 500 error
    res.sendStatus(500);
    console.log(`Error adding user to database`, error);
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
