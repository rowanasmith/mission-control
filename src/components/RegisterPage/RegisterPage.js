import React, { Component } from 'react';
import { connect } from 'react-redux';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 60,
    margin: "auto",
    maxWidth: 700,
    padding: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    marginTop: 20,
    marginBottom: 15,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
})

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    access_code: '',
  };

  passwordConfirmed = (password) => {
    // 1. if the password matches, return true
    // 2. if the password doesn't match, return false
    if (this.state.password === this.state.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  registerUser = (event) => {
    event.preventDefault();

    console.log('passwordConfirmed()', this.passwordConfirmed());

    // if the password input doesn't match the confirm password input
    if (this.passwordConfirmed() === false) {
      // cancel the dispatch
      this.props.dispatch({ type: 'CONFIRMATION_ERROR' });
      return;
    }

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          access_code: this.state.access_code,
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={24}
      >
        {this.props.errors.registrationMessage && (
          <Typography
            className="alert"
            role="alert"
            variant="h3"
          >
            {this.props.errors.registrationMessage}
          </Typography>
        )}
        <Grid item>
          <form onSubmit={this.registerUser}>
            <Typography variant="h1">Register User</Typography>
            <TextField
              required
              label="Username"
              value={this.state.username}
              className={classes.textField}
              onChange={this.handleInputChangeFor('username')}
              margin="normal"
            />
            <br />
            <TextField
              required
              type="password"
              label="Password"
              value={this.state.password}
              className={classes.textField}
              onChange={this.handleInputChangeFor('password')}
              margin="normal"
            />

            <TextField
              type="password"
              label="Confirm Password"
              value={this.state.confirmPassword}
              className={classes.textField}
              onChange={this.handleInputChangeFor('confirmPassword')}
              margin="normal"
            />
            <TextField
              type="number"
              label="Access Code"
              value={this.state.access_code}
              className={classes.textField}
              onChange={this.handleInputChangeFor('access_code')}
              margin="normal"
            />
            <br/>
            <Button
              className={classes.button}
              type="submit"
              name="submit"
              value="Register"
              variant="contained"
              color="primary"
            >
              Register
              </Button>
          </form>
        </Grid>
        <Grid item>
          <center>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
            >
              Login
            </Button>
          </center>
        </Grid>
      </Grid>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(RegisterPage));

