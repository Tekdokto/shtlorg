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
import { toast } from "react-toastify";


class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    var passwordtoken = this.props.location.pathname.split("/")
    // console.log("idarray",passwordtoken[3])
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
    // console.log('in set notification',val);
    
    this.setState({notification:val})
    let ths = this;
    setTimeout(()=>{
      ths.setState({notification:false})
    },2000)
    this.props.resetNotification();
  }

  verifyPassword(value){
    var paswd=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    // console.log("value.match(paswd)",value.match(paswd))
    if(value.match(paswd)){
      return true;
    }
    return false
  }

  verifyLength(val, length){
    if (val.trim().length >= length) {
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
    this.setState({password: val.trim()})
  }
  setconfirmpassword(val=""){
    this.setState({confirmpassword: val.trim()})
  }
  onSubmit(e,val={}){
    // console.log('Test',this.setconfirmpasswordState);
    // this.setNotify() ;
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (this.state.confirmpasswordState === "") {
      this.setconfirmpasswordState("error");
    }
    if(this.verifyPassword(val.password) && this.verifyLength(val.confirmpassword,6) && val.password === val.confirmpassword){
      this.props.resetpasswordUser(val,this.props.history);
    }else{
      if(!(this.verifyLength(val.password,1))){
        toast.error('Password can not be empty.')
      }else if(!(this.verifyPassword(val.password))){
        toast.error('Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
      }else if(!(val.password === val.confirmpassword)){
        toast.error('Password and confirm password should be same.')
      }
    }
    e.preventDefault();
  }
  // componentWillReceiveProps(){
  //   console.log("received props",this.props);
    
  // }
  componentDidUpdate(prevProps) {
    // console.log('prevstate',prevProps)
  } 
  render() {
    const { classes } = this.props;
    const { password,passwordState,cardAnimaton,confirmpassword,confirmpasswordState,token } = this.state;
    return (
      <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={(e)=>this.onSubmit(e,{password,confirmpassword,token})}>
            <Card login >
              <CardHeader className={`${classes.cardHeader} ${classes.logCardHeader} ${classes.textCenter}`} >
                  <h4 justify="center" className={classes.logCardHeaderTitle}>
                    Reset your password 
                  </h4>                  
              </CardHeader>             
              <CardBody>
                <CustomInput
                    success={passwordState === "success"}
                    error={passwordState === "error"}
                    labelText="New Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}                  
                    inputProps={{ 
                      placeholder:"Enter a new password",                    
                      type: "password",
                      autoComplete: "off",
                      onChange:((e)=>{
                        if(this.verifyPassword(e.target.value)){
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
                    labelText="Confirm New Password"
                    id="confirmpassword"
                    formControlProps={{
                      fullWidth: true
                    }}                  
                    inputProps={{     
                      placeholder:"Confirm your new password",                
                      type: "password",
                      autoComplete: "off",
                      onChange:((e)=>{
                        if(this.verifyLength(e.target.value,6) && password === e.target.value){
                          this.setconfirmpasswordState("success");
                          
                        }else{
                          this.setconfirmpasswordState("error");
                        }
                        this.setconfirmpassword(e.target.value)
                        })
                    }}
                  />                              
              </CardBody>
              <CardFooter className={classes.bodyPadding}>
                <GridContainer>                          
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button className={`${classes.logButton} ${classes.mb30}`}  type="submit" color="info" size="md" block>
                        Reset Password
                      </Button>
                    </GridItem>
                  </GridContainer>                
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
       <Snackbar
        place="tr"
        color={(this.props.loginerror)?"danger":"info"}
        icon={AddAlert}
        message={`${this.props.notification_message}`}
        open={this.props.shownotification}
        closeNotification={() =>{
           this.setNotify(false);           
          }}
        close
      />
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