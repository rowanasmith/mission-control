import React, { Component } from "react";
import { connect } from 'react-redux';

//----Material UI----
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save'


class TeamMember extends Component {

  state = {
    edit: false,
    teamMemberName: '',
    id: '',
    teamId: ''
  }

  componentDidMount() {
    this.getUrl();
  }

  //Handles click to update database to show the teammate as hidden
  hide = () => {
    const hidePayload = {
      hideProps: this.props.item,
      teamId: this.state.teamId
    }
    this.props.dispatch({
      type: "HIDE_TEAM_MEMBER",
      payload: hidePayload

    })
  }


  getUrl = () => {
    const keySplit = window.location.hash.split('=');
    const teamId = keySplit[1];
    this.setState({
      ...this.state,
      teamId: teamId
    })
  }

  handleChange = propertyName => event => {
    this.setState({
      ...this.state,
      [propertyName]: event.target.value
    })
  }

  //Handles edit of teammate name switchs view to show input field and save button
  editTeamMember = () => {
    this.setState({
      ...this.state,
      teamMemberName: this.props.item.name,
      id: this.props.item.member_id,
      edit: true,
    })
  }

  //Dispatches state of updated teammate name to database and switches view back to original (delete/edit icons)
  saveTeamMember = () => {
    this.setState({
      ...this.state,
      edit: false
    })
    this.props.dispatch({
      type: "EDIT_TEAM_MEMBER",
      payload: this.state
    })
  }

  //Takes in team members as props
  render() {
    if (this.state.edit === false)
      return (
        <TableRow>
          <TableCell>{this.props.item.name}</TableCell>
          <TableCell><EditIcon onClick={this.editTeamMember}>Edit</EditIcon></TableCell>
          <TableCell><DeleteIcon onClick={this.hide}>Delete</DeleteIcon></TableCell>
        </TableRow>
      );
    else if (this.state.edit === true)
      return (
        <TableRow>
          <TableCell>
            <TextField value={this.state.teamMemberName} onChange={this.handleChange("teamMemberName")}>
            </TextField>
          </TableCell>
          <TableCell>
            <SaveIcon onClick={this.saveTeamMember}>Save
          </SaveIcon>
          </TableCell>
          <TableCell>{' '}</TableCell>
        </TableRow>
      )
  }
}


const mapReduxStateToProps = (reduxState) => ({
  reduxState,
}); export default connect(mapReduxStateToProps)(TeamMember);