import React , { Component } from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// material ui icons
import Contacts from "@material-ui/icons/Contacts";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Select from 'react-select';

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import { addUser,editUser } from '../../redux/action'
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";


class UserAddEdit extends Component{
    constructor(props){
        super(props);
        this.addUser = this.addUser.bind(this);
        this.state = {
            isEditPage : false,
            firstName : "",
            firstNameState: "",
            lastName : "",
            lastNameState: "",
            email : "",
            emailState: "",
            phone: "",
            phoneState: "",
            password: "",
            passwordState: "",
            user_id : 0,
            alert : null
        }
    }
    componentDidMount(){
        // console.log("IN MOUNT:",this.props.location)
        let pathcheck = this.props.location.pathname.split('/');
        let path = pathcheck[pathcheck.length-1];
        let isEdit = path === "edit"
        this.setState({
            users: (this.props.edit_user_obj)?this.props.users:[],
            isEditPage : (this.props.edit_user_obj && isEdit)?true:false,
            firstName : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['first_name']?this.props.edit_user_obj['first_name']:""):"",            
            lastName : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['last_name']?this.props.edit_user_obj['last_name']:""):"",            
            email : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['email']?this.props.edit_user_obj['email']:""):"",        
            phone: (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['phone']?this.props.edit_user_obj['phone']:""):"",            
            user_id : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['id']?this.props.edit_user_obj['id']:0):0, 

        })
    }
    // static getDerivedStateFromProps(props, state) {    
    //     console.log("props cattt",props);
    //     // console.log("props state cattt",state);      
    //       return {        
    //         users: (props.edit_user_obj)?props.users:[],
    //         isEditPage : (props.edit_user_obj)?true:false,
    //         firstName : (props.edit_user_obj)?(props.edit_user_obj['first_name']?props.edit_user_obj['first_name']:""):"",            
    //         lastName : (props.edit_user_obj)?(props.edit_user_obj['last_name']?props.edit_user_obj['last_name']:""):"",            
    //         email : (props.edit_user_obj)?(props.edit_user_obj['email']?props.edit_user_obj['email']:""):"",        
    //         phone: (props.edit_user_obj)?(props.edit_user_obj['phone']?props.edit_user_obj['phone']:""):"",            
    //         user_id : (props.edit_user_obj)?(props.edit_user_obj['id']?props.edit_user_obj['id']:0):0,          
    //       };        
    //   }
    setAlert(val=null){
        this.setState({alert:val})
    }
    verifyString(val,len=1){
        console.log('val',val,len);
        
        if(val.trim().length >= len){
            return true
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

    setemail(val=""){
        this.setState({email:val})
    }
    setemailState(val=""){
        this.setState({emailState:val})
    }
    verifyEmail(val){
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(val)) {
          return true;
        }
        return false;
      }

    setphone(val=""){
        this.setState({phone:val})
    }
    setphoneState(val=""){
        this.setState({phoneState:val})
    }

    setpassword(val=""){
        this.setState({password:val})
    }
    setpasswordState(val=""){
        this.setState({passwordState:val})
    }

    addUser(){
        console.log("State:0",this.state);
        console.log('first',this.verifyString(this.state.firstName,2) ,'last', this.verifyString(this.state.lastName,2) ,'phone',this.verifyString(this.state.phone,8) ,'email', this.verifyEmail(this.state.email) ,'pass', (this.verifyString(this.state.password,8) && (!this.state.isEditPage)));
        
        if(this.verifyString(this.state.firstName,2)){
            this.setfirstNameState("error");
        }
        if(this.verifyString(this.state.lastName,2)){
            this.setlastNameState("error");
        }
        if(this.verifyString(this.state.phone,8)){
            this.setphoneState("error");
        }
        if(this.verifyEmail(this.state.email)){
            this.setemailState("error");
        }
        if(this.state.isEditPage){
            if(this.verifyString(this.state.password,8)){
                this.setpasswordState("error");
            }
        }
        // && (this.verifyString(this.state.password,8) && (!this.state.isEditPage))
        if(this.verifyString(this.state.firstName,2) && this.verifyString(this.state.lastName,2) && this.verifyString(this.state.phone,8) && this.verifyEmail(this.state.email)){
            let admin_id = this.props.user.user_id
            let user = {
                admin_id,
                'id':this.state.user_id,
                'first_name':this.state.firstName,
                'last_name':this.state.lastName,
                'phone':this.state.phone,
                'email':this.state.email,
                'password':this.state.password
            }
            console.log("USER OBJECT:",user);
            
            if(this.state.isEditPage === true){
                
                this.props.editUser(user,this.props.history);
            }else{
                this.props.addUser(user,this.props.history);
                this.setState({
                    isEditPage : false,
                    firstName : "",
                    firstNameState: "",
                    lastName : "",
                    lastNameState: "",
                    email : "",
                    emailState: "",
                    phone: "",
                    phoneState: "",
                    password: null,
                    passwordState: ""
                })
            }
        }
    }
options = [
    { value: 'one', label: 'One' },
    { value: 'one', label: 'Two' }
  ];
       
logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
}
    render(){
        const { classes } = this.props;
        return(
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                    <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                        <Contacts />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>{(this.state.isEditPage===false)?"Add User":"Edit User"}</h4>
                    </CardHeader>
                    <CardBody>
                        <form>
                        <CustomInput
                            success={this.state.firstNameState === "success"}
                            error={this.state.firstNameState === "error"}
                            labelText="First Name*"
                            id="firstname"
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
                            type: "textarea"
                            }}
                        />
                        <CustomInput
                            success={this.state.lastNameState === "success"}
                            error={this.state.lastNameState === "error"}
                            labelText="Last Name*"
                            id="lastname"
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
                        <CustomInput
                            success={this.state.emailState === "success"}
                            error={this.state.emailState === "error"}
                            labelText="Email *"
                            id="email"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyEmail(event.target.value)) {
                                    this.setemailState("success");
                                } else {
                                    this.setemailState("error");
                                }
                                this.setemail(event.target.value);
                            },
                            value: this.state.email,
                            type: "email"
                            }}
                        />
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
                        {(this.state.isEditPage===false)?<CustomInput
                            success={this.state.passwordState === "success"}
                            error={this.state.passwordState === "error"}
                            labelText="Password *"
                            id="password"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,8)) {
                                    this.setpasswordState("success");
                                } else {
                                    this.setpasswordState("error");
                                }
                                this.setpassword(event.target.value);
                            },
                            value: this.state.password,
                            type: "password"
                            }}
                        />:null}
                        {/* <Select
                            name="form-field-name"
                            defaultValue={this.options}
                            isMulti
                            options={this.options}   
                            onChange={this.logChange}                     
                            /> */}
                        <div className={classes.formCategory}>
                            <small>*</small> Required fields
                        </div>
                        <div className={classes.center}>
                            <Button color="rose" onClick={this.addUser}>
                                {(this.state.isEditPage===false)?"Add User":"Edit User"}
                            </Button>
                            <Button color="default" onClick={()=>{ this.props.history.push('/admin/user-management/list') }}>
                                Cancel
                            </Button>
                        </div>
                        </form>
                    </CardBody>
                    </Card>
                </GridItem>
                <Snackbar
                    place="tr"
                    color={(this.props.user_error)?"danger":"info"}
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
    // console.log('in maptoprops:',state);
    
    return {
      user: state.authReducer.user,
      shownotification: state.userReducer.shownotification,
      user_error : state.userReducer.user_error,    
      edit_user_id : state.userReducer.edit_user_id,
      edit_user_obj : state.userReducer.edit_user_obj,
      total_user : state.userReducer.total_user,
      notification_message:state.userReducer.notification_message
    };
  };
  const mapDispatchToProps = { addUser,editUser };

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(UserAddEdit))