import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';


function* getAllProjects(action) {
    try {
        const response = yield axios.get(`/api/projects`);
        yield put({ type: 'SET_PROJECTS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* getProjectDetails(action) {
    try {
        const response = yield axios.get(`/api/projects/details/${action.payload.projectId}`);
        yield put({ type: 'SET_PROJECT_DETAILS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* publishProject(action) {
    try {
        console.log('action.payload', action.payload.projectId);

        yield axios.put(`/api/projects/publish/${action.payload.projectId}`);
        yield put({ type: 'GET_PROJECT_DETAILS', payload: action.payload })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* getPenalties(action) {
    try {
        const response = yield axios.get(`/api/projects/penalties/${action.payload.projectId}`);
        yield put({ type: 'SET_PENALTIES', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get penalties info`);
    }
}

function* deletePenalty(action) {
    try {
        yield axios.delete(`/api/projects/penalties/${action.payload.penaltyId}`);
        yield put({ type: 'GET_PENALTIES', payload: action.payload });
    }
    catch (error) {
        console.log(`Couldn't delete penalty`);
    }
}

function* getMissions(action) {
    try {
        const response = yield axios.get(`/api/projects/missions/${action.payload.projectId}`);
        yield put({ type: 'SET_MISSIONS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get penalties info`);
    }
}

function* deleteMission(action) {
    try {

        yield axios.delete(`/api/projects/missions/${action.payload.missionId}`);
        yield put({ type: 'GET_MISSIONS', payload: action.payload });
    }
    catch (error) {
        console.log(`Couldn't delete penalty`);
    }
}

function* deleteProject(action) {
    try {
        console.log('action.payload', action.payload);

        yield axios.put(`/api/projects/project/${action.payload}`);
        yield put({ type: 'GET_ALL_PROJECTS' });
    }
    catch (error) {
        console.log(`Couldn't delete penalty`);
    }
}

function* getEitherOr(action) {
    try {
        const response = yield axios.get(`/api/projects/missions/either-or/${action.payload.projectId}`);
        yield put({ type: 'SET_EITHER_OR', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get either/or goals info`);
    }
}

function* addProject(action) {
    try {
        const response = yield axios.post(`/api/projects`, action.payload);
        console.log('new project id:', response);

        yield put({ type: 'GET_ALL_PROJECTS' })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* updateProjectInfo(action) {
    try {
        console.log('action.payload', action.payload);
        let id = action.payload.projectId

        yield axios.put(`/api/projects/info/${id}`, action.payload);
        yield put({ type: 'GET_PROJECT_DETAILS', payload: action.payload });
    }
    catch (error) {
        console.log(`Couldn't update project info`);
    }
}

function* projectSaga() {
    yield takeLatest('GET_ALL_PROJECTS', getAllProjects);
    yield takeLatest('GET_PROJECT_DETAILS', getProjectDetails);
    yield takeLatest('PUBLISH_PROJECT', publishProject);
    yield takeLatest('UPDATE_PROJECT_NAME', updateProjectInfo);
    yield takeLatest('DELETE_PROJECT', deleteProject);
    yield takeLatest('GET_PENALTIES', getPenalties);
    yield takeLatest('DELETE_PENALTY', deletePenalty);
    yield takeLatest('GET_MISSIONS', getMissions);
    yield takeLatest('DELETE_MISSION', deleteMission);
    yield takeLatest('GET_EITHER_OR', getEitherOr);
    yield takeLatest('ADD_PROJECT', addProject);
}

export default projectSaga;