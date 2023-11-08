import React from "react";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import moment from "moment"
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
import combineStyles from '../../combineStyles';

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";

import ExamIcon from "assets/img/exam-icon.svg";
import { fetchMockInterviewStudentData,getProfileLatestData } from "../../redux/action";


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

// const classesCustom = useCustomSpace();
// const customStyle = useCustomStyle();

class InterviewResult extends React.Component{ 
  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      mock_interview_data : []
    }
  }
  static getDerivedStateFromProps(props, state) {    
    // console.log("props state cattt",state);  
    if((state.mock_interview_data.length !== props.mock_interview_data.length)){        
        // console.log("props cattt" , props.mock_interview_data );
      return {                
        mock_interview_data : (props.mock_interview_data.length > 0)?props.mock_interview_data:[]        
      };   
    }else{
      return {
        ...state
      } 
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
    this.props.fetchMockInterviewStudentData({user_id:this.props.user.user_id},this.props.history);
    this.props.getProfileLatestData({user_id : this.props.user.user_id},this.props.history);
    ths.showLoader();
    setTimeout(function(){
      if(ths.state.mock_interview_data.length > 0){
        // console.log("test1",ths.state.mock_interview_data)
        if(ths.state.mock_interview_data[0].status === 2){
          // console.log("test2",ths.state.mock_interview_data)
        }else if(ths.props.user.current_progress_status >= 3){
          // console.log("test3",ths.props.user.current_progress_status)
        }else{
          ths.props.history.push("/candidate/interviewscheduler")
        }
      }
    },1000)
   
    setTimeout(()=>{
      ths.hideLoader()
    },1000)
    
  }
  render(){
    // console.log("state:",this.state)
  const { classes } = this.props;
  return (
    <div className="main-right-panel">
      <GridContainer>
        <Hidden xsDown>
          <CustomBreadscrumb {...this.props}/>
        </Hidden>

        <GridItem xs={12} sm={12}>
          <h1>Mock Interview</h1>
          <h5>Congratulations! You are one step close to being Hired!</h5>
        </GridItem>
      </GridContainer>
      <GridContainer >
        <GridItem md={12} xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Results of Mock Interview
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container className={classes.root} spacing={4}>
                <Grid item xs={12} className={`${classes.textCenter}`}>
                  <img src={ExamIcon} alt="" className={`${classes.mt30} ${classes.mb30}`}></img>
                  <div className={classes.resultsBlock}>
                    Congratulations
                    <span className={classes.examinerName}>{(this.props.user)?((this.props.user.full_name)?this.props.user.full_name:'User'):'User'}</span>
                    <span className={`${classes.mb15} ${classes.dBlock}`}>You’ve successfully cleared the mock interview {(this.state.mock_interview_data.length >0 )?((this.state.mock_interview_data[0].on_date)? `held on ${moment(this.state.mock_interview_data[0].on_date).format("Do MMMM YYYY")},${this.state.mock_interview_data[0].on_time}.`:null):null} </span>
                    Your profile is ready for hiring. Please complete your profile details to get your dream Job.
                  </div>                  
                </Grid>
              </Grid>
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
    mock_interview_data : state.preperationReducer.mock_interview_data
  };
};
const mapDispatchToProps = { fetchMockInterviewStudentData,getProfileLatestData}
const combinedStyles = combineStyles(customStyle, useCustomSpace1,styles);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(InterviewResult));