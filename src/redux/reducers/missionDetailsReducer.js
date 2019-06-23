let mission = {}

const missionDetails = (state = mission, action) => {
    // console.log( `STATE!:`, state );
    
    switch (action.type) {
        
        case 'SET_MISSION_DETAILS':
            mission = {
                name: action.payload[0].name,
                description: action.payload[0].description,
                goals: action.payload,
                goalCount: action.payload.length,

            };

            return state = mission;

        case 'UPDATE_GOALS':
            mission = {
                ...mission, 
                goals: action.payload}
            return state = mission;

        case 'ADD_GOAL':
            mission = {
                ...mission,
                goalCount: mission.goalCount + 1,
                goals: [
                    ...mission.goals,
                    {
                        goal_id: mission.goalCount,
                        goal_type_id: action.payload || '',
                    }
                ]
            }
            return state = mission;
    
        default:
            return state;
    }
}

export default missionDetails;