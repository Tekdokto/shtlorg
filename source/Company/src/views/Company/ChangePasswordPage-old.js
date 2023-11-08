import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from 'react-redux';
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
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { changePassword,resetNotification } from '../../redux/action'
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import AddAlert from "@material-ui/icons/AddAlert";


class ChangePasswordPage extends React.Component {
  constructor(props) {
    super(props);
    var passwordtoken = this.props.location.pathname.split("/")
    // console.log("idarray",passwordtoken[3])
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      password : "",
      passwordState: "",
      confirmpassword : "",
      confirmpasswordState: "",
      currentpassword : "",
      currentpasswordState: "",
      cardAnimaton : "cardHidden",
      notification: false
    }
  }
  
 
  
  componentDidMount(){    
    let ths = this;
    setTimeout(function() {
      ths.setCardAnimation("");
    }, 700);
  }
  setNotify(val=true){
    // console.log('in set notification',val);
    
    this.setState({notification:val})
    let ths = this;
    setTimeout(()=>{
      ths.setState({notification:false})
    },2000)
    this.props.resetNotification();
  }
  verifyConfirmpassword(val,lenght=1){
    if(val.length >= lenght){
      if(val === this.state.password){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }
  verifyLength(val, length){
    if (val.length >= length) {
      return true;
    }
    return false;
  };
  setcurrentpasswordState(val=""){
    this.setState({currentpasswordState:val})
  }
  setpasswordState(val=""){
    this.setState({passwordState:val})
  }
  setconfirmpasswordState(val=""){
    this.setState({confirmpasswordState:val})
  }
  setCardAnimation(val=""){
    this.setState({cardAnimaton: val})
  }
  setcurrentpassword(val=""){
    this.setState({currentpassword: val})
  }
  setpassword(val=""){
    this.setState({password: val})
  }
  setconfirmpassword(val=""){
    this.setState({confirmpassword: val})
  }
  onSubmit(val={}){
    console.log('Test',val,this.props.user.user_id);
    // this.setNotify() ;
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (this.state.confirmpasswordState === "") {
      this.setconfirmpasswordState("error");
    }
    if (this.state.currentpasswordState === "") {
      this.setconfirmpasswordState("error");
    }
    if(val.password && val.confirmpassword && val.currentpassword){
      val.user_id = this.props.user.user_id
      this.props.changePassword(val);
      this.setcurrentpasswordState();
      this.setconfirmpasswordState();
      this.setpasswordState();
      this.setpassword();
      this.setconfirmpassword();
      this.setcurrentpassword();
    }
  }  
  render() {
    const { classes } = this.props;
    const { password,passwordState,cardAnimaton,confirmpassword,confirmpasswordState,currentpassword,currentpasswordState } = this.state;
    return (
      <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login >
              {/* <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Reset Password</h4>
               
              </CardHeader> */}
              <CardBody>
                
              <CustomInput
                  success={currentpasswordState === "success"}
                  error={currentpasswordState === "error"}
                  labelText="Current Password"
                  id="currentpassword"
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
                    value : this.state.currentpassword,
                    onChange:((e)=>{
                      if(this.verifyLength(e.target.value,1)){
                        this.setcurrentpasswordState("success");
                      }else{
                        this.setcurrentpasswordState("error");
                      }
                      this.setcurrentpassword(e.target.value)
                      })
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
                    value : this.state.password,
                    onChange:((e)=>{
                      if(this.verifyLength(e.target.value,1)){
                        this.setpasswordState("success");
                      }else{
                        this.setpasswordState("error");
                      }
                      this.setpassword(e.target.value)
                      })
                  }}
                />
                <CustomInput
                  success={confirmpasswordState === "success"}
                  error={confirmpasswordState === "error"}
                  labelText="Confirm Password"
                  id="confirmpassword"
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
                    value : this.state.confirmpassword,
                    onChange:((e)=>{
                      if(this.verifyConfirmpassword(e.target.value,1)){
                        this.setconfirmpasswordState("success");
                      }else{
                        this.setconfirmpasswordState("error");
                      }
                      this.setconfirmpassword(e.target.value)
                      })
                  }}
                />
                                
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button onClick={()=>this.onSubmit({password,confirmpassword,currentpassword})} color="rose" simple size="lg" block>
                  Change
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      <Snackbar
        place="tr"
        color={(this.props.changepassworderror)?"danger":"info"}
        icon={AddAlert}
        message={`${this.props.notification_message}`}
        open={this.props.shownotification}
        closeNotification={() =>{
           this.props.resetNotification();           
          }}
        close
      />
    </div>
    );
  }
}


ChangePasswordPage.propTypes = {
  classes: PropTypes.object
};

const mapStateToProps = state => ({ 
  user: state.authReducer.user,
  shownotification: state.authReducer.shownotification,
  loginerror : state.authReducer.loginerror,
  changepassworderror : state.authReducer.changepassworderror,    
  notification_message:state.authReducer.notification_message
 });
const mapDispatchToProps = { changePassword,resetNotification };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChangePasswordPage));