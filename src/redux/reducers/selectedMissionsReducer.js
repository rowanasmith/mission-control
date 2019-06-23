const selectedMissionsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SELECTED_MISSIONS':
        console.log(`action.payload in runDetails`, action.payload);

        let selectedMissions = [];
        for (let item of action.payload) {
          item = {
            ...item,
            count: 0,
            disabled: false,
            isCompleted: false
          }
          selectedMissions.push(item);
        }
        return selectedMissions;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default selectedMissionsReducer;