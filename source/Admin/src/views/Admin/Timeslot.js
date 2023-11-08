import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from 'react-redux';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";

import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import combineStyles from "../../combineStyles.js"
import moment from 'moment';
import { getTimeslot,changeTimeslot,resetNotification } from '../../redux/action'
import { toast } from "react-toastify";

const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));



class AdminTimeslot extends React.Component {
  constructor(props) {
    super(props);
   
    this.updateTimeslot1 = this.updateTimeslot1.bind(this);
    this.updateTimeslot2 = this.updateTimeslot2.bind(this);
    this.updateTimeslot3 = this.updateTimeslot3.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setNotify = this.setNotify.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    
    
    
    this.state = {
      timeslot1 : "",
      timeslot1State: "",
      timeslot2 : "",
      timeslot2State: "",
      timeslot3 : "",
      timeslot3State: "",
      cardAnimaton : "cardHidden",
      notification: false,
      timeslotdata: null
    }
  }
  
 
  
  componentDidMount(){    
    let ths = this;
    var dt = moment("12:15 AM", ["hh:mm A"]).format("hh:mm A");
console.log("testests",dt)
    let admin_id = this.props.user.user_id
    
    
    this.props.getTimeslot({
      admin_id:admin_id
    },this.props.history);  
   
  }
  componentWillReceiveProps(props) {
    console.log("propsdata",props.timeslotdata)
    if(props.timeslotdata){
      console.log("propsdata",props.timeslotdata[0].time_slot1)
      this.setState({timeslot1:moment(props.timeslotdata[0].time_slot1, ["hh:mm A"]).format("hh:mm A")})
      this.setState({timeslot2:moment(props.timeslotdata[0].time_slot2, ["hh:mm A"]).format("hh:mm A")})
      this.setState({timeslot3:moment(props.timeslotdata[0].time_slot3, ["hh:mm A"]).format("hh:mm A")})
    }
  }
  setNotify(val=true){
    console.log('in set notification',val);
    
    this.setState({notification:val})
    let ths = this;
    setTimeout(()=>{
      ths.setState({notification:false})
    },2000)
    this.props.resetNotification();
  }
  
  verifyLength(val, length){
    console.log("in verify length",val)
    if (val.length >= length) {
      return true;
    }
    return false;
  };
  settimeslot1State(val=""){
    console.log("in set length",val)
    this.setState({timeslot1:val})
  }
  settimeslot1(val){
    console.log(val)
    this.setState({timeslot1:val})
  }
  onSubmit(val={}){
    console.log('Test',val);
    console.log('Test1',this.props.user,this.state.timeslot2 == this.state.timeslot1 ,this.state.timeslot1,this.state.timeslot2,this.state.timeslot3);
    // this.setNotify() ;
    var finalslot = {}
    if(this.state.timeslot1 && this.state.timeslot1 != "Invalid date" && this.state.timeslot2 && this.state.timeslot2 != "Invalid date" && this.state.timeslot3 && this.state.timeslot3 != "Invalid date"){
      
     if((this.state.timeslot1 === this.state.timeslot2 === this.state.timeslot3)||(this.state.timeslot1 === this.state.timeslot2)||(this.state.timeslot2 === this.state.timeslot3)||(this.state.timeslot1 === this.state.timeslot3)){
       toast.error("Please select all different time slots")
    }else{
      finalslot.admin_id = this.props.user.user_id
      finalslot.timeslot1 = this.state.timeslot1
      finalslot.timeslot2 = this.state.timeslot2
      finalslot.timeslot3 = this.state.timeslot3
      this.props.changeTimeslot(finalslot,this.props.history);
     }
    }
  }  
  updateTimeslot1(date) {
    // This function gives you the moment object of date selected. 
    console.log("testsett",date)
   
    var timeslot1val =  
    this.setState({timeslot1:`${moment(date).format("hh:mm A")}`})
  }
  updateTimeslot2(date) {
    // This function gives you the moment object of date selected. 
    var timeslot1val = moment(date).format("hh:mm A")
    this.setState({timeslot2:timeslot1val})
  }
  updateTimeslot3(date) {
    // This function gives you the moment object of date selected. 
    var timeslot1val = moment(date).format("hh:mm A")
    this.setState({timeslot3:timeslot1val})
  }
  render() {
    const { classes } = this.props;
    const { timeslot1,timeslot1State,cardAnimaton,timeslot2,timeslot2State,timeslot3,timeslot3State } = this.state;
    return (
      <div className="main-right-panel">
      <GridContainer>
        <GridItem>
          <h1>Interview Time Slot</h1>
          <h5>The times below will be used when requesting an interview</h5>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Enter Your Time  Availability
            </CardHeader>
            <CardBody className="cardCustomBody">
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      input={true}
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 1" }}
                      timeFormat="hh:mm A"
                      defaultValue={this.state.timeslot1}
                      onChange={this.updateTimeslot1}
                      value={timeslot1}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      input={true}
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 2" }}
                      timeFormat="hh:mm A"
                      //defaultValue={this.state.timeslot2}
                      onChange={this.updateTimeslot2}
                      value={timeslot2}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl className={`${classes.mb30} ${classes.mr15}`}>
                    <Datetime
                      input={true}
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Enter Time Slot 3" }}
                      timeFormat="hh:mm A"
                      //defaultValue={this.state.timeslot3}
                      onChange={this.updateTimeslot3}
                      value={timeslot3}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>
              <div className="flex-center">
                  <Button
                    color="info"
                    size="md"
                    className={`${classes.newButton} ${classes.mb30} ${classes.mt15}`}
                    onClick={this.onSubmit}
                  >
                    Set Time
                  </Button>
              </div>              
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
     
      {/* <Snackbar
        place="tr"
        color={(this.props.changepassworderror)?"danger":"info"}
        icon={AddAlert}
        message={`${this.props.notification_message}`}
        open={this.props.shownotification}
        closeNotification={() =>{
           this.props.resetNotification();           
          }}
        close
      /> */}
    </div>
    );
  }
}


AdminTimeslot.propTypes = {
  classes: PropTypes.object
};

const mapStateToProps = state => ({ 
  user: state.authReducer.user,
  timeslotdata:state.authReducer.timeslotdata,
  shownotification: state.authReducer.shownotification,
  loginerror : state.authReducer.loginerror,
  changepassworderror : state.authReducer.changepassworderror,    
  notification_message:state.authReducer.notification_message
 });
const mapDispatchToProps = { getTimeslot,changeTimeslot,resetNotification };
const combinedStyles = combineStyles(customStyle, styles);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(AdminTimeslot));
