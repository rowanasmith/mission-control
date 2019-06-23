import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EitherOr from './EitherOr';
import qs from 'query-string';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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

class AddMission extends Component {

    state = {
        project_id: 0,
        name: '',
        description: '',
        goalCount: 1,
        goals: [
            {
                goal: 1,
                type: '',
            }
        ],
        editState: false,
    }

    // on load of component, get project id from url and add it to state
    // need project id to save mission to current project
    componentDidMount(){
        const searchObject = qs.parse(this.props.location.search);
        this.setState({
            project_id: searchObject.projectId,
        })
        this.props.dispatch({ type: 'GET_GOAL_TYPES' });
        this.props.dispatch({ type: 'REFRESH_OPTIONS' });
    }

    // set state with changes in mission forms
    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
    }

    // add goal to goals array in state on click of "Add a Goal"
    addGoal = () => {
        this.setState({
            ...this.state,
            goalCount: this.state.goalCount + 1,
            goals: [
                ...this.state.goals,
                {
                    goal: this.state.goalCount + 1,
                    type: '',
                }
            ]
        })
    }

    // make changes to goal data when user changes inputs in form
    handleGoal = (i, name) => (event) => { 
        let newGoals = [...this.state.goals];
        for (let goal of newGoals) {
            if (goal.goal - 1 === i) {
                let index = newGoals.indexOf(goal);
                newGoals[index][name] = event.target.value;
            }
        }
        this.setState({
            ...this.state,
            goals: newGoals,
        })
    }

    // remove goal from goals in state when user clicks trash can button
    removeGoal = (i) => (event) => {
        event.preventDefault();
        let newGoals = [...this.state.goals];
        for (let goal of newGoals) {
            if (goal.goal - 1 === i) {
                let index = newGoals.indexOf(goal);
                newGoals.splice(index, 1);
            }
        }

        this.setState({
            ...this.state,
            goals: newGoals,
        })
    }

    // gather all page details and send with ADD_MISSION dispatch to add to db
    handleSave = () => {
        let eitherOrOptions = this.props.reduxState.goalOptions.optionList;
        let addMissionPayload = {
            mission: this.state,
            options: eitherOrOptions
        };
        this.props.dispatch({ type: 'ADD_MISSION', payload: addMissionPayload });
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;

        let goalCount = 0;
      
        {/* maps through goals and conditionally renders corresponding goal info based on goal type */ }
        // Mapping through goals to display on DOM
        // conditional checks goal type to display corresponding form structure
        let goalList =
            this.state.goals.map((goal, index) => {
                index = goal.goal - 1;
                let goalTypeForm;
                goalCount += 1;

                if (goal.type === '1') {
                    goalTypeForm = <div>
                        <TextField 
                            type="text" 
                            name="name" 
                            className={classes.textField}
                            label="Goal Name"
                            onChange={this.handleGoal(index, 'name')} 
                        />
                        <TextField 
                            type="number" 
                            name="points" 
                            className={classes.textField}
                            label="Points"
                            placeholder="0"
                            onChange={this.handleGoal(index, 'points')} 
                        />
                    </div>

                } else if (goal.type === '2') {
                    goalTypeForm = <EitherOr goal={goal.goal} editState={this.state.editState} />

                } else if (goal.type === '3') {
                    goalTypeForm = <div>
                        <TextField 
                            type="text" 
                            name="name" 
                            label=" Goal Name"
                            className={classes.textField}
                            onChange={this.handleGoal(index, 'name')} 
                        />
                        <TextField 
                            type="number" 
                            name="points"
                            label="Points" 
                            placeholder="0"
                            className={classes.textField}
                            onChange={this.handleGoal(index, 'points')} 
                        />
                        <TextField 
                            type="number" 
                            name="min" 
                            label="Min"
                            placeholder="0"
                            className={classes.textField}
                            onChange={this.handleGoal(index, 'min')} 
                        />
                        <TextField 
                            type="number" 
                            name="max" 
                            label="Max"
                            placeholder="0"
                            className={classes.textField}
                            onChange={this.handleGoal(index, 'max')} 
                        />
                    </div>

                } else {
                    goalTypeForm = null;
                }

                return <div  className={classes.border} key={index}>
                    <Typography variant="h4">Goal: {goalCount}</Typography>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={this.removeGoal(index)}
                    >
                        Delete Goal<DeleteIcon className={classes.delete}/>
                    </Button>
                    <select 
                        name="type" 
                        value={goal.type}
                        className={classes.textField}
                        onChange={this.handleGoal(index, 'type')} 
                        SelectProps={{
                            MenuProps: {
                              className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        <option value="" placeholder disabled >Choose a Type</option>
                        {this.props.reduxState.goalTypes.map(type =>
                            <option 
                                key={type.id} 
                                value={type.id}
                            >
                                {type.type}
                            </option>
                        )}
                    </select>

                    {goalTypeForm}
                </div>
            })
        
        return (
            <Grid
                container
                className={classes.root}
                direction="column"
                justify="center"
                alignItems="center"
                spacing={16}
            >
                <Paper className={classes.paper}>
                    <Typography variant="h3" >Add Mission</Typography>

                    <div>
                        <TextField
                            type="text"
                            label="Mission Name"
                            name="name"
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            label="Mission Description"
                            name="description"
                            className={classes.textField}
                            value={this.state.description}
                            onChange={this.handleChange}
                        />
                    </div>

                    {goalList}

                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={this.addGoal}
                    >Add a Goal
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={this.handleSave}
                    >Save Mission
                    </Button>
                </Paper>
            </Grid>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

AddMission.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withRouter(withStyles(styles)(AddMission)));