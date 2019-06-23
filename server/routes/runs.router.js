const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment');

/**
 * GET to get all missions for current project 
 */
router.get('/missions', async (req, res) => {
    const client = await pool.connect();
    try {
        let sqlText1 = `SELECT "id" FROM "projects"
                        WHERE "published"= TRUE
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                        "id", 
                        "project_id", 
                        "name", 
                        "description"
                        FROM "missions"
                        WHERE "project_id"=$1
                        GROUP BY "id";`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1)
        const projectId = runsIdResponse.rows[0].id;
        const missionsResponse = await client.query(sqlText2, [projectId])
        await client.query('COMMIT')
        res.send(missionsResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error getting all the missions for your current project`, error);
    }
    finally {
        client.release();
    }
});


//POST to post all rundetails for logged in team or coach
router.post('/saveDetails', async (req, res) => {
    const client = await pool.connect();
    let teamId;
    let runDetails = req.body.runDetails.newRun;
    let runTeam = req.body.runDetails.runTeam;
    let selectedMissions = req.body.runDetails.newRun.selectedMissions;
    let currentDate = moment().format();

    if (req.user.security_clearance === 2) {
        try{
            teamId = req.body.id;
            let sqlText1 = `INSERT INTO "runs" (team_id, name, date, driver, assistant, score_keeper)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            RETURNING id;`
            let sqlText2 = `INSERT INTO "selected_missions" (run_id, mission_id)
                            VALUES ($1, $2)
                            RETURNING id`
            let sqlText3 = `SELECT "goals"."id" FROM "goals"
                            JOIN "missions" ON "missions"."id" = "goals"."mission_id"
                            JOIN "selected_missions" ON "selected_missions"."mission_id" = "missions"."id"
                            WHERE "selected_missions"."mission_id" = $1 AND "selected_missions"."run_id" = $2;`
            let sqlText4 = `INSERT INTO "goals_per_run"("goal_id", "selected_missions_id")VALUES($1, $2);`
            await client.query('BEGIN')
            const runsInsertResponse = await client.query(sqlText1, [teamId, runDetails.runName, currentDate, runTeam.driverId, runTeam.assistantId, runTeam.scorekeeperId])
            const runId = runsInsertResponse.rows[0].id;
            for (mission of selectedMissions) {
                if(mission.selected === true){
                    const selectedMissionId = await client.query(sqlText2, [runId, mission.id]);
                    const selectedGoalId = await client.query(sqlText3, [mission.id, runId]);
                    const goalsPerRunInsert = await client.query(sqlText4, [selectedGoalId.rows[0].id, selectedMissionId.rows[0].id]);
                }
            }
            await client.query('COMMIT')
            res.sendStatus(201);
        }
        catch ( error ) {
            await client.query('ROLLBACK')
            res.sendStatus(500);
            console.log(`Error saving your initial run details for coach`, error);
        }
        finally{
            client.release();
        }

    }
    else if (req.user.security_clearance === 4) {
        
        try {
            teamId = req.user.id;
            let sqlText0 = `SELECT "id" FROM "teams"
                            WHERE "team_user_id"=$1;`;
            let sqlText1 = `INSERT INTO "runs" (team_id, name, date, driver, assistant, score_keeper)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            RETURNING id;`
            let sqlText2 = `INSERT INTO "selected_missions" (run_id, mission_id)
                            VALUES ($1, $2)
                            RETURNING id;`
            let sqlText3 = `SELECT "goals"."id" FROM "goals"
                            JOIN "missions" ON "missions"."id" = "goals"."mission_id"
                            JOIN "selected_missions" ON "selected_missions"."mission_id" = "missions"."id"
                            WHERE "selected_missions"."mission_id" = $1 AND "selected_missions"."run_id" = $2;`
            let sqlText4 = `INSERT INTO "goals_per_run"("goal_id", "selected_missions_id")VALUES($1, $2);`
            await client.query('BEGIN')
            const idResponse = await client.query(sqlText0, [teamId])
            const runsInsertResponse = await client.query(sqlText1, [idResponse.rows[0].id, runDetails.runName, currentDate, runTeam.driverId, runTeam.assistantId, runTeam.scorekeeperId])
            const runId = runsInsertResponse.rows[0].id;
            for (mission of selectedMissions) {
                if (mission.selected === true) {
                    const selectedMissionId = await client.query(sqlText2, [runId, mission.id]);
                    const selectedGoalId = await client.query( sqlText3, [mission.id, runId]);
                    const goalsPerRunInsert = await client.query( sqlText4, [selectedGoalId.rows[0].id, selectedMissionId.rows[0].id]);
                }
            }
            await client.query('COMMIT')
            res.sendStatus(201);
        }
        catch (error) {
            await client.query('ROLLBACK')
            res.sendStatus(500);
            console.log(`Error saving your initial run details for team`, error);
        }
        finally {
            client.release();
        }
    }
    else {
        res.sendStatus(500);
    }
    
});

// /**
//  * GET to get details for yes/no and how many goals for latest run for logged in team
//  */

router.get('/selectedMissions', async (req, res) => {
    const client = await pool.connect();

    let teamId = req.user.id;
        try {
            let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                            JOIN "teams" ON "teams"."id" = "runs"."team_id"
                            WHERE "team_user_id" = $1
                            ORDER BY "id" DESC LIMIT 1;`
            let sqlText2 = `SELECT
                            "run_id",
                            "selected_missions"."mission_id",
                            "missions"."name" AS "mission_name",
                            "missions"."description" AS "mission_description", 
                            "goals"."id" AS "goal_id",
                            "goals"."goal_type_id", 
                            "goals"."name" AS "goal_name", 
                            "goals"."points" AS "goal_points", 
                            "goals"."how_many_max", 
                            "goals"."how_many_min",
                            "goal_types"."type" AS "goal_type"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "goal_types" ON "goal_types"."id" = "goals"."goal_type_id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`

            await client.query('BEGIN')
            const runsIdResponse = await client.query(sqlText1, [teamId])
            const runId = runsIdResponse.rows[0].id;
            const selectedMissionsGetResponse = await client.query(sqlText2, [runId])
            await client.query('COMMIT')

            const runInfo = {
                id: runsIdResponse.rows[0].id, runName: runsIdResponse.rows[0].name, runDetails: selectedMissionsGetResponse.rows };
                
            res.send(runInfo);
        }
        catch (error) {
            await client.query('ROLLBACK')
            res.sendStatus(500);
            console.log(`Error getting all the selected missions for your run as a team`, error);
        }
        finally {
            client.release();
        }

});

// /**
//  * GET to get details for yes/no and how many goals for latest run for team for logged in coach
//  */

router.get('/selectedMissions/:id', async (req, res) => {
    const client = await pool.connect();
    let teamId = req.params.id;

    try {
        let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                            WHERE "runs"."team_id" = $1
                            ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                            "run_id",
                            "selected_missions"."mission_id",
                            "missions"."name" AS "mission_name",
                            "missions"."description" AS "mission_description", 
                            "goals"."id" AS "goal_id",
                            "goals"."goal_type_id", 
                            "goals"."name" AS "goal_name", 
                            "goals"."points" AS "goal_points", 
                            "goals"."how_many_max", 
                            "goals"."how_many_min",
                            "goal_types"."type" AS "goal_type"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "goal_types" ON "goal_types"."id" = "goals"."goal_type_id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`

        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1, [teamId])
        const runId = runsIdResponse.rows[0].id;
        const selectedMissionsGetResponse = await client.query(sqlText2, [runId])
        await client.query('COMMIT')
        
        const runInfo = {
            id: runsIdResponse.rows[0].id, runName: runsIdResponse.rows[0].name, runDetails: selectedMissionsGetResponse.rows
        };
        
        res.send(runInfo);
    }
    catch (error) {
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.log(`Error getting all the selected missions for your run as a coach`, error);
    }
    finally {
        client.release();
    }

});

// /**
//  * GET to get details for either/or goals for latest run for logged in team
//  */

router.get('/selectedEitherOr', async (req, res) => {
    const client = await pool.connect();
    let teamId = req.user.id;

    try {
        let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                        JOIN "teams" ON "teams"."id" = "runs"."team_id"
                        WHERE "team_user_id" = $1
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                            "either_or"."goal_id" AS "either_or_goal_id",
                            "either_or"."id" AS "either_or_id",
                            "either_or"."name" AS "either_or_name",
                            "either_or"."points" AS "either_or_points"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "either_or" ON "goal_id" = "goals"."id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1, [teamId])
        const runId = runsIdResponse.rows[0].id;
        const eitherOrGetResponse = await client.query(sqlText2, [runId])
        await client.query('COMMIT')
        
        res.send(eitherOrGetResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error getting all the selected either or goals for your run as a team`, error);
    }
    finally {
        client.release();
    }

});

// /**
//  * GET to get details for either/or goals for latest run for team for logged in coach
//  */

router.get('/selectedEitherOr/:id', async (req, res) => {
    const client = await pool.connect();
    let teamId = req.params.id;
    try {
        let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                            WHERE "runs"."team_id" = $1
                            ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                            "either_or"."goal_id" AS "either_or_goal_id",
                            "either_or"."id" AS "either_or_id",
                            "either_or"."name" AS "either_or_name",
                            "either_or"."points" AS "either_or_points"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "either_or" ON "goal_id" = "goals"."id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1, [teamId])
        const runId = runsIdResponse.rows[0].id;
        const eitherOrGetResponse = await client.query(sqlText2, [runId])
        await client.query('COMMIT')
        
        res.send(eitherOrGetResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error getting all the selected either or goals for your run as a coach`, error);
    }
    finally {
        client.release();
    }

});

// /**
//  * GET for all penalties for current project
//  */

router.get('/penalties', async (req, res) => {
    const client = await pool.connect();
    try {
        let sqlText1 = `SELECT "id" FROM "projects"
                        WHERE "published"= TRUE
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                        "penalties"."id",
                        "penalties"."name",
                        "penalties"."points",
                        "penalties"."max"
                        FROM "penalties"
                        JOIN "projects" ON "projects"."id" = "penalties"."project_id"
                        WHERE "projects"."id"=$1;`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1)
        const projectId = runsIdResponse.rows[0].id;
        const penaltiesResponse = await client.query(sqlText2, [projectId])
        await client.query('COMMIT')

        res.send(penaltiesResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error getting all the penalties for your run`, error);
    }
    finally {
        client.release();
    }
});

router.put('/updateDetails', async (req, res) => {
    const client = await pool.connect();
    let penaltyCount = 0;
    let runId = req.body.runId;
    let score = req.body.score;
    let goals = req.body.goals;
    for (penalty of req.body.penalties) {
        penaltyCount = penaltyCount + penalty.count;
    }

    try {

        let sqlText1 = `UPDATE "runs"
                        SET "score" = $1, "penalties" = $2
                        WHERE "id" = $3;`;
        let sqlText2 = `SELECT "id", "mission_id"
                        FROM "selected_missions"
                        WHERE "run_id" = $1;`;
        let sqlText3 = `UPDATE "goals_per_run"
                        SET "is_completed" = $1
                        WHERE "selected_missions_id" = $2
                        AND "goal_id" = $3;`;
        await client.query('BEGIN')
        const runUpdate = await client.query(sqlText1, [score, penaltyCount, runId])
        
        const selectedMissionsResponse = await client.query(sqlText2, [runId])
        
        // loop through goals and if they match selected at selected mission id.mission_id and goal.mission_id, updated completed status
        for (goal of goals) {
            // loop through the selectedmissions to compare id to goal mission id
            for( let i=0; i<selectedMissionsResponse.rows.length; i++){
                if ( selectedMissionsResponse.rows[i].mission_id === goal.mission_id){
                    
                    const goalsUpdate = await client.query(sqlText3, [goal.isCompleted, selectedMissionsResponse.rows[i].id, goal.goal_id])
                }
            }
        }
        await client.query('COMMIT')
        res.sendStatus(200);
    }
    catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error updating the scoring details for your run`, error);
    }
    finally {
        client.release();
    }

});


//GET runs for coach based on url query string
router.get('/coach/:id', (req, res) => {
    let id = req.params.id;

    const sqlText = `
        SELECT "runs"."id", "runs"."name", COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end), "runs"."score", "runs"."penalties" FROM "runs"
        JOIN "selected_missions" ON "run_id" = "runs"."id"
        JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
        WHERE "team_id" = $1
        GROUP BY "runs"."id";
    `;

    pool.query( sqlText, [id] )
        .then ( result => {
            // result should be an array of objects with run information
            // run id, run name, goals completed count, run score
            res.send( result.rows );
        }).catch ( error => {
            res.sendStatus( 500 );
            console.log(`Error getting the run summary details as a coach`, error);
        });
});

// get details for specified run to display on run summary when a team run has ended
router.get( '/runHistoryDetails/:id', rejectUnauthenticated, (req, res) => {
    const runId = req.params.id;
    
    let sqlText = `SELECT r."id", r."name", r."date", r."score", r."penalties", r."notes",
                    (CASE WHEN r."driver" = t."id" THEN t."name" END) AS "driver", 
                    (CASE WHEN r."assistant" = t1."id" THEN t1."name" END) AS "assistant", 
                    (CASE WHEN r."score_keeper" = t2."id" THEN t2."name" END) AS "score_keeper",
                    COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end)
                    FROM "runs" AS r
                    LEFT JOIN "team_members" AS t ON t."id" = r."driver"
                    JOIN "team_members" AS t1 ON t1."id" = r."assistant"
                    JOIN "team_members" AS t2 ON t2."id" = r."score_keeper"
                    JOIN "selected_missions" ON "run_id" = r."id"
                    JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
                    WHERE r."id" = $1
                    GROUP BY r."id", t."id", t1."id", t2."id"`;

    pool.query( sqlText, [runId] )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error getting the run history details as a coach`, error);
        })
} )

// update run details with notes when run is created/saved
router.put( `/summary/:id`, rejectUnauthenticated, (req, res) => {
    
    const runId = req.params.id;
    const runNotes = req.body.notes;

    let sqlText = `UPDATE "runs" 
                    SET "notes" = $1
                    WHERE "id" = $2;`;

    pool.query( sqlText, [runNotes, runId] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error updating run details with notes`, error);
        })
})

/**
 * GET runs for team based on user id
 */
router.get('/team', (req, res) => {

    let id = req.user.id;
    
    const sqlText = `
            SELECT "runs"."id", "runs"."name", COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end), "runs"."score", "runs"."penalties"
            FROM "runs"
            JOIN "selected_missions" ON "run_id" = "runs"."id"
            JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
            JOIN "teams" ON "teams"."id" = "runs"."team_id"
            WHERE "teams"."team_user_id" = $1
            GROUP BY "runs"."id";
        `;

    pool.query( sqlText, [id] )
        .then ( result => {
            // result should be an array of objects with run information
            // run id, run name, goals completed count, run score
            
            res.send( result.rows );
        }).catch ( error => {
            res.sendStatus( 500 );
            console.log(`Error getting the run history for your team`, error);
        });
});

module.exports = router;