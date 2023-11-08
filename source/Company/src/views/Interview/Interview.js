import React from "react";
import { connect } from "react-redux";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "components/Table/Table.js";
import Link from "@material-ui/core/Link";

import CloseIcon from "../../assets/img/close-icon.svg"


import filterIcon from "../../assets/img/filter-icon.svg";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import { logoutUser } from "../../redux/action";
import { API_URL } from "constants/defaultValues.js";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import combineStyles from '../../combineStyles';
import buttonStyles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";



const useStyles = makeStyles(styles);
const useButtonStyles = makeStyles(buttonStyles);
const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  },
}
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomStyle = makeStyles(customStyle);

class InterviewTimeSlot extends React.Component{
  // const classes = useStyles();
  // const classesCustom = useCustomSpace();
  // const customStyle = useCustomStyle();
  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      timeslot1 : "",
      timeslot2 : "",
      timeslot3 : ""
    }
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }
  
  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }
  componentDidMount(){
    let ths = this;
    let params = {}
    params.user_id = this.props.user.user_id;
    params.company_user_id = this.props.user.user_id;
    this.fetchTimeSlot(params);
    ths.showLoader();
    setTimeout(()=>{
      ths.hideLoader()
    },500)
  }

  handleCustomTimeSlot(index,val){
    // console.log("val:",val,moment(moment().format("MM-DD-YYYY")+' '+val));
    
    if(val && val !== "" && moment(val).format("hh:mm A") !== "Invalid date"){
      if(index === 1){
        this.setState({
          timeslot1 : `${moment(val).format("hh:mm A")}`
        })
      }else if(index === 2){
        this.setState({
          timeslot2 : `${moment(val).format("hh:mm A")}`
        })
      }else if(index === 3){
        this.setState({
          timeslot3 : `${moment(val).format("hh:mm A")}`
        })
      }  
      }
  }

  async fetchTimeSlot(params){
    let response = await this.callFetchTimeSlot(params);
    if(response.status !== -2){
      if(response.status === false){
        toast.error(response.message)        
      }else{
        this.setState({
          timeslot1 : (response.data.length > 0)?response.data[0].time_slot1 :"",
          timeslot2 : (response.data.length > 0)?response.data[0].time_slot2 :"",
          timeslot3 : (response.data.length > 0)?response.data[0].time_slot3 :"",
        })
      }
    }else{
      this.props.logoutUser(this.props.history);
    }
  }

  async callFetchTimeSlot(params){
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/get_company_timeslot`,params,headers)
    return res.data;
  }

  Settimeslots(){
    let params = {}
    const { timeslot1,timeslot2,timeslot3 } = this.state;
    params.user_id = this.props.user.user_id;
    
    if(timeslot1 && timeslot2 && timeslot3 && 
      timeslot1 !== "" && timeslot2 !== "" && timeslot3 !== ""){
        if((timeslot1 ===  timeslot2 === timeslot3)||(timeslot1 ===  timeslot2)||(timeslot2 === timeslot3)||(timeslot1 === timeslot3)){
          toast.error("Please select all different time slots")    
        }else{
          params.timeslot1 = timeslot1;
          params.timeslot2 = timeslot2;
          params.timeslot3 = timeslot3;
          this.sethTimeSlot(params);
        }
    }else{
      toast.error("Please select valid time slots")
    }
  }

  async sethTimeSlot(params){
    let response = await this.callSetTimeSlot(params);
    if(response.status !== -2){
      if(response.status === false){
        toast.error(response.message)        
      }else{
        toast.success(response.message);
      }
    }else{
      this.props.logoutUser(this.props.history);
    }
  }

  async callSetTimeSlot(params){
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/addcompany_timeslot`,params,headers)
    return res.data;
  }


  render(){
    let { timeslot1,timeslot2,timeslot3 } = this.state;
    // console.log("state",timeslot1,timeslot2,timeslot3);
  const { classes } = this.props;
  return (
    <div className="main-right-panel">
      <GridContainer>
        <GridItem>
          <h1>Select Times to Interview</h1>
          <h5>The times below will be sent to candidates to choose from when requesting an intro call or interview</h5>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Select Your 3 Most Preferred Interview Times              
            </CardHeader>
            <CardBody className="cardCustomBody">
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 1" }}
                      // defaultValue={moment(`${moment().format("YYYY-MM-DD")} ${moment(timeslot1, 'hh:mm A').format('HH:mm')}`)}                    
                      value={timeslot1}
                      timeFormat="hh:mm A"
                      onChange={(time)=>this.handleCustomTimeSlot(1,time)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 2" }}
                      // defaultValue={moment(`${moment().format("YYYY-MM-DD")} ${moment(timeslot2, 'hh:mm A').format('HH:mm')}`)}                    
                      value={timeslot2}
                      timeFormat="hh:mm A"
                      onChange={(time)=>this.handleCustomTimeSlot(2,time)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>  
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 3" }}
                      // defaultValue={moment(`${moment().format("YYYY-MM-DD")} ${moment(timeslot3, 'hh:mm A').format('HH:mm')}`)}
                      value={timeslot3}
                      timeFormat="hh:mm A"
                      onChange={(time)=>this.handleCustomTimeSlot(3,time)}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>
              <div className="flex-center">
                  <Button
                    color="info"
                    size="md"
                    className={`${classes.newButton} ${classes.mb30} ${classes.mt15}`}
                    onClick={(e)=>this.Settimeslots()}
                  >
                    Set Time
                  </Button>
              </div>              
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      </div>
  );
  }
}

const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user    
  };
};

const mapDispatchToProps = { logoutUser  }
const combinedStyles = combineStyles(customStyle,styles,buttonStyles,useCustomSpace1);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(InterviewTimeSlot));
