import React from "react";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Link from "@material-ui/core/Link";
import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js"
import CustomInput from "components/CustomInput/CustomInput.js";
import {toast} from "react-toastify"

import MyToolbar from 'views/Calendar/mytoolbar';

import combineStyles from '../../combineStyles';
import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
import customStyle from "assets/jss/customStyle";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { fetchAdminInterviewTimeSlot,setMockInterviewWithAdmin,fetchMockInterviewStudentData,getProfileLatestData } from "../../redux/action";

import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { events as calendarEvents } from "variables/general.js";
const localizer = momentLocalizer(moment);


// const useStyles = makeStyles(styles);
// const useCustomStyle = makeStyles(customStyle);
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
};

// const classes = useStyles();
// const classesCustom = useCustomSpace();
// const customStyle = useCustomStyle();
class InterviewScheduler extends React.Component{
 
  constructor(props){
    super(props);
    this.props = props;
    this.selectTimeSlot = this.selectTimeSlot.bind(this);
    this.setmockInterview = this.setmockInterview.bind(this);
    this.state = {
      user : null,
      events : [{
        title: <CheckCircleIcon/>,
        start: moment().add(1,'days'),
        end: moment().add(1,'days')
      }],
      alert : null,
      SelectedDate : moment().add(1,'days').format("Do MMMM YYYY"),
      dateToSent : moment().add(1,'days').format("YYYY-MM-DD"),
      admin_time_slot : [],
      mock_interview_data : [],
      selected_slot : 2,
      selected_slot_hours : "",
      fail_date : "",
      fail_time : ""
    }
  }

  static getDerivedStateFromProps(props, state) {    
    // console.log("props state cattt",state);  
    if((state.admin_time_slot.length !== props.admin_time_slot.length)||(state.mock_interview_data.length !== props.mock_interview_data.length)||(props.user && state.user && props.user.current_progress_status != "undefined" && state.user.current_progress_status != "undefined" && state.user.current_progress_status !== props.user.current_progress_status )){        
        // console.log("props cattt",props.admin_time_slot , props.mock_interview_data );
      return {  
        user : (props.user)?props.user : null,
        admin_time_slot: (props.admin_time_slot.length > 0)?props.admin_time_slot:[],
        mock_interview_data : (props.mock_interview_data.length > 0)?props.mock_interview_data:[],
        selected_slot_hours : (!(props.mock_interview_data.length > 0))?((props.admin_time_slot.length > 0)?((props.admin_time_slot[0].time_slot2)?props.admin_time_slot[0].time_slot2:"12:00 PM"):"12:00 PM"):((props.mock_interview_data[0].on_time)?props.mock_interview_data[0].on_time:"12:00 PM"),
        selected_slot : (props.admin_time_slot.length > 0 && props.mock_interview_data.length > 0)?((props.admin_time_slot[0].time_slot1 == props.mock_interview_data[0].on_time )?1:((props.admin_time_slot[0].time_slot3 == props.mock_interview_data[0].on_time)?3:2)):2,
        dateToSent : (props.mock_interview_data.length > 0)?((props.mock_interview_data[0].on_date && props.mock_interview_data[0].status !== 1)?moment(props.mock_interview_data[0].on_date).format("YYYY-MM-DD"):moment().add(1,'days').format("YYYY-MM-DD")):moment().add(1,'days').format("YYYY-MM-DD"),
        SelectedDate : (props.mock_interview_data.length > 0)?((props.mock_interview_data[0].on_date && props.mock_interview_data[0].status !== 1)?moment(props.mock_interview_data[0].on_date).format("Do MMMM YYYY"):moment().add(1,'days').format("Do MMMM YYYY")):moment().add(1,'days').format("Do MMMM YYYY"),
        events : [{
          title: <CheckCircleIcon/>,
          start: (props.mock_interview_data.length > 0)?((props.mock_interview_data[0].on_date && props.mock_interview_data[0].status !== 1)?moment(props.mock_interview_data[0].on_date): moment().add(1,'days')): moment().add(1,'days'),
          end: (props.mock_interview_data.length > 0)?((props.mock_interview_data[0].on_date && props.mock_interview_data[0].status !== 1)?moment(props.mock_interview_data[0].on_date): moment().add(1,'days')): moment().add(1,'days')
        }],
        fail_date : (props.mock_interview_data.length > 0)?((props.mock_interview_data[0].on_date)?moment(props.mock_interview_data[0].on_date).format("Do MMMM YYYY"):moment().add(1,'days').format("Do MMMM YYYY")):moment().add(1,'days').format("Do MMMM YYYY"),
        fail_time : (!(props.mock_interview_data.length > 0))?((props.admin_time_slot.length > 0)?((props.admin_time_slot[0].time_slot2)?props.admin_time_slot[0].time_slot2:"12:00 PM"):"12:00 PM"):((props.mock_interview_data[0].on_time)?props.mock_interview_data[0].on_time:"12:00 PM")
      };   
    }else{
      return {
        ...state
      } 
    }               
  }
  selectTimeSlot(val=1){
    let slot_hours = "12:00 PM"
    if(val==1){
      slot_hours = (this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot1)?this.state.admin_time_slot[0].time_slot1:"12:00 PM"):"12:00 PM"
    }else if(val==2){
      slot_hours = (this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot2)?this.state.admin_time_slot[0].time_slot2:"12:00 PM"):"12:00 PM"
    }else if(val==3){
      slot_hours = (this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot3)?this.state.admin_time_slot[0].time_slot3:"12:00 PM"):"12:00 PM"
    }
    this.setState({
      selected_slot : val,
      selected_slot_hours : slot_hours
    })
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
    this.props.fetchAdminInterviewTimeSlot();
    this.props.fetchMockInterviewStudentData({user_id:this.props.user.user_id},this.props.history);
    let ths = this;
    this.props.getProfileLatestData({user_id : this.props.user.user_id},this.props.history);
    ths.showLoader();
   
    setTimeout(function(){
      
      if(ths.props.user.current_progress_status >= 2){
        // console.log("test1",ths.state.mock_interview_data)
        if(ths.state.mock_interview_data.length > 0){
          // console.log("test2")
          // console.log("ths.props.user.current_progress_status",ths.props.user.current_progress_status)
          if(ths.state.mock_interview_data[0].status === 1 || ths.state.mock_interview_data[0].status === 0){
            // console.log("test3")
          }else if(ths.state.mock_interview_data[0].status  === 2){
            // console.log("test4")
            ths.props.history.push("/candidate/interviewresult")
          }else{
            // console.log("test5")
            ths.props.history.push("/candidate/interviewprep")
          }
        }
    }else if(ths.props.user.current_progress_status === 1){
      ths.props.history.push("/candidate/interviewprep/true")
    }else{
      ths.props.history.push("/candidate/skillassesment/true/interviewscheduler")
    }
    },1000)
    setTimeout(()=>{
      ths.hideLoader()
    },1000)
  }

  setSelectedDate(val=moment().format("Do MMMM YYYY")){
    this.setState({SelectedDate : val})
  }
  setEvents(val=null){
    this.setState({
      events : val
    })
  }
  setAlert(val=null){
    this.setState({
      alert : val
    })
  }
  selectedEvent = event => {
    // window.alert(event.title);
  };
  addNewEventAlert = slotInfo => {
    if((this.state.mock_interview_data.length == 0)||(this.state.mock_interview_data.length > 0 && this.state.mock_interview_data[0].status === 1)){
      if(moment(slotInfo.end).diff(moment(), 'hours')>=0){
        this.dateSelected("",slotInfo);    
      }else{
  
      }
    }
  };

  dateSelected = (e,slotDate) => {
    let event = [];
    event.push({
      title: <CheckCircleIcon/>,
      start: slotDate.end,
      end: slotDate.end
    });
    this.setEvents(event);
    this.setState({dateToSent: moment(slotDate.end).format("YYYY-MM-DD")})
    this.setSelectedDate(moment(slotDate.end).format("Do MMMM YYYY"));
  }

  eventColors = event => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };

  setmockInterview(){
    // console.log("Date:",this.state.dateToSent,this.state.SelectedDate,moment(this.state.dateToSent).diff(moment(),'hours'));
    let temp_date = (this.state.dateToSent)?this.state.dateToSent:"";
    if(this.state.SelectedDate && this.state.selected_slot && moment(this.state.dateToSent).format("MM/DD/YYYY") !== "Invalid date" && moment(this.state.dateToSent).diff(moment(),'hours') > 0){
      this.props.setMockInterviewWithAdmin({user_id:this.props.user.user_id,on_date:temp_date,on_time:this.state.selected_slot_hours},this.props.history)
      // setTimeout(function(){
      //   window.location.reload()
      // },2000)
    }else{
      toast.error("Please select valid date and time")
    }
  }

  render(){
    
  const { classes } = this.props;
  return (
    <div className="main-right-panel">
      <GridContainer>
        <Hidden xsDown>
          <CustomBreadscrumb {...this.props}/>
        </Hidden>

        <GridItem xs={12} sm={12}>
          <h1>Interview Schedule</h1>
          <h5>Congratulations! You are one step close to being Hired!</h5>
        </GridItem>
      </GridContainer>
      <GridContainer >
        <GridItem md={12} xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Schedule your mock Interview
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container className={classes.root} spacing={8}>
                <Grid item xs={12} sm={12} md={12} lg={7}>
                  <div>
                    {/* <div className={`${classes.bigCalendarTop} ${classes.mb30}`}>
                      <div>
                        <Button
                          color="info"
                          size="sm"
                          className={`${classes.blockButton}`}
                        >
                          Prev
                    </Button>
                      </div>
                      <div className={classes.calendarMonth}>April 2020</div>
                      <div>
                        <Button
                          color="info"
                          size="sm"
                          className={`${classes.blockButton}`}
                        >
                          Next
                    </Button>
                      </div>
                    </div> */}
                    <BigCalendar
                      selectable
                      localizer={localizer}
                      events={this.state.events}
                      defaultView="month"
                      scrollToTime={new Date(1970, 1, 1, 6)}
                      defaultDate={new Date()}
                      onSelectEvent={event => this.selectedEvent(event)}
                      onSelectSlot={slotInfo => this.addNewEventAlert(slotInfo)}
                      eventPropGetter={this.eventColors}
                      components={{ toolbar: MyToolbar }}
                      defaultView={'month'}
                      views={['month']}
                    />
                  </div>

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={5}>
                  <div className={`${classes.selectedTime}`}>Time Available :</div>
                  <Button
                    color="info"
                    size="lg"
                    className={(this.state.selected_slot == 1)?`${classes.blockButton} ${classes.mt30} ${classes.mr30}`:`${classes.outlineButton} ${classes.mt30} ${classes.mr30}`}
                    disabled={(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].status != 1)?true:((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot1)?false:true):true)):((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot1)?false:true):true)}
                    onClick={(e)=>this.selectTimeSlot(1)}
                  >
                      {(this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot1)?this.state.admin_time_slot[0].time_slot1:"12:00 PM"):"12:00 PM"}
                    </Button>
                  <Button
                    color="info"
                    size="lg"
                    className={(this.state.selected_slot == 2)?`${classes.blockButton} ${classes.mt30} ${classes.mr30}`:`${classes.outlineButton} ${classes.mt30} ${classes.mr30}`}
                    disabled={(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].status != 1)?true:((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot2)?false:true):true)):((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot2)?false:true):true)}
                    onClick={(e)=>this.selectTimeSlot(2)}
                  >
                    {(this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot2)?this.state.admin_time_slot[0].time_slot2:"12:00 PM"):"12:00 PM"}
                    </Button>
                  <Button
                    color="info"
                    size="lg"
                    className={(this.state.selected_slot == 3)?`${classes.blockButton} ${classes.mt30}`:`${classes.outlineButton} ${classes.mt30}`}
                    disabled={(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].status != 1)?true:((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot3)?false:true):true)):((this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot3)?false:true):true)}
                    onClick={(e)=>this.selectTimeSlot(3)}
                  >
                    {(this.state.admin_time_slot.length > 0)?((this.state.admin_time_slot[0].time_slot3)?this.state.admin_time_slot[0].time_slot3:"12:00 PM"):"12:00 PM"}
                  </Button>
                  <div className={`${classes.selectedTime} ${classes.mt50}`}>
                    Time and Date for Mock Interview :
                    <span className={`${classes.selectedTimeDate} ${classes.mt30}`}>{this.state.SelectedDate}, {this.state.selected_slot_hours}</span>
                  </div>
                  <Button
                    color="info"
                    size="md"
                    className={`${classes.newButton} ${classes.mt50}`}
                    onClick={(e)=>{this.setmockInterview()}}
                    disabled={(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].status != 1)?true:false):false}
                  >
                    Request for Mock Interview
                  </Button>
                </Grid>
              </Grid>
              <div className={`${classes.notClearText} ${classes.mt30}`}>
                {(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].status == 1)?`You haven’t cleared your last mock Interview! held on ${this.state.fail_date},${this.state.fail_time}.  Try again`:null):null}
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
    user: state.authReducer.user,
    mock_interview_data : state.preperationReducer.mock_interview_data,
    admin_time_slot : state.preperationReducer.admin_time_slot
  };
};
const mapDispatchToProps = { fetchAdminInterviewTimeSlot,setMockInterviewWithAdmin,fetchMockInterviewStudentData,getProfileLatestData}
const combinedStyles = combineStyles(customStyle, useCustomSpace1,styles);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(InterviewScheduler));
