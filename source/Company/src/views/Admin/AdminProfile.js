import React from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// @material-ui/icons
import PermIdentity from "@material-ui/icons/PermIdentity";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardAvatar from "components/Card/CardAvatar.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

import styles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.js";

import avatar from "assets/img/faces/marc.jpg";
import { connect } from "react-redux";
import { editAdminProfile } from '../../redux/action'

const useStyles = makeStyles(styles);

class AdminProfile extends React.Component{
    constructor(props){
        super(props);
        this.editProfile = this.editProfile.bind(this);
        this.state = {
            firstName : "",
            firstNameState : "",
            lastName : "",
            lastNameState : "",
            state : "",
            stateState : "",
            email: "",
            emailState : "",
            city : "",
            cityState : "",
            zipcode: "",
            zipcodeState : "",
            phone : "",
            phoneState : "",
            profilePic : "",
            profilePicState : ""
        }
    }
    componentDidMount(){        
        this.setState({     
            user_id:(this.props.user)?(this.props.user['user_id']?this.props.user['user_id']:""):"",
            firstName : (this.props.user)?(this.props.user['first_name']?this.props.user['first_name']:""):"",            
            lastName : (this.props.user)?(this.props.user['last_name']?this.props.user['last_name']:""):"",            
            email : (this.props.user)?(this.props.user['email']?this.props.user['email']:""):"",
            profilePic : (this.props.user)?(this.props.user['profile_pic']?this.props.user['profile_pic']:""):"",
            phone: (this.props.user)?(this.props.user['phone']?this.props.user['phone']:""):"",            
            city : (this.props.user)?(this.props.user['city']?this.props.user['city']:""):"",
            state : (this.props.user)?(this.props.user['state']?this.props.user['state']:""):""
        })
    }
    verifyString(val,len=1){
        if(val.trim().length >= len){
            return true;
        }
        return false;
    }
    verifyPhone(val,len=1){
        console.log("phone:",isNaN(val.trim()));
        
        if(val.trim().length >= len && (!isNaN(val.trim()))){
            return true
        }
        return false;
    }
    verifyEmail(val){
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(val)) {
          return true;
        }
        return false;
      }
    setfirstName(val=""){
        this.setState({firstName:val})
    }
    setfirstNameState(val=""){
        this.setState({firstNameState:val})
    }
    setlastName(val=""){
        this.setState({lastName:val})
    }
    setlastNameState(val=""){
        this.setState({lastNameState:val})
    }
    setstate(val=""){
        this.setState({state:val})
    }
    setstateState(val=""){
        this.setState({stateState:val})
    }
    setemail(val=""){
        this.setState({email:val})
    }
    setemailState(val=""){
        this.setState({emailState:val})
    }
    setcity(val=""){
        this.setState({city:val})
    }
    setcityState(val=""){
        this.setState({cityState:val})
    }
    setzipcode(val=""){
        this.setState({zipcode:val})
    }
    setzipcodeState(val=""){
        this.setState({zipcodeState:val})
    }
    setprofilePic(val=""){
        this.setState({profilePic:val})
    }
    setprofilePicState(val=""){
        this.setState({profilePicState:val})
    }
    setphone(val=""){
        this.setState({phone:val})
    }
    setphoneState(val=""){
        this.setState({phoneState:val})
    }
    editProfile(){
        if(this.verifyString(this.state.firstName,2)){
            this.setfirstNameState("error");
        } 
        if(this.verifyString(this.state.lastName,2)){
            this.setlastNameState("error");
        }
        if(this.verifyPhone(this.state.phone,8)){
            this.setphoneState("error");
        }
        if(this.verifyString(this.state.firstName,2) && this.verifyString(this.state.lastName,2)&&this.verifyPhone(this.state.phone,8)){
            let temp_obj = this.state;
            temp_obj.admin_id = this.state.user_id;
            this.props.editAdminProfile(this.state,this.props.history);
            this.setfirstNameState();
            this.setlastNameState();
            this.setphoneState();
        }
    }
    render(){
        const { classes } = this.props;
        return(
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                <Card>
                    <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                        <PermIdentity />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                        Edit Profile
                    </h4>
                    </CardHeader>
                    <CardBody>
                    <GridContainer>                        
                        <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            success={this.state.emailState === "success"}
                            error={this.state.emailState === "error"}
                            labelText="Email address"
                            id="email-address"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setemailState("success");
                                } else {
                                    this.setemailState("error");
                                }
                                this.setemail(event.target.value);
                            },
                            value: this.state.email,
                            type: "email",
                            disabled:true
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            success={this.state.phoneState === "success"}
                            error={this.state.phoneState === "error"}
                            labelText="Phone *"
                            id="phone"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyPhone(event.target.value,8)) {
                                    this.setphoneState("success");
                                } else {
                                    this.setphoneState("error");
                                }
                                this.setphone(event.target.value);
                            },
                            value: this.state.phone,
                            type: "text"
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            success={this.state.firstNameState === "success"}
                            error={this.state.firstNameState === "error"}
                            labelText="First Name"
                            id="first-name"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setfirstNameState("success");
                                } else {
                                    this.setfirstNameState("error");
                                }
                                this.setfirstName(event.target.value);
                            },
                            value: this.state.firstName,
                            type: "text"
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            success={this.state.lastNameState === "success"}
                            error={this.state.lastNameState === "error"}
                            labelText="Last Name"
                            id="last-name"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setlastNameState("success");
                                } else {
                                    this.setlastNameState("error");
                                }
                                this.setlastName(event.target.value);
                            },
                            value: this.state.lastName,
                            type: "text"
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            success={this.state.cityState === "success"}
                            error={this.state.cityState === "error"}
                            labelText="City"
                            id="city"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setcityState("success");
                                } else {
                                    this.setcityState("error");
                                }
                                this.setcity(event.target.value);
                            },
                            value: this.state.city,
                            type: "text"
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            success={this.state.stateState === "success"}
                            error={this.state.emailState === "error"}
                            labelText="State"
                            id="state"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setstateState("success");
                                } else {
                                    this.setstateState("error");
                                }
                                this.setstate(event.target.value);
                            },
                            value: this.state.state,
                            type: "text"
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            success={this.state.zipcodeState === "success"}
                            error={this.state.zipcodeState === "error"}
                            labelText="Postal Code"
                            id="postal-code"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setzipcodeState("success");
                                } else {
                                    this.setzipcodeState("error");
                                }
                                this.setzipcode(event.target.value);
                            },
                            value: this.state.zipcode,
                            type: "text"
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    {/* <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                        <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                        <CustomInput
                            labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                            id="about-me"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            multiline: true,
                            rows: 5
                            }}
                        />
                        </GridItem>
                    </GridContainer> */}
                    <Button color="rose" className={classes.updateProfileButton} onClick={this.editProfile}>
                        Update Profile
                    </Button>
                    <Clearfix />
                    </CardBody>
                </Card>
                </GridItem>
                <Snackbar
                    place="tr"
                    color={(this.props.loginerror)?"danger":"info"}
                    icon={AddAlert}
                    message={`${this.props.notification_message}`}
                    open={this.props.shownotification}
                    closeNotification={() =>{
                                
                        }}
                    close
                />
            </GridContainer>
        )
    }
}
const mapStateToProps = state => {
    console.log("IN PROPS:",state);
    
    return {
        user : state.authReducer.user,
        shownotification: state.authReducer.shownotification,
        loginerror : state.authReducer.loginerror,    
        notification_message:state.authReducer.notification_message
    }
}
const mapDispatchToProps = {
    editAdminProfile
}
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(AdminProfile))

// export default function AdminProfile() {
//   const classes = useStyles();
//   return (
//     <div>
//       <GridContainer>
//         <GridItem xs={12} sm={12} md={8}>
//           <Card>
//             <CardHeader color="rose" icon>
//               <CardIcon color="rose">
//                 <PermIdentity />
//               </CardIcon>
//               <h4 className={classes.cardIconTitle}>
//                 Edit Profile - <small>Complete your profile</small>
//               </h4>
//             </CardHeader>
//             <CardBody>
//               <GridContainer>
//                 <GridItem xs={12} sm={12} md={5}>
//                   <CustomInput
//                     labelText="Company (disabled)"
//                     id="company-disabled"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                     inputProps={{
//                       disabled: true
//                     }}
//                   />
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={3}>
//                   <CustomInput
//                     labelText="Username"
//                     id="username"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={4}>
//                   <CustomInput
//                     labelText="Email address"
//                     id="email-address"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//               </GridContainer>
//               <GridContainer>
//                 <GridItem xs={12} sm={12} md={6}>
//                   <CustomInput
//                     labelText="First Name"
//                     id="first-name"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={6}>
//                   <CustomInput
//                     labelText="Last Name"
//                     id="last-name"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//               </GridContainer>
//               <GridContainer>
//                 <GridItem xs={12} sm={12} md={4}>
//                   <CustomInput
//                     labelText="City"
//                     id="city"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={4}>
//                   <CustomInput
//                     labelText="Country"
//                     id="country"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={4}>
//                   <CustomInput
//                     labelText="Postal Code"
//                     id="postal-code"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                   />
//                 </GridItem>
//               </GridContainer>
//               <GridContainer>
//                 <GridItem xs={12} sm={12} md={12}>
//                   <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
//                   <CustomInput
//                     labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
//                     id="about-me"
//                     formControlProps={{
//                       fullWidth: true
//                     }}
//                     inputProps={{
//                       multiline: true,
//                       rows: 5
//                     }}
//                   />
//                 </GridItem>
//               </GridContainer>
//               <Button color="rose" className={classes.updateProfileButton}>
//                 Update Profile
//               </Button>
//               <Clearfix />
//             </CardBody>
//           </Card>
//         </GridItem>
//       </GridContainer>
//     </div>
//   );
// }
