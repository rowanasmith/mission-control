# Mission Control
Mission Control is a scorekeeping and recording application to be used when practicing for First Lego League robotics competitions. This version uses React, Redux, Express, and PostgreSQL (a full list of dependencies can be found in `package.json`).

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Installation

* Use npm to install dependencies
```bash
npm install
```

* Create a PostgreSQL database called `high_tech_kids`
* Use the included `database.sql` file to generate tables.

* Create a `.env` file at the root of the project and paste this line into the file:
    ```
    SERVER_SESSION_SECRET=ggZZs9bDG9HmSG9KWdf5nLxje
    ```

* Start the server with
    ```
    npm run server
    ```

* Start the client with
    ```
    npm run client
    ```

## Administrator Usage

* Register as an administrator using Admin access code  `23646`


![Register](public/screenshots/Register.png?raw=true "Register")

* Administrators have a desktop-first view
* On the landing page you may view already created projects or create a new one.

![Projects](public/screenshots/NewProject.png?raw=true "Projects")

* After selecting a project you may view the missions.
* Newly created projects will not have any missions

![Missions](public/screenshots/ViewMissions.png?raw=true "Missions")

* Clicking to create a penalty will take you to the penalty creation page
* After filling out the fields click save penalty to return to the previous page

![penalties](public/screenshots/Penalties.png?raw=true "penalties")

* Click add mission to be taken to the add mission form
* After filling out a mission name and description you can choose its first goal
* goals have three types, Yes/No, Either/Or, and How Many, chooseable from the dropdown
* Goals are deletable if needed
* After goal is entered click Add A Goal to add another goal. Once all goals are created click Save Mission to return to the previous page

![goals](public/screenshots/addMission.png?raw=true "goals")

* Once all missions are created click Publish Project to make the project visible to coaches and teams

![publish](public/screenshots/Publish.png?raw=true "publish")

## Coach Usage

* Register as a coach using the access code `26224`

![coach](public/screenshots/coachRegister.png?raw=true "coach")

* Coach view is developed for mobile first

![coachlanding](public/screenshots/CoachLanding.png?raw=true "coachlanding")

* View missions allows you to see all the missions (and penalties) for the current project

![missions](public/screenshots/missions.png?raw=true "missions")

* View teams will show all the coach's teams. Upon registration the first team must be created by clicking Create new Team

![teams](public/screenshots/teams.png?raw=true "teams")

* Input the team's name, number and password. This name and password will be the login for the team. Save this by clicking the Save Team button

![addteam](public/screenshots/addteam.png?raw=true "addteam")

* This page allows you to add team members. The coach will be automatically added.
* Input a name and click add teammate to add them to the list. List items are deletable
* After all members are added click save

![members](public/screenshots/teammembers.png?raw=true "members")

* You can create a new run, or at the bottom toggle permissions for the team to create runs
* You can view the members of the team
* You can view the run history of the team

![teamdone](public/screenshots/teamDone.png?raw=true "teamdone")

## Team Usage

* Team members log in with the team name and password the coach has created

![teamlogin](public/screenshots/teamLogin.png?raw=true "teamlogin")

* Team landing page features view missions, view run history, and (if enabled) the ability to create a new run.

![teamLanding](public/screenshots/teamLanding.png?raw=true "teamLanding")

* When creating a new run you must input a name and select the missions you will attempt before selecting the run team

![newRun](public/screenshots/newRun.png?raw=true "newRun")

* Select the team member for each role from the dropdown before clicking start

![teammembers](public/screenshots/teamSelect.png?raw=true "teammembers")

* On the run page you can see your current score
* Clicking add penalty will add the penalty (undo can reverse this)
* Clicking on a mission will drop down its goals
* Clicking on a goal will indicate it is completed and your score will be updated
* The timer can be started and stopped with the corresponding buttons.
* When the run is completed, click on End Run

![run](public/screenshots/run.png?raw=true "run")

* On the run summary page you will see a summary of the completed run. There is a text field to add notes. When complete click save

![runSummary](public/screenshots/runSummary.png?raw=true "runSummary")

* View run history will now list the completed runs. Clicking on the View button will show more information

![viewRuns](public/screenshots/RunHistory.png?raw=true "runHistory")

* Run details will show a breakdown of all the information about the run

![details](public/screenshots/runDetails.png?raw=true "details")

## Contributors

- [Bradley Hennen](https://github.com/BradleyHennen)
- [Nina Johnson](https://github.com/9makesthings)
- [Chase Linzmeyer](https://github.com/linzmeyer)
- [Rachel Peddie](https://github.com/rachelpeddie)
- [Rowan Smith](https://github.com/rowanasmith)


