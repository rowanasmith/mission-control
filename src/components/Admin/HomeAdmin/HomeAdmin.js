import React, { Component } from 'react';
import { connect } from 'react-redux';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import './HomeAdmin.css'

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        overflowX: 'auto',
    },
    paper: {
        // margin: theme.spacing.unit * 2,
        maxWidth: 375,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
    },
    button: {
        maxWidth: 300,
        margin: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    textField: {
        width: 350,
        // margin: theme.spacing.unit,
        // padding: theme.spacing.unit,
    },
})


class HomeAdmin extends Component {

    state = {
        newProject: {
            name: '',
            description: '',
            year: '',
            published: false,
        }
    }

    componentDidMount() {
        this.props.dispatch({ type: 'GET_ALL_PROJECTS' });
    }

    showProject = (event) => {

        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(event.target.value).style.display = "block";
        event.currentTarget.className += " active";
    }

    // sets new project properties on input value change
    handleChange = propertyName => (event) => {
        this.setState({
            newProject: {
                ...this.state.newProject,
                [propertyName]: event.target.value,
            }
        });
    }

    // resets state and dispatches new project state
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.dispatch({ type: 'ADD_PROJECT', payload: this.state.newProject })
        this.setState({
            newProject: {
                name: '',
                description: '',
                year: '',
                published: false,
            }
        });
    }

    // routes to project page with new project id
    handleClickMission = (event) => {
        this.props.history.push(`/admin/projects?projectId=${event.currentTarget.value}`)
    }

    render() {
        const { classes } = this.props;

        return (
            <div >
                <Grid
                    container
                    className={classes.root}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={16}
                >
                    <Typography variant="h2">Welcome, {this.props.reduxState.user.username}!</Typography>
                    <Typography variant="h6">Click on a project to view details or create a new project below.</Typography>
                </Grid>
                <div>
                    <Typography variant="h4">Projects:</Typography>
                    <div className="tab">
                        <button className="tablinks" value="newProject" onClick={this.showProject}>New Project +</button>
                        {/* maps through projects reducer to display clickable list of project names on dom */}
                        {this.props.reduxState.projects.map(project => (
                            <div key={project.id}>
                                <button className="tablinks" value={project.id} onClick={this.showProject}>
                                    {project.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {/* maps through projects reducer to display project details on domon dom */}
                    {this.props.reduxState.projects.map(project => {
                        return (
                            <div key={project.id} id={project.id} className="tabcontent">
                                <Typography variant="h4">{project.name}, {project.year}</Typography>
                                <Typography variant="h6">The Project:</Typography>
                                <Typography variant="body2">{project.description}</Typography>
                                <Button 
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    value={project.id} 
                                    onClick={this.handleClickMission}
                                >View Mission
                                </Button>
                            </div>
                        )
                    })}
                    <div id="newProject" className="tabcontent">
                        <form>
                            <Typography variant="h4">Create New Project</Typography>
                            <TextField
                                type="text"
                                label="Project Name"
                                className={classes.textField}
                                value={this.state.newProject.name}
                                onChange={this.handleChange('name')}
                            >
                            </TextField>
                            <br />
                            <TextField
                                type="text"
                                label="Project Season (e.g 2019-2020)"
                                maxLength={9}
                                className={classes.textField}
                                value={this.state.newProject.year}
                                onChange={this.handleChange('year')}
                            >
                            </TextField>
                            <br />
                            <TextField
                                multiline
                                type="text"
                                label="Project Description"
                                className={classes.textField}
                                rows="4"
                                cols="40"
                                value={this.state.newProject.description}
                                onChange={this.handleChange('description')}
                            >
                            </TextField>
                            <br />
                            <Button 
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                            >Submit
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = reduxState => ({
    reduxState
});

HomeAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(HomeAdmin));
