import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import EditMissionGoals from './EditMissionGoals';

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

class EditMission extends Component {

    state = {
        mission_id: 0,
        name: '',
        description: '',
        goals: []
    }

    // on load of component, get missionid from url and add it to state
    // dispatch to sagas to get mission and goal data for pre-filling forms
    componentDidMount() {
        const searchObject = qs.parse(this.props.location.search);
        
        this.setState({
            mission_id: searchObject.missionId,
        })
        this.props.dispatch({ type: 'GET_GOAL_TYPES' });
        this.props.dispatch({ type: `GET_MISSION_DETAILS`, payload: searchObject });
    }

    // once reduxState is updated with information from GET dispatches in componentDidMount,
    // set state with data from missionDetails reducer
    componentDidUpdate(prevProps) {

        if (this.props.reduxState.missionDetails !== prevProps.reduxState.missionDetails) {
            this.setState({
                ...this.state,
                name: this.props.reduxState.missionDetails.name,
                description: this.props.reduxState.missionDetails.description,
                goals: this.props.reduxState.missionDetails.goals,
            })
        }
    }

    // set state with changes when user updates input fields
    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.currentTarget.value,
        })
    }

    // group data from page for save and send with dispatch to saga to update DB
    handleSave = () => {
        let missionDetails = this.props.reduxState.missionDetails;

        let missionUpdate = {
            mission_id: this.state.mission_id || missionDetails.mission_id,
            name: this.state.name || missionDetails.name,
            description: this.state.description || missionDetails.description,
            goals: missionDetails.goals,
            eitherOrOptions: this.props.reduxState.goalOptions.optionList,
        }

        this.props.dispatch({ type: 'UPDATE_MISSION', payload: missionUpdate });
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;

        let missionDetails = this.props.reduxState.missionDetails;
        let missionIntro;

        // Check that redux state is not empty and render forms 
        // once it contains info from get dispatches
        if (missionDetails) {
            missionIntro = <div>
                <TextField
                    type="text"
                    label="Mission Name"
                    name="name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange} />
                <TextField
                    type="text"
                    label="Mission Description"
                    name="description"
                    className={classes.textField}
                    value={this.state.description}
                    onChange={this.handleChange} />
            </div>
        } else {
            missionIntro = null;
        }

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
                    <Typography variant="h3">Edit Mission</Typography>

                    {missionIntro}

                    <EditMissionGoals mission_id={this.state.mission_id} />
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

EditMission.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withRouter(withStyles(styles)(EditMission)));