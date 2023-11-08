import React from "react";
import { connect } from "react-redux";

import axios from "axios";
import { API_URL } from "constants/defaultValues.js";
import { toast } from "react-toastify";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";

import combineStyles from "../../combineStyles";
import { logoutUser } from "../../redux/action";



class Logout extends React.Component {  

  constructor(props) {
    super(props);
    this.props = props;    
    this.state = {
      user: null     
    };
  }
  
  componentDidMount() {
    console.log("PROPS", this.props.location);
    
    this.props.logoutUser(this.props.history);
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);
    if (props.user) {
      return {
        user: props.user ? props.user : null,
      };
    } else {
      return {
        ...state,
      };
    }
  }


  render() {
    // console.log("State: ",this.state)
    const { classes } = this.props;
    return (
      <div className="main-right-panel">

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = { logoutUser };
const combinedStyles = combineStyles(
  styles
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(Logout));
