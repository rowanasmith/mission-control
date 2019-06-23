import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import projects from './projectsReducer';
import missions from './allMissionsReducer';
import selectedMissions from './selectedMissionsReducer';
import projectMission from './missionReducer';
import allTeams from './allTeamsReducer';
import teamMembers from './teamMembersReducer';
import penalties from './penaltiesReducer';
import penalty from './penaltyReducer';
import runDetails from './runDetailsReducer';
import projectDetails from './projectDetailsReducer';
import goalTypes from './goalTypesReducer';
import goalOptions from './goalOptionReducer';
import missionDetails from './missionDetailsReducer';
import eitherOr from './eitherOrReducer';
import runHistoryDetails from './runHistoryDetails';
import allRuns from './allRunsReducer';
import teamInfoReducer from './teamInfoReducer';
import teamIdReducer from './teamIdReducer';


// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  teamMembers, // holds team members for logged in user
  runDetails,
  projects,
  projectDetails,
  penalties,
  projectMission,
  missions,
  eitherOr,
  selectedMissions,
  allTeams, // holds teams with specific coach/user id
  penalty,
  allRuns,
  goalTypes,
  goalOptions, // options for Either/Or goals
  missionDetails, // hold mission info by specific mission id
  runHistoryDetails, // holds details from past run
  teamInfoReducer,
  teamIdReducer

});

export default rootReducer;
