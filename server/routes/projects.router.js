const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
var moment = require('moment');
const router = express.Router();

// getting project info for project list on homepage
router.get('/', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT * FROM "projects" WHERE "hidden" = false ORDER BY "id" DESC;`)
    pool.query(sqlText)
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting all the projects from the database`, error);
        })
});

// getting specific project details
router.get('/details/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT * FROM "projects" WHERE "id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows[0]);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting your project details from the database`, error);
        })
});

// updating projects to hidden = true when user "deletes" a project
router.put('/project/:id', rejectUnauthenticated, async (req, res) => {
    let id = req.params.id;
    
    let sqlText = (`UPDATE "projects" SET "hidden" = NOT "hidden" WHERE "id" = $1`)
    pool.query(sqlText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error updating your project in the database`, error);
        })
})

// updating project to published = true when user "publishes" a project
router.put('/publish/:id', rejectUnauthenticated, (req, res) => {
    let id = req.params.id;
    
    let sqlText = (`UPDATE "projects" SET "published" = NOT "published" WHERE "id" = $1`)
    pool.query(sqlText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error publishing your project`, error);
        })
});

// updating name and description when user makes edits
router.put('/info/:id', rejectUnauthenticated, (req, res) => {
    let id = req.params.id;
    let info = req.body.projectInfo;
    
    let sqlText = (`UPDATE "projects" SET "name" = $1, "description" = $2, "year" = $3 WHERE "id" = $4 AND "hidden" = FALSE;`)
    pool.query(sqlText, [info.projectName, info.projectDescription, info.year, id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error updating project info`, error);
        })
});

// get penalty information for specific project
router.get('/penalties/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT * FROM "penalties" WHERE "project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting all the penalties for your project from the database`, error);
        })
});

// delete penalty by its id (from a specified project)
router.delete('/penalties/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`DELETE FROM "penalties" WHERE "id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((response) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error deleting your penalty from the database`, error);
        })
})

// getting mission details for a specified project by project id
router.get('/missions/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT "missions"."id" AS "mission_id", 
                           "missions"."name" AS "mission_name", 
                           "missions"."description", 
                           "goals"."id" AS "goal_id", 
                           "goals"."goal_type_id", 
                           "goals"."name",
                           "goals"."points", 
                           "goals"."how_many_max", 
                           "goals"."how_many_min"
                    FROM "missions"
                    JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                    WHERE "missions"."project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting all the missions for your project`, error);
        })
});

// delete specific mission by id and it's corresponding goals and eitherOr goal options
router.delete('/missions/:id', rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();
    let id = req.params.id;

    try {
        let goalId = (`SELECT "id" FROM "goals" WHERE "mission_id" = $1 AND "goal_type_id" = '2';`);
        let missionQuery = (`DELETE FROM "missions" WHERE "id" = $1;`);
        let goalQuery = (`DELETE FROM "goals" WHERE "mission_id" = $1;`);
        let eitherOr = (`DELETE FROM "either_or" WHERE "goal_id" = $1;`);
        
    
        await client.query('BEGIN')

        let maybe = await client.query(goalId, [id])
        if (maybe.rows.length != 0) {
            await client.query(eitherOr, [maybe.rows[0].id])           
        } 
        await client.query(goalQuery, [id]);
        await client.query(missionQuery, [id]);

        await client.query('COMMIT')
        res.sendStatus(201);
      } catch (error) {
        await client.query('ROLLBACK')
        res.sendStatus(500);
        console.log(`Error getting all the missions for your project`, error);
      } finally {
        client.release()
      }
})

// get option details when goal-type is either/or on project id
router.get('/missions/either-or/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT 
                        "either_or"."id", 
                        "either_or"."goal_id", 
                        "either_or"."name", 
                        "either_or"."points"
                    FROM "missions"
                    JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                    JOIN "either_or" ON "either_or"."goal_id" = "goals"."id"
                    WHERE "missions"."project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error getting all the either/or goals for your project`, error);
        })
});

// create a new project in admin homepage
router.post('/', rejectUnauthenticated, (req, res) => {
    let newProject = req.body;
    let currentDate = moment().format()

    let sqlText = (`INSERT INTO "projects" ("name", "description", "year", "published", "date_created")
                    VALUES ($1, $2, $3, $4, $5) RETURNING id;`);
    pool.query(sqlText, [newProject.name, newProject.description, newProject.year, newProject.published, currentDate])
        .then((result) => {
            res.send(result.row);
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log(`Error adding your project to the database`, error);
        })
})

// add penalty to project with project id
router.post( '/penalty', rejectUnauthenticated, (req, res) => {
    let penalty = req.body;

    let sqlText = `INSERT INTO "penalties" ("project_id", "name", "description", "points", "max")
                    VALUES ($1, $2, $3, $4, $5);`;
    pool.query(sqlText, [penalty.project_id, penalty.name, penalty.description, penalty.points, penalty.max] )
        .then( (response) => {
            res.sendStatus(201);
            console.log(`Error adding your penalty to the database`, error);
        })
        .catch( (error) => {
            res.sendStatus(500);
        })
})

// get penalty data for edit by the penalty id
router.get( `/penalty/:id`, rejectUnauthenticated, (req, res) => {
    let penalty_id = req.params.id;

    let sqlText = `SELECT * FROM "penalties" WHERE "id" = $1;`;
    pool.query( sqlText, [penalty_id] )
        .then( (result) => {
            res.send(result.rows[0]);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error getting the penalties for your project`, error);
        })
})

// update edited penalty by the penalty id
router.put( `/penalty`, rejectUnauthenticated, (req, res) => {
    let penalty = req.body;

    let sqlText = `UPDATE "penalties" 
                    SET "name" = $1, "description" = $2, 
                    "points" = $3, "max" = $4 
                    WHERE "id" = $5;`;
    pool.query( sqlText, 
        [penalty.name, penalty.description, penalty.points, penalty.max, penalty.penalty_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error updating your penalty`, error);
        })
})

// get goal types for adding/editing missions
router.get( '/goalTypes', rejectUnauthenticated, (req, res) => {
    let sqlText = `SELECT * FROM "goal_types" ORDER BY "id";`;

    pool.query( sqlText )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error getting the goal types for your project`, error);
        })
})

// add mission and goals to project with project id
router.post( '/mission', rejectUnauthenticated, async(req, res) => {
    
    const client = await pool.connect();
    let mission = req.body.mission;
    let goals = mission.goals;
    let eitherOrOptions = req.body.options;
    
    try {
        
        await client.query('BEGIN');

        let sqlText1 = `INSERT INTO "missions" ("project_id", "name", "description")
                        VALUES ( $1, $2, $3 ) 
                        RETURNING "id";`;

        const id = await client.query( sqlText1, 
            [mission.project_id, mission.name, mission.description] );

        const missionId = id.rows[0].id;

        for( let goal of goals ){
            
            if(goal.type === '1'){
                
                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id", "name", "points")
                                VALUES ( $1, $2, $3, $4 );`;
                await client.query( sqlText2, [missionId, goal.type, goal.name, goal.points]);

            } else if(goal.type === '2'){

                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id")
                                VALUES ( $1, $2) 
                                RETURNING "id";`;
                const id = await client.query( sqlText2, [missionId, goal.type]);
                const goalId = id.rows[0].id;

                for( let option of eitherOrOptions ){
                    if( goal.goal === option.goal_id ){
                        let sqlText3 = `INSERT INTO "either_or" ("goal_id", "name", "points")
                                        VALUES ( $1, $2, $3 );`;
                        
                        await client.query( sqlText3, [ goalId, option.option_name, option.option_points ]);
                    }
                }

            } else if(goal.type === '3'){
                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id", "name", "points", "how_many_max", "how_many_min")
                                VALUES ( $1, $2, $3, $4, $5, $6 );`;
                await client.query( sqlText2, [missionId, goal.type, goal.name, goal.points, goal.max, goal.min]);
            }
        }

        await client.query('COMMIT');
        res.sendStatus(201);
    } catch(error) {   
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.log(`Error adding your mission and goals to the database`, error);
    } finally {
        client.release()
    }
})

// get mission and goal data for edit by mission id
router.get( `/mission/:id`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    let mission_id = req.params.id;
    
    try {
        await client.query('BEGIN');

        let sqlText = `SELECT m."name", m."description", 
                        g."goal_type_id", g."name" AS "goal_name",
                        g."points", g."how_many_max",
                        g."how_many_min",  g."id" AS "goal_id"
                        FROM "missions" AS m
                        JOIN "goals" AS g ON "mission_id" = m."id"
                        WHERE m."id" = $1
                        ORDER BY g."id";`;
        const result = await client.query( sqlText, [mission_id] );

        let optionArray = [];

        for( let row of result.rows ){
            if( row.goal_type_id === 2 ){
                let sqlText2 = `SELECT "id", "goal_id", "name" AS "option_name",
                                "points" AS "option_points"
                                FROM "either_or"
                                WHERE "goal_id" = $1
                                ORDER BY "id";`;
                
                let result2 = await client.query( sqlText2, [row.goal_id] );
                
                for( let option of result2.rows ){
                    optionArray.push(option);
                }
            }
        }

        const allResults = {
            missionGoals: result.rows,
            eitherOrOptions: optionArray,
        }

        await client.query('COMMIT');
        res.send( allResults );
    } catch(error) {   
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.log(`Error getting the mission and goal data for editing`, error);
    } finally {
        client.release()
    }
})

// update mission, goals, and either/or options on mission id
router.put( `/mission`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    let mission = req.body;
    let goalList = mission.goals;
    let eitherOrOptions = mission.eitherOrOptions;

    try {
        await client.query('BEGIN');

        let sqlText = `UPDATE "missions"
                        SET "name" = $1, "description" = $2
                        WHERE "id" = $3;`;

        await client.query( sqlText, [ mission.name, mission.description, mission.mission_id ]);
        
        for( let goal of goalList ){
            
            if(goal.goal_type_id === 1){
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1,
                                "name" = $2,
                                "points" = $3
                                WHERE "id" = $4;`;
            
                await client.query( sqlText2, [goal.goal_type_id, goal.goal_name, goal.points, goal.goal_id] )

            } else if(goal.goal_type_id === 2){
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1
                                WHERE "id" = $2;`;
            
                await client.query( sqlText2, [goal.goal_type_id, goal.goal_id] );

                for( let option of eitherOrOptions ){
                    
                    if( goal.goal_id === option.goal_id ){
                        let sqlText3 = `UPDATE "either_or" 
                                        SET "name" = $1, "points" = $2
                                        WHERE "id" = $3;`;
                        
                        await client.query( sqlText3, [ option.option_name, option.option_points, option.id ]);
                    }
                }

            } else if(goal.goal_type_id === 3){
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1, "name" = $2,
                                "points" = $3, "how_many_max" = $4,
                                "how_many_min" = $5
                                WHERE "id" = $6;`;
            
                await client.query( sqlText2, 
                    [goal.goal_type_id, goal.goal_name, goal.points, 
                    goal.how_many_max, goal.how_many_min, goal.goal_id] );
            }
        }

        await client.query('COMMIT');
        res.sendStatus(201);
    } catch(error) {   
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.log(`Error editing your mission data`, error);
    } finally {
        client.release()
    }
    
})

// add goal data to mission with mission id, return goal id for edits
router.post( `/goal`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    
    const missionId = req.body.missionId;

    try {
        await client.query('BEGIN');

        let sqlText = `INSERT INTO "goals" ("mission_id", "goal_type_id")
                        VALUES ($1, 1)
                        RETURNING "id";`;

        const result = await client.query( sqlText, [missionId] );

        await client.query('COMMIT');
        res.send( result.rows );
    } catch(error) {   
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.log(`Error adding your goal to your mission in the database `, error);
    } finally {
        client.release()
    }
})

// add option to goal of type either/or with goal id, return option id for edits
router.post( `/option`, rejectUnauthenticated, (req, res) => {
    const goal_id = req.body.goal_id;

    let sqlText = `INSERT INTO "either_or" ("goal_id")
                    VALUES ($1)
                    RETURNING "id";`;
    pool.query( sqlText, [goal_id] )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error adding either/or goal to the database`, error);
        })
})

// delete goal from mission/project by goal id
router.delete( '/goal/:id', rejectUnauthenticated, (req, res) => {
    
    const goal_id = req.params.id;

    let sqlText = `DELETE FROM "goals"
                    WHERE "id" = $1;`;

    pool.query( sqlText, [goal_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error deleting the goal from your project`, error);
        })
})

// delete option from goal/mission/project by option id from either_or table
router.delete( '/option/:id', rejectUnauthenticated, (req, res) => {
    
    const option_id = req.params.id;

    let sqlText = `DELETE FROM "either_or"
                    WHERE "id" = $1;`;

    pool.query( sqlText, [option_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            res.sendStatus(500);
            console.log(`Error deleting either or option`, error);
        })
})

module.exports = router;