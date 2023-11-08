import React from "react";
// changesv1
// @material-ui/core components
import PropTypes from "prop-types";
import moment from "moment";
import Hidden from "@material-ui/core/Hidden";
import axios from "axios";
import { API_URL } from "constants/defaultValues.js"
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import Snackbar from "components/Snackbar/Snackbar.js";
import GridContainer from "components/Grid/GridContainer.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import * as Datetime from 'react-datetime';
import { logoutUser } from '../../redux/action'
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";


import customStyle from "assets/jss/customStyle";

// Importing for merging multiple jss styles
import combineStyles from '../../combineStyles';

import { Component } from "react";
import Link from "@material-ui/core/Link";
const useStyles = makeStyles(styles);

function createMarkup(data) {
  return {__html: data};
}


class Policy extends Component {
  constructor(props) {
    super(props);    
    this.state = {
        status : "0",
        title:'',
        content:''
    }
  }

  componentDidMount() {
    // console.log("Props:",this.props.location)
    let { match } = this.props;
    this.setContentpage({ type : 'companyprivacy'  })
   
    // localStorage.clear();
    let ths = this;    
  }  

  async setContentpage(params){
    let response = await this.setContentpageCall(params);
    if(response.status !== -2){
      if(response.status === false){
        this.props.history.push("/auth/login")
        toast.error(response.message)
      }else{
        //get content and display page
        this.setState({title:response.data.title,content:response.data.content})
        // console.log("resposne data",response)
      }
    }else{
      this.props.history.push("/auth/login")
      this.props.logoutUser(this.props.history)
    }
  }

  async setContentpageCall(params){
    const res = await axios.post(`${API_URL}/student/master/get-cms`,params)
    return res.data;
  }


  render() {
    // console.log("STate:",this.state,moment(this.state.custom_time_slot1))
    const { classes } = this.props;
    const { user } = this.props;
    // console.log('user',user )
    return (
     <div style={{"width":"100%"}}>
       {
          (user) ? 
          <div className="main-right-panel">
              <GridContainer>
                
                <GridItem xs={12}>
                  <h1> {this.state.title}</h1>
                  
                </GridItem>
              </GridContainer>
              <GridContainer spacing={10}>
                <GridItem xs={12} lg={12}>
      
                  <Card className="paddingTopBottom cardCustom">
                    <CardBody className="cardCustomBody">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.content
                            }}></div>
                          
                    </CardBody>
                  </Card>
                  </GridItem>
              </GridContainer>
            </div>
          :
         
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12}>          
                
                      <GridContainer justify="center" alignItems="center" spacing={10}>
                        <GridItem lg={12} md={12} sm={12} className={classes.textCenter}>
                          <h2 className={classes.logLeftContentH2}>
                            {this.state.title}
                          </h2>
                          <p className={classes.contentp} >
                          
                          <div
                            dangerouslySetInnerHTML={{
                              __html: this.state.content
                            }}></div>
                          </p>                                
                        </GridItem>
                        <Hidden lgDown>
                          <GridItem lg={1}></GridItem>
                        </Hidden>
                    </GridContainer> 
                      
                                
                </GridItem>
              </GridContainer>        
            </div>
         
       }
     </div>
       
     
     
    );
  }
}

Policy.propTypes = {
  classes: PropTypes.object
};

// const mapStateToProps = state => ({ 
//   user: state.user,
//   shownotification: state.shownotification,
//   loginerror : state.loginerror,    
//   notification_message:state.notification_message
//  });

const mapStateToProps = state => {
  // console.log('in maptoprops:',state);

  return {
    user: state.authReducer.user,
    shownotification: state.authReducer.shownotification,
    loginerror: state.authReducer.loginerror,
    notification_message: state.authReducer.notification_message
  };
};
const mapDispatchToProps = { logoutUser };
const combinedStyles = combineStyles(customStyle, styles,customSelect);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(Policy));
