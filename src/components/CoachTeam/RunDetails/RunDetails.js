import React, {Component} from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';

//----Material UI----
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        padding: theme.spacing.unit,
        margin: theme.spacing.unit,
        width: '100%',
        overflowX: 'auto',
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    spacing: {
        marginTop: 25,
        marginBottom: 15,
    },
})

class RunDetails extends Component {

    state = {
        count: 1,
    }

    // finds id in query string and dispatches to get run details
    componentDidMount(){
        const values = queryString.parse(this.props.location.search);
        this.props.dispatch( {type: 'GET_RUN_DETAILS', payload: values.runId} );
    }

    // checks for updates in reduxState, sets count if updated
    componentDidUpdate(prevProps){
        if( this.props.reduxState.runHistoryDetails !== prevProps.reduxState.runHistoryDetails ){
            this.setState({ ...this.state, count: this.state.count + 1 });   
        }
    }
    
    routeToTeam = () => {
        this.props.history.push( `/home` );
        if(this.props.reduxState.user.security_clearance === 2 ){
            this.props.history.push( `/home` );
        } else {
            this.props.history.push( `/home` );
        }
        this.props.dispatch( {type: `RESET_RUN_DETAILS`} );
    }

    routeToHistory = () => {
        this.props.history.push( `/history` );
        this.props.dispatch( {type: `RESET_RUN_DETAILS`} );
    }

    render(){
        const runDetails = this.props.reduxState.runHistoryDetails;
        const { classes } = this.props;

        return(
            <Grid
                className={classes.root}
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={16}
            >
                <Typography variant="h2">Details: </Typography>
                <Typography variant="h2">{runDetails.name}</Typography>

                <div className={classes.spacing}>
                    <Typography variant="h3">Final Score</Typography>
                    <Typography variant="h4">{runDetails.score}</Typography>
                    <Typography variant="h6"><b>Driver:</b> {runDetails.driver}</Typography>
                    <Typography variant="h6"><b>Assistant:</b> {runDetails.assistant}</Typography>
                    <Typography variant="h6"><b>Scorekeeper:</b> {runDetails.score_keeper}</Typography>
                </div>

                <div className={classes.spacing}>
                    <Typography variant="h6">Completed Goals: {runDetails.count}</Typography>
                    <Typography variant="h6">Penalties: {runDetails.penalties}</Typography>
                </div>

                <div className={classes.spacing}>
                    <Typography variant="h6"><b>Notes:</b></Typography>
                    <Typography variant="h6">{runDetails.notes}</Typography>
                </div>

                <div className={classes.spacing}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.button}
                        onClick={this.routeToTeam} 
                    >Back to Home
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.button}
                        onClick={this.routeToHistory} 
                    >Back to Runs
                    </Button>
                </div>
            </Grid>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

RunDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToProps)(withStyles(styles)(RunDetails));