import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from "react-redux";
// changesv1
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";
import Snackbar from "components/Snackbar/Snackbar.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { changePassword, resetNotification } from "../../redux/action";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import combineStyles from "../../combineStyles";
import AddAlert from "@material-ui/icons/AddAlert";
import { toast } from "react-toastify"

class ChangePasswordPage extends React.Component {
  constructor(props) {
    super(props);
    // var passwordtoken = this.props.location.pathname.split("/")
    // console.log("idarray",passwordtoken[3])
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      password: "",
      passwordState: "",
      confirmpassword: "",
      confirmpasswordState: "",
      currentpassword: "",
      currentpasswordState: "",
      cardAnimaton: "cardHidden",
      notification: false,
    };
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }
  
  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }
  componentDidMount() {
    let ths = this;
    setTimeout(function() {
      ths.setCardAnimation("");
    }, 700);
    ths.showLoader();
    setTimeout(()=>{
      ths.hideLoader()
    },500)
  }
  setNotify(val = true) {
    // console.log("in set notification", val);

    this.setState({ notification: val });
    let ths = this;
    setTimeout(() => {
      ths.setState({ notification: false });
    }, 2000);
    this.props.resetNotification();
  }
  verifyConfirmpassword(val, lenght = 1) {
    if (val.length >= lenght) {
      if (val === this.state.password) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  verifyPassword(value){
    var paswd=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    // console.log("value.match(paswd)",value.match(paswd))
    if(value.match(paswd)){
      return true;
    }
    return false
  }

  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  }
  setcurrentpasswordState(val = "") {
    this.setState({ currentpasswordState: val });
  }
  setpasswordState(val = "") {
    this.setState({ passwordState: val });
  }
  setconfirmpasswordState(val = "") {
    this.setState({ confirmpasswordState: val });
  }
  setCardAnimation(val = "") {
    this.setState({ cardAnimaton: val });
  }
  setcurrentpassword(val = "") {
    this.setState({ currentpassword: val });
  }
  setpassword(val = "") {
    this.setState({ password: val });
  }
  setconfirmpassword(val = "") {
    this.setState({ confirmpassword: val });
  }
  onSubmit(e, val = {}) {
    // console.log("Test", val, this.props.user.user_id);
    // this.setNotify() ;
    if (!this.verifyPassword(val.password)) {
      this.setpasswordState("error");
    }else if((val.password.trim()!== val.confirmpassword.trim())){
      this.setconfirmpasswordState("error");
    }else if (!this.verifyLength(val.currentpassword,1)) {
      this.setcurrentpasswordState("error");
    }else if((val.currentpassword.trim()== val.password.trim())){
      this.setpasswordState("error");
    }
    if (val.password && val.confirmpassword && val.currentpassword  && this.verifyPassword(val.password) && (val.password.trim() === val.confirmpassword.trim()) && (val.currentpassword.trim()!= val.password.trim()) && this.verifyLength(val.currentpassword,1)) {
      val.user_id = this.props.user.user_id;
      this.props.changePassword(val);
      this.setcurrentpasswordState();
      this.setconfirmpasswordState();
      this.setpasswordState();
      this.setpassword();
      this.setconfirmpassword();
      this.setcurrentpassword();
    }else{
      if(!this.verifyLength(val.currentpassword,1)){ 
        toast.error('Please enter old password.')
      }else if(!(this.verifyPassword(val.password))){
        toast.error('New Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
      }else if((val.currentpassword.trim()== val.password.trim())){
        toast.error('New Password should not be same as old password')
      }else if(val.password.trim()!== val.confirmpassword.trim()){
        toast.error('New password and Confirm password should be same.')
      }
    }
    e.preventDefault();
  }
  render() {
    const { classes } = this.props;
    const {
      password,
      passwordState,
      cardAnimaton,
      confirmpassword,
      confirmpasswordState,
      currentpassword,
      currentpasswordState,
    } = this.state;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12}>
            <h1>Change Password</h1>
            <h5>Change your password</h5>
          </GridItem>
        </GridContainer>
        <GridContainer spacing={10}>
          <GridItem
            xs={12}
            sm={8}
            md={8}
            lg={6}
            className={classes.centerBlock}
          >
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Change your password
              </CardHeader>
              <CardBody className="cardCustomBody">
                <form
                  onSubmit={(e) =>
                    this.onSubmit(e, {
                      password,
                      confirmpassword,
                      currentpassword,
                    })
                  }
                >
                  <CustomInput
                    // success={currentpasswordState === "success"}
                    error={currentpasswordState === "error"}
                    labelText="Old Password"
                    id="currentpassword"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "password",
                      autoComplete: "off",
                      value: this.state.currentpassword,
                      onChange: (e) => {
                        if (this.verifyLength(e.target.value, 1)) {
                          this.setcurrentpasswordState("success");
                        } else {
                          this.setcurrentpasswordState("error");
                        }
                        this.setcurrentpassword(e.target.value);
                      },
                    }}
                  />
                  <CustomInput
                    // success={passwordState === "success"}
                    error={passwordState === "error"}
                    labelText="New Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "password",
                      autoComplete: "off",
                      value: this.state.password,
                      onChange: (e) => {
                        if (this.verifyPassword(e.target.value)) {
                          this.setpasswordState("success");
                        } else {
                          this.setpasswordState("error");
                        }
                        this.setpassword(e.target.value);
                      },
                    }}
                  />
                  <CustomInput
                    // success={confirmpasswordState === "success"}
                    error={confirmpasswordState === "error"}
                    labelText="Confirm New Password"
                    id="confirmpassword"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "password",
                      autoComplete: "off",
                      value: this.state.confirmpassword,
                      onChange: (e) => {
                        if (this.verifyConfirmpassword(e.target.value, 1)) {
                          this.setconfirmpasswordState("success");
                        } else {
                          this.setconfirmpasswordState("error");
                        }
                        this.setconfirmpassword(e.target.value);
                      },
                    }}
                  />
                  <Grid item xs={12} className={classes.textCenter}>
                    <Button
                      color="info"
                      size="lg"
                      type="submit"
                      className={`${classes.blockButton} ${classes.mt30}`}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

ChangePasswordPage.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  shownotification: state.authReducer.shownotification,
  loginerror: state.authReducer.loginerror,
  changepassworderror: state.authReducer.changepassworderror,
  notification_message: state.authReducer.notification_message,
});
const mapDispatchToProps = { changePassword, resetNotification };

const combinedStyles = combineStyles(customStyle, styles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(ChangePasswordPage));
