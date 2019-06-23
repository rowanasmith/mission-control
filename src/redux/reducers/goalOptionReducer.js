let options = {
    optionCount: 0,
    optionList: []
}

const goalOptionReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_GOAL_OPTIONS':
            options = {
                ...options,
                optionList: action.payload,
            }

            if(options.optionCount === 0){
                options = {
                    ...options,
                    optionCount: action.payload.length,
                }
            } 

            return state = options;
    
        case 'ADD_OPTION':
            options = {
                ...options,
                optionCount: options.optionCount + 1,
                optionList: [
                    ...options.optionList,
                    {
                        id: action.payload.option_id || options.optionCount,
                        goal_id: action.payload.goal_id,
                        option_name: '',
                        option_points: '',
                    }
                ]
            }

            return state = options;

        case 'ADD_STARTER_OPTIONS':
            options = {
                ...options,
                optionCount: 2,
                optionList: [
                    {
                        id: options.optionCount -1,
                        goal_id: action.payload,
                        option_name: '',
                        option_points: '',
                    },
                    {
                        id: options.optionCount,
                        goal_id: action.payload,
                        option_name: '',
                        option_points: '',
                    }
                ]
            }

            return state = options;

        case 'REMOVE_OPTION':
            options = {
                ...options,
                optionList: action.payload,
            }
            return state = options;

        case 'REFRESH_OPTIONS':
            options = {
                optionCount: 0,
                optionList: []
            }
            return state = options;

        default:
            return state;
    }
}

export default goalOptionReducer;