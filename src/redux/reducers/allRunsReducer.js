const allRunsReducer = (state = [], action) => {
  switch (action.type) {
    // sets the runs for a team based on logged in team or logged in coach
    case 'SET_RUNS':
      return action.payload;
    default:
      return state;
  }
};


export default allRunsReducer;