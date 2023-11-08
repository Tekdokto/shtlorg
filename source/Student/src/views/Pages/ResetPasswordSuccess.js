import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

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
    this.redirectTologin = this.redirectTologin.bind(this);
    // console.log("idarray",passwordtoken[3])
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.state = {
      cardAnimaton : "cardHidden"
    }
  }
  redirectTologin(){
      this.props.history.push('/auth/login')
  }
  setCardAnimation(val=''){
      this.setState({
        cardAnimaton :val
      })
  }
  
  componentDidMount(){  
    let ths = this;
    setTimeout(function() {
      ths.setCardAnimation("");
    }, 700);
  } 
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={6}>
          <form >
            <Card login >
              <CardHeader className={`${classes.cardHeader} ${classes.logCardHeader} ${classes.textCenter}`} >
                  <h4 justify="center" className={classes.logCardHeaderTitle}>
                    Password Reset Successful!
                  </h4>
                  <h5>
                    You can now use your new password to log in to your account!
                  </h5>
              </CardHeader>             
              <CardBody>
                                             
              </CardBody>
              <CardFooter className={classes.bodyPadding}>
                <GridContainer>                          
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button className={`${classes.logButton} ${classes.mb30}`} onClick={()=>{this.redirectTologin()}} color="info" size="md" block>
                        Login
                      </Button>
                    </GridItem>
                  </GridContainer>                
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
       
    </div>
    );
  }
}


ResetPasswordPage.propTypes = {
  classes: PropTypes.object
};


export default withStyles(styles)(ResetPasswordPage);