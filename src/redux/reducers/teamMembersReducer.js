

// Holding all teams by specific coach_user_id
const teamMembersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_TEAM_MEMBERS':
            return action.payload;

        default:
            return state;
    }
};






export default  teamMembersReducer