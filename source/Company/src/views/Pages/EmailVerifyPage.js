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
import { resetpasswordUser,resetNotification,verifyEmail } from '../../redux/action'
import { Component } from "react";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { toast } from "react-toastify";


class EmailVerifyPage extends React.Component {
  constructor(props) {
    super(props);
    var passwordtoken = this.props.location.pathname.split("/")
    console.log("idarray",passwordtoken[3])
    this.redirectTologin = this.redirectTologin.bind(this);
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
  
  redirectTologin(){
    this.props.history.push('/auth/login')
  }
  
  componentDidMount(){  
    var tokendata = {"token":this.state.token}
    this.props.verifyEmail(tokendata,this.props.history);  
    let ths = this;
    setTimeout(function() {
      ths.setCardAnimation("");
    }, 700);
  }

  setCardAnimation(val=""){
    this.setState({cardAnimaton: val})
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login >
              <CardHeader className={`${classes.cardHeader} ${classes.logCardHeader} ${classes.textCenter}`} >
                  <h4 justify="center" className={classes.logCardHeaderTitle}>
                    Verifying email...
                  </h4>                  
              </CardHeader>             
              <CardBody>
                                              
              </CardBody>
              <CardFooter className={classes.bodyPadding}>
                <GridContainer>                          
                    <GridItem sm={12} className={classes.textCenter}>
                    <Button className={`${classes.logButton} ${classes.mb30}`} onClick={()=>{this.redirectTologin()}} color="info" size="md" block>
                        Back to Login
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


EmailVerifyPage.propTypes = {
  classes: PropTypes.object
};



const mapDispatchToProps = { resetpasswordUser,resetNotification,verifyEmail };

export default connect(null, mapDispatchToProps)(withStyles(styles)(EmailVerifyPage));