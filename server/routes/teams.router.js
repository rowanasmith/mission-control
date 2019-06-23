const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const encryptLib = require('../modules/encryption');

/**
 * GET team members by team id
 */
router.get('/members', rejectUnauthenticated, (req, res) => {
    
    let sqlText = `SELECT "team_members"."id" AS "member_id", "team_members"."team_id", "team_members"."name", "users"."id" AS "user_id" 
                   FROM "team_members"
                   LEFT JOIN "teams" ON "team_members"."team_id" = "teams"."id"
                   LEFT JOIN "users" ON "teams"."team_user_id" = "users"."id"
                   WHERE "users"."id"=$1
                   ORDER BY "team_members"."id";`;
    pool.query(sqlText, [req.user.id])
        .then(results => {
            
            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting your team members as a team`, error);
        })
});


/**
 * GET team members by team id for coach
 */
router.get('/members/:id', rejectUnauthenticated, (req, res) => {

    let sqlText = `SELECT "team_members"."id" AS "member_id", "team_members"."team_id", "team_members"."name"
                   FROM "team_members"
                   LEFT JOIN "teams" ON "team_members"."team_id" = "teams"."id"
                   WHERE "teams"."id"=$1
                   AND "hidden" = false
                   ORDER BY "team_members"."id";`;
    pool.query(sqlText, [req.params.id])
        .then(results => {

            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting your team members as a coach`, error);
        })
});

//Get info about the current team

router.get('/team-info/:id', rejectUnauthenticated, (req, res) => {
    let teamId = req.params.id
    
    let sqlText = `SELECT * FROM teams WHERE "id" = $1`
    pool.query (sqlText, [teamId])
    .then( results => {
        
        res.send(results.rows);
    })
    .catch( (error) => {
        res.sendStatus(500);
        console.log(`Error getting team info by team id`, error);
    })
})

/**
 * GET teams by coach id
 */
router.get('/:id', rejectUnauthenticated, (req, res) => {
    
    let coachId = req.params.id;
    let sqlText = `SELECT t."id", t."coach_user_id", t."team_user_id",
                    t."name", t."team_number", u."security_clearance" AS "team_access"
                    FROM "teams" AS t
                    JOIN "users" AS u ON u."id" = t."team_user_id"
                    WHERE "coach_user_id" = $1`;
    pool.query( sqlText, [coachId] )
        .then( results => {
            res.send(results.rows);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error getting all teams for coach`, error);
        })
});


//Gets Team ID
router.get(`/team-id/:id`, rejectUnauthenticated, (req, res) => {
    let teamNumber = req.params.id;     
    let sqlText = `SELECT "id" FROM "teams" WHERE "team_number" = $1`
    pool.query( sqlText, [teamNumber])
    .then( results => {
        res.send(results.rows);
    })
    .catch( (error) => {
        res.sendStatus(500);
        console.log(`Error getting team id based on team number`, error);
    })
});
   
//Create new team member
router.post(`/team-member`, (req, res) => {
     let name = req.body.newTeamMember;
     let team_id = req.body.teamId;
     let hidden = false
     let sqlText = `INSERT INTO team_members ("team_id", "name", "hidden") VALUES ($1, $2, $3)`
     pool.query(sqlText, [team_id, name, hidden])
     .then((result) => {
         res.sendStatus(200);
     })
     .catch((error) => {
         res.sendStatus(500);
         console.log(`Error adding new team member`, error);
     })
})

//Create new Team, team user, and coach team member
router.post(`/team-name`, rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();
    let team_name = req.body.teamName 
    let team_number = req.body.teamNumber
    let coach_user_id = req.body.coach_user_id
    let security_clearance = 3
    let password = encryptLib.encryptPassword(req.body.password);
    let hidden = false
    let coach = 'coach'
    try{
        await client.query('BEGIN');
        //This will create the team in the user table
        let sqlText1 = `INSERT INTO users ("username", "password", "security_clearance") VALUES ($1, $2, $3) RETURNING id`;
        //This will create the team in the teams table
        let sqlText2 = `INSERT INTO teams ("name", "team_number", "coach_user_id", "team_user_id") VALUES ($1, $2, $3, $4) RETURNING id`;
        let sqlText3 = `INSERT INTO team_members ("team_id", "name", "hidden") VALUES ($1, $2, $3)`
        const idInsert = await client.query( sqlText1, [team_name, password, security_clearance]);
        //This will grab the id from the just-created user table row and allow us to insert it into the team table
        id = idInsert.rows[0].id
        const teamIdInsert = await client.query( sqlText2, [team_name, team_number, coach_user_id, id]);
        teamId = teamIdInsert.rows[0].id
        await client.query( sqlText3, [teamId, coach, hidden]);
        await client.query('COMMIT');
        res.sendStatus(200);
    }
    catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.log(`Error adding new team to database`, error);
  } finally {
    client.release()
  }
})

//PUT to hide the team member
router.put(`/hide-team-member`, rejectUnauthenticated, (req, res) => {
    let id = req.body.member_id
    let hidden = true
    
    let sqlText = `UPDATE "team_members" SET "hidden" = $1 WHERE "id" = $2`
    pool.query( sqlText, [hidden, id])
        .then((response) => {
            res.sendStatus(200)
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error hiding the team member`, error);
        })
})

//PUT to update team member name
router.put(`/edit-team-member`, rejectUnauthenticated, (req, res) => {
    let team_id = req.body.id
    let name = req.body.teamMemberName
    let sqlText = `UPDATE "team_members" SET "name" = $1 WHERE "id" = $2`;
    pool.query( sqlText, [name, team_id] )
            .then((response) => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
                console.log(`Error editing team member information`, error);
            })
})

// PUT to update team_access on toggle clicks
router.put( `/teamAccess`, rejectUnauthenticated, (req, res) => {
    let team_id = req.body.team_id;
    let access = req.body.permission;
    
    let sqlText = `UPDATE "users" SET "security_clearance" = $1 WHERE "id" = $2;`;
    let newAccess;

    if( access === 4 ){
        newAccess = 4;

        pool.query( sqlText, [newAccess, team_id] )
            .then((response) => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
                console.log(`Error giving your team create run access`, error);
            })
      
    } else if(access === 3) {
        newAccess = 3;
      
        pool.query( sqlText, [newAccess, team_id] )
            .then((response) => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
                console.log(`Error removing your team's create run access`, error);
            })
    }
})

module.exports = router;
