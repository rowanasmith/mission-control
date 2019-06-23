import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import projectSaga from './projectSaga';
import missionSaga from './missionSaga';
import teamSaga from './teamSaga';
import penaltySaga from './penaltySaga';
import runsSaga from './runsSaga';
import runSaga from './runSaga';
import goalSaga from './goalSaga';
import runDetailsSaga from './runDetailsSaga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    userSaga(),
    projectSaga(),
    missionSaga(),
    teamSaga(),
    penaltySaga(),
    runsSaga(),
    runSaga(),
    goalSaga(), 
    runDetailsSaga(),
  ]);
}
