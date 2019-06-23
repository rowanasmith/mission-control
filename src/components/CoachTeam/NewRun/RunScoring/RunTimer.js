import React, { Component } from "react";
import Timer from 'react-compound-timer';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
      flexGrow: 1,
      textAlign: "center",
      padding: theme.spacing.unit,
      overflowX: 'auto',
  },
  paper: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit * 2,
      textAlign: "center",
  },
  button: {
      maxWidth: 300,
      minWidth: 200,
      margin: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
  }
});

class RunTimer extends Component {

  render() {
    const { classes } = this.props;

    return (
      // sets up checkpoints to disable buttons, change color, etc.
        <Timer
          className = '.red-backround'
          initialTime = { 150000  }
          startImmediately = { false }
          direction = "backward"
          checkpoints={[
            {
              time: 0,
              callback: () => this.props.setCheckpoint('disable-buttons'),
            },
            {
              time: 10000,
              callback: () => this.setState({ checkpoint1: true, checkpoint2: false, checkpoint3: false }),
            },
            {
              time: 7000,
              callback: () => this.setState({ checkpoint1: false, checkpoint2: true, checkpoint3: false }),
            },
            {
              time: 4000,
              callback: () => this.setState({ checkpoint1: false, checkpoint2: false, checkpoint3: true }),
            }
          ]}
        > 
          {({ start, resume, pause, stop, reset, timerState }) => (
            <React.Fragment>
            <Paper className={classes.paper}> 
              <div>
              <Typography variant="h3">
                {/* ensures formatting is always 2 digits on either side of colon */}
                <Timer.Minutes formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}/>:
                <Timer.Seconds formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`} />
              </Typography>
              </div>
              <br />
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button}
                  onClick={ start }>Start Timer
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button}
                  onClick={ stop } >Stop Timer
                </Button>
              </Paper>
            </React.Fragment>
          )}
        </Timer>
    );
  }
}

RunTimer.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RunTimer);
