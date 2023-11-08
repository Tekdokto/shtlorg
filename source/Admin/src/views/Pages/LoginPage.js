import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import TwitterLogin from 'react-twitter-auth';
// changesv1
// @material-ui/core components
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import AddAlert from "@material-ui/icons/AddAlert";
import Hidden from "@material-ui/core/Hidden";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
// import LockOutline from "@material-ui/icons/LockOutline";

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
import { loginUser, socialloginUser, resetNotification } from '../../redux/action'

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { Component } from "react";
import { config } from '../../helpers/config'
import LogArrow from "../../assets/img/logpage-arrow.svg";
import EyeSlash from "../../assets/img/eye-slash.svg";
import { API_URL } from '../../constants/defaultValues'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this)
    this.state = {
      email: "",
      emailState: "",
      password: "",
      passwordState: "",
      cardAnimaton: "cardHidden",
      notification: false,
      checkedA: false,
      isChecked: false,
    }
  }

  componentDidMount() {
    if (localStorage.checkbox && localStorage.username !== "") {
      this.setState({
        isChecked: true,
        email: localStorage.username,
        password: localStorage.password
      })
    }
    let ths = this;
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
  }
  onChangeCheckbox = event => {
    this.setState({
      isChecked: event.target.checked
    })
  }
  setNotify(val = true) {
    console.log('in set notification', val);

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
  setpasswordState(val = "") {
    this.setState({ passwordState: val })
  }
  setemailState(val = "") {
    this.setState({ emailState: val })
  }
  setCardAnimation(val = "") {
    this.setState({ cardAnimaton: val })
  }
  setemail(val = "") {
    this.setState({ email: val })
  }
  setpassword(val = "") {
    this.setState({ password: val })
  }
  onSubmit(e, val = {}) {
    // this.setNotify() ;
    if (this.state.emailState === "") {
      this.setemailState("error");
    }
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (val.email && val.password && this.verifyEmail(val.email)) {
      if (this.state.isChecked) {
        localStorage.username = val.email
        localStorage.password = val.password
        localStorage.checkbox = this.state.isChecked
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('checkbox');
      }
      this.props.loginUser(val, this.props.history);
    }
    e.preventDefault();
  }
  facebookResponse = (response) => {
    console.log("facebook response", response.accessToken);
    if (response && response.accessToken != null) {
      var val = { 'access_token': response.accessToken, 'strategy': 'facebook', role: 1 }
      this.props.socialloginUser(val, this.props.history);


    } else {
      //display error in snack bar
      // this.props.loginerror = "danger";
      // this.props.notification_message = "testing"
      // this.props.shownotification=true
      var val = { 'access_token': '', 'strategy': 'facebook', role: 1 }
      this.props.socialloginUser(val, this.props.history);
    }

  };
  responseGoogle = (response) => {
    console.log("responsegoogle", response);
    console.log("googleresponsetolen", response.accessToken)
    if (response && response.accessToken != null) {
      var val = { 'access_token': response.accessToken, 'strategy': 'google', role: 1 }
      this.props.socialloginUser(val, this.props.history);


    } else {

      var val = { 'access_token': '', 'strategy': 'google', role: 1 }
      this.props.socialloginUser(val, this.props.history);
    }

  }
  responseGoogleFail = (response) => {
    console.log("responsegoogleFail", response);
  }
  twitterResponse = (response) => {
    console.log("twitterresponse", response);
    response.json().then(user => {
      console.log("r : ", user);

      let token = user.token;
      if (user.status == true) {
        localStorage.setItem('email', user.data.email);
        localStorage.setItem('user', JSON.stringify({ 'token': user.token }));

        window.location.reload();
      } else {
        //display error in snakbar
      }
    });
  }
  twitterResponseFail = (response) => {
    //display error in snakbar
  }
  handleChange = event => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };
  render() {
    const { email, password, cardAnimaton, emailState, passwordState } = this.state;
    console.log("this.state", this.state)
    const { classes } = this.props;
    const customHeader = {};
    customHeader['role'] = '1';
    customHeader['strategy'] = 'twitter';
    var loginUrl = API_URL + "/user/twitteradmin"
    var requestTokenUrl = API_URL + "/user/reverse"
    return (
      <div className={classes.container}>
        <GridContainer justify="center" alignItems="center" spacing={10}>
          {/* <GridItem lg={7} sm={6} className={classes.textCenter}>
          <h2 className={classes.logLeftContentH2}>
            Get Matched With Your Dream Job
          </h2>
          <p className={classes.logLeftContentP}>
            Shtudy connects top Black, Latinx, and Native
            <Hidden mdDown>
              <br />
            </Hidden>
            American tech talent with career opportunities
            <Hidden mdDown>
              <br />
            </Hidden>
            at America’s leading companies.
          </p>
          <h3 className={classes.logLeftContentH3}>A Simple, Easy Process</h3>
          <div className="logProccessStep">
            Quiz{" "}
            <img
              src={LogArrow}
              alt=""
              title=""
              className={classes.logArrows}
            ></img>{" "}
            Interview{" "}
            <img
              src={LogArrow}
              alt=""
              title=""
              className={classes.logArrows}
            ></img>{" "}
            Get Hired
          </div>
        </GridItem> */}
          <Hidden mdDown>
            <GridItem lg={1}></GridItem>
          </Hidden>

          <GridItem xs={12} sm={6} lg={6}>
            <form onSubmit={(e) => this.onSubmit(e, { email, password })}>
              <Card login className={classes[cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.logCardHeader}`}
                >
                  <h4 className={classes.logCardHeaderTitle}>
                    Welcome to Shtudy!
                </h4>
                  <small className={classes.logSubTitle}>
                    Sign in to Get Access as Admin.
                </small>
                </CardHeader>
                <CardBody className={classes.bodyPadding + " logInputs"}>
                  <CustomInput
                    success={emailState === "success"}
                    error={emailState === "error"}
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      onChange: ((e) => {
                        if (this.verifyEmail(e.target.value)) {
                          this.setemailState("success");
                        } else {
                          this.setemailState("error");
                        }
                        this.setemail(e.target.value)
                      }),
                      value: email,
                    }}

                  />
                  <CustomInput
                    success={passwordState === "success"}
                    error={passwordState === "error"}
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                        </Icon>
                        </InputAdornment>
                      ),
                      type: "password",
                      autoComplete: "off",
                      onChange: ((e) => {
                        if (this.verifyLength(e.target.value, 1)) {
                          this.setpasswordState("success");
                        } else {
                          this.setpasswordState("error");
                        }
                        this.setpassword(e.target.value)
                      }),
                      value: password,
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.bodyPadding}>
                  <GridContainer>
                    <GridItem md={6}>
                      <FormControlLabel
                        className={classes.rememberOne}
                        id="rememberOne"
                        control={
                          <Checkbox
                            checked={this.state.isChecked}
                            onChange={this.onChangeCheckbox}
                            name="checkedA"
                            color="primary"
                          />
                        }
                        label="Remember me."
                      />
                    </GridItem>
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button
                        type="submit"
                        color="info"
                        size="lg"
                        className={`${classes.logButton} ${classes.mb30}`}
                      >
                        Sign in
                    </Button>
                    </GridItem>

                  </GridContainer>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>


        {/* <Snackbar
          place="tr"
          color={(this.props.loginerror) ? "danger" : "info"}
          icon={AddAlert}
          message={`${this.props.notification_message}`}
          open={this.props.shownotification}
          closeNotification={() => {
            this.setNotify(false);
          }}
          close
        /> */}
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object
};
const mapStateToProps = state => {
  // console.log('in maptoprops:',state);

  return {
    user: state.authReducer.user,
    shownotification: state.authReducer.shownotification,
    loginerror: state.authReducer.loginerror,
    notification_message: state.authReducer.notification_message
  };
};

// const mapStateToProps = state => (
//   console.log();
//   { 
//   user: state.user,
//   shownotification: state.shownotification,
//   loginerror : state.loginerror,    
//   notification_message:state.notification_message
//  });
const mapDispatchToProps = { loginUser, resetNotification, socialloginUser };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage));