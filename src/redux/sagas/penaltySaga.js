import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* addPenalty(action) {
    try {
        yield axios.post( `/api/projects/penalty`, action.payload );
    }
    catch(error) {
        console.log( `Couldn't add penalty.`, error );
        alert( `Sorry, couldn't add penalty at this time. Try again later.` );
    }
}

function* getPenalty(action) {
    try {
        const response = yield axios.get( `/api/projects/penalty/${action.payload}` );
        yield put( {type: `SET_PENALTY`, payload: response.data} );
    }
    catch(error) {
        console.log( `Couldn't get penalty info.` );
        alert( `Sorry, couldn't get info at this time. Try again later.`);
    }
}

function* updatePenalty(action) {
    try {
        console.log( `Payload!`, action.payload );
        
        yield axios.put( `/api/projects/penalty`, action.payload );
    }
    catch(error) {
        console.log( `Couldn't update penalty.` );
        alert( `Sorry, couldn't save penalty at this time. Try again later.` );
    }
}

function* penaltySaga() {
    yield takeLatest( `ADD_PENALTY`, addPenalty );
    yield takeLatest( `GET_PENALTY`, getPenalty );
    yield takeLatest( `UPDATE_PENALTY`, updatePenalty );
}

export default penaltySaga;