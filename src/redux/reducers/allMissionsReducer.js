const allMissionsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_ALL_MISSIONS':
        let allMissions = [];
        for ( let item of action.payload) {
          let mission = {
            ...item,
            selected: false 
          }
          allMissions.push(mission);
        }
        return allMissions;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default allMissionsReducer;