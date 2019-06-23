const runHistoryDetails = (state = {}, action) => {
    switch (action.type) {
        case 'SET_RUN_DETAILS':
            return action.payload;
    
        case 'RESET_RUN_DETAILS':
            return state = {};

        default:
            return state;
    }
}

export default runHistoryDetails;