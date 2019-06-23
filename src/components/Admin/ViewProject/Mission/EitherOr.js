import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        overflowX: 'auto',
    },
    paper: {
        maxWidth: 375,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        maxWidth: 300,
        margin: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    textField: {
        width: 300,
        margin: theme.spacing.unit * 2,
    },
    delete: {
        marginLeft: 5,
    },
})

class EitherOr extends Component {

    state = {
        missionId: 0,
        goal_id: this.props.goal,
        optionArray: [],
        optionCount: 0,
        count: 1,
    }

    // on page load, get mission id from url and add it to state
    // if a goal is new, editState will be false and dispatch to reduxState
    // to add starting option fields
    componentDidMount() {
        const searchObject = qs.parse(this.props.location.search);
        
        this.setState({
            missionId: searchObject.missionId,
        })

        this.props.dispatch({ type: 'GET_GOAL_TYPES' });

        if (this.props.editState === false) {
            this.props.dispatch({ type: 'ADD_STARTER_OPTIONS', payload: this.props.goal });
        }
    }

    // Once optionList and missionDetails in reduxState is populated, 
    // set state with data from those reducers
    componentDidUpdate(prevProps) {
        if (this.props.reduxState.goalOptions.optionList !== prevProps.reduxState.goalOptions.optionList) {
            this.setState({
                optionArray: this.props.reduxState.goalOptions.optionList,
                optionCount: this.props.reduxState.goalOptions.optionCount,
            })
        }
        if (this.props.reduxState.missionDetails !== prevProps.reduxState.missionDetails) {
            this.setState({ state: this.state });
        }
    }

    // On click of "Add an Option"
    // If goal is new and editState is false, add an option to the goal array in reduxState
    // if not, add option to DB table either_or
    addOption = () => {
        if (this.props.editState === false) {
            this.props.dispatch({ type: 'ADD_OPTION', payload: this.state });

        } else {
            this.props.dispatch({ type: 'ADD_OPTION_TO_GOAL', payload: this.state });
        }

        // need to update state in order to update the mapping of goalOptionReducer
        this.setState({ state: this.state });
    }

    // update reduxState with changes of goal's option input fields
    handleOption = (i, name) => (event) => {
        let newOptions = [...this.props.reduxState.goalOptions.optionList];

        for (let option of newOptions) {
            if (option.id === i) {
                let index = newOptions.indexOf(option);
                
                newOptions[index][name] = event.target.value;
                newOptions[index].goal_id = this.props.goal;
            }
        }

        this.props.dispatch({ type: 'SET_GOAL_OPTIONS', payload: newOptions });
        // need to update state in order to update the mapping of missionDetails.goals
        this.setState({ state: this.state });
    }

    // Delete an option on click of trash can icon
    // either from reduxState (if editState is false)
    // or from DB
    removeOption = (i) => (event) => {
        event.preventDefault();
        if (this.props.editState === false) {
            let newOptions = [...this.props.reduxState.goalOptions.optionList];

            for (let option of newOptions) {
                if (option.id === i) {
                    let index = newOptions.indexOf(option);
                    newOptions.splice(index, 1);
                }
            }

            this.props.dispatch({ type: 'REMOVE_OPTION', payload: newOptions });
        } else {
            let removeOptionPayload = {
                option_id: i,
                missionId: this.state.missionId,
            }

            this.props.dispatch({ type: 'DELETE_OPTION', payload: removeOptionPayload });
        }

        // need to update state in order to update the mapping of goalOptionReducer
        this.setState({ state: this.state });
    }

    render() {
        const { classes } = this.props;

        let optionArray = this.props.reduxState.goalOptions.optionList;
        let optionCount = this.props.reduxState.goalOptions.optionCount;
        let optionMap;

        // map through options in optionList reducer
        // display form fields for each option 
        // and pre-populate if reduxState holds option data
        if (optionCount > 1) {
            optionMap = optionArray.map(option => {

                let option_name = option.option_name;
                let option_points = option.option_points;
                if (option.option_name === null) {
                    option_name = '';
                }
                if (option.option_points === null) {
                    option_points = '';
                }

                if (option.goal_id === this.props.goal) {
                    return <div key={option.id} >
                        <TextField
                            type="text"
                            name="option_name"
                            label="Option Name"
                            className={classes.textField}
                            value={option_name}
                            onChange={this.handleOption(option.id, 'option_name')}
                        />
                        <TextField
                            type="number"
                            name="option_points"
                            label="Points"
                            placeholder="0"
                            className={classes.textField}
                            value={option_points}
                            onChange={this.handleOption(option.id, 'option_points')}
                        />
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={this.removeOption(option.id)}
                        >
                            Delete Option
                        </Button>
                    </div>
                } else {
                    return null;
                }
            }
            )
        } else {
            optionMap = null;
        }

        return (
            <div>
                {optionMap}

                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={this.addOption}
                >Add Option
                </Button>

            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

EitherOr.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withRouter(withStyles(styles)(EitherOr)));