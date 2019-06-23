import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* getGoalTypes( action ) {
    try {
        const response = yield axios.get( `/api/projects/goalTypes`);
        yield put( {type: 'SET_GOAL_TYPES', payload: response.data} );
    }
    catch(error) {
        console.log( `Couldn't get goal types.`, error );
        alert( `Sorry, can't get data at this time. Try again later.` );
    }
}

function* addGoalToMission( action ){
    try{
        console.log( `in ADD GOAL:`, action.payload );
        
        yield axios.post( `/api/projects/goal`, action.payload );
        // yield put( {type: 'ADD_GOAL', payload: response.data[0].id} );
        yield put( {type: `GET_MISSION_DETAILS`, payload: action.payload} );
    }
    catch(error) {
        console.log( `Couldn't add goal to mission.`, error );
        alert( `Sorry, can't add goal at this time. Try again later.` );
    }
}

function* addOptionToGoal( action ){
    try{
        const response = yield axios.post( `/api/projects/option`, action.payload );
        yield put( { type: 'ADD_OPTION', payload: {option_id: response.data[0].id, goal_id: action.payload.goal_id} } );
        console.log( response.data );
        
        yield put( {type: `GET_MISSION_DETAILS`, payload: action.payload} );
    }
    catch(error) {
        console.log( `Couldn't add option to goal.`, error );
        alert( `Sorry, can't add option at this time. Try again later.` );
    }
}

function* deleteGoal( action ){
    try{
        axios.delete( `/api/projects/goal/${action.payload.goal_id}` );
        yield put( {type: `GET_MISSION_DETAILS`, payload: action.payload} );
    }
    catch(error) {
        console.log( `Couldn't delete goal.`, error );
        alert( `Sorry, can't remove goal at this time. Try again later.` );
    }
}

function* deleteOption( action ){
    try{
        axios.delete( `/api/projects/option/${action.payload.option_id}` );
        yield put( {type: `GET_MISSION_DETAILS`, payload: action.payload} );
    }
    catch(error) {
        console.log( `Couldn't delete option.`, error );
        alert( `Sorry, can't remove option at this time. Try again later.` );
    }
}

function* missionSaga() {
    yield takeLatest( 'GET_GOAL_TYPES', getGoalTypes );
    yield takeLatest( 'ADD_GOAL_TO_MISSION', addGoalToMission );
    yield takeLatest( 'ADD_OPTION_TO_GOAL', addOptionToGoal );
    yield takeLatest( 'DELETE_GOAL', deleteGoal );
    yield takeLatest( 'DELETE_OPTION', deleteOption );
}

export default missionSaga;