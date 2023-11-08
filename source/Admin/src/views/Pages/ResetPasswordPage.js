import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from 'react-redux';
// changesv1
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddAlert from "@material-ui/icons/AddAlert";
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
import { resetpasswordUser,resetNotification,validatetoken } from '../../redux/action'
import { Component } from "react";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";


class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    var passwordtoken = this.props.location.pathname.split("/")
    console.log("idarray",passwordtoken[3])
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      token:passwordtoken[3],
      password : "",
      passwordState: "",
      confirmpassword : "",
      confirmpasswordState: "",
      cardAnimaton : "cardHidden",
      notification: false
    }
  }
  
 
  
  componentDidMount(){  
    var tokendata = {"token":this.state.token}
    this.props.validatetoken(tokendata,this.props.history);  
    let ths = this;
    setTimeout(function() {
      ths.setCardAnimation("");
    }, 700);
  }
  setNotify(val=true){
    console.log('in set notification',val);
    
    this.setState({notification:val})
    let ths = this;
    setTimeout(()=>{
      ths.setState({notification:false})
    },2000)
    this.props.resetNotification();
  }

  verifyLength(val, length){
    if (val.length >= length) {
      return true;
    }
    return false;
  };
 
  setpasswordState(val=""){
    this.setState({passwordState:val})
  }
  setconfirmpasswordState(val=""){
    this.setState({confirmpasswordState:val})
  }
  setCardAnimation(val=""){
    this.setState({cardAnimaton: val})
  }
  setpassword(val=""){
    this.setState({password: val})
  }
  setconfirmpassword(val=""){
    this.setState({confirmpassword: val})
  }
  onSubmit(val={}){
    console.log('Test',this.setconfirmpasswordState);
    // this.setNotify() ;
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (this.state.confirmpasswordState === "") {
      this.setconfirmpasswordState("error");
    }
    if(val.password && val.confirmpassword && val.password === val.confirmpassword){
      this.props.resetpasswordUser(val,this.props.history);
    }
  }
  // componentWillReceiveProps(){
  //   console.log("received props",this.props);
    
  // }
  componentDidUpdate(prevProps) {
    console.log('prevstate',prevProps)
  } 
  render() {
    const { classes } = this.props;
    const { password,passwordState,cardAnimaton,confirmpassword,confirmpasswordState,token } = this.state;
    return (
      <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login >
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Reset Password</h4>
               
              </CardHeader>
              <CardBody>
                
               
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
                    onChange:((e)=>{
                      if(this.verifyLength(e.target.value,1)){
                        this.setpasswordState("success");
                      }else{
                        this.setpasswordState("error");
                      }
                      if(confirmpassword != "" && confirmpassword === e.target.value){
                        this.setconfirmpasswordState("success");
                      }else if(confirmpassword != "" && confirmpassword != e.target.value){
                        
                        this.setconfirmpasswordState("error");
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
                    onChange:((e)=>{
                      if(this.verifyLength(e.target.value,1) && password === e.target.value){
                        this.setconfirmpasswordState("success");
                        
                      }else{
                        this.setconfirmpasswordState("error");
                      }
                      this.setconfirmpassword(e.target.value)
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
                <Button onClick={()=>this.onSubmit({password,confirmpassword,token})} color="rose" simple size="lg" block>
                  Submit
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


ResetPasswordPage.propTypes = {
  classes: PropTypes.object
};



 const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  
  return {
    user: state.authReducer.user,
      shownotification: state.authReducer.shownotification,
      loginerror : state.authReducer.loginerror,    
      notification_message:state.authReducer.notification_message
  };
};
const mapDispatchToProps = { resetpasswordUser,resetNotification,validatetoken };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ResetPasswordPage));