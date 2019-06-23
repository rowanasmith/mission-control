const eitherOrReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_EITHER_OR':
            return action.payload;
        case 'SET_SELECTED_EITHER_OR':
            let selectedEitherOr = [];
            for (let item of action.payload) {
                item = {
                    ...item,
                    disabled: false
                }
                selectedEitherOr.push(item);
            }
            return selectedEitherOr;
        default:
            return state;
    }
};

// user will be on the redux state at:
// state.user
export default eitherOrReducer;
