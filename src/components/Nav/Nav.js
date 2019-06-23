import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';

//----Material UI----
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    marginRight: 200,
  }
})


const Nav = (props) => (
  <div className="root">
    <AppBar>
      <Toolbar>
        <Grid
          justify="space-between" // Add it here :)
          container
          spacing={24}
        >
          {/* <IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon/>
           </IconButton> */}
          <Grid item>
            <Link to="/home">
              <Typography variant="h6" edge="start" className={styles.title}>
                Mission Control
          </Typography>
            </Link>
          </Grid>
          <Grid item>
            {props.user.id && (
              <LogOutButton />
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(Nav));
