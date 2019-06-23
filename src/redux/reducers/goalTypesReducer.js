const goalTypesReducer = ( state=[], action ) => {
    switch (action.type) {
        case 'SET_GOAL_TYPES':
            return action.payload;
    
        default:
            return state;
    }
}

export default goalTypesReducer;