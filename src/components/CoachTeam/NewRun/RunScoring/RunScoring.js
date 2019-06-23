import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaUndo } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import RunTimer from './RunTimer';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        overflowX: 'auto',
    },
    pointSpace: {
        margin: 10,
    },
    panel: {
        minWidth: 350,
    },
    paper: {
        maxWidth: 375,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        maxWidth: 300,
        minWidth: 200,
        margin: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    textField: {
        width: 250,
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    menu: {
        width: 250,
    },
    span: {
        padding: 2,
    }
})

class RunScoring extends Component {

    state = {
        score: 0,
        runId: 0,
        goals: [],
        eitherOr: [],
        penalties: []
    }

    // checks for existing reduxState, updates local state if reduxState has changed
    componentDidUpdate(prevProps) {
        if (this.props.reduxState.runDetails !== prevProps.reduxState.runDetails) {
            this.setState({
                runId: this.props.reduxState.runDetails.id,
            })
        }
        if (this.props.reduxState.penalties !== prevProps.reduxState.penalties) {
            this.setState({
                penalties: this.props.reduxState.penalties,
            })
        }
        if (this.props.reduxState.selectedMissions !== prevProps.reduxState.selectedMissions) {
            this.setState({
                goals: this.props.reduxState.selectedMissions,
            })
        }
        if (this.props.reduxState.eitherOr !== prevProps.reduxState.eitherOr) {
            this.setState({
                eitherOr: this.props.reduxState.eitherOr,
            })
        }
    };

    // renders list of missions on DOM
    missionList = () => {
        const { classes } = this.props;

        let missionArr = this.state.goals;
        let eitherOrArr = this.state.eitherOr;
        let newMissionArr = [];
        let newEitherOrArr = [];
        let test = [];
        let missionMin = 0;
        let missionMax = 0;
        let missionMinMaxArr = [];
        let eitherOrMin = 0;
        let eitherOrMax = 0;
        let eitherOrMinMaxArr = [];

        //Pushes missions ids into its own array
        for (let i = 0; i < missionArr.length; i++) {
            missionMinMaxArr.push(missionArr[i].mission_id);
        }

        //Finds min and mix id numbers for loop
        missionMin = Math.min(...missionMinMaxArr);
        missionMax = Math.max(...missionMinMaxArr);
        
        //Pushes either/or ids into its own array
        for (let i = 0; i < eitherOrArr.length; i++) {
            eitherOrMinMaxArr.push(eitherOrArr[i].either_or_goal_id);
        }

        //Finds min and mix id numbers for loop        
        eitherOrMin = Math.min(...eitherOrMinMaxArr);
        eitherOrMax = Math.max(...eitherOrMinMaxArr);

        //Organizes array based on ids 
        for (let count = missionMin; count <= missionMax; count++) {
            test = missionArr.filter(x => x.mission_id === count)

            if (test.length !== 0) {

                newMissionArr.push(test)
            }

        }
        
        //Organizes array based on ids 
        for (let count = eitherOrMin; count <= eitherOrMax; count++) {
            test = eitherOrArr.filter(x => x.either_or_goal_id === count)

            if (test.length !== 0) {

                newEitherOrArr.push(test)
            }

        }

        return (
            // mapping through new array of goals to display the corresponding mission headers on DOM
            newMissionArr.map((mission, i) => {
                return (
                    <div key={i}>
                        <ExpansionPanel className={classes.panel}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="body2">Mission {i + 1}: {mission[0].mission_name}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                >
                                    {/* for each mission, render goals */}
                                    {mission.map((goal, y) => {
                                        return (
                                            <div key={y}>
                                                {this.renderGoals(goal, newEitherOrArr)}
                                            </div>
                                        )
                                    })}
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                )
            })
        )
    }

    penaltyList = () => {
        const { classes } = this.props;

        return (
            // mapping through array of penalties to display each as a clickable button with a clickable undo button for each
            this.state.penalties.map((penalty, i) => {
                return (
                    <Grid item key={penalty.id}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">{penalty.name}</Typography>
                            <Typography variant="h6">Count: {penalty.count}</Typography>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => { this.penaltyOnClick(i) }}
                                disabled={penalty.disabled}
                            >Add Penalty
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => { this.undoOnClick(i) }}
                            >Undo<FaUndo />
                            </Button>
                        </Paper>
                    </Grid>
                )
            })
        )
    }


    renderGoals = (goal, eitherOr) => {
        const { classes } = this.props;
        // conditionally renders goals as clickable buttons based on type id with corresponding information for each type
        if (goal.goal_type_id === 1) {
            return (
                <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    disabled={goal.disabled} 
                    onClick={() => { this.yesNoOnClick(goal) }}
                ><div>{goal.goal_name}</div> <div className={classes.pointSpace}>{goal.goal_points} pts</div>
                </Button>
            )
        }
        else if (goal.goal_type_id === 2) {

            return (
                eitherOr.map((options) => {
                    return (
                        // if goal type is either, map through options and display as clickable buttons on DOM under corresponding mission
                        options.map((option, i) => {
                            if (goal.goal_id === option.either_or_goal_id) {
                                return (
                                    <div key={i}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            className={classes.button}
                                            disabled={option.disabled} 
                                            onClick={() => { this.eitherOrOnClick(option, goal) }}
                                            ><div>{option.either_or_name}</div> <div className={classes.pointSpace}>{option.either_or_points} pts</div>
                                        </Button>
                                        {this.renderOrText(options, i)}
                                    </div>
                                )
                            }
                        })
                    )
                })
            )
        }
        else if (goal.goal_type_id === 3) {

            return (
                <div>
                    <Button 
                        disabled={goal.disabled} 
                        variant="contained" 
                        color="primary" 
                        className={classes.button}
                        onClick={() => { this.howManyOnClick(goal) }}
                        ><div>{goal.goal_name}</div><div className={classes.pointSpace}>{goal.goal_points} pts each</div>
                    </Button>
                    <Typography variant="body1">Count: {goal.count}</Typography>
                </div>
            )
        }
    }

    // renders 'OR' after each option except for last option in array
    renderOrText = (options, i) => {
        if (i < (options.length - 1)) {
            return <Typography variant="h5">Or</Typography>
        }
        return null;
    }

    // updates penalty information on click of each penalty button
    penaltyOnClick = (i) => {
        let updatedPenalties = [...this.state.penalties];
        // if penalty max is not reached, add one to penalty count
        if ((updatedPenalties[i].count < updatedPenalties[i].max) && (updatedPenalties[i].disabled === false)) {
            updatedPenalties[i].count = updatedPenalties[i].count + 1
        }
        // if penalty max is reached, disable button
        if (updatedPenalties[i].count === updatedPenalties[i].max) {
            updatedPenalties[i].disabled = true;
        }
        this.setState({
            penalties: updatedPenalties
        })
    }

    // updates penalty information for corresponding penalty if undo option is clicked
    undoOnClick = (i) => {
        let updatedPenalties = [...this.state.penalties];
        updatedPenalties[i].disabled = false;
        // if the penalty count is 1 or more, remove a penalty from count on click
        if (updatedPenalties[i].count <= (updatedPenalties[i].max + 1) && updatedPenalties[i].count > 0) {
            updatedPenalties[i].count = updatedPenalties[i].count - 1
        }
        this.setState({
            penalties: updatedPenalties
        })
    }

    // function to add points for how many goal type on click
    howManyOnClick = (goal) => {
        let updatedGoals = [...this.state.goals];
        let goalIndex = 0;
        let currentScore = this.state.score;

        // finds index in new array to compare to original array
        for (let i = 0; i < updatedGoals.length; i++) {
            if (updatedGoals[i].goal_id === goal.goal_id) {
                goalIndex = i;
            }
        }

        // adds one to the count and changes completed status to true in new array
        updatedGoals[goalIndex].count = updatedGoals[goalIndex].count + 1;
        updatedGoals[goalIndex].isCompleted = true;

        // if the count is less than or equal to max, add to score
        if (updatedGoals[goalIndex].count <= updatedGoals[goalIndex].how_many_max) {
            currentScore = currentScore + updatedGoals[goalIndex].goal_points
        }
        // if count equals max, disable button
        if (updatedGoals[goalIndex].count === updatedGoals[goalIndex].how_many_max) {
            updatedGoals[goalIndex].disabled = true;
        }
        this.setState({
            score: currentScore,
            goals: updatedGoals
        })
    }

    // function to add points for yes/no goal type on click and disable button after click
    yesNoOnClick = (goal) => {
        let updatedGoals = [...this.state.goals];
        let goalIndex = 0;
        let currentScore = this.state.score;

        // finds index in new array to compare to original array    
        for (let i = 0; i < updatedGoals.length; i++) {
            if (updatedGoals[i].goal_id === goal.goal_id) {
                goalIndex = i;
            }
        }
        // adds to score if button is not disabled
        if (updatedGoals[goalIndex].disabled === false) {
            currentScore = currentScore + updatedGoals[goalIndex].goal_points
        }
        // sets goal to completed and disabled on click
        updatedGoals[goalIndex].isCompleted = true;
        updatedGoals[goalIndex].disabled = true;
        this.setState({
            score: currentScore,
            goals: updatedGoals
        })
    }

    // function to add points for either/or goal type on click and disable all options after click
    eitherOrOnClick = (option, goal) => {
        let updatedGoals = [...this.state.goals];
        let updatedEitherOr = [...this.state.eitherOr]
        let goalIndex = 0;
        let currentScore = this.state.score;
        let optionIndex = 0;
        // finds index in new goal array to compare to original array
        for (let i = 0; i < updatedGoals.length; i++) {
            if (updatedGoals[i].goal_id === goal.goal_id) {
                goalIndex = i;
                updatedGoals[i].isCompleted = true;
            }
        }
        // finds index of option to compare to original either or array
        for (let i = 0; i < updatedEitherOr.length; i++) {
            if (updatedEitherOr[i].either_or_id === option.either_or_id) {
                optionIndex = i;
            }
        }
        // adds points if goal is not disabled
        if (updatedGoals[goalIndex].disabled === false) {
            currentScore = currentScore + updatedEitherOr[optionIndex].either_or_points
        }
        // loops through array and changes each option to disabled on click
        for (let choice of updatedEitherOr) {
            if (choice.either_or_goal_id === goal.goal_id) {
                choice.disabled = true;
            }
        }

        this.setState({
            score: currentScore,
            goals: updatedGoals,
            eitherOr: updatedEitherOr
        })
    }

    // calculates score based on penalties added if score is greater than penalty points deducted
    calculateScore = () => {
        let score = this.state.score;
        for (let penalty of this.state.penalties) {
            if (score >= Math.abs(penalty.points)){
                score = score + (penalty.count * penalty.points)
            }
        }
        return score;
    }

    handleSubmit = () => {
        this.props.dispatch({ type: 'UPDATE_RUN_DETAILS', payload: this.state });
        this.props.history.push(`/practice-run/run-summary?runId=${this.state.runId}`)
    }

    render() {
        const { classes } = this.props;


        return (

            <Grid
                container
                className={classes.root}
                direction="column"
                justify="center"
                alignItems="center"
                spacing={16}
            >
                <Grid item>
                    <Typography variant="h3">Score: {this.calculateScore()}</Typography>
                    <Typography variant="h4">{this.props.reduxState.runDetails.name}</Typography>
                </Grid>
                <Grid item>
                    {this.penaltyList()}
                </Grid>
                <Grid item>
                    {this.missionList()}
                </Grid>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleSubmit}
                >End Run
                </Button>
                <RunTimer />
            </Grid>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

RunScoring.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapReduxStateToProps)(withStyles(styles)(RunScoring)));
