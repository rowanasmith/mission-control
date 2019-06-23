import React, { Component } from "react";
import { connect } from "react-redux";
import TeamMember from './TeamMember';

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
    },
    paper: {
        margin: theme.spacing.unit * 2,
        maxWidth: 700,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    textField: {
        width: 250,
        margin: theme.spacing.unit,
    },
    button: {
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: "5%",
        paddingRight: "5%",
    },
})

class AddTeam extends Component {

    state = {
        newTeam: {
            teamName: '',
            teamNumber: '',
            password: '',
            coach_user_id: this.props.reduxState.user.id,
            newTeamMember: '',
            teamId: ''
        },
        teamSaved: false,
    }

    // Handles change for inputs
    handleChange = propertyName => (event) => {
        this.setState({
            newTeam: {
                ...this.state.newTeam,
                [propertyName]: event.target.value
            }
        });
    };

    //Dispatches team information and team members and pushes us to the view all teams page
    saveTeam = () => {
        this.props.dispatch({
            type: "ADD_TEAM_NAME",
            payload: this.state.newTeam
        })
        this.setState({
            teamSaved: true,
        })

    }

    //Sets Id to the state
    setId = () => {
        this.setState({
            newTeam: {
                ...this.state.newTeam,
                teamId: this.props.reduxState.teamIdReducer
            }
        })
    }


    // Sends new team state and dispatchs and clears input 
    addTeammate = () => {
        this.props.dispatch({
            type: "ADD_TEAM_MEMBER",
            payload: this.state.newTeam
        })
        this.setState({
            newTeam: {
                ...this.state.newTeam,
                newTeamMember: ""
            }
        })
    }

    //Switches view to coach view all team views
    changePage = () => {
        window.location = `#/coach/teams`
    }

    render() {
        const { classes } = this.props;

        if (this.state.teamSaved === false) {
            return (
                <Grid
                    className={classes.root}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={5}
                >
                    <Typography variant="h3">Add a Team</Typography>
                    <TextField 
                        type="text" 
                        className={classes.textField}
                        onChange={this.handleChange("teamName")} 
                        value={this.state.newTeam.teamName} 
                        label="Team Name">
                    </TextField>
                    <TextField 
                        type="number" 
                        onChange={this.handleChange("teamNumber")} 
                        value={this.state.newTeam.teamNumber} 
                        label="Team Number"
                        className={classes.textField}
                    >
                    </TextField>
                    <TextField 
                        type="text" 
                        onChange={this.handleChange("password")} 
                        value={this.state.newTeam.password} 
                        label="Password"
                        className={classes.textField}
                    >
                    </TextField>
                    <Button 
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={this.saveTeam}
                    >Save Team
                    </Button>
                </Grid>
            )
        }
        else return (
            <Grid
                className={classes.root}
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={5}
            >
                <Typography variant="h3">Team Members</Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>{' '}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.reduxState.teamMembers.map(item =>
                            (<TeamMember item={item} key={item.member_id} />)
                        )}
                    </TableBody>
                </Table>
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
                <Button 
                    variant="contained"
                    color="primary" 
                    className={classes.button}
                    onClick={this.changePage}
                >Save
                </Button>

            </Grid>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
}); 

AddTeam.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withStyles(styles)(AddTeam));