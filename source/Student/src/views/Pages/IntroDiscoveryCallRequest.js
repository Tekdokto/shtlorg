import React from "react";
// changesv1
// @material-ui/core components
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import Hidden from "@material-ui/core/Hidden";
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




class IntroDiscoveryCallRequest extends Component {
  constructor(props) {
    super(props);
    this.setCardAnimation = this.setCardAnimation.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.state = {
      declined : false,
      details : null,
      custom_time_slots : [],
      user_id : "",
      type : false,// 0 - predefined , 1 - custom
      id : "",
      email: "",
      emailState: "",
      on_date : moment().add(1,'days').format("YYYY-MM-DD"),
      timeslot1 : "",
      custom_select : false,
      custom_time_slot1 : "",
      custom_time_slot2 : "",
      custom_time_slot3 : "",
      cardAnimaton: "cardHidden",
      notification: false,

    }
  }

  async verifyAndFetchDetail(params){
    let response = await this.callToVerifyDetails(params);
    // console.log("verified Data:",response)
    if(response.status !== -2){
      if(response.status === false){
        this.props.history.push("/auth/login")
        toast.error(response.message)
      }else{
        // Set state
        this.setState({
          details : response.data,
          custom_time_slots : (response.data)?(response.data.company_timeslot.length > 0?response.data.company_timeslot[0]:null):null
        })
      }
    }else{
      this.props.history.push("/auth/login")
      this.props.logoutUser(this.props.history)
    }
  }

  async callToVerifyDetails(params){
    const res = await axios.post(`${API_URL}/student/check_intro_discovery_call_request`,params);
    return await res.data; 
  }

  componentDidMount() {
    // console.log("Props:",this.props.location)
    let { match } = this.props;
    if(match.params.id){
      this.setState({ id : match.params.id  })
      // console.log("Match:",match.params)
      if(match.params.declined && (match.params.declined === 0 || match.params.declined === '0')){
        this.setState({
          declined : true
        })
      }else{
        this.verifyAndFetchDetail({ id : match.params.id})
      }
    }else{
      this.props.history.push("/auth/login")
      toast.error("Oops! Request may be not available,.")
    }
    // localStorage.clear();
    let ths = this;
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
  }
  setNotify(val = true) {
    console.log('in set notification', val);

    this.setState({ notification: val })
    let ths = this;
    setTimeout(() => {
      ths.setState({ notification: false })
    }, 2000)    
  }

  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  };
  verifyEmail(val) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }
  setemailState(val = "") {
    this.setState({ emailState: val })
  }
  setCardAnimation(val = "") {
    this.setState({ cardAnimaton: val })
  }
  setemail(val = "") {
    this.setState({ email: val })
  }
// handle date change
  handleChange = (newDate) => {
    // console.log("newDate", moment(newDate).format("YYYY-MM-DD"),moment(newDate).diff(moment(),'hours'));
    if(newDate && moment(newDate).format("YYYY-MM-DD") !== "Invalid date" && moment(newDate).diff(moment(),'hours') > 2){
      return this.setState({on_date: moment(newDate).format("YYYY-MM-DD")});
    }else{
      this.setState({on_date:null });
    }
  }

  isValidDate(currentDate){
    if(moment(currentDate).diff(moment(),'hours') > 2){
      return true;
    }else{
      return false;
    }
  }

// handle time slot selected 

  settimeslot1Select(val){
    this.setState({
      timeslot1 : val
    })
  } 

  handletimeslot1Select = (event) => {
    console.log("EVENTT:",event)
    this.settimeslot1Select(event);
  };

// handle custom time slot

  handleCustomTimeSlot(index,val){
    // console.log("index : ",val,moment(val).format("hh:mm A") === "Invalid date",index)
    if(val && val !== "" && moment(val).format("hh:mm A") !== "Invalid date"){
    if(index === 1){
      this.setState({
        custom_time_slot1 : `${moment(val).format("hh:mm A")}`
      })
    }else if(index === 2){
      this.setState({
        custom_time_slot2 : `${moment(val).format("hh:mm A")}`
      })
    }else if(index === 3){
      this.setState({
        custom_time_slot3 : `${moment(val).format("hh:mm A")}`
      })
    }  
    }  
  }

  handleTypeChange(event){
    // console.log("EVENT",event.target.name,event.target.checked)  
    this.setState({
      [event.target.name] : event.target.checked,
      custom_time_slot1 : (!event.target.checked)?"":this.state.custom_time_slot1,
      custom_time_slot2 : (!event.target.checked)?"":this.state.custom_time_slot2,
      custom_time_slot3 : (!event.target.checked)?"":this.state.custom_time_slot3,
      timeslot1 : (event.target.checked)?"":this.state.timeslot1
    })
  }
  onSubmit(e) {
    console.log('Test', this.state);
    if(this.state.type){
      if(this.state.custom_time_slot1 && this.state.custom_time_slot2 && this.state.custom_time_slot3
          && this.state.custom_time_slot1 !== "" && this.state.custom_time_slot2 !== "" && this.state.custom_time_slot3 !== ""){
            if(this.state.on_date && this.state.on_date !== ""){
              let temp_obj = {}
              // temp_obj.user_id = this.state.;
              if((this.state.custom_time_slot1 ===  this.state.custom_time_slot2 === this.state.custom_time_slot3)||(this.state.custom_time_slot1 ===  this.state.custom_time_slot2)||(this.state.custom_time_slot2 === this.state.custom_time_slot3)||(this.state.custom_time_slot1 === this.state.custom_time_slot3)){
                toast.error("Please select all different time slots")    
              }else{
              temp_obj.id = this.state.id;
              temp_obj.type = (this.state.type)?'1':'0';
              temp_obj.on_date = this.state.on_date;
              temp_obj.timeslot1 = this.state.custom_time_slot1;
              temp_obj.timeslot2 = this.state.custom_time_slot2;
              temp_obj.timeslot3 = this.state.custom_time_slot3;
              this.setIntroDiscovery(temp_obj);
              }
            }else{
              toast.error("Please select valid date.")
            }
      }else{
        toast.error("Please select all three prefer time slot.")
      }
    }else{
      if(this.state.timeslot1 && this.state.timeslot1 != ""){
        if(this.state.on_date && this.state.on_date !== ""){
          let temp_obj = {}
              temp_obj.user_id = this.state.custom_time_slot1;
              temp_obj.id = this.state.id;
              temp_obj.type = (this.state.type)?'1':'0';
              temp_obj.on_date = this.state.on_date;
              temp_obj.timeslot1 = this.state.timeslot1;
              temp_obj.timeslot2 = "";
              temp_obj.timeslot3 = "";
              this.setIntroDiscovery(temp_obj);
        }else{
          toast.error("Please select valid date.")
        }
      }else{
        toast.error("Please select time slot.")
      }
    }
    
    e.preventDefault();
  }
  // componentWillReceiveProps(){
  //   console.log("received props",this.props);

  // }
  async setIntroDiscovery(params){
    let response = await this.setIntroDiscoveryCall(params);
    if(response.status !== -2){
      if(response.status === false){
        this.props.history.push("/auth/login")
        toast.error(response.message)
      }else{
        this.props.history.push("/auth/login")
        toast.success(response.message)
      }
    }else{
      console.log("6")
      this.props.history.push("/auth/login")
      this.props.logoutUser(this.props.history)
    }
  }

  async setIntroDiscoveryCall(params){
    const res = await axios.post(`${API_URL}/student/set_intro_discovery_call_timeslot`,params)
    return res.data;
  }


  render() {
    // console.log("STate:",this.state,moment(this.state.custom_time_slot1))
    const { email, cardAnimaton, emailState } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12}>
            <form>
              {(!this.state.declined)?<Card login className={classes[cardAnimaton]}>
                <CardHeader className={`${classes.cardHeader} ${classes.logCardHeader} ${classes.textCenter} ${classes.px50}`}>
                  {(this.state.details)?((this.state.details.company_name)?<h4 justify="center" className={`${classes.logCardHeaderTitle} ${classes.pt30}`}>
                    Interview Requests from {this.state.details.company_name}
                  </h4>:null):null}
                  <h4 justify="center" className={`${classes.logCardHeaderTitle} ${classes.pt30}`}>
                    Intro Discovery Request for {(this.state.details)?((this.state.details.role_title)?this.state.details.role_title:"Watchlist"):"Watchlist"}
                  </h4>
                </CardHeader>
                <CardBody className={classes.px50+' '+classes.my50}>
                <Grid container justify="center">
                  <Grid xs="8" md="2" className="date-time">
                  <FormControl component="fieldset" fullWidth>
                  <FormLabel className="label-radio">Select Interview Date</FormLabel>
                    <Datetime
                      defaultValue={moment(this.state.on_date)}
                      isValidDate={this.isValidDate}
                      dateFormat="MM/DD/YYYY"
                      inputProps={{                           
                            id: "interview_date",
                            placeholder : "Interview Date"
                      }}
                      timeFormat={false}
                      closeOnSelect={true}
                      onChange={this.handleChange}                    
                    />
                    </FormControl>
                    {/* <CustomInput
                      success={emailState === "success"}
                      error={emailState === "error"}
                      labelText="Set Date"
                      id="date"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "Select date for intro.",
                        type : "date",
                        value : this.state.on_date,
                        onChange: ((e) => {
                          if (this.verifyEmail(e.target.value)) {
                            this.setemailState("success");
                          } else {
                            this.setemailState("error");
                          }
                          this.setemail(e.target.value)
                        })
                      }}
                    /> */}
                  </Grid>
                  <Grid xs="8" md="6"> 
                  <GridContainer justify="center">
                    <Grid xs="12" className={classes.ml30}>
                        {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot1)?<Button
                        color="info"
                        size="lg"
                        className={(this.state.custom_time_slots.time_slot1 === this.state.timeslot1)?`${classes.blockButton} ${classes.mr15}`:`${classes.outlineButton} ${classes.mt10} ${classes.mr30}`}
                        disabled={(this.state.type)?true:false}
                        onClick={()=>this.handletimeslot1Select(this.state.custom_time_slots.time_slot1)}
                        value={this.state.custom_time_slots.time_slot1}
                      >
                          {this.state.custom_time_slots.time_slot1}
                        </Button>:null}

                        {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot2)?<Button
                        color="info"
                        size="lg"
                        className={(this.state.custom_time_slots.time_slot2 === this.state.timeslot1)?`${classes.blockButton} ${classes.mr15}`:`${classes.outlineButton} ${classes.mt10} ${classes.mr30}`}
                        disabled={(this.state.type)?true:false}
                        onClick={()=>this.handletimeslot1Select(this.state.custom_time_slots.time_slot2)}
                        value={this.state.custom_time_slots.time_slot2}
                      >
                          {this.state.custom_time_slots.time_slot2}
                        </Button>:null}

                        {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot3)?<Button
                        color="info"
                        size="lg"
                        className={(this.state.custom_time_slots.time_slot3 === this.state.timeslot1)?`${classes.blockButton}`:`${classes.outlineButton} ${classes.mt10}`}
                        disabled={(this.state.type)?true:false}
                        onClick={()=>this.handletimeslot1Select(this.state.custom_time_slots.time_slot3)}
                        value={this.state.custom_time_slots.time_slot3}
                      >
                        {this.state.custom_time_slots.time_slot3}
                      </Button>:null}
                    </Grid>
                  </GridContainer>                                  
                  {/* <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          Time Slot
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={this.state.timeslot1}
                          onChange={this.handletimeslot1Select}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select",
                            disabled : this.state.type
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                            value={""}
                          >
                            Time Slot
                          </MenuItem>                                                  
                              {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot1)?<MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={this.state.custom_time_slots.time_slot1}
                              >
                                {this.state.custom_time_slots.time_slot1}
                              </MenuItem>:null}

                              {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot2)?<MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={this.state.custom_time_slots.time_slot2}
                              >
                                {this.state.custom_time_slots.time_slot2}
                              </MenuItem>:null}

                              {(this.state.custom_time_slots && this.state.custom_time_slots.time_slot3)?<MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={this.state.custom_time_slots.time_slot3}
                              >
                                {this.state.custom_time_slots.time_slot3}
                              </MenuItem>:null}                                            
                        </Select>
                      </FormControl> */}
                  </Grid>
                  <Grid container xs="8" md="8">
                    
                    <Grid xs="8" md="8">
                        <FormControlLabel
                          className={classes.rememberOne}
                          id="rememberOne"
                          control={
                            <Checkbox
                              checked={this.state.type}
                              onChange={this.handleTypeChange}
                              name="type"
                              color="primary"
                            />
                          }
                          label="Propose a new Time Slot(s)"
                        />
                    </Grid>
                  </Grid>
                  {(this.state.type)?<Grid container xs="8" md="8">
                    <Grid xs="4" md="4" className={`date-time ${classes.pr15}`} >
                    <FormControl fullWidth className={classes.selectFormControl}>
                        {/* <InputLabel >
                            Time Slot 1
                        </InputLabel> */}
                        <Datetime
                          inputProps={{                           
                            id: "timeslot1",
                            placeholder : "Time Slot 1"
                          }}
                          defaultValue={this.state.custom_time_slot1}
                          dateFormat={false}
                          className="interviewTime"
                          timeFormat="hh:mm A"
                          onChange={(time)=>this.handleCustomTimeSlot(1,time)}
                          />
                      </FormControl>                      
                    </Grid>
                    <Grid xs="4" md="4" className={`date-time ${classes.pr15}`}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                         {/* <InputLabel className={classes.selectLabel}>
                            Time Slot 2
                        </InputLabel> */}
                        <Datetime
                            inputProps={{                           
                              id: "timeslot2",
                              placeholder : "Time Slot 2"
                            }}
                            defaultValue={this.state.custom_time_slot2}
                            dateFormat={false}
                            className="interviewTime"
                            timeFormat="hh:mm A"
                            onChange={(time)=>this.handleCustomTimeSlot(2,time)}
                          />
                      </FormControl>                     
                    </Grid>
                    <Grid xs="4" md="4" className="date-time">
                    <FormControl fullWidth className={classes.selectFormControl}>
                        {/* <InputLabel className={classes.selectLabel}>
                            Time Slot 3
                        </InputLabel> */}
                        <Datetime
                          inputProps={{                           
                            id: "timeslot3",
                            placeholder : "Time Slot 3"
                          }}
                          defaultValue={this.state.custom_time_slot3}
                          dateFormat={false}
                          className="interviewTime"
                          timeFormat="hh:mm A"
                          onChange={(time)=>this.handleCustomTimeSlot(3,time)}
                          />
                      </FormControl>
                      {/* <CustomInput
                        success={emailState === "success"}
                        error={emailState === "error"}
                        labelText="Set Date"
                        id="date"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          placeholder: "Select date for intro.",
                          type : "time",                      
                          onChange: ((e) => {
                            if (this.verifyEmail(e.target.value)) {
                              this.setemailState("success");
                            } else {
                              this.setemailState("error");
                            }
                            this.setemail(e.target.value)
                          })
                        }}
                      /> */}
                    </Grid>
                  </Grid>:null}
                </Grid>                  
                </CardBody>
                <CardFooter className={classes.px50}>
                  <GridContainer>
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button
                        type="submit"
                        color="info"
                        onClick={(e) => this.onSubmit(e)}
                        size="lg"
                        className={`${classes.logButton} ${classes.my50}`}
                      >
                        Send
                    </Button>
                    </GridItem>                                        
                  </GridContainer>
                </CardFooter>
              </Card>:
              <GridContainer justify="center" alignItems="center" spacing={10}>
              <GridItem lg={7} md={7} sm={6} className={classes.textCenter}>
                <h2 className={classes.logLeftContentH2}>
                  Intro Discovery Request Rejected
                </h2>
                <p className={classes.logLeftContentP}>
                You have declined Intro Discovery Request call successfully.
                  <Hidden mdDown>
                    <br />
                  </Hidden>
                  {/* American tech talent with career opportunities
                  <Hidden mdDown>
                    <br />
                  </Hidden>
                  at America’s leading companies. */}
                </p>                                
              </GridItem>
              <Hidden lgDown>
                <GridItem lg={1}></GridItem>
              </Hidden>
              </GridContainer>             
              }
            </form>
          </GridItem>
        </GridContainer>        
      </div>
    );
  }
}

IntroDiscoveryCallRequest.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(IntroDiscoveryCallRequest));
