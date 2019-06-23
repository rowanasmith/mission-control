
// TO DO
// Check with Brad on this!

const penaltyReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_PENALTY':
            return action.payload;
        default:
            return state;
    }
}

export default penaltyReducer;