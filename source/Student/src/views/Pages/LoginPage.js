import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
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
import { loginUser, resetNotification } from '../../redux/action'

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { Component } from "react";
import { config } from '../../helpers/config'
import LogArrow from "../../assets/img/logpage-arrow.svg";
import MailIcon from "../../assets/img/mail-icon.svg";
import EyeIcon from "../../assets/img/eye-slash.svg";
import EyeSlash from "../../assets/img/eye-slash.svg";
import { Icon as IconF, InlineIcon } from '@iconify/react';
import eyeIcon from '@iconify/icons-fa/eye';
import eyeSlash from '@iconify/icons-fa/eye-slash';
import { toast } from "react-toastify";

import { API_URL } from '../../constants/defaultValues'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      emailState: "",
      emailerrortext: "",
      password: "",
      passwordState: "",
      passworderrortext: "",
      cardAnimaton: "cardHidden",
      notification: false,
      checkedA: false,
      passwordShow: false
    }
  }

  componentDidMount() {
    let ths = this;
    let emailObject = localStorage.getItem('emailpassword')
    let tempObject = (emailObject) ? JSON.parse(emailObject) : false
    let email = (tempObject) ? ((tempObject.email) ? tempObject.email : "") : "";
    let password = (tempObject) ? ((tempObject.password) ? tempObject.password : "") : "";
    let checkedA = (tempObject) ? ((tempObject.checkedA) ? tempObject.checkedA : "") : false;
    console.log("tempObject", tempObject, email, password);

    this.setState({ email: email, password: password, checkedA: checkedA })
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
  }
  setNotify(val = true) {
    console.log('in set notification', val);


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
    var val = val.trim();
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }
  setpasswordState(val = "") {
    this.setState({ passwordState: val, passworderrortext: (val == "error") ? "Password shouldn't be empty." : "" })
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
  setpassword(val = "") {
    this.setState({ password: val })
  }
  passwordShowHide() {
    this.setState({ passwordShow: !this.state.passwordShow })
  }
  onSubmit(e, val = {}) {
    // this.setNotify() ;
    console.log("checkbox:", this.state.checkedA);
    if (this.state.checkedA && this.verifyEmail(val.email) && this.verifyLength(val.password, 1)) {
      localStorage.setItem('emailpassword', JSON.stringify({ email: val.email, password: val.password, checkedA: true }))
    } else {
      localStorage.removeItem('emailpassword');
    }

    if (!(this.verifyEmail(val.email))) {
      toast.error("Please enter valid email.")
      this.setemailState("error");
    } else
      if (!(this.verifyLength(val.password, 1))) {
        toast.error("Please enter password.")
        this.setpasswordState("error");
      }
    if (this.verifyEmail(val.email) && this.verifyLength(val.password, 1)) {
      val.email = val.email.trim()
      this.props.loginUser(val, this.props.history);
      this.setemailState();
      this.setpasswordState();
    }
    e.preventDefault();
  }

  handleChange = event => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };
  render() {
    const { email, password, cardAnimaton, emailState, passwordState } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.containerFluid}>
        <GridContainer justify="center" alignItems="center" spacing={10}>
          <GridItem lg={7} md={6} sm={6} className={classes.textCenter}>
            <h2 className={classes.logLeftContentH22}>
              Get Matched With Your Dream Job
          </h2>
            <p className={`${classes.logLeftContentP} ${classes.logLeftContentP1}`}>
              Shtudy connects top Black, Latinx, and Native
            <Hidden mdDown>
                <br />
              </Hidden>
            American tech talent with career opportunities&nbsp;
            <Hidden mdDown>
                <br />
              </Hidden>
            at America’s leading companies.
          </p>
          <p className={`${classes.logLeftContentP} ${classes.logLeftContentP1}`}>
            Start your profile today to begin
          </p>
            <h3 className={classes.logLeftContentH3}>A Simple, Easy Process</h3>
            <div className="logProccessStep">
            Get Screened{" "}
              <img
                src={LogArrow}
                alt=""
                title=""
                className={classes.logArrows}
              ></img>{" "}
            Start Interviewing{" "}
              <img
                src={LogArrow}
                alt=""
                title=""
                className={classes.logArrows}
              ></img>{" "}
            Get Hired
          </div>
          </GridItem>
          <Hidden lgDown>
            <GridItem lg={1}></GridItem>
          </Hidden>

          <GridItem xs={12} sm={6} lg={5} xl={4} md={6}>
            <form onSubmit={(e) => this.onSubmit(e, { email, password })}>
              <Card login className={classes[cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.logCardHeader}`}
                >
                  <h4 className={classes.logCardHeaderTitle}>
                    Welcome to Shtudy!
                </h4>
                  <small className={classes.logSubTitle}>
                    Sign in to Get Hired, Fast.
                </small>
                </CardHeader>
                <CardBody className={classes.bodyPadding + " logInputs"}>
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
                    // helperText={(passwordState === "error")?this.state.passworderrortext:""}
                    // success={passwordState === "success"}
                    error={passwordState === "error"}
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end" style={{ 'cursor': 'pointer' }} onClick={(e) => { this.passwordShowHide() }}>
                          {(this.state.passwordShow)
                            ? <IconF icon={eyeIcon} />
                            : <IconF icon={eyeSlash} />
                          }
                        </InputAdornment>
                      ),
                      type: (this.state.passwordShow) ? "text" : "password",
                      value: this.state.password,
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
                            checked={this.state.checkedA}
                            onChange={this.handleChange}
                            name="checkedA"
                            color="primary"
                          />
                        }
                        label="Remember me"
                      />
                    </GridItem>
                    <GridItem className={classes.textRight} md={6}>
                      <Link
                        href="/auth/forgotpassword"
                        className={classes.forgotLink}
                      >
                        Forgot Password?
                    </Link>
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
                    {/* <GridItem className={`${classes.textCenter} ${classes.singUpBlock}`}>
                     Don't have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className={classes.forgotLink}                    
                    >
                      Sign Up
                    </Link>
                  </GridItem> */}
                    <GridItem
                      sm={12}
                      className={`${classes.textCenter} ${classes.singUpBlock}`}
                    >
                      Don't have an account?{" "}
                      <Link
                        href="/auth/signup"
                        className={classes.signUpLink}
                      >
                        Sign Up
                    </Link>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>

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

const mapDispatchToProps = { loginUser, resetNotification };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage));