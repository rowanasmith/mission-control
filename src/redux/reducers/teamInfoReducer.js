

//Stores info about one specific team
const teamInfoReducer = (state = ['State'], action) => {
    if (action.type === 'SET_TEAM_INFO'){
    console.log(action.payload);
        return action.payload;
    }
    else return state;
}


export default 
teamInfoReducer
