CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "security_clearance" INT NOT NULL
);



CREATE TABLE "projects" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(250) NOT NULL,
    "description" VARCHAR(1000),
    "year" VARCHAR(9) NOT NULL,
    "published" BOOLEAN NOT NULL,
    "date_created" DATE,
    "hidden" BOOLEAN NOT NULL DEFAULT 'false'
);



CREATE TABLE "missions" (
    "id" SERIAL PRIMARY KEY,
    "project_id" INT REFERENCES "projects" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500) NOT NULL
);



CREATE TABLE "goal_types" (
    "id" SERIAL PRIMARY KEY,
    "type" varchar(100) NOT NULL
);



CREATE TABLE "goals" (
    "id" SERIAL PRIMARY KEY,
    "mission_id" INT REFERENCES "missions" NOT NULL,
    "goal_type_id" INT REFERENCES "goal_types" NOT NULL,
    "name" VARCHAR(200),
    "points" INT ,
    "how_many_max" INT ,
    "how_many_min" INT DEFAULT '0'
);



CREATE TABLE "teams" (
    "id" SERIAL PRIMARY KEY,
    "coach_user_id" INT REFERENCES "users" NOT NULL,
    "team_user_id" INT REFERENCES "users" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "team_number" INT NOT NULL
);



CREATE TABLE "team_members" (
    "id" SERIAL PRIMARY KEY,
    "team_id" INT REFERENCES "teams" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT 'false'
);



CREATE TABLE "runs" (
    "id" SERIAL PRIMARY KEY,
    "team_id" INT REFERENCES "teams" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "date" DATE NOT NULL,
    "driver" INT REFERENCES "team_members" NOT NULL,
    "assistant" INT REFERENCES "team_members" NOT NULL,
    "score_keeper" INT REFERENCES "team_members"NOT NULL,
    "score" INT,
    "penalties" INT,
    "notes" VARCHAR(1000)
);



CREATE TABLE "selected_missions" (
    "id" SERIAL PRIMARY KEY,
    "mission_id" INT REFERENCES "missions" NOT NULL,
    "run_id" INT REFERENCES "runs" NOT NULL
);



CREATE TABLE "either_or" (
    "id" SERIAL PRIMARY KEY,
    "goal_id" INT REFERENCES "goals" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "points" INT NOT NULL
);



CREATE TABLE "penalties" (
    "id" SERIAL PRIMARY KEY,
    "project_id" INT REFERENCES "projects" NOT NULL,
    "name" VARCHAR(250) NOT NULL,
	"description" VARCHAR,
    "points" INT NOT NULL,
    "max" INT NOT NULL
);

--GOAL TYPES
INSERT INTO "public"."goal_types"("type") VALUES('Yes/No');
INSERT INTO "public"."goal_types"("type") VALUES('Either/Or');
INSERT INTO "public"."goal_types"("type") VALUES('How Many');