import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import qs from 'query-string';

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
        width: 300,
        margin: theme.spacing.unit * 2,
    },
})

class EditPenalty extends Component {

    state = {
        penalty_id: this.props.reduxState.projects.id || 1,
        name: '',
        description: '',
        max: '',
        points: ''
    }

    // on page load, get penalty id from url
    // then get specific penalty data from DB
    componentDidMount(){
        const searchObject = qs.parse(this.props.location.search);
        
        this.setState({
            penalty_id: searchObject.penaltyId,
        })
        this.props.dispatch( {type: 'GET_PENALTY', payload: searchObject.penaltyId} );
    }

    // wait for reduxState to populate with penalty data and add data to state
    componentDidUpdate(prevProps){
        if( this.props.reduxState.penalty !== prevProps.reduxState.penalty ){
            this.setState({
                ...this.state, 
                name: this.props.reduxState.penalty.name || '',
                description: this.props.reduxState.penalty.description || '',
                max: this.props.reduxState.penalty.max || '',
                points: this.props.reduxState.penalty.points || ''
            })
        }
    }

    // set state with input field changes
    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
    }

    // on click of "Back" button, route user to project page
    routeBack = () => {
        this.props.history.push( `/admin/projects?projectId=${this.props.reduxState.projectDetails.id}`);
    }

    // on click of "Save Penalty", PUT data to update DB and route user to project page
    updatePenalty = (event) => {
        let update = {...this.props.reduxState.penalty};

        let penaltyUpdate = {
            penalty_id: this.state.penalty_id || 1,
            name: this.state.name,
            description: this.state.description,
            max: this.state.max,
            points: this.state.points,
        };

        this.props.dispatch( {type: 'UPDATE_PENALTY', payload: penaltyUpdate} );
        this.props.history.push( `/admin/projects?projectId=${this.props.reduxState.projectDetails.id}`);
        event.preventDefault();
    }

    render() {

        const { classes } = this.props;

        return(
            <Grid
                container
                className={classes.root}
                direction="column"
                justify="center"
                alignItems="center"
                spacing={16}
            >
                <Paper className={classes.paper}>
                <form>
                <Typography variant="h3">Edit Penalty</Typography>

                <div>
                    <TextField 
                        type="text" 
                        label="Penalty Name"
                        className={classes.textField}
                        value={this.state.name}
                        name="name"
                        onChange={this.handleChange} 
                    />
                    <TextField 
                        type="text" 
                        name="description"
                        label="Penalty Description"
                        className={classes.textField}
                        value={this.state.description}
                        onChange={this.handleChange} 
                    />
                    <TextField 
                        type="number" 
                        label="Max Number of Penalties"
                        className={classes.textField}
                        name="max" 
                        min="1"
                        value={this.state.max}
                        onChange={this.handleChange} 
                    />
                    <TextField 
                        type="number" 
                        name="points"
                        label="Points"
                        className={classes.textField}
                        max="-1"
                        value={this.state.points}
                        onChange={this.handleChange} />
                </div>

                <Button 
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={this.routeBack} 
                >Back
                </Button>
                <Button 
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={this.updatePenalty} 
                >Save Penalty
                </Button>
            </form>
            </Paper>
            </Grid>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

EditPenalty.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withRouter(withStyles(styles)(EditPenalty)));