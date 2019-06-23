import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

// get runs if user is a coach
function* getRunsAsCoach( action ) {    
  try {
    // get runs data from db
    const response = yield axios.get( `/api/runs/coach/${ action.payload.teamId }` );
    // set allRuns in redux state
    yield put({ type: 'SET_RUNS', payload: response.data });
  }
  catch (error) {
    console.log( `Couldn't get runs from DB`, error );
  }
}

// get runs if user is a team
function* getRunsAsTeam( action ) {    
  try {
    // get runs data from db
    const response = yield axios.get( `/api/runs/team` );
    // set allRuns in redux state
    console.log('response', response);
    
    yield put({ type: 'SET_RUNS', payload: response.data });
  }
  catch (error) {
    console.log( `Couldn't get runs from DB`, error );
  }
}

function* runsSaga() {
  yield takeLatest( 'GET_RUNS_AS_COACH', getRunsAsCoach );
  yield takeLatest( 'GET_RUNS_AS_TEAM', getRunsAsTeam );
}

export default runsSaga;
