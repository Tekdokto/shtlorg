import React from 'react';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Link from "@material-ui/core/Link";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { withStyles } from "@material-ui/core/styles";

class CustomBreadscrumb extends React.Component {
  constructor(props) {
    super(props);
    this.changeNavbar = this.changeNavbar.bind(this);
    this.props = props;
  }

  changeNavbar = (e, tabno) => {
    if (tabno == 1) {
      this.props.history.push('/candidate/dashboard')
    }
    else if (tabno == 2) {
      this.props.history.push('/candidate/skillassesment')
    } else if (tabno == 3 && this.props.user.current_progress_status >= 1) {
      if (tabno == 3 && this.props.user.current_progress_status == 2) {
        this.props.history.push('/candidate/interviewscheduler')
      } else if (tabno == 3 && this.props.user.current_progress_status == 3) {
        this.props.history.push('/candidate/interviewresult')
      } else {
        this.props.history.push('/candidate/interviewprep')
      }
    }
    else if (tabno == 4 && this.props.user.current_progress_status >= 4 || tabno == 4 && this.props.user.looking_for_job == 0) {
      this.props.history.push('/candidate/dashboard')
    }
    else if (tabno == 5 && this.props.user.current_progress_status >= 5 || tabno == 5 && this.props.user.looking_for_job == 1) {
      this.props.history.push('/candidate/dashboard')
    }
    e.preventDefault();
  }

  render() {
    return (
      <GridItem xs={12}>
        <ul className="custom-breadcrumb">
          <li >
            <Link style={{ "cursor": "pointer" }} onClick={(e) => this.changeNavbar(e, 1)}>Home</Link>
          </li>
          <li>
            <Link style={{ "cursor": "pointer" }} onClick={(e) => this.changeNavbar(e, 2)} className={(this.props.user && this.props.user.current_progress_status != "undefined" && this.props.user.current_progress_status >= 1) ? "active" : ""}>Skill Assessment</Link>
          </li>
          <li>
            <Link style={{ "cursor": "pointer" }} onClick={(e) => this.changeNavbar(e, 3)} className={(this.props.user && this.props.user.current_progress_status != "undefined" && this.props.user.current_progress_status >= 1) ? "active" : ""}>Interview Preparation</Link>
          </li>
          <li>
            <Link style={{ "cursor": "pointer" }} onClick={(e) => this.changeNavbar(e, 4)} className={(this.props.user && this.props.user.current_progress_status != "undefined" && this.props.user.current_progress_status >= 4) ? "active" : ""}>Interviewing</Link>
          </li>
          <li className="last-child">
            <Link style={{ "cursor": "pointer" }} onClick={(e) => this.changeNavbar(e, 5)} className={(this.props.user && this.props.user.current_progress_status != "undefined" && this.props.user.looking_for_job == 0 ) ? "active" : ""}>Hired!</Link>
          </li>
        </ul>
      </GridItem>)
  }
}

export default withStyles(styles)(CustomBreadscrumb);