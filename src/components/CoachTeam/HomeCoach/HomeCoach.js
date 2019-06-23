import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
        paddingLeft: "5%",
        paddingRight: "5%",
    },
})


class HomeCoach extends Component {

    componentDidMount() {
        console.log('User is:', this.props.reduxState);

    }

    // On click, route to ProjectOverview page
    routeToMissions = () => {
        this.props.history.push('/missions');
    }

    // On click, route to ViewAllTeams page
    routeToTeams = () => {
        this.props.history.push('/coach/teams');
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid className={classes.root}>
                <Typography variant="h2">Welcome, Coach!</Typography>
                <Button
                    className={classes.button}
                    onClick={this.routeToMissions}
                    variant="contained"
                    color="primary"
                >
                    View Missions
                </Button>
                <br />
                <Button
                    className={classes.button}
                    onClick={this.routeToTeams}
                    variant="contained"
                    color="primary"
                >
                    View Your Teams
                </Button>
            </Grid>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});


HomeCoach.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withRouter(withStyles(styles)(HomeCoach)));