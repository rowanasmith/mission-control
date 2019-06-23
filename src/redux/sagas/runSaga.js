import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';


function* saveRun( action ) {
    console.log(`userClearance is`, action.payload.userClearance);
    
    try {
        console.log('in save run saga', action.payload);        
        yield axios.post( `/api/runs/saveDetails`, action.payload );
        if (action.payload.userClearance === 4) {
            yield put({ type: 'GET_SELECTED_MISSIONS' });
            yield put({ type: 'GET_SELECTED_EITHER_OR' });
        }
        else if (action.payload.userClearance === 2) {
            yield put({ type: 'GET_SELECTED_MISSIONS_WITH_ID', payload: action.payload.id });
            yield put({ type: 'GET_SELECTED_EITHER_OR_WITH_ID', payload: action.payload.id });  
        }
    }
    catch(error) {
        console.log(`Couldn't post your run details`, error);
        alert(`Sorry, couldn't save your run details`);
    }
}


function* getSelectedPenalties( action ) {
    try {
        const response = yield axios.get(`/api/runs/penalties`);
        yield put({ type: 'SET_SELECTED_PENALTIES', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get penalties info`);
    }
}

function* updateRunDetails( action ){
    try{
        console.log(`updateRunDetails payload`, action.payload);
        yield axios.put(`api/runs/updateDetails`, action.payload)
        yield put({ type: 'GET_RUN_DETAILS', payload: action.payload.runId })
    } catch (error) {
        console.log(`Couldn't update your run details`);
    }
}

function* runSaga() {
    yield takeLatest( 'SAVE_RUN_DETAILS', saveRun );
    yield takeLatest( 'GET_SELECTED_PENALTIES', getSelectedPenalties);
    yield takeLatest( 'UPDATE_RUN_DETAILS', updateRunDetails );
}


export default runSaga;