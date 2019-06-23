// Holding all teams by specific coach_user_id
const allTeamsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_TEAMS':
            return action.payload;

        default:
            return state;
    }
};

export default allTeamsReducer;