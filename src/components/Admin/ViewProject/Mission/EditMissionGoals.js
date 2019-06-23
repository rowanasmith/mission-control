import React, { Component } from 'react';
import { connect } from 'react-redux';
import EitherOr from './EitherOr';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';


const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        overflowX: 'auto',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        maxWidth: 300,
        margin: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
    },
    textField: {
        width: 300,
        margin: theme.spacing.unit * 2,
    },
    delete: {
        marginLeft: 5,
    },
    menu: {
        width: 200,
    },
    border: {
        margin: 10,
        border: "1px solid black",
        borderRadius: 10,
    }
})

class EditMissionGoals extends Component {

    state = {
        missionId: 0,
        goals: [],
    }

    // wait for reduxState to update, then set state with goal details
    componentDidUpdate(prevProps) {
        if (this.props.reduxState.missionDetails.goals !== prevProps.reduxState.missionDetails.goals) {
            this.setState({
                ...this.state,
                missionId: this.props.mission_id,
                goals: this.props.reduxState.missionDetails.goals,
            })
        }
    }

    // update state and reduxState with changes to goal forms
    handleGoal = (i, name) => (event) => {
        let newGoals = [...this.props.reduxState.missionDetails.goals];
        for (let goal of newGoals) {
            if (goal.goal_id === i) {
                let index = newGoals.indexOf(goal);
                if (name === 'goal_type_id') {
                    newGoals[index][name] = Number(event.currentTarget.value);
                } else {
                    newGoals[index][name] = event.target.value;
                }
            }
        }
        this.props.dispatch({ type: 'UPDATE_GOALS', payload: newGoals });
        this.setState({
            ...this.state,
            goals: newGoals,
        })
    }

    // create goal in db on click of "Add a Goal"
    addGoal = () => {
        this.props.dispatch({ type: 'ADD_GOAL_TO_MISSION', payload: this.state });
        this.setState({ state: this.state });
    }

    // delete goal from DB when user clicks trash can for goal
    removeGoal = (id) => () => {
        let removePayload = { goal_id: id, missionId: this.state.missionId };
        this.props.dispatch({ type: 'DELETE_GOAL', payload: removePayload });
        this.setState({ state: this.state });
    }

    render() {
        const { classes } = this.props;

        let missionDetails = this.props.reduxState.missionDetails;
        let goalList;
        let goalCount = 0;

        // wait for reduxState to populate with data from GET request
        // then map through goal data and display forms corresponding with goal types
        if (missionDetails.goals) {
            goalList = this.state.goals.map(goal => {
                let goalTypeForm;
                goalCount += 1;
                let goal_name = goal.goal_name;
                let points = goal.points;
                if (goal.goal_name === null) {
                    goal_name = '';
                }
                if (goal.points === null) {
                    points = '';
                }

                if (goal.goal_type_id === 1) {
                    goalTypeForm = <div>
                        <TextField
                            type="text"
                            label="Name"
                            name="name"
                            className={classes.textField}
                            value={goal_name}
                            onChange={this.handleGoal(goal.goal_id, 'goal_name')}
                        />
                        <TextField
                            type="number"
                            label="Points"
                            name="points"
                            className={classes.textField}
                            value={points}
                            onChange={this.handleGoal(goal.goal_id, 'points')}
                        />
                    </div>

                } else if (goal.goal_type_id === 2) {
                    goalTypeForm = <EitherOr goal={goal.goal_id} mission_id={this.state.mission_id} />;

                } else if (goal.goal_type_id === 3) {
                    goalTypeForm = <div>
                        <TextField
                            type="text"
                            name="name"
                            label=" Goal Name"
                            className={classes.textField}
                            value={goal.goal_name}
                            onChange={this.handleGoal(goal.goal_id, 'goal_name')}
                        />
                        <TextField
                            type="number"
                            name="points"
                            label="Points"
                            className={classes.textField}
                            value={goal.points}
                            onChange={this.handleGoal(goal.goal_id, 'points')}
                        />
                        <TextField
                            type="number"
                            name="min"
                            label="Min"
                            className={classes.textField}
                            value={goal.how_many_min || 0}
                            onChange={this.handleGoal(goal.goal_id, 'how_many_min')}
                        />
                        <TextField
                            type="number"
                            name="max"
                            label="Max"
                            className={classes.textField}
                            value={goal.how_many_max || 1}
                            onChange={this.handleGoal(goal.goal_id, 'how_many_max')}
                        />
                    </div>;
                }

                return <div className={classes.border} key={goal.goal_id}>
                    <Typography variant="h4">Goal: {goalCount}</Typography>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={this.removeGoal(goal.goal_id, goal)}
                    >
                        Delete Goal<DeleteIcon className={classes.delete}/>
                    </Button>

                    <select 
                        name="goal_type_id" 
                        value={goal.goal_type_id}
                        className={classes.textField}
                        onChange={this.handleGoal(goal.goal_id, 'goal_type_id')}
                        SelectProps={{
                            MenuProps: {
                              className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        <option value="" disabled >Choose a Type</option>
                        {this.props.reduxState.goalTypes.map(type =>
                            <option key={type.id} value={type.id}>{type.type}</option>
                        )}
                    </select>

                    {goalTypeForm}
                </div>
            })
        }

        return (
            <div>

                {goalList}

                <Button 
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={this.addGoal} 
                >Add a Goal
                </Button>
            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

EditMissionGoals.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withStyles(styles)(EditMissionGoals));