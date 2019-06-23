import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {connect} from 'react-redux';

import ProtectedAdmin from '../ProtectedRoutes/ProtectedAdmin/ProtectedAdmin';
import ProtectedCoach from '../ProtectedRoutes/ProtectedCoach/ProtectedCoach';
import ProtectedTeams from '../ProtectedRoutes/ProtectedTeams/ProtectedTeams';
import ProtectedTeamWithAccess from '../ProtectedRoutes/ProtectedTeamWithAccess/ProtectedTeamWithAccess';

import Nav from '../Nav/Nav';
import HomeAdmin from '../Admin/HomeAdmin/HomeAdmin';
import CreateRun from '../CoachTeam/NewRun/CreateRun/CreateRun';
import HomeTeam from '../CoachTeam/HomeTeam/HomeTeam';
import ViewProject from '../Admin/ViewProject/ViewProject';
import RunHistory from '../CoachTeam/RunHistory/RunHistory';
import HomeCoach from '../CoachTeam/HomeCoach/HomeCoach';
import ViewAllTeams from '../CoachTeam/ManageTeam/ViewAllTeams/ViewAllTeams';
import StartRun from '../CoachTeam/NewRun/StartRun/StartRun';
import RunSummary from '../CoachTeam/NewRun/RunSummary/RunSummary';
import ProjectOverview from '../CoachTeam/ProjectOverview/ProjectOverview';
import AddTeam from '../CoachTeam/ManageTeam/AddTeam/AddTeam';
import TeamMembers from '../CoachTeam/ManageTeam/TeamMembers/TeamMembers';

import './App.css';
import theme from './theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import ProtectedCoachAndTeams from '../ProtectedRoutes/ProtectedCoachAndTeams/ProtectedCoachAndTeams';
import AddPenalty from '../Admin/ViewProject/Penalty/AddPenalty';
import EditPenalty from '../Admin/ViewProject/Penalty/EditPenalty';
import AddMission from '../Admin/ViewProject/Mission/AddMission';
import EditMission from '../Admin/ViewProject/Mission/EditMission';
import RunDetails from '../CoachTeam/RunDetails/RunDetails';


class App extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  userHome = () => {
    if(this.props.reduxState.user.security_clearance === 1){
      return <ProtectedAdmin
          exact
          path="/home"
          component={HomeAdmin}
        />;
    } else if(this.props.reduxState.user.security_clearance === 2){
      return <ProtectedCoach
          exact
          path="/home"
          component={HomeCoach}
        />;
    } else if(this.props.reduxState.user.security_clearance === 3 || this.props.reduxState.user.security_clearance === 4){
      return <ProtectedTeams
          exact
          path="/home"
          component={HomeTeam}
        />;
    } else {
      return <ProtectedAdmin 
        exact path="/home"
        component={HomeAdmin}
      />;
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Nav />
          <div style={{paddingTop: 65}}>
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            
            {this.userHome()}

            <ProtectedTeamWithAccess
              exact 
              path="/practice-run"
              component={CreateRun}
            />
            <ProtectedCoachAndTeams
              exact
              path="/practice-run/run-scoring"
              component={StartRun}
            />
            <ProtectedCoachAndTeams
              exact
              path="/practice-run/run-summary"
              component={RunSummary}
            />
            <ProtectedAdmin
              exact
              path="/admin/projects"
              component={ViewProject}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/add-penalty"
              component={AddPenalty}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/edit-penalty"
              component={EditPenalty}
            />
            <ProtectedCoachAndTeams
              exact
              path="/history"
              component={RunHistory}
            />
            <ProtectedCoach
              exact
              path="/coach/teams"
              component={ViewAllTeams}
            />
            <ProtectedCoachAndTeams 
              exact
              path="/missions"
              component={ProjectOverview}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/add-mission"
              component={AddMission}
            />
            <ProtectedCoach
              // exact
              path="/coach/create-team"
              component={AddTeam}
              />
            <ProtectedCoach
              path="/coach"
              component={TeamMembers}
              />
            <ProtectedAdmin
              // exact
              path="/admin/projects/edit-mission"
              component={EditMission}
            />
            <ProtectedCoachAndTeams 
              exact
              path="/history/run"
              component={RunDetails}
            />
            <Route render={() => <h1>404</h1>} />
          </Switch>
          </div>
        </div>
      </Router>
      </MuiThemeProvider>
  )}
}

const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

export default connect(mapReduxStateToProps)(App);
