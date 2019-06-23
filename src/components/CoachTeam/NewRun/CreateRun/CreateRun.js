import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectRunDetails from '../SelectRunDetails/SelectRunDetails';

class CreateRun extends Component {

    componentDidMount() {
        this.props.dispatch({ type: 'GET_ALL_MISSIONS' })
    }

    render () {

        return (
            <div>
                <SelectRunDetails />
            </div>
        )
    }
}


export default connect()( CreateRun );