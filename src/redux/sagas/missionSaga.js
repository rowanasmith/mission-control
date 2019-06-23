import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* getMissions( action ) {    
    try {
        const response = yield axios.get( `/api/runs/missions` );
        console.log( `get response is`, response.data );
        yield put({ type: 'SET_ALL_MISSIONS', payload: response.data })
    }
    catch( error ) {
        console.log( `Couldn't get missions from db` );
    }
}

function* getSelectedMissions( action ) {
    try {
        const response = yield axios.get( `/api/runs/selectedMissions` )
        console.log(`get response is`, response.data)
        yield put({ type: 'SET_SELECTED_MISSIONS', payload: response.data.runDetails })
        yield put({ type: 'SET_RUN_DETAILS', payload: {id: response.data.id, name: response.data.runName }})
    }
    catch( error ) {
        console.log( `Couldn't get selected missions from db` );
    }
}

function* getSelectedMissionsWithId(action) {
    try {
        console.log(`action.payload in getSelectedMissionsWithId`, action.payload);
        
        const response = yield axios.get(`/api/runs/selectedMissions/${action.payload}`)
        console.log(`get response is`, response.data)
        yield put({ type: 'SET_SELECTED_MISSIONS', payload: response.data.runDetails })
        yield put({ type: 'SET_RUN_DETAILS', payload: { id: response.data.id, name: response.data.runName } })
    }
    catch (error) {
        console.log(`Couldn't get selected missions from db`);
    }
}

function* getSelectedEitherOr(action) {
    
    try {
        const response = yield axios.get(`/api/runs/selectedEitherOr`)
        yield put({ type: 'SET_SELECTED_EITHER_OR', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get either/or goals info`);
    }
}

function* getSelectedEitherOrWithId(action) {
    console.log(`action.payload in selectedEitherOrbyId`, action.payload);
    try {
        const response = yield axios.get(`/api/runs/selectedEitherOr/${action.payload}`);
        yield put({ type: 'SET_SELECTED_EITHER_OR', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get either/or goals info`);
    }
}

function* addMission( action ){
    try {
        // console.log( `in addMission!` );
        yield axios.post( '/api/projects/mission', action.payload );
    }
    catch(error) {
        console.log( `Couldn't save mission.`, error );
        alert( `Sorry, couldn't save mission at this time. Try again later.` );
    }
}

function* getMissionDetails( action ){
    try{
        const response = yield axios.get( `api/projects/mission/${action.payload.missionId}` );
        yield put( {type: `SET_MISSION_DETAILS`, payload: response.data.missionGoals} );
        yield put( {type: 'SET_GOAL_OPTIONS', payload: response.data.eitherOrOptions} );
    }
    catch(error) {
        console.log( `Couldn't get mission details.`, error );
        alert( `Sorry, could not get info at this time. Try again later.` );
    }
} 

function* updateMission( action ) {
    try{
        yield axios.put( `/api/projects/mission`, action.payload );
    }
    catch(error) {
        console.log( `Couldn't update mission details.`, error );
        alert( `Sorry, could not update info at this time. Try again later.` );
    }
}

function* missionSaga() {
    yield takeLatest( 'GET_ALL_MISSIONS', getMissions );
    yield takeLatest( 'ADD_MISSION', addMission );
    yield takeLatest( 'GET_MISSION_DETAILS', getMissionDetails );
    yield takeLatest( 'UPDATE_MISSION', updateMission );
    yield takeLatest( 'GET_SELECTED_MISSIONS', getSelectedMissions );
    yield takeLatest( 'GET_SELECTED_EITHER_OR', getSelectedEitherOr );
    yield takeLatest( 'GET_SELECTED_MISSIONS_WITH_ID', getSelectedMissionsWithId );
    yield takeLatest( 'GET_SELECTED_EITHER_OR_WITH_ID', getSelectedEitherOrWithId );
}

export default missionSaga;