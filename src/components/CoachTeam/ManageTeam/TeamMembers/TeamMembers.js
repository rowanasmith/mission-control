import React, { Component } from "react";
import { connect } from "react-redux";
import TeamMember from "./TeamMember";

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
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
    margin: theme.spacing.unit,
    width: '100%',
    overflowX: 'auto',
  },
  paper: {
    margin: theme.spacing.unit * 2,
    maxWidth: 700,
    padding: theme.spacing.unit ,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    marginBottom: 15,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
})

class TeamMembers extends Component {
  state = {
    newTeam: {
      teamName: "",
      teamNumber: "",
      coach_user_id: this.props.reduxState.user.id,
      newTeamMember: "",
      teamId: ""
    }
  };

  componentDidMount() {
    this.getUrl();
  }

  //Changes view to view all teams
  changePage = () => {
    window.location = `#/coach/teams`;
  };

  handleChange = propertyName => event => {
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        [propertyName]: event.target.value
      }
    });
  };

  //Sends state of the new teammate to database and clears input field 
  addTeammate = () => {
    this.props.dispatch({
      type: "ADD_TEAM_MEMBER",
      payload: this.state.newTeam
    });
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        newTeamMember: ""
      }
    })
  };

  //This will take the id from the url and use it to make a get request for the team members
  getUrl = () => {
    const keySplit = window.location.hash.split("=");
    const id = keySplit[1];
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        teamId: id
      }
    });
    this.props.dispatch({
      type: "GET_TEAM_MEMBERS_WITH_ID",
      payload: {teamId: id}
    });
  };

  setId = () => {
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        teamId: this.props.reduxState.teamInfoReducer[0].id
      }
    });
  }

  render() {
    const { classes } = this.props;

    if (this.props.reduxState.teamInfoReducer[0] === "State") {
      return <div />;
    } else
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
            <Typography variant="h4">{this.props.reduxState.teamInfoReducer[0].name}</Typography>
            <Typography variant="h6">
              Team Number: {this.props.reduxState.teamInfoReducer[0].team_number}
            </Typography>
          </Grid>
          <Grid item>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{' '}</TableCell>
                    <TableCell>{' '}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.reduxState.teamMembers.map(
                    (item, i) => (
                      <TeamMember item={item} key={i} />
                    )
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <Typography variant="h5">Add Member</Typography>
              <TextField
                type="text"
                onClick={this.setId}
                onChange={this.handleChange("newTeamMember")}
                value={this.state.newTeam.newTeamMember}
                label="Team Member Name"
                margin="normal"
              ></TextField>
              <Button 
                variant="contained" 
                color="primary" 
                className={classes.button}
                onClick={this.addTeammate}
              >
                Add Teammate
              </Button>
              
            </Paper>
          </Grid>
        </Grid>
      );
  }
}

const mapReduxStateToProps = reduxState => ({
  reduxState
});

TeamMembers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withStyles(styles)(TeamMembers));
