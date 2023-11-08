import React , { Component } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";

// material ui icons
import MailOutline from "@material-ui/icons/MailOutline";
import Contacts from "@material-ui/icons/Contacts";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";


class UserAddEdit extends Component{
    constructor(props){
        super(props);
        this.addUser = this.addUser.bind(this);
        this.state = {
            firstName : "",
            firstNameState: "",
            lastName : "",
            lastNameState: "",
            email : "",
            emailState: "",
            address: "",
            addressState: "",
            phone: null,
            phoneState: ""
        }
    }
    verifyString(val,len=1){
        if(val.trim().length >= len){
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

    setaddress(val=""){
        this.setState({address:val})
    }
    setaddressState(val=""){
        this.setState({addressState:val})
    }

    setphone(val=""){
        this.setState({phone:val})
    }
    setphoneState(val=""){
        this.setState({phoneState:val})
    }

    addUser(){
        if(this.verifyString(this.state.firstName,2)){
            this.setfirstNameState("error");
        }
        if(this.verifyString(this.state.lastName,2)){
            this.setlastNameState("error");
        }
        if(this.verifyString(this.state.address,8)){
            this.setaddressState("error");
        }
        if(this.verifyEmail(this.state.email)){
            this.setaddressState("error");
        }
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
                        <h4 className={classes.cardIconTitle}>Add User</h4>
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
                            type: "text"
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
                            type: "email"
                            }}
                        />
                        <CustomInput
                            success={this.state.addressState === "success"}
                            error={this.state.addressState === "error"}
                            labelText="Address *"
                            id="address"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,10)) {
                                    this.setaddressState("success");
                                } else {
                                    this.setaddressState("error");
                                }
                                this.setaddress(event.target.value);
                            },
                            type: "textarea"
                            }}
                        />
                        <div className={classes.formCategory}>
                            <small>*</small> Required fields
                        </div>
                        <div className={classes.center}>
                            <Button color="rose" onClick={this.addUser}>
                                Add User
                            </Button>
                        </div>
                        </form>
                    </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        )
    }
}

export default withStyles(styles)(UserAddEdit)