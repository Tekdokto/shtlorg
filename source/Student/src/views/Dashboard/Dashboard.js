import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import { useSelector, shallowEqual } from 'react-redux'
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

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
import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js"
import EditIcon from '@material-ui/icons/Edit';

import Table from "components/Table/Table.js";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import ProfilePic from "../../assets/img/profile-pic.png";
import DefaultProfilePic from "../../assets/img/default-avatar.png";
import CalendarIcon from "../../assets/img/calendar-icon.svg";
import MailIcon from "../../assets/img/mail-icon.svg";
import PhoneIcon from "../../assets/img/phone.svg";
import UniversityIcon from "../../assets/img/university-icon.svg";
import CheckLiIcon from "../../assets/img/check-li.svg";
import TempGraph from "../../assets/img/temp-graph.png";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { classnames } from "classnames";
import { Home } from "@material-ui/icons/Home";

import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "constants/defaultValues.js";
import { logoutUser, getAllSkills, getProfileLatestData } from "../../redux/action";
import combineStyles from '../../combineStyles';
import moment from "moment";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// const useStyles = makeStyles(styles);

class Dashboard extends React.Component {
  // const classes = useStyles();
  // const user = useSelector(state => state.authReducer.user,shallowEqual)
  constructor(props) {
    super(props);
    this.props = props;
    this.hangleProfilePic = this.hangleProfilePic.bind(this);
    this.state = {
      user: null,
      user_deatils: null,
      other_company_data: [],
      skills: "",
      selected_profile_pic : null,
    }
  }

  filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
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
    this.props.getAllSkills();
    this.fetchDashboardList(this.props.user.user_id)
    this.props.getProfileLatestData(
      { user_id: this.props.user.user_id },
      this.props.history
    );
    ths.showLoader();
    setTimeout(() => {
      ths.hideLoader()
    }, 1500)
  }
  createTablecontent(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: key + 1,
        company_name: (prop['company_name']) ? prop['company_name'] : " - ",
        position: (prop['position']) ? prop['position'] : " - ",
        place: (prop['place']) ? prop['place'] : " - ",
        salary: (prop['salary']) ? prop['salary'] : " - ",
        interviewed: (prop['interviewed']) ? prop['interviewed'] : " - ",
        has_offer: (prop['has_offer']) ? prop['has_offer'] : " - ",
      };
    }) : []
  }

  async fetchDashboardList(id) {
    let params = {}
    params.user_id = `${this.props.user.user_id}`;
    let response = await this.fetchDashboardCall(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push('/candidate/dashboard')
      } else {
        if (response.data) {
          console.log("SPECSHEET DATTA:", response)
          if (response.data) {
            if (response.data.user_deatils.student_details.length > 0) {
              let skills_ids = response.data.user_deatils.student_details[0].skills;
              let skills_array = this.props.all_skills.filter((skill) => (skills_ids.includes(skill.id)))
              let skill_name_arr = skills_array.map((skill) => skill.skill_name)
              let skill_string = (skill_name_arr.length > 0) ? skill_name_arr.join(',') : " - "
              this.setState({
                skills: skill_string
              })
            }
          }
          this.setState({
            user_deatils: response.data.user_deatils,
            other_company_data: response.data.other_company_data
          })
        }
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchDashboardCall(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }

    const res = await axios.post(`${API_URL}/student/getdashboard`, params, headers);
    return await res.data;
  }

  calculateProgress() {
    let current_progress = 0;
    let spec_sheet_updated = 0;
    let progress = 0;
    if (this.props.user) {
      current_progress = this.state.user_deatils && this.state.user_deatils.current_progress_status ? this.state.user_deatils.current_progress_status : 0;
      spec_sheet_updated = this.state.user_deatils && this.state.user_deatils.is_spec_sheet_added ? this.state.user_deatils.is_spec_sheet_added : 0;
      if (current_progress >= 1) {
        progress += 25
      }
      if (current_progress >= 2) {
        progress += 25
      }
      if (current_progress >= 3) {
        progress += 25
      }
      if (spec_sheet_updated == 1) {
        progress += 25
      }
      return progress
    } else {
      return 0
    }
  }

  handleClick = (e) => {
    this.inputElement.click();
  }

  hangleProfilePic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log("Event : ",e.target.files[0])
      if((e.target.files[0].size / 1024) <= 1024 ){
        const reader = new FileReader()
        let ths =this;        

        this.updateProfilePic(e.target.files[0]);
        reader.addEventListener('load', () =>
            ths.setState({
              selected_profile_pic : reader.result,
            }),
            false
        )
        reader.readAsDataURL(e.target.files[0])
      } else {
        toast.error("Allowed maximum image size is 1 MB.")
        return false
      }   
    } else {
      return false
    }
  }

  async updateProfilePic(profile_pic) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { "Content-Type": "multipart/form-data", token: `${token}` } }

    let user_obj  = new FormData();
    user_obj.append("user_id", `${this.props.user.user_id}`);
    if(profile_pic){
      // console.log("profile_pic:", profile_pic)
      user_obj.append("profile_pic",profile_pic)
    }

    const response = await axios.post(`${API_URL}/student/updateprofilepic`, user_obj, headers)
    // console.log("Response",response.data);
    if(response.data.status !== -2){
      if (response.data.status === false) {
          toast.error(response.data.message)               
      } else {
        toast.success("Profile picture updated successfully.")
      }
    }else{
        toast.error(response.data.message)
        this.props.logoutUser(this.props.history)
    }

    let ths = this;
    setTimeout(() => {
      ths.props.getProfileLatestData(
        { user_id: ths.props.user.user_id },
        ths.props.history
      );      
    }, 500);
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <Hidden xsDown>
            <CustomBreadscrumb {...{ ...this.props, user }} />
          </Hidden>

          <GridItem xs={12}>
            <h1>Welcome{" "}{(this.state.user_deatils) ? ((this.state.user_deatils.full_name) ? this.state.user_deatils.full_name : "User") : "User"}{"!"}</h1>
            <h5>Check your progress</h5>
          </GridItem>
        </GridContainer>
        <GridContainer spacing={10}>
          <GridItem xs={12} lg={7}>

            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Candidate Profile
            </CardHeader>

              <CardBody className="cardCustomBody">
                <Grid container>
                  <Grid className="dashboardProfileLeft">
                    <div className="profileImageWrapper">
                      <img src={(this.state.selected_profile_pic !== null) ? this.state.selected_profile_pic : ((this.state.user_deatils && this.state.user_deatils.profile_pic) ? this.state.user_deatils.profile_pic : DefaultProfilePic )} className="profileImage"></img>

                      <Button
                        color="info"
                        size="lg"
                        className="dashboardPofileEditBtn"
                        onClick={e=>{ this.handleClick(e)}}
                      >
                        <EditIcon />
                        <input type="file" accept="image/*"  ref={input => this.inputElement = input} onChange={this.hangleProfilePic} style={{"display":"none"}}/>
                      </Button>
                    </div>
                  </Grid>
                  <Grid className="dashboardProfileRight">
                    <Grid className="userName">{(this.state.user_deatils) ? ((this.state.user_deatils.full_name) ? this.state.user_deatils.full_name : " - ") : " - "}</Grid>
                    <Grid>
                      <ul className="userInfo">
                        <li>
                          <img src={CalendarIcon}></img> {(this.state.user_deatils) ? ((this.state.user_deatils.created_date && moment(this.state.user_deatils.created_date).format("MMM DD,YYYY") !== "Invalid date") ? moment(this.state.user_deatils.created_date).format("MMM DD,YYYY") : " - ") : " - "}
                        </li>
                        <li>
                          <img src={MailIcon}></img> {(this.state.user_deatils) ? ((this.state.user_deatils.email) ? this.state.user_deatils.email : " - ") : " - "}
                        </li>
                        {/* <li> <img src={UniversityIcon}></img>
                          {(this.state.user_deatils)
                            ? ((this.state.user_deatils.student_education.length > 0)
                              ? ((this.state.user_deatils.student_education[0].institution_name)
                                ? this.state.user_deatils.student_education[0].institution_name : " - ") : " - ") : " - "}
                        </li> */}
                        <li>
                          <img src={PhoneIcon}></img> {(this.state.user_deatils) ? ((this.state.user_deatils.phone) ? this.state.user_deatils.phone : " - ") : " - "}
                        </li>
                      </ul>
                    </Grid>
                    <Grid className="skills">
                      <span>Skills : </span> {(this.state.skills && this.state.skills != "") ? this.state.skills : ""}
                    </Grid>
                    <Grid className="skills">
                      <span>Status : </span>{(this.state.user_deatils) ? ((this.state.user_deatils.looking_for_job === 0) ? "Hired" : "Actively looking for job") : "Actively looking for job"}
                    </Grid>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} lg={5}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Shtudy Progress
            </CardHeader>
              <CardBody className="cardCustomBody pr0">
                <Grid container>
                  <Grid sm={5} xs={12}>
                    <CircularProgressbar
                      value={this.calculateProgress()}
                      text={`${this.calculateProgress()}%`}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 1 / 2 + 1 / 8,
                        strokeLinecap: "butt",
                        trailColor: "#eee",
                      })}
                    />
                  </Grid>
                  <Grid xs={12} sm={7}>
                    <ul className="simple-list">
                      <li className="has-bg manage-space">
                        Entry Exam{" "}
                        {(this.state.user_deatils) ? ((this.state.user_deatils.current_progress_status >= 1) ? <img src={CheckLiIcon} className="check-icon"></img> : " ") : ""}
                      </li>
                      <li className="manage-space">
                        My Resume
                      {(this.state.user_deatils) ? ((this.state.user_deatils.is_spec_sheet_added === 1) ? <img src={CheckLiIcon} className="check-icon"></img> : " ") : ""}
                      </li>
                      <li className="manage-space">
                        Interview Prep Library
                      {(this.state.user_deatils) ? ((this.state.user_deatils.current_progress_status >= 2) ? <img src={CheckLiIcon} className="check-icon"></img> : " ") : ""}
                      </li>
                      <li className="has-bg manage-space">
                        Mock Interview
                      {(this.state.user_deatils) ? ((this.state.user_deatils.current_progress_status >= 3) ? <img src={CheckLiIcon} className="check-icon"></img> : " ") : ""}
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Companies Interested
            </CardHeader>
              <CardBody className="cardCustomBody">
                <ReactTable
                  noDataText={"No data found"}
                  data={this.createTablecontent(this.state.other_company_data)}
                  filterable
                  columns={[
                    {
                      Header: "#",
                      accessor: "sr_no",
                      width: 50,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Company",
                      accessor: "company_name",
                      width: 160,
                      sortable: false,
                      filterable: true
                    },
                    {
                      Header: "Position",
                      accessor: "position",
                      width: 160,
                      sortable: false,
                      filterable: true
                    },
                    {
                      Header: "Location",
                      accessor: "place",
                      width: 160,
                      sortable: false,
                      filterable: true
                    },
                    {
                      Header: "Salary",
                      accessor: "salary",
                      width: 130,
                      sortable: false,
                      filterable: true
                    },
                    {
                      Header: "Has Offer",
                      accessor: "has_offer",
                      width: 110,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Interviewed",
                      accessor: "interviewed",
                      width: 125,
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultFilterMethod={(filter, row) => this.filterCaseInsensitive(filter, row)}
                  defaultPageSize={(this.state.other_company_data.length === 0) ? 3 : this.state.other_company_data.length}
                  showPaginationBottom={false}
                  className="-striped -highlight"
                  resizable={false}
                // onFetchData={(state, instance) => {
                //   // show the loading overlay                        
                //   // fetch your data   
                //   // console.log("STATEL:", state)
                //   this.setState({ page: state.page, pagesize: state.pageSize })
                //   this.getDataFromDb(state);
                // }}
                />
                {/* <Table
                striped
                tableHead={[
                  "#",
                  "Company",
                  "Position",
                  "Place",
                  "Salary",
                  "Interviewed",
                ]}
                tableData={[
                  ["1", "IBM", "Software Engineer", "NY", "$9000", "Yes"],
                  ["2", "Apple", "Data Analyst", "BOS", "$10000", "Yes"],
                  ["3", "Microsoft", "Data Analyst", "NY", "$9000", "No"],
                ]}
                customCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customClassesForCells={[0, 5, 6]}
                customHeadCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customHeadClassesForCells={[0, 5, 6]}
              /> */}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
    all_skills: state.authReducer.all_skills,
  };
};

const mapDispatchToProps = { logoutUser, getAllSkills, getProfileLatestData };
const combinedStyles = combineStyles(styles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(Dashboard))
