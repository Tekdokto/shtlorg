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
import { Component } from "react";
const useStyles = makeStyles(styles);




class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      email: "",
      emailState: "",
      cardAnimaton: "cardHidden",
      notification: false
    }
  }

  componentDidMount() {
    let ths = this;
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
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
  setemailState(val = "") {
    this.setState({ emailState: val })
  }
  setCardAnimation(val = "") {
    this.setState({ cardAnimaton: val })
  }
  setemail(val = "") {
    this.setState({ email: val })
  }
  onSubmit(val = {}) {
    console.log('Test', val, this.props);
    // this.setNotify() ;
    if (this.state.emailState === "") {
      this.setemailState("error");
    }
    if (val.email) {
      this.props.forgotpasswordUser(val, this.props.history);
    }
  }
  // componentWillReceiveProps(){
  //   console.log("received props",this.props);

  // }
  componentDidUpdate(prevProps) {
    console.log('prevstate', prevProps)
  }
  render() {
    const { email, cardAnimaton, emailState } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card login className={classes[cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="rose"
                >
                  <h4 className={classes.cardTitle}>Forgot Password</h4>
                </CardHeader>
                <CardBody className="logInputs">
                  <CustomInput
                    success={emailState === "success"}
                    error={emailState === "error"}
                    labelText="Email..."
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
                      })
                    }}
                  />
                  <NavLink to={"/auth/login"} className={classes.navLink}>
                    <ListItemText
                      primary={"Back to Login"}
                      disableTypography={true}
                      className={classes.listItemText}
                    />
                  </NavLink>
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button onClick={() => this.onSubmit({ email })} color="rose" simple size="lg" block>
                    Let{"'"}s Go
                </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
        {/* <Snackbar
        place="tr"
        color={(this.props.loginerror)?"danger":"info"}
        icon={AddAlert}
        message={`${this.props.notification_message}`}
        open={this.props.shownotification}
        closeNotification={() =>{
           this.setNotify(false);           
          }}
        close
      /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ForgotPasswordPage));
