import React from "react";
// changesv1
// @material-ui/core components
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import Snackbar from "components/Snackbar/Snackbar.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { forgotpasswordUser, resetNotification } from '../../redux/action'
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { toast } from "react-toastify";

import customStyle from "assets/jss/customStyle";

// Importing for merging multiple jss styles
import combineStyles from '../../combineStyles';

import { Component } from "react";
import Link from "@material-ui/core/Link";
const useStyles = makeStyles(styles);




class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      email: "",
      emailState: "",
      emailerrortext: "",
      cardAnimaton: "cardHidden",
      notification: false,
      isdisable: false
    }
  }

  componentDidMount() {
    let ths = this;
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
  }
  setNotify(val = true) {
    // console.log('in set notification', val);

    this.setState({ notification: val })
    let ths = this;
    setTimeout(() => {
      ths.setState({ notification: false })
    }, 2000)
    this.props.resetNotification();
  }

  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  };
  verifyEmail(val) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }
  setemailState(val = "") {
    this.setState({ emailState: val, emailerrortext: (val === "error") ? "Please enter valid email." : "" })
  }
  setCardAnimation(val = "") {
    this.setState({ cardAnimaton: val })
  }
  setemail(val = "") {
    this.setState({ email: val })
  }
  onSubmit(e, val = {}) {

    this.setState({ isdisable: true })
    // console.log('Test', val, this.props);
    // this.setNotify() ;
    if (!this.verifyEmail(val.email)) {
      toast.error("Please enter valid email.")
      this.setemailState("error");
      this.setState({ isdisable: false })
    }
    if (this.verifyEmail(val.email)) {
      this.props.forgotpasswordUser(val, this.props.history);
      this.setemail("")
      this.setemailState("");
      setTimeout(() => {
        this.setState({ isdisable: false })
      }, 2500)

    }
    e.preventDefault();
  }
  // componentWillReceiveProps(){
  //   console.log("received props",this.props);

  // }
  componentDidUpdate(prevProps) {
    // console.log('prevstate', prevProps)
  }
  render() {
    const { email, cardAnimaton, emailState } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={8}>
            <form>
              <Card login className={classes[cardAnimaton]}>
                <CardHeader className={`${classes.cardHeader} ${classes.logCardHeader} ${classes.textCenter} ${classes.px50}`}>
                  <h4 justify="center" className={`${classes.logCardHeaderTitle} ${classes.pt30}`}>
                    Forgot your password?
                  </h4>
                  <small className={classes.logSubTitle}>
                    Don't worry! Resetting your password is easy. Just type in the email <br />  you registered to Shtudy.
                  </small>
                </CardHeader>
                <CardBody className={classes.px50 + " logInputs"}>
                  <CustomInput
                    // helperText={this.state.emailerrortext}
                    // success={emailState === "success"}
                    error={emailState === "error"}
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.email,
                      placeholder: "Enter your email address",
                      onChange: ((e) => {
                        if (this.verifyEmail(e.target.value)) {
                          this.setemailState("success");
                        } else {
                          this.setemailState("error");
                        }
                        this.setemail(e.target.value)
                      })
                    }}
                  />

                </CardBody>
                <CardFooter className={classes.px50}>
                  <GridContainer>
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button
                        type="submit"
                        color="info"
                        onClick={(e) => this.onSubmit(e, { email })}
                        size="lg"
                        className={`${classes.logButton} ${classes.my50}`}
                        disabled={this.state.isdisable}
                      >
                        Confirm Email
                    </Button>
                    </GridItem>

                    <GridItem
                      sm={12}
                      className={`${classes.textCenter} ${classes.singUpBlock}`}
                    >
                      Did you remembered your password?{" "}
                      <Link
                        href="/auth/login"
                        className={classes.signUpLink}
                      >
                        Try logging in
                    </Link>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
        <Snackbar
          place="tr"
          color={(this.props.loginerror) ? "danger" : "info"}
          icon={AddAlert}
          message={`${this.props.notification_message}`}
          open={this.props.shownotification}
          closeNotification={() => {
            this.setNotify(false);
          }}
          close
        />
      </div>
    );
  }
}

ForgotPasswordPage.propTypes = {
  classes: PropTypes.object
};

// const mapStateToProps = state => ({ 
//   user: state.user,
//   shownotification: state.shownotification,
//   loginerror : state.loginerror,    
//   notification_message:state.notification_message
//  });

const mapStateToProps = state => {
  // console.log('in maptoprops:',state);

  return {
    user: state.authReducer.user,
    shownotification: state.authReducer.shownotification,
    loginerror: state.authReducer.loginerror,
    notification_message: state.authReducer.notification_message
  };
};
const mapDispatchToProps = { forgotpasswordUser, resetNotification };
const combinedStyles = combineStyles(customStyle, styles);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(ForgotPasswordPage));
