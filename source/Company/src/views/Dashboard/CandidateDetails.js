import React, { Fragment } from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

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
import CustomInput from "components/CustomInput/CustomInput.js";

import { Icon as IconF, InlineIcon } from '@iconify/react';
import cloudDownloadOutlined from '@iconify/icons-ant-design/cloud-download-outlined';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { toast } from "react-toastify";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js"
// import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js"
import combineStyles from '../../combineStyles';
import moment from "moment";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VideoPlayer from "assets/img/video-player.jpg";
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import { API_URL } from "constants/defaultValues.js"
import { getProfileLatestData, fetchCareerPath, logoutUser } from '../../redux/action';

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
const useCustomSpace1 = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

// const classesCustom = useCustomSpace();
// const customStyle = useCustomStyle();
class SpecSheet extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleSimple = this.handleSimple.bind(this);
    this.state = {
      hidewatchlist: 0,
      hideattachment: 1,
      career_path: [],
      all_watchlist: [],
      watchlist: "",
      user: null,
      student_details: null,
      cities: [],
      all_skills: [],
      // Edit Details
      student_details: [
        {
          experience_level: 0, // 1 - student , ...
          currently_lived: 0, // city id
          employment_type: -1, // 0 - part time  ,  1 - full time
          interested_remortely: '0',// 0 - no , 1 - yes
          willing_to_works: '', // text
          looking_for_role: '', // text
          skills: "", // all selected skill of student
          bio: '',
          anything_else_details: '',
          resume: '',
          github_url: '',
          linkedin_url: '',
          website_url: ''
        }
      ],
      student_details_default_obj: {
        experience_level: 0, // 1 - student , ...
        currently_lived: 0, // city id
        employment_type: -1, // 0 - part time  ,  1 - full time
        interested_remortely: '0',// 0 - no , 1 - yes
        willing_to_works: '', // text
        looking_for_role: '', // text
        skills: "", // all selected skill of student
        bio: '',
        anything_else_details: ''
      },
      // text    
      //  Edit Work History
      student_work_history: [
        // default object        
      ],
      // Edit Other Details
      student_education: [

      ],
      // Edit Attachment
      student_attachment: [],
    }
  }
  formatedDate(date) {
    if (date) {
      // console.log("arjgbjhsdb:", date, moment(date).format("MM-DD-YYYY"))
      return moment(date).format("MM-DD-YYYY")
    } else {
      return ""
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);      
    // if(props.user.student_details && props.user.student_work_history && props.user.student_education
    //      && ((props.user.student_details.length > 0 && state.student_details.length == 0 )
    //       || (props.user.student_work_history.length > 0 && state.student_work_history.length == 0 )
    //         || (props.user.student_education.length > 0 )|| (props.user && state.user && props.user.current_progress_status != "undefined" && state.user.current_progress_status != "undefined" && state.user.current_progress_status !== props.user.current_progress_status ) )){
    //   return {
    //     user: (props.user)?props.user:state.user,        
    //     student_work_history : (props.user)?((props.user.student_work_history.length > 0)?props.user.student_work_history:state.student_work_history):state.student_work_history,
    //     student_education : (props.user)?((props.user.student_education.length > 0)?props.user.student_education:state.student_education):state.student_education
    //   }
    // }

    if (props.user || (props.career_path.length !== state.career_path.length)) {
      return {
        user: (props.user) ? props.user : state.user,
        career_path: (props.career_path.length > 0) ? props.career_path : state.career_path
      };
    } else {
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
  componentDidMount() {
    let ths = this;
    ths.showLoader();
    this.props.fetchCareerPath();
    let { match } = this.props;
    // let path_arr = location.pathname.split('/');
    let student_id = 0;
    // console.log("Propsss:", match, student_id)
    if (match.params.id) {
      student_id = match.params.id;
      if (match.params.hide === "1" || match.params.hide === 1 || match.params.hide === "0" || match.params.hide === 0) {
        this.setState({
          hidewatchlist: 1
        })
      }
    }
    if (match.params.hide === "1" || match.params.hide === 1) {
      this.setState({
        hideattachment: 0
      })
    }
    if (+(student_id) > 0) {
      this.getGetStudentDetail({ "user_id": this.props.user.user_id, "student_id": student_id, "display_name": +(match.params.hide) })
      this.fetchWatchList({ 'user_id': this.props.user.user_id })
      ths.hideLoader();
    } else {
      ths.hideLoader();
      this.props.history.push("/company/search")
    }
    // this.props.getProfileLatestData({user_id:this.props.user.user_id},this.props.history);
  }

  //  Get student detail  page based on student id

  async getGetStudentDetail(params) {
    let response = await this.getDataFromDb(params);
    // console.log("DATTA:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push("/company/search");
      } else {
        this.setState({
          student_details: (response.data) ? response.data : null,
          student_education: (response.data && response.data.student_work_history.length > 0) ? response.data.student_work_history : [],
          student_education: (response.data && response.data.student_education.length > 0) ? response.data.student_education : [],
        })
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async getDataFromDb(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/student/studentdetails`, params, headers);
    return await res.data;
  }

  //  Add student to watch list
  addStudentToWatchlistOnClick() {
    if (this.state.watchlist && this.state.watchlist !== "") {
      let params = {
        user_id: this.props.user.user_id,
        watchlist_id: this.state.watchlist,
        student_id: this.state.student_details.user_id
      }
      this.addToWatchList(params)
    } else {
      toast.error('Please select my openings.')
    }
  }

  async addToWatchList(params) {
    let response = await this.addStudentToWatchList(params);
    // console.log("ADD STUD WATCHLIST:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async addStudentToWatchList(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/addstudent`, params, headers);
    return await res.data;
  }

  // Fetch all watch list 

  async fetchWatchList(params) {
    let response = await this.fetchStudentToWatchList(params);
    // console.log("FETCH WATCH LIST:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        this.setState({
          all_watchlist: (response.data.length > 0) ? response.data : []
        })
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchStudentToWatchList(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/get_all_watchlist`, params, headers);
    return await res.data;
  }

  handleSimple(e) {
    this.setState({
      watchlist: e.target.value
    })
  }

  handleDownloadCertification(certification_url) {    
    // console.log('handleDownloadCertification ===>', certification_url);
    const win = window.open(certification_url, '_blank');
    if (win != null) {
      win.focus();
    }
  }

  //  ######### Start functions Edit Details ###########

  //  ######### End functions Edit Details ###########

  // ######## Start Edit Work history functions ##########


  // ######## End Edit Work history functions ##########

  // ######## Start Edit Other Details functions ##########


  // ######## End Edit Other Details functions ##########  
  render() {
    // console.log("this.render.", this.state);
    const { classes } = this.props;
    let ths = this;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem>
            <h1>Candidate Details</h1>
            <h5>Check your candidate</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative has-buttons">
                <GridContainer spacing={6} className={`${classes.mb30}`}>
                  <GridItem xs={12} lg={6} md={12}>
                    Candidate Details
                </GridItem>
                  {(this.state.hidewatchlist !== 1) ? <>
                    <GridItem xs={12} lg={3} md={6}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          Select My Openings
                      </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={this.state.watchlist}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "watchlist",
                            id: "simple-select",
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Select My Openings
                          </MenuItem>
                          {(this.state.all_watchlist.length > 0) ? this.state.all_watchlist.map((watch_list) => <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value={watch_list.id}
                          >
                            {watch_list.role_title}
                          </MenuItem>) : null}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={3} md={6}>
                      <Button
                        color="info"
                        size="sm"
                        fullWidth="true"
                        className={`${classes.newButton} ${classes.mt15}`}
                        onClick={(e) => this.addStudentToWatchlistOnClick()}
                      >
                        Add Candidate
                    </Button>
                    </GridItem></> : null}
                </GridContainer>
              </CardHeader>
              <CardBody className="cardCustomBody">
                <CustomTabs
                  headerColor="transparent"
                  tabs={[
                    {
                      tabName: "Details",
                      tabContent: (
                        <div>
                          <GridContainer spacing={6}>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Name</span>
                              {(this.state.student_details && this.state.student_details.full_name) ? this.state.student_details.full_name : "-"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>{(this.state.student_details && this.state.student_details.phone != "") ? 'Phone Number' : 'Profile Number'}</span>
                              {(this.state.student_details && this.state.student_details.phone != "") ? ((this.state.student_details && this.state.student_details.phone) ? `${this.state.student_details.phone}` : "-") : ((this.state.student_details && this.state.student_details.user_id) ? `#${this.state.student_details.user_id}` : "-")}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Career Path</span>
                              {(this.state.student_details && this.state.student_details.career_path) ? this.state.student_details.career_path : "-"}
                            </GridItem>
                            <GridItem xs={12} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Technical assessment</span>
                              {(this.state.student_details && this.state.student_details.technical_assisment) ? this.state.student_details.technical_assisment : "-"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Experience Level</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.experience_level) ? this.state.student_details.student_details.experience_level : "-"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Where do you currently live?</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.currently_lived) ? this.state.student_details.student_details.currently_lived : "-"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span className={classes.highlighText}>Has Offer(s)?</span>
                              {(this.state.student_details && this.state.student_details.has_offer && this.state.student_details.has_offer) ? this.state.student_details.has_offer : "No"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>What type of employment are you seeking?</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.employment_type) ? this.state.student_details.student_details.employment_type : "-"}
                            </GridItem>
                            <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Are you interested in working remotely?</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.interested_remortely) ? this.state.student_details.student_details.interested_remortely : "-"}
                            </GridItem>
                            <GridItem xs={12} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Where geographically are you willing to work?</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.willing_to_works) ? this.state.student_details.student_details.willing_to_works : "-"}
                            </GridItem>
                            <GridItem xs={12} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>What kind of role in an organization are you looking for?</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.looking_for_role) ? this.state.student_details.student_details.looking_for_role : "-"}
                            </GridItem>
                            <GridItem xs={12} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>What are your skills? (Select all that apply)</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.skills) ? this.state.student_details.student_details.skills : "-"}
                            </GridItem>
                            <GridItem xs={12} className={`${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Bio</span>
                              {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.bio) ? this.state.student_details.student_details.bio : "-"}
                            </GridItem>
                          </GridContainer>
                        </div>
                      )
                    },
                    {
                      tabName: "Work History",
                      tabContent: (
                        <div>
                          {(this.state.student_details && this.state.student_details.student_work_history && this.state.student_details.student_work_history.length > 0) ? this.state.student_details.student_work_history.map((work_history, index) => <Grid container className={`${classes.root} ${classes.mb30}`} spacing={4}>
                            <Grid item xs={12} sm={12} md={5} className={classes.pb0} style={{ 'color': "#0077B5" }}>
                              Company {index + 1}*
                            </Grid>
                            <Hidden>
                              <Grid xs={0} sm={0} md={7}></Grid>
                            </Hidden>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Company Name</span>
                              {(work_history.company_name) ? work_history.company_name : " - "}
                              {/* <CustomInput
                                labelText="Company Name"
                                id="company_name"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (work_history.company_name) ? work_history.company_name : "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Job Title</span>
                              {(work_history.job_title) ? work_history.job_title : " - "}
                              {/* <CustomInput
                                labelText="Job Title"
                                id="job_title"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (work_history.job_title) ? work_history.job_title : "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>
                            <Hidden>
                              <Grid xs={0} sm={0} md={4}></Grid>
                            </Hidden>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Start Date</span>
                              {(work_history.start_date) ? this.formatedDate(work_history.start_date) : " - "}
                              {(work_history.end_date) ? "" : ` - Present`}
                              {/* <CustomInput
                                labelText="Start Date"
                                id="start_date"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type : "date",                                
                                  value: (work_history.start_date) ? this.formatedDate(work_history.start_date) : "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              {(work_history.end_date) ? (
                                <>
                                  <span>End Date</span>
                                  <>{this.formatedDate(work_history.end_date)}</>
                                </>
                              ) : ""}
                              {/* <CustomInput
                                labelText="End Date"
                                id="end_date"
                                formControlProps={{
                                  fullWidth: true
                                }}                              
                                inputProps={{
                                  type : "date",                                                               
                                  value: (work_history.end_date) ? this.formatedDate(work_history.end_date): "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>
                            <Grid item xs={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Job Description</span>
                              {(work_history.description) ? work_history.description : " - "}
                              {/* <CustomInput
                                labelText="Job Description"
                                id="description"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (work_history.description) ? work_history.description : "",                               
                                  disabled:true,
                                  multiline: true,
                                  rows: 3
                                }}
                              /> */}
                            </Grid>

                          </Grid>) :
                            <Grid>
                              <Grid item xs={12} sm={12} md={12} className={classes.py0 + ' ' + classes.textCenter}>
                                Work History not available
                              </Grid>
                            </Grid>
                          }

                        </div>
                      )
                    },
                    {
                      tabName: "Education",
                      tabContent: (
                        <div>
                          {(this.state.student_details && this.state.student_details.student_education && this.state.student_details.student_education.length > 0) ? this.state.student_details.student_education.map((education, index) => <Grid container className={`${classes.root} ${classes.mb30}`} spacing={4}>
                            <Grid item xs={12} sm={12} md={5} className={classes.pb0} style={{ 'color': "#0077B5" }}>
                              Education {index + 1}*
                              </Grid>
                            <Hidden>
                              <Grid xs={0} sm={0} md={7}></Grid>
                            </Hidden>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Name of Institution</span>
                              {(education.institution_name) ? education.institution_name : " - "}
                              {/* <CustomInput
                                labelText="Name of Institution"
                                id="name_of_institute"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (education.institution_name) ? education.institution_name : "",                                
                                  disabled : true
                                }}
                              /> */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Name of Degree</span>
                              {(education.degree_name) ? education.degree_name : " - "}
                              {/* <CustomInput
                                labelText="Name of Degree"
                                id="name_of_degree"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (education.degree_name) ? education.degree_name : "",                                
                                  disabled : true
                                }}
                              /> */}
                            </Grid>
                            <Hidden>
                              <Grid xs={0} sm={0} md={4}></Grid>
                            </Hidden>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Start Date</span>
                              {(education.start_date) ? this.formatedDate(education.start_date) : " - "}
                              {(education.end_date) ? "" : ` - Present`}
                              {/* <CustomInput
                                labelText="Start Date"
                                id="start_date"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type : "date",                                
                                  value: (education.start_date) ? this.formatedDate(education.start_date) : "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              {(education.end_date) ? (
                                <>
                                  <span>End Date</span>
                                  <>{this.formatedDate(education.end_date)}</>
                                </>
                              ) : ""}
                              {/* <CustomInput
                                labelText="End Date"
                                id="end_date"
                                formControlProps={{
                                  fullWidth: true
                                }}                              
                                inputProps={{
                                  type : "date",                                                               
                                  value: (education.end_date) ? this.formatedDate(education.end_date): "",                                
                                  disabled:true
                                }}
                              /> */}
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Description</span>
                              {(education.description) ? education.description : " - "}
                              {/* <CustomInput
                                labelText="Description"
                                id="description"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value: (education.description) ? education.description : "",
                                  multiline: true,
                                  rows: 3,                               
                                  disabled : true
                                }}
                              /> */}
                            </Grid>

                          </Grid>) :

                            <Grid item xs={12} sm={12} md={12} className={classes.py0 + ' ' + classes.textCenter + ' ' + classes.mb30}>
                              No Education Detail Available
                              </Grid>
                          }

                          <Grid item xs={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                            <span>Anything Else you would like to share?</span>
                            {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.anything_else_details) ? this.state.student_details.student_details.anything_else_details : " - "}
                            {/* <CustomInput
                                labelText="Anything Else you would like to share?"
                                id="anything_else"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  value:(this.state.student_details.length > 0)?this.state.student_details[0].anything_else_details:"",
                                  multiline: true,
                                  rows: 3,                                
                                }}
                              /> */}
                          </Grid>

                        </div>
                      )
                    },
                    {
                      tabName: "Attachments",
                      tabHide: this.state.hideattachment === 1 ? true : false,
                      tabContent: (
                        <div>
                            <Grid item xs={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                                <span>Resume</span>
                                {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.resume && this.state.student_details.student_details.resume_url) ? (
                                  <div className={`${classes.attachmentInfo}`}>
                                    <IconF 
                                      icon={cloudDownloadOutlined} 
                                      style={{ color: "#0077B5", width: "27px", height: "27px", marginRight: "25px", cursor: "pointer" }}
                                      onClick={(e) => {
                                        this.handleDownloadCertification(this.state.student_details.student_details.resume_url);
                                      }}
                                    />
                                    <span className={`${classes.attachmentName}`}>{this.state.student_details.student_details.resume}</span>
                                  </div>
                                ) : " - " }
                            </Grid>
  
                            <Grid item xs={12} sm={12} md={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Certifications</span>
                            </Grid>
                            {(this.state.student_details && this.state.student_details.student_attachment &&this.state.student_details.student_attachment.length > 0) ? this.state.student_details.student_attachment.map((attachment, index) => 
                                <Grid container className={`${classes.root} ${classes.mb30}`} spacing={4}>
                                  {(attachment.certification && attachment.certification_url) ? (
                                    <Grid item xs={12} sm={12} md={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.attachmentInfo}`}>
                                      <IconF 
                                        icon={cloudDownloadOutlined} 
                                        style={{ color: "#0077B5", width: "27px", height: "27px", marginRight: "25px", cursor: "pointer" }}
                                        onClick={(e) => {
                                          this.handleDownloadCertification(attachment.certification_url);
                                        }}
                                      />
                                      <span className={`${classes.attachmentName}`}>{attachment.certification}</span>
                                    </Grid>
                                  ) : ""}
                                </Grid>                           
                              ) :
                              <Grid item xs={12} sm={12} md={12} className={classes.py0 + ' ' + classes.textCenter + ' ' + classes.mb30}>
                                No Certifications Detail Available
                              </Grid>
                            }
  
                            <Grid item xs={12} sm={12} md={12} className={`${classes.py0} ${classes.candidateInfo} ${classes.mb30}`}>
                              <span>Social Links</span>
                            </Grid>
                            <Grid container className={`${classes.root} ${classes.mb30}`} spacing={4}>
                              <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                                <span>GitHub</span>
                                {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.github_url)?this.state.student_details.student_details.github_url:"-"}
                              </GridItem>
                              <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                                <span>Linkedin</span>
                                {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.linkedin_url)?`${this.state.student_details.student_details.linkedin_url}`:"-"}
                              </GridItem>
                              <GridItem xs={12} md={4} className={`${classes.candidateInfo} ${classes.mb30}`}>
                                <span>Personal Website</span>
                                {(this.state.student_details && this.state.student_details.student_details && this.state.student_details.student_details.website_url)?`${this.state.student_details.student_details.website_url}`:"-"}
                              </GridItem>
                            </Grid>
                        </div>
                      )
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

      </div>
    )
  }
}
const mapStatetoProps = state => {
  // console.log("maptostate : ",state)
  return {
    user: state.authReducer.user,
    career_path: state.authReducer.career_path
  }
}
const mapDispatchtoProps = { getProfileLatestData, fetchCareerPath }
const combinedStyles = combineStyles(customSelectStyle, dashboardStyle, styles, customStyle);
export default connect(mapStatetoProps, mapDispatchtoProps)(withStyles(combinedStyles)(SpecSheet))
