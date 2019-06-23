import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        margin: theme.spacing.unit,
        width: '100%',
        overflowX: 'auto',
    },
    paper: {
        margin: theme.spacing.unit * 2,
        maxWidth: 700,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    textField: {
        width: 250,
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    menu: {
        width: 250,
    },
})

class SelectRunDetails extends Component {

    state = {
        // stores selected mission details
        newRun: {
            runName: '',
            selectedMissions: [],
            allSelected: false,
        },
        // stores details for team roles
        runTeam: {
            driverId: '',
            assistantId: '',
            scorekeeperId: '',
        },
        // used for view toggle
        stepOne: true,
    }

    componentDidMount() {
        const searchObject = qs.parse(this.props.location.search);
        // gets all the team members for logged in team
        if (this.props.reduxState.user.security_clearance === 4) {
            this.props.dispatch({ type: 'GET_TEAM_MEMBERS' });
        }
        else if (this.props.reduxState.user.security_clearance === 2) {
            this.props.dispatch({ type: 'GET_TEAM_MEMBERS_WITH_ID', payload: searchObject });
        }
    }

    // function to change runName for current run
    missionHandleChangeFor = event => {
        this.setState({
            newRun: {
                ...this.state.newRun,
                runName: event.target.value,
            }
        })
    }

    // function to set current runTeam
    runTeamHandleChangeFor = propertyName => event => {
        event.preventDefault();
        this.setState({
            runTeam: {
                ...this.state.runTeam,
                [propertyName]: event.target.value,
            }
        })
    }

    // function to run on button click to select all of the missions for the current project, takes in allMissionsReducer state
    selectAllMissions(missions) {
        let newSelection = [...missions];

        // changes selected state of all individual missions within reducer to true
        if (this.state.newRun.allSelected === false) {
            for (let mission of newSelection) {
                mission.selected = true;
            }
        }

        // changes selected state of all individual missions within reducer to false
        if (this.state.newRun.allSelected === true) {
            for (let mission of newSelection) {
                mission.selected = false;
            }
        }

        // sets selectedMissions to updated newSelection array, toggles allSelected between true and false
        this.setState({
            newRun: {
                ...this.state.newRun,
                selectedMissions: newSelection,
                allSelected: !this.state.newRun.allSelected
            }

        })

    }

    // function to set selected missions with state
    setSelectedMissions = () => {
        // sets selectedMissionsReducer with current state.newRun
        this.props.dispatch({ type: 'SET_SELECTED_MISSIONS', payload: this.state.newRun })
    }

    // function to select mission at index i to selected, updates newSelection array with new selected value
    updateMission(i) {
        let newSelection = [...this.props.reduxState.missions];
        newSelection[i].selected = !newSelection[i].selected;

        // sets selectedMissions to updated newSelection array
        this.setState({
            newRun: {
                ...this.state.newRun,
                selectedMissions: newSelection
            }
        })
    }

    // toggles state for stepOne on click
    changeView() {

        if (this.state.newRun.runName === '') {
            alert('You need to include a run name!');
        }
        else {
            this.setState({
                stepOne: !this.state.stepOne,
            })
        }

    }

    // checks security clearance for coach or team with access, conditionally dispatches corresponding information
    handleSubmit = event => {
        event.preventDefault();

        const searchObject = qs.parse(this.props.location.search);

        if (this.props.reduxState.user.security_clearance === 4) {
            this.props.dispatch({ type: 'SAVE_RUN_DETAILS', payload: { runDetails: this.state, userClearance: 4 }})
            this.props.history.push(`/practice-run/run-scoring`);
        }
        else if (this.props.reduxState.user.security_clearance === 2) {
            this.props.dispatch({ type: 'SAVE_RUN_DETAILS', payload: { runDetails: this.state, id: searchObject.teamId, userClearance: 2 }});
            this.props.history.push(`/practice-run/run-scoring?teamId=${searchObject.teamId}`);
        }
    }

    // checks for reduxState array, maps through array if existing and creates a checkbox for each 
    selectedMissionsView = () => {
        const { classes } = this.props;
        let missionList;
        if (this.props.reduxState.missions) {
            missionList = this.props.reduxState.missions.map((mission, i) =>
                <div key={i}>
                    <label>{i + 1}. {mission.name}</label>
                    <input type='checkbox' checked={mission.selected === true} value={mission.selected} onChange={() => { this.updateMission(i) }} />
                </div>
            )
        } else {
            missionList = null;
        }
        return (
            <Grid item>
                <form>
                    <Paper className={classes.paper}>
                        <Typography variant="h4">Create Run Name</Typography>
                        <TextField
                            type='text'
                            label='Run Name'
                            className={classes.textField}
                            value={this.state.newRun.runName}
                            required
                            onChange={this.missionHandleChangeFor}
                        />
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="h4">Select Missions</Typography>
                        <div className='mission-selection'>
                            {missionList}
                        </div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => { this.selectAllMissions(this.props.reduxState.missions) }}>{this.state.newRun.allSelected === false ? 'Select All Missions' : 'Deselect All Missions'}
                        </Button>
                    </Paper>
                </form>
            </Grid>
        )
    }

    // mapping through team members to create drop down selections from loggedin team/search query if coach
    selectedRunTeam = () => {
        const { classes } = this.props;

        return (
            <Grid item>
                <Paper className={classes.paper}>
                    <Typography variant="h4">{this.props.reduxState.selectedMissions.runName}</Typography>
                    <form>
                        <Typography variant="h5">Driver:</Typography>
                        <TextField
                            select
                            label="Select Driver"
                            className={classes.textField}
                            value={this.state.runTeam.driverId}
                            onChange={this.runTeamHandleChangeFor('driverId')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select team member"
                            margin="normal"
                        >
                            {this.props.reduxState.teamMembers.map(option => (
                                <MenuItem key={option.member_id} value={option.member_id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Typography variant="h5">Assistant:</Typography>
                        <TextField
                            select
                            label="Select Assistant"
                            className={classes.textField}
                            value={this.state.runTeam.assistantId}
                            onChange={this.runTeamHandleChangeFor('assistantId')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select team member"
                            margin="normal"
                        >
                            {this.props.reduxState.teamMembers.map(option => (
                                <MenuItem key={option.member_id} value={option.member_id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Typography variant="h5">Scorekeeper:</Typography>
                        <TextField
                            select
                            label="Select Score Keeper"
                            className={classes.textField}
                            value={this.state.runTeam.scorekeeperId}
                            onChange={this.runTeamHandleChangeFor('scorekeeperId')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select team member"
                            margin="normal"
                        >
                            {this.props.reduxState.teamMembers.map(option => (
                                <MenuItem key={option.member_id} value={option.member_id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button
                            onClick={this.handleSubmit}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >Start
                    </Button>
                    </form>
                </Paper>
            </Grid>
        )
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
                {/* conditionally renders views based on stepOne boolean toggle in changeView function */}
                {this.state.stepOne === true ? (this.selectedMissionsView()) : (this.selectedRunTeam())}
                {/* conditionally renders button text based on stepOne boolean toggle in changeView function */}
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => { this.changeView() }}>{this.state.stepOne === true ? 'Select Run Team' : 'Back to Missions'}
                </Button>
            </Grid>
        )
    }
}

const mapReduxStateToProps = reduxState => ({
    reduxState,
})


SelectRunDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapReduxStateToProps)(withStyles(styles)(SelectRunDetails)));