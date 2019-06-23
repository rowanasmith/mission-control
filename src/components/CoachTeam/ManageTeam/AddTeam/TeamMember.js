import React, { Component } from "react";
import {connect} from 'react-redux';

//----Material UI----
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';

class TeamMember extends Component {

state = {
  name: this.props.item.name,
  member_id: this.props.item.member_id,
  team_id: this.props.reduxState.teamIdReducer,
  teamId: this.props.reduxState.teamIdReducer
}

//Handles click to update database to show the teammate as hidden
hide = (event) => { 
  const hidePayload = {
    hideProps: {
      name: this.props.item.name,
      member_id: this.props.item.member_id,
    },
    teamId: this.state.team_id
  }

  this.props.dispatch({
    type: "HIDE_TEAM_MEMBER",
    payload: hidePayload
  })
}

//Takes in team members as props
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.item.name}</TableCell>
        <TableCell><DeleteIcon onClick={this.hide} value={this.props.item.member_id} >Delete</DeleteIcon></TableCell>
      </TableRow>
    );
  }
}


const mapReduxStateToProps = (reduxState) => ({
  reduxState,
});export default connect(mapReduxStateToProps)(TeamMember);