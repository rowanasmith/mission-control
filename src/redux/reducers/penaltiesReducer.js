const penaltiesReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_PENALTIES':
            return action.payload;
        case 'SET_SELECTED_PENALTIES':
            let selectedPenalties = [];
            for (let item of action.payload) {
                item = {
                    ...item,
                    count: 0,
                    disabled: false
                }
                selectedPenalties.push(item);
            }
            return selectedPenalties;
        default:
            return state;
    }
};

// user will be on the redux state at:
// state.user
export default penaltiesReducer;
