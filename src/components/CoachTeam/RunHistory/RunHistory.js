import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    padding: theme.spacing.unit,
    overflowX: 'auto',
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: "center",
  },
  button: {
    maxWidth: 300,
    margin: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  table: {
    // maxWidth: 360,
    padding: 200
    // // width: '100%'
  }
})

class RunHistory extends Component {
  // conditionally gets runs based on security clearance
  componentDidMount() {
    const searchObject = qs.parse(this.props.location.search);
    // 1. if the user is a coach
    // 2. if the user is a team or a team with access
    if (this.props.user.security_clearance === 2) {
      this.props.dispatch({ type: 'GET_RUNS_AS_COACH', payload: searchObject });
    } else if (this.props.user.security_clearance === 3 || this.props.user.security_clearance === 4) {
      this.props.dispatch({ type: 'GET_RUNS_AS_TEAM' });
    }
  }

  routeToPracticeRun = () => {
    this.props.history.push('/practice-run')
  }

  routeToRunSummary = (runId) => {
    this.props.history.push(`/history/run?runId=${runId}`)
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
        spacing={8}
      >
        <Grid item>
          <Typography variant="h2">{this.props.user.username}</Typography>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
          <Typography variant="h4">Practice Runs</Typography>
            <Table padding='checkbox' className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Goals Completed</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              {/* maps through all runs and creates table display of history */}
              <TableBody>
              {this.props.allRuns.map(run =>
                <TableRow>
                  <TableCell>{run.name}</TableCell>
                  <TableCell>{run.count}</TableCell>
                  <TableCell>{run.score + run.penalties}</TableCell>
                  <TableCell><Button onClick={() => this.routeToRunSummary(run.id)}>View</Button></TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.routeToPracticeRun}
          >Create New Run
          </Button>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = ({ teamId, allRuns, user }) => ({ teamId, allRuns, user });

RunHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(withStyles(styles)(RunHistory)));
