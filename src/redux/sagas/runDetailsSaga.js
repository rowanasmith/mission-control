import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* getRunDetails(action) {
    try {
        const response = yield axios.get( `/api/runs/runHistoryDetails/${action.payload}` );
        yield put( {type: 'SET_RUN_DETAILS', payload: response.data[0]} );
    }
    catch(error) {
        console.log( `Couldn't get run details.`, error );
        alert( `Sorry, couldn't get information. Try again later.` );
    }
}

function* updateRunNotes(action) {
    try {
        console.log( action.payload );
        
        yield axios.put( `/api/runs/summary/${action.payload.runId}`, action.payload );
    }
    catch(error) {
        console.log( `Couldn't update run information.`, error );
        alert( `Sorry, couldn't save information. Try again later.` );
    }
}

function* runDetailsSaga(){
    yield takeLatest( 'GET_RUN_DETAILS', getRunDetails );
    yield takeLatest( 'UPDATE_RUN_NOTES', updateRunNotes );
}

export default runDetailsSaga;