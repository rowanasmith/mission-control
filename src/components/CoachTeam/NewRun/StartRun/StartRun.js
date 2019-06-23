import React, { Component } from 'react';
import { connect } from 'react-redux';
import RunScoring from '../RunScoring/RunScoring';

class StartRun extends Component {

    componentDidMount = () => {
        // get selectedMission details
        this.props.dispatch({ type: 'GET_SELECTED_PENALTIES' });
    }

    render() {
        return (
            <div>
                <RunScoring />
            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(StartRun);