import React, { Component } from 'react';
import { connect } from 'react-redux';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
    },
    paper: {
        maxWidth: 375,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        minWidth: 360,
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    panel: {
        minWidth: 360,
    }
})

class ProjectOverview extends Component {

    state = {
        projectId: 0,
        editProject: false,
        projectName: '',
        projectDetails: {},
        projectPenalties: [],
        projectMissions: [],
        projectEitherOr: [],
    }

    componentDidMount() {
        this.props.dispatch({ type: 'GET_ALL_PROJECTS' })
        this.props.dispatch({ type: 'GET_PROJECT_DETAILS', payload: this.state });
        this.props.dispatch({ type: 'GET_PENALTIES', payload: this.state });
        this.props.dispatch({ type: 'GET_MISSIONS', payload: this.state });
        this.props.dispatch({ type: 'GET_EITHER_OR', payload: this.state });
    }

    componentDidUpdate(prevProps) {
        if (this.state.projectDetails.length === 0) {
            this.props.dispatch({ type: 'GET_PROJECT_DETAILS', payload: this.state });
            this.props.dispatch({ type: 'GET_PENALTIES', payload: this.state });
            this.props.dispatch({ type: 'GET_MISSIONS', payload: this.state });
            this.props.dispatch({ type: 'GET_EITHER_OR', payload: this.state });
        }
        if (this.props.reduxState.projects !== prevProps.reduxState.projects) {
            this.setState({
                projectId: this.props.reduxState.projects[0].id
            })
        };
        if (this.props.reduxState.projectDetails !== prevProps.reduxState.projectDetails) {
            this.setState({
                projectId: this.props.reduxState.projects[0].id,
                projectName: this.props.reduxState.projectDetails.name,
                projectDetails: this.props.reduxState.projectDetails
            })

        };
        if (this.props.reduxState.penalties !== prevProps.reduxState.penalties) {
            this.setState({
                projectPenalties: this.props.reduxState.penalties
            })
        };
        if (this.props.reduxState.projectMission !== prevProps.reduxState.projectMission) {
            this.setState({
                projectMissions: this.props.reduxState.projectMission
            })
        };
        if (this.props.reduxState.eitherOr !== prevProps.reduxState.eitherOr) {
            this.setState({
                projectEitherOr: this.props.reduxState.eitherOr
            })
        };
    }

    groundControl = () => {
        const { classes } = this.props;

        let missionArr = this.state.projectMissions;
        let eitherOrArr = this.state.projectEitherOr;
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
            eitherOrMinMaxArr.push(eitherOrArr[i].goal_id);
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
            test = eitherOrArr.filter(x => x.goal_id === count)

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
                                        <Grid item>                     
                                        <Typography variant="h6">Desription:</Typography>
                                        <Typography variant="body1">{mission[0].description}</Typography>

                                        </Grid>     
                                        <Grid item>
                                        <Typography variant="h6">Goals:</Typography>
                                        {/* for each mission, render goals */}
                                        {mission.map((mission, i) => {
                                            return (
                                                <div key={i}>
                                                        {this.renderGoals(mission, newEitherOrArr)}
                                                </div>
                                            )
                                        })}
                                         </Grid>
                            </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                )
            })
        )
    }

    renderGoals = (mission, eitherOr) => {
        // conditionally renders goals as clickable buttons based on type id with corresponding information for each type
        if (mission.goal_type_id === 1) {
            return (
                <div>
                    <Typography variant="body1">{mission.name}</Typography>
                    <Typography variant="body2">{mission.points} points</Typography>
                </div>
            )
        }
        else if (mission.goal_type_id === 2) {
            return (
                eitherOr.map((eithers) => {
                    return (
                        // if goal type is either, map through options and display as clickable buttons on DOM under corresponding mission
                        eithers.map( (either, i) => {
                            if (mission.goal_id === either.goal_id) {
                                return (
                                    <Grid item key={i}>
                                        <Typography variant="body2">Goal: {either.name} = {either.points} points</Typography>
                                        {this.renderOrText(eithers, i)}
                                    </Grid>
                                )
                            }
                            return <div></div>
                        })
                    )
                })
            )
        }
        else if (mission.goal_type_id === 3) {

            return (
                <div>
                    <Typography variant="body1">{mission.name}</Typography>
                    <Typography variant="body2">{mission.points} points each</Typography>
                </div>
            )
        }
    }

    // renders 'OR' after each option except for last option in array
    renderOrText = (either, i) => {
        if (i < (either.length - 1)) {
            return <Typography variant="body2">OR</Typography>
        }
        return
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid
                className={classes.root}
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={16}
            >
                <Grid item>
                    <Typography variant="h3">{this.state.projectDetails.name}:</Typography>
                    <Typography variant="h3">{this.state.projectDetails.year}</Typography>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Typography variant="h4">The Project:</Typography>
                        <Typography variant="body1">{this.state.projectDetails.description}</Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h3">Missions</Typography>
                    {this.groundControl()}
                </Grid>
                <Grid item>
                    <Typography variant="h3">Penalties</Typography>
                    {this.state.projectPenalties.map(penalty => {
                        return (
                            <Paper key={penalty.id} className={classes.paper}>
                                <Typography variant="h4">{penalty.name}</Typography>
                                <Typography variant="body2">{penalty.description}</Typography>
                                <Typography variant="body1">Penalty Points: {penalty.points}</Typography>
                                <Typography variant="body1">Max Penalties: {penalty.max}</Typography>
                            </Paper>
                        )
                    })}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = reduxState => ({
    reduxState
});

ProjectOverview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(ProjectOverview));