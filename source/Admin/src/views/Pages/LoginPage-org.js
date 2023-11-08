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
import { loginUser,socialloginUser,resetNotification } from '../../redux/action'

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { Component } from "react";
import { config } from '../../helpers/config'
import { API_URL } from '../../constants/defaultValues'

class LoginPage extends Component{  
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      email : "",
      emailState: "",
      password : "",
      passwordState:"",
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
  verifyEmail(val){
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }
  setpasswordState(val=""){
    this.setState({passwordState:val})
  }
  setemailState(val=""){
    this.setState({emailState:val})
  }
  setCardAnimation(val=""){
    this.setState({cardAnimaton: val})
  }
  setemail(val=""){
    this.setState({email: val})
  }
  setpassword(val=""){
    this.setState({password: val})
  }
  onSubmit(e,val={}){
    // this.setNotify() ;
    if (this.state.emailState === "") {
      this.setemailState("error");
    }
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if(val.email && val.password){
      this.props.loginUser(val,this.props.history);
    }
    e.preventDefault();
  }  
  facebookResponse = (response) => {
      console.log("facebook response",response.accessToken);
      if(response && response.accessToken != null){
        var val =  {'access_token':response.accessToken,'strategy':'facebook',role:1}
        this.props.socialloginUser(val,this.props.history);

       
      }else{
        //display error in snack bar
        // this.props.loginerror = "danger";
        // this.props.notification_message = "testing"
        // this.props.shownotification=true
        var val =  {'access_token':'','strategy':'facebook',role:1}
        this.props.socialloginUser(val,this.props.history);
      }
     
  };
  responseGoogle = (response) => {
    console.log("responsegoogle",response);
    console.log("googleresponsetolen",response.accessToken)
    if(response && response.accessToken != null){
      var val =  {'access_token':response.accessToken,'strategy':'google',role:1}
      this.props.socialloginUser(val,this.props.history);

     
    }else{
    
      var val =  {'access_token':'','strategy':'google',role:1}
      this.props.socialloginUser(val,this.props.history);
    }
   
  }
  responseGoogleFail = (response) => {
    console.log("responsegoogleFail",response);
  }
  twitterResponse = (response) => {
    console.log("twitterresponse",response);
    response.json().then(user => {
        console.log("r : ", user);
      
        let token = user.token;
        if (user.status == true) {
            localStorage.setItem('email',user.data.email);
            localStorage.setItem('user', JSON.stringify({'token':user.token}));
            
            window.location.reload();
        }else{
          //display error in snakbar
        }
    });
  }
  twitterResponseFail = (response) => {
    //display error in snakbar
  }
  render(){
  const { email,password,cardAnimaton,emailState,passwordState } = this.state;
  const { classes } = this.props;
  const customHeader = {};
  customHeader['role'] = '1';
  customHeader['strategy'] = 'twitter';
  var loginUrl=API_URL+"/user/twitteradmin"
  var requestTokenUrl=API_URL+"/user/reverse"
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={(e)=>this.onSubmit(e,{email,password})} method="POST">
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
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
                    onChange:((e)=>{
                        if(this.verifyEmail(e.target.value)){
                          this.setemailState("success");
                        }else{
                          this.setemailState("error");
                        }
                        this.setemail(e.target.value)
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
                <NavLink to={"/auth/forgot-password"} className={classes.navLink}>
                  <ListItemText
                    primary={"Forgot Password"}
                    disableTypography={true}
                    className={classes.listItemText}
                  />
                </NavLink>
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button type="submit"  color="rose" simple size="lg" block>
                  Let{"'"}s Go
                </Button>
               
              </CardFooter>
              <p className={classes.listItemText}>
                  Don’t have a account?
                  <NavLink to={"/auth/register"} className={classes.navLink}>
                  <ListItemText
                    primary={"Sign Up"}
                    disableTypography={true}
                    className={classes.listItemText}
                  />
                </NavLink></p>
            </Card>
           
          </form>
          <div className={classes.center}>
            <FacebookLogin
              appId={config.FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email"
              callback={this.facebookResponse}
              cssClass=""
              textButton={false}
              icon={<Button justIcon round color="facebook">
              <i className="fab fa-facebook-f" />
            </Button>}
              />
               {` `}
              <GoogleLogin
                clientId={config.GOOGLE_CLIENT_ID}
                buttonText=""
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogleFail}
                cookiePolicy={'single_host_origin'}
                icon={false}
                cssClass=""
              >
               {` `}
               <Button justIcon round color="google">
                <i className={"fab fa-google"} />
              </Button>
              </GoogleLogin>
              <TwitterLogin 
                loginUrl={loginUrl}
                onFailure={this.twitterResponseFail} 
                onSuccess={this.twitterResponse}
                requestTokenUrl={requestTokenUrl}
                customHeaders={customHeader}
                showIcon={true}
              >
              <Button justIcon round color="twitter">
                <i className={"fab fa-twitter"} />
              </Button>
            </TwitterLogin>    

            
          </div>        
        
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

LoginPage.propTypes = {
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

// const mapStateToProps = state => (
//   console.log();
//   { 
//   user: state.user,
//   shownotification: state.shownotification,
//   loginerror : state.loginerror,    
//   notification_message:state.notification_message
//  });
const mapDispatchToProps = { loginUser,resetNotification,socialloginUser };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage));