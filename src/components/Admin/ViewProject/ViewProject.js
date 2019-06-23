import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        overflowX: 'auto',
    },
    paper: {
        minWidth: 1000,
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        maxWidth: 300,
        margin: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    textField: {
        width: 250,
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    mulitline: {
        width: 400,
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    description: {
        maxWidth: 800,
    },
    border: {
        border: "1px solid black",
        margin: theme.spacing.unit,
        borderRadius: 5,
        padding: 15
    }
})

class ViewProject extends Component {

    state = {
        projectId: 0,
        editProject: false,
        projectInfo: {
            projectName: '',
            projectDescription: '',
            year: '',
        },
        projectDetails: {},
        projectPenalties: [],
        projectMissions: [],
        projectEitherOr: [],
    }

    componentDidMount() {
        const searchObject = qs.parse(this.props.location.search);
        this.setState({
            projectId: searchObject.projectId,
        })
        this.props.dispatch({ type: 'GET_PROJECT_DETAILS', payload: searchObject });
        this.props.dispatch({ type: 'GET_PENALTIES', payload: searchObject });
        this.props.dispatch({ type: 'GET_MISSIONS', payload: searchObject });
        this.props.dispatch({ type: 'GET_EITHER_OR', payload: searchObject });
    }

    componentDidUpdate(prevProps) {
        if (this.props.reduxState.projectDetails !== prevProps.reduxState.projectDetails) {
            this.setState({
                projectInfo: {
                    projectName: this.props.reduxState.projectDetails.name,
                    projectDescription: this.props.reduxState.projectDetails.description,
                    year: this.props.reduxState.projectDetails.year,
                },
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

        for (let i = 0; i < missionArr.length; i++) {
            missionMinMaxArr.push(missionArr[i].mission_id);
        }
        missionMin = Math.min(...missionMinMaxArr);
        missionMax = Math.max(...missionMinMaxArr);
        
        for (let i = 0; i < eitherOrArr.length; i++) {
            eitherOrMinMaxArr.push(eitherOrArr[i].goal_id);
        }
        eitherOrMin = Math.min(...eitherOrMinMaxArr);
        eitherOrMax = Math.max(...eitherOrMinMaxArr);
        

        for (let count = missionMin; count <= missionMax; count++) {
            test = missionArr.filter(x => x.mission_id === count)

            if (test.length !== 0) {

                newMissionArr.push(test)
            }

        }
        for (let count = eitherOrMin; count <= eitherOrMax; count++) {
            test = eitherOrArr.filter(x => x.goal_id === count)

            if (test.length !== 0) {

                newEitherOrArr.push(test)
            }

        }
        
        return (
            newMissionArr.map((mission, i) => {
                return (
                    <div className={classes.border} key={i}>
                        <Typography variant="h4">Mission {i + 1}: {mission[0].mission_name}</Typography>
                        
                        <Typography variant="h5">{mission[0].description}</Typography>
                        {mission.map((mission, i) => {
                            return (
                                <div key={i}>
                                    {this.renderGoals(mission, newEitherOrArr)}
                                </div>
                            )
                        })}
                        <Button 
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            value={mission[0].mission_id} 
                            onClick={this.editMission}
                        >Edit
                        </Button>
                        <Button 
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            value={mission[0].mission_id} 
                            onClick={this.handleDeleteMission}
                        >Delete
                        </Button>
                    </div>
                )
            })
        )
    }

    renderGoals = (mission, eitherOr) => {

        if (mission.goal_type_id === 1) {
            return (
                <Grid item >
                    <Typography variant="body2">Goal: {mission.name} = {mission.points} points</Typography>
                </Grid>
            )
        }
        else if (mission.goal_type_id === 2) {
            return (
                eitherOr.map((eithers) => {
                    return (
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
                <Grid item>
                    <Typography variant="body2">Goal: {mission.name} = {mission.points} points each</Typography>
                </Grid>
            )
        }
    }

    renderOrText = (either, i) => {
        if (i < (either.length - 1)) {
            return <Typography variant="body2">OR</Typography>
        }
        return
    }

    handleDeletePenalty = (event) => {
        let info = {
            projectId: this.state.projectId,
            penaltyId: event.currentTarget.value,
        }
        this.props.dispatch({ type: 'DELETE_PENALTY', payload: info })
    }

    handleDeleteMission = (event) => {
        let info = {
            projectId: this.state.projectId,
            missionId: event.currentTarget.value
        }
        this.props.dispatch({ type: 'DELETE_MISSION', payload: info });
    }

    addMission = () => {
        this.props.history.push(`projects/add-mission?projectId=${this.state.projectId}`);
    }

    editMission = (event) => {
        this.props.history.push(`projects/edit-mission?missionId=${event.currentTarget.value}`)
    }

    addPenalty = () => {
        this.props.history.push(`projects/add-penalty?projectId=${this.state.projectId}`);
    }

    editPenalty = (event) => {
        this.props.history.push(`projects/edit-penalty?penaltyId=${event.currentTarget.value}`)
    }

    deleteProject = () => {
        this.props.dispatch({ type: 'DELETE_PROJECT', payload: this.state.projectId })
        this.props.history.push('/admin/home')
    }

    publishProject = () => {
        this.props.dispatch({ type: 'PUBLISH_PROJECT', payload: { projectId: this.state.projectId } })
    }

    editProjectName = () => {
        this.setState({
            editProject: !this.state.editProject,
        });
        let data = {
            projectId: this.state.projectId,
            projectInfo: this.state.projectInfo
        }
        this.props.dispatch({ type: 'UPDATE_PROJECT_NAME', payload: data});

    }

    handleChange = (propertyName) => (event) => {
        this.setState({
            projectInfo: {
                ...this.state.projectInfo,
                [propertyName]: event.currentTarget.value,
            }
        });
    }

    render() {
        const { classes } = this.props;

        if(this.state.projectDetails.hidden === true) {
           return <h1>404</h1>
        }
        else {
            return (
                <Grid
                    container
                    className={classes.root}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={4}
                >
                    <Paper className={classes.paper}>
                    <Grid item>
                        
                        {this.state.editProject === false ?
                            <Typography variant="h2">{this.state.projectDetails.name}: {this.state.projectDetails.year}</Typography>
                            :
                            <div>
                                <TextField 
                                    className={classes.textField}
                                    label="Project Name" 
                                    onChange={this.handleChange('projectName')} 
                                    value={this.state.projectInfo.projectName}>
                                </TextField>
                                <TextField 
                                    className={classes.textField}
                                    label="Project Year" 
                                    onChange={this.handleChange('year')} 
                                    value={this.state.projectInfo.year}>                               
                                </TextField>
                            </div>
                        }
                        {this.state.editProject === false ?
                            <Typography className={classes.description} variant="body1">{this.state.projectDetails.description}</Typography>
                            :
                            <TextField 
                                multiline
                                label="Project Description"
                                className={classes.mulitline}
                                onChange={this.handleChange('projectDescription')} 
                                value={this.state.projectInfo.projectDescription}>
                            </TextField>
                        }
                        </Grid>
                        <Grid item>
                        <Button 
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={this.deleteProject}
                        >Delete Project
                        </Button>
                        {this.state.editProject === false ?
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.editProjectName}
                            >Edit Project Info
                            </Button>
                            :
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.editProjectName}
                            >Save Project Info
                            </Button>
                        }
                        {this.state.projectDetails.published === false ?
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.publishProject}
                            >Publish Project
                            </Button>
                            :
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.publishProject}
                            >Unpublish Project
                            </Button>
                        }
                    </Grid>
                    </Paper>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <div >
                                <Typography variant="h3">Penalties</Typography>
                                <Button 
                                    className={classes.button}
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.addPenalty}
                                >Add Penalty
                                </Button>
                                {this.state.projectPenalties.map(penalty => {
                                    return (
                                        <div className={classes.border} key={penalty.id}>
                                            <Typography variant="h4">{penalty.name}</Typography>
                                            <Typography variant="h6">{penalty.description}</Typography>
                                            <Typography variant="body2">Max Penalties: {penalty.max}</Typography>
                                            <Typography variant="body2">Points: {penalty.points}</Typography>
                                            <Button 
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                value={penalty.id} 
                                                onClick={this.editPenalty}
                                            >EDIT
                                            </Button>
                                            <Button 
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                value={penalty.id} 
                                                onClick={this.handleDeletePenalty}
                                            >DELETE
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h3">Missions</Typography>
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="secondary"
                                onClick={this.addMission}
                            >Add Mission
                            </Button>
                            {this.groundControl()}
                        </Paper>
                    </Grid>
                </Grid>
            )
        }
        
    }
}

const mapStateToProps = reduxState => ({
    reduxState
});

ViewProject.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(ViewProject));
