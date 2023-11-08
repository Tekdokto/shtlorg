import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import TwitterLogin from 'react-twitter-auth';
// changesv1
// @material-ui/core components
import Timeline from "@material-ui/icons/Timeline";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
import InfoArea from "components/InfoArea/InfoArea.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import AddAlert from "@material-ui/icons/AddAlert";
import LogArrow from "../../assets/img/logpage-arrow.svg";
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
import { registerUser,socialloginUser,resetNotification } from '../../redux/action'

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { Component } from "react";
import { config } from '../../helpers/config';
import { API_URL } from '../../constants/defaultValues'

class RegisterPage extends Component{  
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      first_name : "",
      firstnameState:"",
      last_name : "",
      lastnameState:"",
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
    // console.log('in set notification',val);
    
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
  setfirstnameState(val=""){
    this.setState({firstnameState:val})
  }
  setlastnameState(val=""){
    this.setState({lastnameState:val})
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
  setfirstname(val=""){
    this.setState({first_name: val})
  }
  setlastname(val=""){
    this.setState({last_name: val})
  }
  setemail(val=""){
    this.setState({email: val})
  }
  setpassword(val=""){
    this.setState({password: val})
  }
  onSubmit(e,val={}){
    // this.setNotify() ;
    // console.log("testest",val.first_name,val.last_name,val.email,val.password)
    if (this.state.emailState === "") {
      this.setemailState("error");
    }
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (this.state.firstnameState === "") {
      this.setfirstnameState("error");
    }
    if (this.state.lastnameState === "") {
      this.setlastnameState("error");
    }
    val.role = config.ROLEID;
    if(val.first_name && val.last_name && val.email && val.password){
      // console.log("intheblock")
      this.props.registerUser(val,this.props.history);
    }
    e.preventDefault();
  }  
  facebookResponse = (response) => {
      // console.log("facebook response",response.accessToken);
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
    // console.log("responsegoogle",response);
    // console.log("googleresponsetolen",response.accessToken)
    if(response && response.accessToken != null){
      var val =  {'access_token':response.accessToken,'strategy':'google',role:1}
      this.props.socialloginUser(val,this.props.history);

     
    }else{
    
      var val =  {'access_token':'','strategy':'google',role:1}
      this.props.socialloginUser(val,this.props.history);
    }
   
  }
  responseGoogleFail = (response) => {
    // console.log("responsegoogleFail",response);
  }
  twitterResponse = (response) => {
    // console.log("twitterresponse",response);
    response.json().then(user => {
        // console.log("r : ", user);
      
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
  const { first_name,last_name,email,password,cardAnimaton,firstnameState,lastnameState,emailState,passwordState } = this.state;
  const { classes } = this.props;
  const customHeader = {};
  customHeader['role'] = '1';
  customHeader['strategy'] = 'twitter';
  var loginUrl=API_URL+"/user/twitteradmin"
  var requestTokenUrl=API_URL+"/user/reverse"
  return (
    // <div className={classes.container}>
    //   <GridContainer justify="center">
    //     <GridItem xs={12} sm={12} md={10}>
    //       <Card className={classes.cardSignup}>
    //         <h2 className={classes.cardTitle}>Register</h2>
    //         <CardBody>
    //           <GridContainer justify="center">
    //             <GridItem xs={12} sm={12} md={5}>
    //               <InfoArea
    //                 title="Marketing"
    //                 description="We've created the marketing campaign of the website. It was a very interesting collaboration."
    //                 icon={Timeline}
    //                 iconColor="rose"
    //               />
    //               <InfoArea
    //                 title="Fully Coded in HTML5"
    //                 description="We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
    //                 icon={Code}
    //                 iconColor="primary"
    //               />
    //               <InfoArea
    //                 title="Built Audience"
    //                 description="There is also a Fully Customizable CMS Admin Dashboard for this product."
    //                 icon={Group}
    //                 iconColor="info"
    //               />
    //             </GridItem>
    //             <GridItem xs={12} sm={8} md={5}>
    //             <form className={classes.form} onSubmit={(e)=>this.onSubmit(e,{first_name,last_name,email,password})} method="POST">
                 
                   
    //                       <CustomInput
    //                           success={firstnameState === "success"}
    //                           error={firstnameState === "error"}
    //                           labelText="First Name"
    //                           id="first_name"
    //                           formControlProps={{
    //                             fullWidth: true
    //                           }}                  
    //                           inputProps={{
    //                             endAdornment: (
    //                               <InputAdornment position="end">
    //                                 <Icon className={classes.inputAdornmentIcon}>
    //                                   face
    //                                 </Icon>
    //                               </InputAdornment>
    //                             ),
    //                             type: "text",
    //                             autoComplete: "off",
    //                             onChange:((e)=>{
    //                               if(this.verifyLength(e.target.value,3)){
    //                                 this.setfirstnameState("success");
    //                               }else{
    //                                 this.setfirstnameState("error");
    //                               }
    //                               this.setfirstname(e.target.value)
    //                               })
    //                           }}
    //                         />
    //                         <CustomInput
    //                           success={lastnameState === "success"}
    //                           error={lastnameState === "error"}
    //                           labelText="Last Name"
    //                           id="last_name"
    //                           formControlProps={{
    //                             fullWidth: true
    //                           }}                  
    //                           inputProps={{
    //                             endAdornment: (
    //                               <InputAdornment position="end">
    //                                 <Icon className={classes.inputAdornmentIcon}>
    //                                   face
    //                                 </Icon>
    //                               </InputAdornment>
    //                             ),
    //                             type: "text",
    //                             autoComplete: "off",
    //                             onChange:((e)=>{
    //                               if(this.verifyLength(e.target.value,3)){
    //                                 this.setlastnameState("success");
    //                               }else{
    //                                 this.setlastnameState("error");
    //                               }
    //                               this.setlastname(e.target.value)
    //                               })
    //                           }}
    //                         />
    //                         <CustomInput
    //                           success={emailState === "success"}
    //                           error={emailState === "error"}
    //                           labelText="Email..."
    //                           id="email"
    //                           formControlProps={{
    //                             fullWidth: true
    //                           }}                  
    //                           inputProps={{
    //                             endAdornment: (
    //                               <InputAdornment position="end">
    //                                 <Email className={classes.inputAdornmentIcon} />
    //                               </InputAdornment>
    //                             ),
    //                             onChange:((e)=>{
    //                                 if(this.verifyEmail(e.target.value)){
    //                                   this.setemailState("success");
    //                                 }else{
    //                                   this.setemailState("error");
    //                                 }
    //                                 this.setemail(e.target.value)
    //                               })
    //                           }}
    //                         />
    //                         <CustomInput
    //                           success={passwordState === "success"}
    //                           error={passwordState === "error"}
    //                           labelText="Password"
    //                           id="password"
    //                           formControlProps={{
    //                             fullWidth: true
    //                           }}                  
    //                           inputProps={{
    //                             endAdornment: (
    //                               <InputAdornment position="end">
    //                                 <Icon className={classes.inputAdornmentIcon}>
    //                                   lock_outline
    //                                 </Icon>
    //                               </InputAdornment>
    //                             ),
    //                             type: "password",
    //                             autoComplete: "off",
    //                             onChange:((e)=>{
    //                               if(this.verifyLength(e.target.value,1)){
    //                                 this.setpasswordState("success");
    //                               }else{
    //                                 this.setpasswordState("error");
    //                               }
    //                               this.setpassword(e.target.value)
    //                               })
    //                           }}
    //                         />
                           
                         
                          
    //                         <div className={classes.center}>
    //                           <Button  type="submit"  round color="primary">
    //                             Get started
    //                           </Button>
    //                         </div>

                           
                         
    //                   </form>
    //                   <div className={classes.center}>
    //                     <FacebookLogin
    //                       appId={config.FACEBOOK_APP_ID}
    //                       autoLoad={false}
    //                       fields="name,email"
    //                       callback={this.facebookResponse}
    //                       cssClass=""
    //                       textButton={false}
    //                       icon={<Button justIcon round color="facebook">
    //                       <i className="fab fa-facebook-f" />
    //                     </Button>}
    //                       />
    //                       {` `}
    //                       <GoogleLogin
    //                         clientId={config.GOOGLE_CLIENT_ID}
    //                         buttonText=""
    //                         onSuccess={this.responseGoogle}
    //                         onFailure={this.responseGoogleFail}
    //                         cookiePolicy={'single_host_origin'}
    //                         icon={false}
    //                         cssClass=""
    //                       >
    //                       {` `}
    //                       <Button justIcon round color="google">
    //                         <i className={"fab fa-google"} />
    //                       </Button>
    //                       </GoogleLogin>
    //                       <TwitterLogin 
    //                         loginUrl={loginUrl}
    //                         onFailure={this.twitterResponseFail} 
    //                         onSuccess={this.twitterResponse}
    //                         requestTokenUrl={requestTokenUrl}
    //                         customHeaders={customHeader}
    //                         showIcon={true}
    //                       >
    //                       <Button justIcon round color="twitter">
    //                         <i className={"fab fa-twitter"} />
    //                       </Button>
    //                     </TwitterLogin>    

                        
    //                   </div>  
    //                   <p className={classes.listItemText}>
    //                     Already have a account?
    //                     <NavLink to={"/auth/login"} className={classes.navLink}>
    //                     <ListItemText
    //                       primary={"Sign In"}
    //                       disableTypography={true}
    //                       className={classes.listItemText}
    //                     />
    //                   </NavLink></p>
                     
    //             </GridItem>
    //             </GridContainer>
    //         </CardBody> 
    //       </Card>
    //     </GridItem>

    //   </GridContainer>
        
    //   <Snackbar
    //     place="tr"
    //     color={(this.props.loginerror)?"danger":"info"}
    //     icon={AddAlert}
    //     message={`${this.props.notification_message}`}
    //     open={this.props.shownotification}
    //     closeNotification={() =>{
    //        this.setNotify(false);           
    //       }}
    //     close
    //   />
    // </div>
    <div className={classes.container}>
      <GridContainer justify="center" alignItems="center" spacing={10}>
        <GridItem lg={7} sm={6} className={classes.textCenter}>
          <h2 className={classes.logLeftContentH2}>
            Get Matched With Your Dream Job
          </h2>
          <p className={classes.logLeftContentP}>
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
        </GridItem>
        <Hidden mdDown>
          <GridItem lg={1}></GridItem>
        </Hidden>

        <GridItem xs={12} sm={6} lg={4}>
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
              <CardBody className={classes.bodyPadding}>                
              <CustomInput
                  success={emailState === "success"}
                  error={emailState === "error"}
                  labelText="Email..."
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}                  
                  inputProps={{                  
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
                      label="Remember me."
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
                  <GridItem className={classes.textCenter} md={12}>
                     Don't have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className={classes.forgotLink}                    
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

RegisterPage.propTypes = {
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
const mapDispatchToProps = { registerUser,resetNotification,socialloginUser };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterPage));