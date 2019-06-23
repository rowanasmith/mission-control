import React, { Component } from 'react';
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


class HomeTeam extends Component {

  // On click, route to Project overview page
  routeToMissions = () => {
    this.props.history.push('/missions');
  }

  // On click, route to ViewAllTeams page
  routeToTeams = () => {
    this.props.history.push('/history');
  }

  // On click, routes to create new run page
  routeToCreateRun = () => {
    this.props.history.push('/practice-run');

  }


  render() {
    const { classes } = this.props;

    return (
      <Grid className={classes.root}>
        <Typography variant="h2">Welcome, {this.props.user.username}!</Typography>
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
          View Run History
         </Button>
        <br />
        {this.props.user.security_clearance === 4 ?
          <Button
            className={classes.button}
            onClick={this.routeToCreateRun}
            variant="contained"
            color="primary"
          >
            Create New Run
         </Button>
          :
          <div></div>
        }
      </Grid>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

HomeTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(HomeTeam));