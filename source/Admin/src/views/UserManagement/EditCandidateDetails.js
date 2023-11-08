import React, { Fragment } from "react";
import { connect } from "react-redux";
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
import * as Datetime from "react-datetime";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../constants/defaultValues.js";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import combineStyles from "../../combineStyles";
import moment from "moment";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Icon as IconF, InlineIcon } from '@iconify/react';
import fileDocumentOutline from '@iconify/icons-mdi/file-document-outline';
import VideoPlayer from "assets/img/video-player.jpg";
import TextField from "@material-ui/core/TextField";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {
  logoutUser,
  getAllcities,
  getAllSkills,
  fetchCareerPath,
} from "../../redux/action";

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
  },
}));

// const classesCustom = useCustomSpace();
// const customStyle = useCustomStyle();
class SpecSheet extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;    
   
    this.handleEmploymentType = this.handleEmploymentType.bind(this);
    this.handleInterestRemoteChange = this.handleInterestRemoteChange.bind(
      this
    );
    this.addNewWorkHistory = this.addNewWorkHistory.bind(this);
    this.addNewOtherDetail = this.addNewOtherDetail.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChangeResume = this.handleChangeResume.bind(this);
    this.handleChangeRemoveResume = this.handleChangeRemoveResume.bind(this);
    this.handleChangeCertification = this.handleChangeCertification.bind(this);
    this.handleChangeRemoveCertification = this.handleChangeRemoveCertification.bind(this);
    this.state = {
      selectedDate: new Date(),
      user: null,
      hidewatchlist : 0,
      student_id : 0,
      cities: [],
      career_path: [],
      minDate: moment("1900-01-01").format("YYYY-MM-DD"),
      maxDate: moment(new Date()).format("YYYY-MM-DD"),
      all_skills: [],
      student_working_history_editable_index: 0,
      student_education_editable_index: 0,
      resume_data : "",
      resume_url: "",
      resume_remove: 0,
      certification_data: [],
      certification_remove_data: [],
      certification_remove: 0,
      // Edit Details
      student_details: [
        {
          experience_level: 0, // 1 - student , ...
          currently_lived: 0, // city id
          employment_type: -1, // 0 - part time  ,  1 - full time
          interested_remortely: "0", // 0 - no , 1 - yes
          willing_to_works: "", // text
          looking_for_role: "", // text
          skills: "", // all selected skill of student
          bio: "",
          anything_else_details: "",
          github_url: "",
          linkedin_url: "",
          website_url: ""
        },
      ],
      student_details_default_obj: {
        experience_level: 0, // 1 - student , ...
        currently_lived: 0, // city id
        employment_type: -1, // 0 - part time  ,  1 - full time
        interested_remortely: "0", // 0 - no , 1 - yes
        willing_to_works: "", // text
        looking_for_role: "", // text
        skills: "", // all selected skill of student
        bio: "",
        anything_else_details: "",
        github_url: "",
        linkedin_url: "",
        website_url: ""
      },
      experience_level: 0, // 1 - student , ...
      currently_lived: 0, // city id
      employment_type: -1, // 0 - part time  ,  1 - full time
      interested_remortely: "0", // 0 - no , 1 - yes
      willing_to_works: "", // text
      looking_for_role: "", // text
      skills: "", // all selected skill of student
      bio: "", // text
      //  Edit Work History
      student_work_history: [
        {
          id: 0,
          user_id: 0,
          company_name: "",
          job_title: "",
          description: "",
          start_date: "",
          end_date: "",
          is_present: 0
        }
      ],
      // Edit Other Details
      student_education: [
        {
          id: 0,
          user_id: 0,
          institution_name: "",
          degree_name: "",
          description: "",
          start_date: "",
          end_date: "",
          is_present: 0
        }
      ],
      // Edit Attachment
      student_attachment: []
    };
  }
 
  formatedDate(date) {
    if (date) {
      // console.log("arjgbjhsdb:", date, moment(date).format("YYYY-MM-DD"));
      return moment(date).format("YYYY-MM-DD");
    } else {
      return "";
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);
    let check_all_cities_master_data =
      state.cities.length !== props.cities.length;
    let check_all_skills_master_data =
      state.all_skills.length !== props.all_skills.length;

    if (check_all_cities_master_data || check_all_skills_master_data) {
      return {
        user: props.user ? props.user : state.user,
        all_skills: props.all_skills ? props.all_skills : [],
        cities: props.cities ? props.cities : [],
        career_path: props.career_path ? props.career_path : [],
      };
    } else {
      return {
        ...state,
      };
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
    this.props.getAllcities();
    this.props.getAllSkills();
    this.props.fetchCareerPath();
    let { match } = this.props;
    let student_id = 0;
    console.log("Propsss:",match,student_id)
    if(match.params.id){
      student_id = match.params.id;
      if(match.params.hide === "1"||match.params.hide === 1){
        this.setState({
          hidewatchlist : 1
        })
      }
      this.setState({
        student_id: student_id
      })
    }
    if(+(student_id) > 0){
      this.getGetStudentDetail({"admin_id":this.props.user.user_id,"student_id": student_id })
    }
    ths.showLoader();
    setTimeout(() => {
      ths.hideLoader()
    }, 1000)
  }

  async getGetStudentDetail(params){
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }    
    const response = await axios.post(`${API_URL}/user/geteditstudentdetails`,params,headers);

    console.log("DATTA:",response)
    if(response.data.status !== -2){
      if(response.data.status === false){
       
        this.props.history.push("/admin/dashboard");
      }else{
        this.setState({        
          student_details : (response.data.data && response.data.data.student_details.length > 0) ? response.data.data.student_details : [this.state.student_details_default_obj],
          student_work_history : (response.data.data && response.data.data.student_work_history.length > 0) ? response.data.data.student_work_history : this.state.student_work_history,
          student_education : (response.data.data && response.data.data.student_education.length > 0) ? response.data.data.student_education : this.state.student_education,
          student_attachment : (response.data.data && response.data.data.student_attachment.length > 0) ? response.data.data.student_attachment : this.state.student_attachment,
        })
      }
    }else{
      this.props.logoutUser(this.props.history)
    }
  }

  //  ######### Start functions Edit Details ###########
  // experience select dropdown
  handleExperienceSelect = (event) => {
    // console.log("Event", event.target.value);
    let temp_student_details = this.state.student_details;
    temp_student_details[0].experience_level = event.target.value;
    this.setState({
      student_details: temp_student_details,
    });
    // this.setExperienceLevel(event.target.value)
  };
  // setExperienceLevel(val) {
  //   this.setState({
  //     experience_level: val
  //   })
  // }
  // Where do you live select dropdown
  handleWhereDoYouLive = (event) => {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].currently_lived = event.target.value;
    this.setState({
      student_details: temp_student_details,
    });
    // this.setWhereDoYouLive(event.target.value)
  };

  // setWhereDoYouLive(val) {
  //   this.setState({
  //     currently_live: val
  //   })
  // }
  // What type of employment required
  handleEmploymentType = (event) => {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].employment_type = event.target.value;
    this.setState({
      student_details: temp_student_details,
    });
    // this.setEmploymentType(event.target.value)
  };
  // setEmploymentType(val) {
  //   this.setState({
  //     employment_type: val
  //   })
  // }
  // multi select skills dropdown
  handleMultiSelectSkills = (event) => {
    // console.log("Skills drop down : ", event.target);
    let temp_student_details = this.state.student_details;
    temp_student_details[0].skills = event.target.value.join(",");
    this.setState({
      student_details: temp_student_details,
    });
    // this.setSkills(event.target.value)
  };
  // setSkills(val) {
  //   this.setState({
  //     skills: val
  //   })
  // }
  // remote work interest change radio handle
  handleInterestRemoteChange(event) {
    // console.log("radio:", event.target.value);
    // console.log("Skills drop down : ", event.target)
    let temp_student_details = this.state.student_details;
    temp_student_details[0].interested_remortely = `${event.target.value}`;
    this.setState({
      student_details: temp_student_details,
    });
    // this.setState({
    //   interested_remortely: event.target.value
    // })
  }

  handleWillingToWork(event) {
    // console.log("radio:", event.target.value);
    let temp_student_details = this.state.student_details;
    temp_student_details[0].willing_to_works = `${event.target.value}`;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleLookingForRole(event) {
    // console.log("radio:", event.target.value);
    let temp_student_details = this.state.student_details;
    temp_student_details[0].looking_for_role = `${event.target.value}`;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeBio(event) {
    // console.log("radio:", event.target.value);
    let temp_student_details = this.state.student_details;
    temp_student_details[0].bio = `${event.target.value}`;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeAnythingElse(val = "") {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].anything_else_details = val;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeGithubUrl(val = "") {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].github_url = val;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeLinkedinUrl(val = "") {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].linkedin_url = val;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeWebsiteUrl(val = "") {
    let temp_student_details = this.state.student_details;
    temp_student_details[0].website_url = val;
    this.setState({
      student_details: temp_student_details,
    });
  }

  handleChangeResume(e) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
        // console.log("handleChangeResume : ",e.target.files[0]);
        this.setState({
          resume_data: e.target.files[0],
          resume_url: e.target.files[0].name
        });
    } else {
      return false
    }
  }

  handleChangeRemoveResume(is_new = false) {
    // console.log('handleChangeRemoveResume ===>', is_new);
    if(is_new) {
      this.setState({
        resume_data: "",
        resume_url: ""
      });
    } else {
      this.setState({
        resume_remove: 1
      });
    }
  }

  handleChangeCertification(e) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
        // console.log("handleChangeCertification : ", e.target.files);

        let temp_student_attachment = this.state.student_attachment;
        let temp_certification_data = this.state.certification_data;
        for (const key of Object.keys(e.target.files)) {
            let new_attachment_obj = {
              id: 0,              
              user_id: 0,
              certification: e.target.files[key].name,
              new_id: temp_certification_data.length + 1
            }
            temp_student_attachment.push(new_attachment_obj);
            temp_certification_data.push(e.target.files[key]);
        }        
        this.setState({
          certification_data: temp_certification_data,
          student_attachment: temp_student_attachment
        });
    } else {
      return false
    }
  }

  handleChangeRemoveCertification(index, is_new = false, attachment_obj = {}, new_id = 0) {    
    let temp_student_attachment = this.state.student_attachment;
    let temp = temp_student_attachment.splice(index, 1);
    // console.log('handleChangeRemoveCertification ===>', index, is_new, this.state.student_attachment, this.state.certification_data, new_id);
    
    if(is_new) {
      let temp_certification_data = this.state.certification_data;
      let temp1 = temp_certification_data.splice(new_id, 1);
      this.setState({
        certification_data : temp_certification_data,
        student_attachment: temp_student_attachment
      });
    } else {
      let temp_certification_remove_data = this.state.certification_remove_data;
      let remove_attachment_obj = {
        id: attachment_obj.id,
        certification: attachment_obj.certification
      }
      temp_certification_remove_data.push(remove_attachment_obj);
      this.setState({
        certification_remove: 1,
        student_attachment: temp_student_attachment,
        certification_remove_data: temp_certification_remove_data
      });
    }
  }

  //  ######### End functions Edit Details ###########

  // ######## Start Edit Work history functions ##########
  addNewWorkHistory() {
    // let temp_work_history = this.state.student_work_history.filter((work_detail)=>work_detail.id === 0);
    let temp_work_history_arr = this.state.student_work_history;
    if (temp_work_history_arr.length >= 10) {
      toast.error("Maximum 10 work history allowed.");
    } else {
      let new_work_history_obj = {
        id: 0,
        user_id: 0,
        company_name: "",
        job_title: "",
        description: "",
        start_date: "",
        end_date: "",
        is_present: 0
      };
      temp_work_history_arr.push(new_work_history_obj);
      this.setState({ student_work_history: temp_work_history_arr });
      this.setState({ student_working_history_editable_index: this.state.student_work_history.length - 1 });
    }
  }
  removeWorkHistory(index) {
    let temp_work_history_arr = this.state.student_work_history;
    let temp = temp_work_history_arr.splice(index, 1);
    this.setState({ student_work_history: temp_work_history_arr });
  }
  editWorkHistory(index) {
    this.setState({
      student_working_history_editable_index: index,
    });
  }
  handleChangeCompanyName(index, id, val = "") {
    let temp_work_history_arr = this.state.student_work_history;
    temp_work_history_arr[index].company_name = val;
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  handleChangeJobTitle(index, id, val = "") {
    let temp_work_history_arr = this.state.student_work_history;
    temp_work_history_arr[index].job_title = val;
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  handleChangeStartDate(index, id, val = "") {
    let temp_work_history_arr = this.state.student_work_history;
    console.log("VALL:", val);
    if (val && val !== "" && moment(val).format("YYYY-MM-DD") !== "Invalid date") {
      temp_work_history_arr[index].start_date = moment(val).format(
        "YYYY-MM-DD"
      );
    } else {
      temp_work_history_arr[index].start_date = "";
    }
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  isValidDate(currentDate) {
    if (moment(currentDate).diff(moment(), "hours") < 1) {
      return true;
    } else {
      return false;
    }
  }
  handleChangeEndDate(index, id, val = "") {
    let temp_work_history_arr = this.state.student_work_history;
    if (val && val !== "" && moment(val).format("YYYY-MM-DD") !== "Invalid date") {
      temp_work_history_arr[index].end_date = moment(val).format("YYYY-MM-DD");
    } else {
      temp_work_history_arr[index].end_date = "";   
    }
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  handleChangeWorkHistoryPresent(index, id, val = "") {    
    let temp_work_history_arr = this.state.student_work_history;
    temp_work_history_arr.map(item => (
      item.is_present = 0
    ))
    temp_work_history_arr[index].end_date = "";
    temp_work_history_arr[index].is_present = val;
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  handleChangeJobDescription(index, id, val = "") {
    let temp_work_history_arr = this.state.student_work_history;
    temp_work_history_arr[index].description = val;
    this.setState({
      student_work_history: temp_work_history_arr,
    });
  }
  // ######## End Edit Work history functions ##########

  // ######## Start Edit Other Details functions ##########
  addNewOtherDetail() {
    let temp_student_education = this.state.student_education;
    if (temp_student_education.length >= 3) {
      toast.error("Maximum 3 education details allowed.");
    } else {
      let new_other_details_obj = {
        id: 0,
        user_id: 0,
        institution_name: "",
        degree_name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_present: 0
      };
      temp_student_education.push(new_other_details_obj);
      this.setState({ student_education: temp_student_education });
    }
  }
  removeOtherDetail(index) {
    let temp_student_education = this.state.student_education;
    let temp = temp_student_education.splice(index, 1);
    this.setState({ student_education: temp_student_education });
  }
  editOtherDetail(index) {
    // console.log("TEST:", index);
    this.setState({
      student_education_editable_index: index,
    });
  }
  handleChangeInstituteName(index, val = "") {
    let temp_student_education = this.state.student_education;
    temp_student_education[index].institution_name = val;
    this.setState({
      student_education: temp_student_education,
    });
  }
  handleChangeDegreeName(index, val = "") {
    let temp_student_education = this.state.student_education;
    temp_student_education[index].degree_name = val;
    this.setState({
      student_education: temp_student_education,
    });
  }
  handleChangeEducationStartDate(index, id, val = "") {
    let temp_student_education = this.state.student_education;
    console.log("VALL:", val);
    if (val && val !== "" && moment(val).format("YYYY-MM-DD") !== "Invalid date") {
      temp_student_education[index].start_date = moment(val).format(
        "YYYY-MM-DD"
      );
    } else {
      temp_student_education[index].start_date = "";
    }
    this.setState({
      student_education: temp_student_education,
    });
  }
  handleChangeEducationEndDate(index, id, val = "") {
    let temp_student_education = this.state.student_education;
    if (val && val !== "" && moment(val).format("YYYY-MM-DD") !== "Invalid date") {
      temp_student_education[index].end_date = moment(val).format("YYYY-MM-DD");
    } else {
      temp_student_education[index].end_date = "";   
    }
    this.setState({
      student_education: temp_student_education,
    });
  }
  handleChangeEducationPresent(index, id, val = "") {    
    let temp_student_education = this.state.student_education;
    temp_student_education.map(item => (
      item.is_present = 0
    ))
    temp_student_education[index].end_date = "";
    temp_student_education[index].is_present = val;
    this.setState({
      student_education: temp_student_education,
    });
  }
  handleChangeInstituteDescription(index, val = "") {
    let temp_student_education = this.state.student_education;
    temp_student_education[index].description = val;
    this.setState({
      student_education: temp_student_education,
    });
  }
  // ######## End Edit Other Details functions ##########
  checkStudentDetails(student_detail_obj) {
    let temp_student_detail = student_detail_obj[0];
    if (
      !temp_student_detail.experience_level ||
      temp_student_detail.experience_level == 0
    ) {
      toast.error("Please select Experience Level.");
      return false;
    } else if (
      !temp_student_detail.currently_lived ||
      temp_student_detail.currently_lived == 0
    ) {
      toast.error("Please select where do you currently live.");
      return false;
    } else if (
      (temp_student_detail.employment_type === 'undefined') ||
      temp_student_detail.employment_type == -1
    ) {
      toast.error("Please select employment type.");
      return false;
    } else if (
      !temp_student_detail.willing_to_works ||
      (temp_student_detail.willing_to_works &&
        temp_student_detail.willing_to_works.trim() == "")
    ) {
      toast.error("Please write where geographically are you willing to work.");
      return false;
    } else if (
      !temp_student_detail.looking_for_role ||
      (temp_student_detail.looking_for_role &&
        temp_student_detail.looking_for_role.trim() == "")
    ) {
      toast.error("Please write what kind of role in an organization are you looking for.");
      return false;
    } else if (
      !temp_student_detail.skills ||
      (temp_student_detail.skills && temp_student_detail.skills == "")
    ) {
      toast.error("Please select at least one skill.");
      return false;
    } else if (
      !temp_student_detail.bio ||
      (temp_student_detail.bio && temp_student_detail.bio.trim() == "")
    ) {
      toast.error("Please write something about yourself.");
      return false;
    } else {
      return true;
    }
  }
  checkWorkHistory(work_history) {
    if (work_history.length > 0) {
      let condition = true;
      if(work_history.length == 1 && !work_history[0].company_name && !work_history[0].job_title && !work_history[0].start_date && !work_history[0].end_date) {
        return condition;
      }
      for (let i = 0; i < work_history.length; i++) {
        if (!work_history[i].company_name) {
          toast.error(`Please write company name of Company ${i + 1}`);
          condition = false;
          break;
        } else if (!work_history[i].job_title) {
          toast.error(`Please write job title of Company ${i + 1}`);
          condition = false;
          break;
        } else if (
          !work_history[i].start_date ||
          moment().diff(moment(work_history[i].start_date), "days") <= 1 ||
          !(
            moment("1900-01-01").diff(
              moment(work_history[i].start_date),
              "days"
            ) <= 1
          )
        ) {
          // console.log("TESST:",moment().diff(moment(work_history[i].start_date), "days") <= 1,moment().diff(moment(work_history[i].start_date), "days"));
          if (
            moment().diff(moment(work_history[i].start_date), "days") <= 1 ||
            !(
              moment("1900-01-01").diff(
                moment(work_history[i].start_date),
                "days"
              ) <= 1
            )
          ) {
            toast.error(`Please select valid start date in Company ${i + 1}`);
          } else {
            toast.error(`Please select start date in Company ${i + 1}`);
          }
          condition = false;
          break;
        } else if (
          !work_history[i].end_date ||
          moment().diff(moment(work_history[i].end_date), "days") < 0 ||
          !(
            moment("1900-01-01").diff(
              moment(work_history[i].start_date),
              "days"
            ) <= 1
          )
        ) {
          if (
            moment().diff(moment(work_history[i].end_date), "days") <= 1 ||
            !(
              moment("1900-01-01").diff(
                moment(work_history[i].start_date),
                "days"
              ) <= 1
            )
          ) {
            toast.error(`Please select valid end date in Company ${i + 1}`);
            condition = false;
            break;
          } else {
              // if(work_history.length !== i + 1) {
              //   toast.error(`Please select end date in Company ${i + 1}`);
              //   condition = false;
              //   break;
              // }
              if(!work_history[i].is_present) {
                toast.error(`Please select end date in Company ${i + 1}`);
                condition = false;
                break;
              }
          }
        } else if (
          !(
            moment(work_history[i].end_date).diff(
              moment(work_history[i].start_date),
              "days"
            ) > 0
          )
        ) {
          toast.error(
            `Please select valid start date and end date in Company ${i + 1}`
          );
          condition = false;
          break;
        }
      }
      return condition;
    } else {
      return true;
    }
  }
  checkOtherDetails(education_details) {
    let condition = true;
    // if (education_details.length > 0) {
    if(education_details.length == 1 && !education_details[0].institution_name && !education_details[0].degree_name && !education_details[0].description && !education_details[0].start_date && !education_details[0].end_date) {
      return condition;
    }
    for (let i = 0; i < education_details.length; i++) {
      if (!education_details[i].institution_name) {
        toast.error(`Please write institution name of Education ${i + 1}`);
        condition = false;
        break;
      } else if (!education_details[i].degree_name) {
        toast.error(`Please write degree name of Education ${i + 1}`);
        condition = false;
        break;
      }  else if (
        !education_details[i].start_date ||
        moment().diff(moment(education_details[i].start_date), "days") <= 1 ||
        !(
          moment("1900-01-01").diff(
            moment(education_details[i].start_date),
            "days"
          ) <= 1
        )
      ) {
        // console.log("TESST:",moment().diff(moment(education_details[i].start_date), "days") <= 1,moment().diff(moment(education_details[i].start_date), "days"));
        if (
          moment().diff(moment(education_details[i].start_date), "days") <= 1 ||
          !(
            moment("1900-01-01").diff(
              moment(education_details[i].start_date),
              "days"
            ) <= 1
          )
        ) {
          toast.error(`Please select valid start date in Education ${i + 1}`);
        } else {
          toast.error(`Please select start date in Education ${i + 1}`);
        }
        condition = false;
        break;
      } else if (
        !education_details[i].end_date ||
        moment().diff(moment(education_details[i].end_date), "days") < 0 ||
        !(
          moment("1900-01-01").diff(
            moment(education_details[i].start_date),
            "days"
          ) <= 1
        )
      ) {
        if (
          moment().diff(moment(education_details[i].end_date), "days") <= 1 ||
          !(
            moment("1900-01-01").diff(
              moment(education_details[i].start_date),
              "days"
            ) <= 1
          )
        ) {
          toast.error(`Please select valid end date in Education ${i + 1}`);
          condition = false;
          break;
        } else {
            // if(education_details.length !== i + 1) {
            //   toast.error(`Please select end date in Education ${i + 1}`);
            //   condition = false;
            //   break;
            // }
            if(!education_details[i].is_present) {
              toast.error(`Please select end date in Education ${i + 1}`);
              condition = false;
              break;
            }
        }
      } else if (
        !(
          moment(education_details[i].end_date).diff(
            moment(education_details[i].start_date),
            "days"
          ) > 0
        )
      ) {
        toast.error(
          `Please select valid start date and end date in Education ${i + 1}`
        );
        condition = false;
        break;
      } else if (!education_details[i].description) {
        toast.error(`Please write description for Education ${i + 1}`);
        condition = false;
        break;
      }
    }
    return condition;
    // } else {
    //   return false;
    // }
  }
 
  async updateSpecSheet() {
    // console.log("this.state.",this.state.student_details,this.state.student_work_history,this.state.student_education);
    if (this.state.student_details.length > 0) {
      if (this.checkStudentDetails(this.state.student_details)) {
        if (this.checkWorkHistory(this.state.student_work_history)) {
          if (this.checkOtherDetails(this.state.student_education)) {
            let update_obj  = new FormData();
            update_obj.append("id", `${this.state.student_id}`);
            update_obj.append("admin_id", `${this.props.user.user_id}`);            
            update_obj.append("experience_level", `${this.state.student_details[0].experience_level}`);
            update_obj.append("currently_lived", `${this.state.student_details[0].currently_lived}`);
            update_obj.append("employment_type", `${this.state.student_details[0].employment_type}`);
            update_obj.append("interested_remortely", `${this.state.student_details[0].interested_remortely}`);
            update_obj.append("willing_to_works", `${this.state.student_details[0].willing_to_works}`);
            update_obj.append("looking_for_role", `${this.state.student_details[0].looking_for_role}`);
            update_obj.append("skills", `${this.state.student_details[0].skills}`);
            update_obj.append("bio", `${this.state.student_details[0].bio}`);
            update_obj.append("anything_else_details", `${this.state.student_details[0].anything_else_details}`);
            update_obj.append("github_url", `${this.state.student_details[0].github_url}`);
            update_obj.append("linkedin_url", `${this.state.student_details[0].linkedin_url}`);
            update_obj.append("website_url", `${this.state.student_details[0].website_url}`);
            update_obj.append("resume_remove", this.state.resume_remove);
            update_obj.append("certification_remove", this.state.certification_remove);

            if(this.state.resume_data){
              // console.log("resume_data:",this.state.resume_data);
              update_obj.append("resume", this.state.resume_data)
            }

            if(this.state.certification_data){
              for (const key of Object.keys(this.state.certification_data)) {
                  // console.log("certification_data:",this.state.certification_data[key]);
                  update_obj.append("certification", this.state.certification_data[key])
              }              
            }

            if(this.state.student_work_history.length > 0 && this.state.student_work_history[0].company_name && this.state.student_work_history[0].job_title && this.state.student_work_history[0].start_date) {
              update_obj.append("working_history", JSON.stringify(this.state.student_work_history));
            }
            if(this.state.student_education.length > 0 && this.state.student_education[0].institution_name && this.state.student_education[0].degree_name && this.state.student_education[0].description && this.state.student_education[0].start_date) {
              update_obj.append("student_education", JSON.stringify(this.state.student_education));
            }
            
            if(this.state.certification_remove){
              update_obj.append("certification_remove_data", JSON.stringify(this.state.certification_remove_data));
            }

            // console.log("Update Object:", update_obj);

            let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
            let token = (User) ? ((User.token) ? User.token : '') : '';
            let headers = { headers: { "Content-Type": "multipart/form-data", token: `${token}` } }
            
            const response = await axios.post(`${API_URL}/user/update_specsheet`, update_obj, headers)
            // console.log("Response",response.data);
            if(response.data.status !== -2){
                if (response.data.status === false) {
                    toast.error(response.data.message)               
                } else {
                    this.setState({
                      resume_data: "",
                      resume_url: "",
                      resume_remove: 0,
                      certification_data: [],
                      certification_remove_data: [],
                      certification_remove: 0,
                    });
                    toast.success("Resume details updated successfully.")
                }
            }else{
                toast.error(response.data.message)
                this.props.logoutUser(this.props.history)
            }

            let ths = this;

            setTimeout(() => {
              ths.getGetStudentDetail({"admin_id":this.props.user.user_id,"student_id": this.state.student_id })             
            }, 500);
            const container = document.getElementById('pagescrollontop'); 
            container.scrollTop = 0;
            var ps = new PerfectScrollbar(container); 
          }
        }
      }
    } else {
      toast.error("Please Fill Spec Sheet Details Properly.");
    }
  }
  handleDateChange(e) {
    this.setState({
      selectedDate: e.target.value,
    });
  }
  render() {
    // console.log("this.render.", this.state);
    const { classes } = this.props;
    let ths = this;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={12}>
            <h1>Engineer Management</h1>
            <h5>Manage Engineers</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
              <Card className="paddingTopBottom cardCustom">
                <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                  Edit Candidate Details              
                </CardHeader>
                <CardBody className="cardCustomBody">
                  <CustomTabs
                    headerColor="transparent"
                    tabs={[
                      {
                        tabName: "Details",
                        tabContent: (                          
                          <Grid
                            container
                            className={`${classes.root} ${classes.mb30}`}
                            spacing={4}
                          >
                            <Grid
                              item
                              xs={12}
                              sm={5}
                              md={6}
                              className={classes.py0}
                            >
                              {/* <CustomInput
                                  labelText="School"
                                  id="emailLog"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                /> */}
                              <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                              >
                                <InputLabel
                                  htmlFor="experience-level-select"
                                  className={classes.selectLabel}
                                >
                                  Experience Level*
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu,
                                  }}
                                  classes={{
                                    select: classes.select,
                                  }}
                                  value={
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .experience_level
                                      : ""
                                  }
                                  onChange={this.handleExperienceSelect}
                                  inputProps={{
                                    name: "experience",
                                    id: "experience-level",
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={0}
                                  >
                                    Select Experience Level
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={1}
                                  >
                                    Undergraduate Student
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={2}
                                  >
                                    Graduate Student
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={3}
                                  >
                                    Entry Level
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={4}
                                  >
                                    Mid-level
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={5}
                                  >
                                    Senior-Level
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={7}
                              md={6}
                              className={classes.py0}
                            >
                              <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                              >
                                <InputLabel
                                  htmlFor="where-you-live-select"
                                  className={classes.selectLabel}
                                >
                                  Where do you currently live?* (List Closest Metropolitan)
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu,
                                  }}
                                  classes={{
                                    select: classes.select,
                                  }}
                                  value={
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .currently_lived
                                      : 0
                                  }
                                  onChange={this.handleWhereDoYouLive}
                                  inputProps={{
                                    name: "whereyoulive",
                                    id: "where-you-live",
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={0}
                                  >
                                    Select City
                                  </MenuItem>
                                  {this.state.cities.length > 0
                                    ? this.state.cities.map((city) => (
                                      <MenuItem
                                        classes={{
                                          root: classes.selectMenuItem,
                                        }}
                                        value={city.id}
                                      >
                                        {city.name}
                                      </MenuItem>
                                    ))
                                    : null}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={5}
                              md={6}
                              className={classes.py0}
                            >
                              <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                              >
                                <InputLabel
                                  htmlFor="what-type-employment"
                                  className={classes.selectLabel}
                                >
                                  What type of employment are you seeking?*
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu,
                                  }}
                                  classes={{
                                    select: classes.select,
                                  }}
                                  value={
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .employment_type
                                      : -1
                                  }
                                  onChange={this.handleEmploymentType}
                                  inputProps={{
                                    name: "experience",
                                    id: "experieence-level",
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={-1}
                                  >
                                    Select Type
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={0}
                                  >
                                    Part-Time
                                  </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={1}
                                  >
                                    Full-Time
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={7}
                              md={6}
                              className={classes.py0}
                            >
                              <FormControl component="fieldset">
                                <FormLabel className="label-radio">
                                  Are you interested in working remotely?*
                                </FormLabel>
                                <RadioGroup
                                  aria-label="interseted_remote"
                                  name="interseted_remote"
                                  value={
                                    this.state.student_details.length > 0
                                      ? +this.state.student_details[0]
                                        .interested_remortely
                                      : 0
                                  }
                                  onChange={this.handleInterestRemoteChange}
                                >
                                  <div class="radio-icons">
                                    <FormControlLabel
                                      value={1}
                                      control={<Radio />}
                                      label="Yes"
                                      className={`${classes.mr50} ${classes.primaryColor}`}
                                    />
                                    <FormControlLabel
                                      value={0}
                                      control={<Radio />}
                                      label="No"
                                      className={`${classes.primaryColor}`}
                                    />
                                  </div>

                                  {/* <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid 
                              item 
                              xs={12}
                              sm={5}
                              md={6} 
                              className={classes.py0}>
                              <CustomInput
                                labelText="Where geographically are you willing to work?*"
                                id="willing_to_works"
                                formControlProps={{
                                  fullWidth: true,
                                  className:"longlable"
                                }}
                                inputProps={{
                                  value:
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .willing_to_works
                                      : "",
                                  onChange: (e) => {
                                    this.handleWillingToWork(e);
                                  },
                                }}
                              />
                            </Grid>
                            <Grid 
                              item 
                              xs={12}
                              sm={7}
                              md={6}
                              className={classes.py0}>
                              <CustomInput
                                labelText="What kind of role in an organization are you looking for?*"
                                id="looking_for_role"
                              
                                formControlProps={{
                                  fullWidth: true,
                                  className:"longlable"
                                }}
                                inputProps={{
                                  value:
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .looking_for_role
                                      : "",
                                  onChange: (e) => {
                                    this.handleLookingForRole(e);
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.py0}>
                              {/* <CustomInput
                                  labelText="Hobbies"
                                  id="emailLog"
                                  multiline
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                /> */}
                              <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                              >
                                <InputLabel
                                  htmlFor="where-you-live-select"
                                  className={classes.selectLabel}
                                >
                                  What are your skills?* (Select all that apply)
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu,
                                  }}
                                  classes={{
                                    select: classes.select,
                                  }}
                                  multiple={true}
                                  value={
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0].skills != ""
                                        ? this.state.student_details[0].skills
                                          .split(",")
                                          .map((x) => +x)
                                        : []
                                      : []
                                  }
                                  onChange={(e) =>
                                    this.handleMultiSelectSkills(e)
                                  }
                                  inputProps={{
                                    name: "skills",
                                    id: "skills",
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem,
                                    }}
                                    value={0}
                                  >
                                    Select skills
                                  </MenuItem>
                                  {this.state.all_skills.map((skill) => {
                                    var skill_career_path_index = this.state.career_path.findIndex(x => x.id == skill.career_path_id);
                                    //var skill_name = (this.state.career_path.length > 0 && this.state.career_path[skill_career_path_index]) ? `${skill.skill_name}(${this.state.career_path[skill_career_path_index].career_name})`: skill.skill_name;
                                    var skill_name = skill.skill_name;
                                    if(skill.is_default_skill === 0) {
                                      return (
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                          value={skill.id}
                                        >
                                          {skill_name}
                                        </MenuItem>
                                      )
                                    }
                                  })}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} className={classes.py0}>
                              <CustomInput
                                labelText="Bio *"
                                id="float"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  value:
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0].bio
                                      : "",
                                  onChange: (e) => {
                                    this.handleChangeBio(e);
                                  },
                                  multiline: true,
                                  rows: 3,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.textCenter}>
                              <Button
                                color="info"
                                size="lg"
                                className={classes.newButton}
                                onClick={(e) => {
                                  this.updateSpecSheet();
                                }}
                              >
                                Submit
                              </Button>
                            </Grid>
                          </Grid>
                        ),
                      },
                      {
                        tabName: "Work History",
                        tabContent: (
                          <>
                            <GridContainer
                                spacing={6}
                                className={`${classes.mb30}`}
                              >
                                <Hidden>
                                  <GridItem xs={0} md={9} lg={10}></GridItem>
                                </Hidden>
                                <GridItem
                                  xs={12}
                                  md={3}
                                  lg={2}
                                  className={`${classes.mtResp30}`}
                                >
                                  <Button
                                    color="info"
                                    size="lg"
                                    fullWidth="true"
                                    className={`${customStyle.newButton} ${customStyle.mt15}`}
                                    onClick={(e) => ths.addNewWorkHistory()}
                                  >
                                    Add
                                  </Button>
                                </GridItem>
                            </GridContainer>                                                   
                            {ths.state.student_work_history.length > 0 ? (
                              ths.state.student_work_history.map(
                                (work_history, index) => (
                                  <Grid
                                    container
                                    className={`${classes.root} ${classes.mb30}`}
                                    spacing={4}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={5}
                                      className={classes.pb0}
                                      style={{ color: "#0077B5" }}
                                    >
                                      Company {index + 1}*
                                      {this.state
                                        .student_working_history_editable_index !==
                                        index ? (
                                          <Button
                                            color="info"
                                            size="xs"
                                            className={classes.labelIconButton}
                                            onClick={(e) => {
                                              this.editWorkHistory(index);
                                            }}
                                          >
                                            <BorderColorIcon />
                                          </Button>
                                        ) : null}
                                      <Button
                                        color="info"
                                        size="xs"
                                        className={classes.labelIconButton}
                                        onClick={(e) => {
                                          this.removeWorkHistory(index);
                                        }}
                                      >
                                        <DeleteOutlineIcon />
                                      </Button>
                                    </Grid>
                                    <Hidden>
                                      <Grid xs={0} sm={0} md={7}></Grid>
                                    </Hidden>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={classes.py0}
                                    >
                                      <CustomInput
                                        labelText="Company Name"
                                        id="company_name"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: work_history.company_name
                                            ? work_history.company_name
                                            : "",
                                          onChange: (e) => {
                                            ths.handleChangeCompanyName(
                                              index,
                                              work_history.id,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_working_history_editable_index ===
                                              index
                                              ? false
                                              : true,
                                        }}
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={classes.py0}
                                    >
                                      <CustomInput
                                        labelText="Job Title"
                                        id="job_title"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: work_history.job_title
                                            ? work_history.job_title
                                            : "",
                                          onChange: (e) => {
                                            ths.handleChangeJobTitle(
                                              index,
                                              work_history.id,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_working_history_editable_index ===
                                              index
                                              ? false
                                              : true,
                                        }}
                                      />
                                    </Grid>
                                    <Hidden>
                                      <Grid xs={0} sm={0} md={4}></Grid>
                                    </Hidden>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControl component="fieldset">
                                        <FormLabel className="label-radio label-time">
                                          Start Date
                                        </FormLabel>
                                        <Datetime
                                          defaultValue={
                                            work_history.start_date
                                              ? moment(
                                                work_history.start_date
                                              ).format("MM-DD-YYYY")
                                              : ""
                                          }
                                          isValidDate={this.isValidDate}
                                          dateFormat="MM-DD-YYYY"
                                          inputProps={{
                                            id: "start_date",
                                            placeholder: "Start Date",
                                            readOnly: true,
                                            disabled: this.state.student_working_history_editable_index === index ? false : true
                                          }}
                                          timeFormat={false}
                                          closeOnSelect={true}
                                          onChange={(e) =>
                                            ths.handleChangeStartDate(
                                              index,
                                              work_history.id,
                                              e
                                            )
                                          }
                                          disabled={
                                            this.state
                                              .student_working_history_editable_index ===
                                              index
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormControl>
                                      {/* <CustomInput
                                  labelText="Start Date"
                                  id="start_date"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type : "date",                                
                                    value: (work_history.start_date) ? this.formatedDate(work_history.start_date) : new Date(),
                                    onChange: ((e) => {
                                      ths.handleChangeStartDate(index, work_history.id, e.target.value)
                                    }),
                                    disabled:(this.state.student_working_history_editable_index === index)?false:true
                                  }}
                                /> */}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControl component="fieldset" className="student-custom-end-date">
                                        <FormLabel className="label-radio label-time">
                                          End Date
                                        </FormLabel>
                                        <Datetime
                                          value={work_history.end_date
                                            ? moment(
                                              work_history.end_date
                                            ).format("MM-DD-YYYY")
                                            : ""}
                                          defaultValue={
                                            work_history.end_date
                                              ? moment(
                                                work_history.end_date
                                              ).format("MM-DD-YYYY")
                                              : ""
                                          }
                                          isValidDate={this.isValidDate}
                                          dateFormat="MM-DD-YYYY"
                                          inputProps={{
                                            id: "end_date",
                                            placeholder: "End Date",
                                            readOnly: true,
                                            disabled: this.state.student_working_history_editable_index === index && !work_history.is_present ? false : true                                        
                                          }}
                                          timeFormat={false}
                                          closeOnSelect={true}
                                          onChange={(e) =>
                                            ths.handleChangeEndDate(
                                              index,
                                              work_history.id,
                                              e
                                            )
                                          }
                                          disabled={
                                            this.state
                                              .student_working_history_editable_index ===
                                              index
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormControl>
                                      {/* <CustomInput
                                  labelText="End Date"
                                  id="end_date"
                                  formControlProps={{
                                    fullWidth: true
                                  }}                              
                                  inputProps={{
                                    type : "date",                                                               
                                    value: (work_history.end_date) ? this.formatedDate(work_history.end_date): "",                                
                                    onChange: ((e) => {
                                      ths.handleChangeEndDate(index, work_history.id, e.target.value)
                                    }),
                                    disabled:(this.state.student_working_history_editable_index === index)?false:true
                                  }}
                                /> */}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControlLabel
                                        className={classes.rememberOne}
                                        id="rememberOne"
                                        control={
                                          <Checkbox
                                            disabled={this.state.student_working_history_editable_index === index ? false: true}
                                            checked={work_history.is_present}
                                            onChange={(e) =>
                                              ths.handleChangeWorkHistoryPresent(
                                                index,
                                                work_history.id,
                                                e.target.checked
                                              )
                                            }
                                            name="is_present"
                                            color="primary"
                                          />
                                        }
                                        label="'Present' if still active"
                                      />
                                    </Grid>

                                    <Grid item xs={12} className={classes.py0}>
                                      <CustomInput
                                        labelText="Job Description"
                                        id="description"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: work_history.description
                                            ? work_history.description
                                            : "",
                                          onChange: (e) => {
                                            ths.handleChangeJobDescription(
                                              index,
                                              work_history.id,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_working_history_editable_index ===
                                              index
                                              ? false
                                              : true,
                                          multiline: true,
                                          rows: 3,
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                )
                              )
                            ) : (
                                <Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className={classes.py0 + " " + classes.textCenter}
                                  >
                                    Work history not available
                                </Grid>
                                </Grid>
                              )}

                            <Grid item xs={12} className={classes.textCenter}>
                              {ths.state.student_work_history.length > 0 ? (
                                <Button
                                  color="info"
                                  size="lg"
                                  className={classes.newButton}
                                  onClick={(e) => {
                                    this.updateSpecSheet();
                                  }}
                                >
                                  Submit
                                </Button>
                              ) : null}
                            </Grid>
                          </> 
                        ),
                      },
                      {
                        tabName: "Education",
                        tabContent: (
                          <>
                            <GridContainer
                              spacing={6}
                              className={`${classes.mb30}`}
                            >
                              <Hidden>
                                  <GridItem xs={0} md={9} lg={10}></GridItem>
                              </Hidden>
                              <GridItem
                                xs={12}
                                md={3}
                                lg={2}
                                className={`${classes.mtResp30}`}
                              >
                                <Button
                                  color="info"
                                  size="lg"
                                  fullWidth="true"
                                  className={`${customStyle.newButton} ${customStyle.mt15}`}
                                  onClick={(e) => ths.addNewOtherDetail()}
                                >
                                  Add
                                </Button>
                              </GridItem>
                            </GridContainer>
                            {this.state.student_education.length > 0 ? (
                              this.state.student_education.map(
                                (education, index) => (
                                  <Grid
                                    container
                                    className={`${classes.root} ${classes.mb20}`}
                                    spacing={4}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={5}
                                      className={classes.pb0}
                                      style={{ color: "#0077B5" }}
                                    >
                                      Education {index + 1}*
                                      {this.state
                                        .student_education_editable_index !==
                                        index ? (
                                          <Button
                                            color="info"
                                            size="xs"
                                            className={classes.imgEditIcnButton}
                                            onClick={(e) => {
                                              this.editOtherDetail(index);
                                            }}
                                          >
                                            <BorderColorIcon />
                                          </Button>
                                        ) : null}
                                      {/* {index !== 0 ? ( */}
                                      <Button
                                        color="info"
                                        size="xs"
                                        className={classes.imgEditIcnButton}
                                        onClick={(e) => {
                                          this.removeOtherDetail(index);
                                        }}
                                      >
                                        <DeleteOutlineIcon />
                                      </Button>
                                      {/* ) : null} */}
                                    </Grid>
                                    <Hidden>
                                      <Grid xs={0} sm={0} md={7}></Grid>
                                    </Hidden>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={classes.py0}
                                    >
                                      <CustomInput
                                        labelText="Name of Institution"
                                        id="name_of_institute"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: education.institution_name
                                            ? education.institution_name
                                            : "",
                                          onChange: (e) => {
                                            this.handleChangeInstituteName(
                                              index,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_education_editable_index ===
                                              index
                                              ? false
                                              : true,
                                        }}
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={classes.py0}
                                    >
                                      <CustomInput
                                        labelText="Name of Degree"
                                        id="name_of_degree"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: education.degree_name
                                            ? education.degree_name
                                            : "",
                                          onChange: (e) => {
                                            this.handleChangeDegreeName(
                                              index,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_education_editable_index ===
                                              index
                                              ? false
                                              : true,
                                        }}
                                      />
                                    </Grid>
                                    <Hidden>
                                      <Grid xs={0} sm={0} md={4}></Grid>
                                    </Hidden>

                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControl component="fieldset">
                                        <FormLabel className="label-radio label-time">
                                          Start Date
                                        </FormLabel>
                                        <Datetime
                                          defaultValue={
                                            education.start_date
                                              ? moment(
                                                education.start_date
                                              ).format("MM-DD-YYYY")
                                              : ""
                                          }
                                          isValidDate={this.isValidDate}
                                          dateFormat="MM-DD-YYYY"
                                          inputProps={{
                                            id: "start_date",
                                            placeholder: "Start Date",
                                            readOnly: true,
                                            disabled: this.state.student_education_editable_index === index ? false : true
                                          }}
                                          timeFormat={false}
                                          closeOnSelect={true}
                                          onChange={(e) =>
                                            ths.handleChangeEducationStartDate(
                                              index,
                                              education.id,
                                              e
                                            )
                                          }
                                          disabled={
                                            this.state
                                              .student_education_editable_index ===
                                              index
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormControl>
                                      {/* <CustomInput
                                  labelText="Start Date"
                                  id="start_date"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type : "date",                                
                                    value: (education.start_date) ? this.formatedDate(education.start_date) : new Date(),
                                    onChange: ((e) => {
                                      ths.handleChangeEducationStartDate(index, education.id, e.target.value)
                                    }),
                                    disabled:(this.state.student_education_editable_index === index)?false:true
                                  }}
                                /> */}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControl component="fieldset" className="student-custom-end-date">
                                        <FormLabel className="label-radio label-time">
                                          End Date
                                        </FormLabel>
                                        <Datetime
                                          value={education.end_date
                                            ? moment(
                                              education.end_date
                                            ).format("MM-DD-YYYY")
                                            : ""}
                                          defaultValue={
                                            education.end_date
                                              ? moment(
                                                education.end_date
                                              ).format("MM-DD-YYYY")
                                              : ""
                                          }
                                          isValidDate={this.isValidDate}
                                          dateFormat="MM-DD-YYYY"
                                          inputProps={{
                                            id: "end_date",
                                            placeholder: "End Date",
                                            readOnly: true,
                                            disabled: this.state.student_education_editable_index === index && !education.is_present ? false : true                                        
                                          }}
                                          timeFormat={false}
                                          closeOnSelect={true}
                                          onChange={(e) =>
                                            ths.handleChangeEducationEndDate(
                                              index,
                                              education.id,
                                              e
                                            )
                                          }
                                          disabled={
                                            this.state
                                              .student_education_editable_index ===
                                              index
                                              ? false
                                              : true
                                          }
                                        />
                                      </FormControl>
                                      {/* <CustomInput
                                  labelText="End Date"
                                  id="end_date"
                                  formControlProps={{
                                    fullWidth: true
                                  }}                              
                                  inputProps={{
                                    type : "date",                                                               
                                    value: (education.end_date) ? this.formatedDate(education.end_date): "",                                
                                    onChange: ((e) => {
                                      ths.handleChangeEducationEndDate(index, education.id, e.target.value)
                                    }),
                                    disabled:(this.state.student_education_editable_index === index)?false:true
                                  }}
                                /> */}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      className={`date-time ${classes.py0}`}
                                    >
                                      <FormControlLabel
                                        className={classes.rememberOne}
                                        id="rememberOne"
                                        control={
                                          <Checkbox
                                            disabled={this.state.student_education_editable_index === index ? false: true}
                                            checked={education.is_present}
                                            onChange={(e) =>
                                              ths.handleChangeEducationPresent(
                                                index,
                                                education.id,
                                                e.target.checked
                                              )
                                            }
                                            name="is_present"
                                            color="primary"
                                          />
                                        }
                                        label="'Present' if still active"
                                      />
                                    </Grid>

                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      className={classes.py0}
                                    >
                                      <CustomInput
                                        labelText="Description"
                                        id="description"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          value: education.description
                                            ? education.description
                                            : "",
                                          multiline: true,
                                          rows: 3,
                                          onChange: (e) => {
                                            this.handleChangeInstituteDescription(
                                              index,
                                              e.target.value
                                            );
                                          },
                                          disabled:
                                            this.state
                                              .student_education_editable_index ===
                                              index
                                              ? false
                                              : true,
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                )
                              )
                            ) : (
                                <Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className={classes.py0 + " " + classes.textCenter}
                                  >
                                    Education detail not available
                                </Grid>
                                </Grid>
                              )}

                            <Grid item xs={12} className={`${classes.mb30}`}>
                              <CustomInput
                                labelText="Anything else you would like to share?"
                                id="anything_else"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  value:
                                    this.state.student_details.length > 0
                                      ? this.state.student_details[0]
                                        .anything_else_details
                                      : "",
                                  multiline: true,
                                  rows: 3,
                                  onChange: (e) => {
                                    this.handleChangeAnythingElse(e.target.value);
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.textCenter}>
                              <Button
                                color="info"
                                size="lg"
                                className={classes.newButton}
                                onClick={(e) => {
                                  this.updateSpecSheet();
                                }}
                              >
                                Submit
                              </Button>
                            </Grid>
                          </>
                        ),
                      },
                      {
                        tabName: "Attachments",
                        tabContent: (
                          <div className="my-resume">
                            <Grid
                              container
                              className={`${classes.root} ${classes.mb30}`}
                              spacing={4}
                            >
                              <Grid
                                item
                                xs={12}
                                className={classes.pb0}
                                style={{ color: "#0077B5", fontWeight: 700, marginBottom: "15px" }}
                              >
                                Resume upload
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={4}
                                className={classes.py0}
                              >
                                <div class="custom-file">
                                  <input 
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
                                    id="exampleCustomFileBrowser2" 
                                    name="resume" 
                                    class="custom-file-input" 
                                    onChange={this.handleChangeResume} 
                                  />
                                  <label class="custom-file-label" for="exampleCustomFileBrowser2">Choose file to upload</label>
                                </div>
                              </Grid>
                              <Grid xs={0} sm={0} md={4}>
                                {
                                  (this.state.resume_url !== null && this.state.resume_url !== "" ) ? (
                                    <div className="resumeData">
                                      <span className="resumeName">{this.state.resume_url}</span>
                                      <span className="deleteIcon">
                                        <DeleteOutlineIcon 
                                          onClick={(e) => {
                                            this.handleChangeRemoveResume(true);
                                          }}
                                        />
                                      </span>
                                    </div>
                                  ) : (this.state.student_details.length > 0 && this.state.student_details[0].resume && !this.state.resume_remove) ? (
                                    <div className="resumeData">
                                      <span className="resumeName">{this.state.student_details[0].resume}</span>
                                      <span className="deleteIcon">
                                        <DeleteOutlineIcon 
                                          onClick={(e) => {
                                            this.handleChangeRemoveResume(false);
                                          }}
                                        />
                                      </span>
                                    </div>
                                  ) : ""
                                }
                                
                              </Grid>
                              <Hidden>
                                <Grid xs={0} sm={0} md={4}></Grid>
                              </Hidden>

                              <Grid
                                item
                                xs={12}
                                className={classes.pb0}
                                style={{ color: "#0077B5", fontWeight: 700, marginTop: "15px", marginBottom: "15px" }}
                              >
                                Certifications upload
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={8}
                                className={classes.py0}
                              >
                                <div class="custom-file">
                                  <input 
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
                                    id="exampleCustomFileBrowser2" 
                                    name="certification" 
                                    class="custom-file-input" 
                                    onChange={this.handleChangeCertification}
                                    multiple 
                                  />
                                  <label class="custom-file-label" for="exampleCustomFileBrowser2">Choose file to upload</label>
                                </div>
                              </Grid>
                              <Hidden>
                                <Grid xs={0} sm={0} md={4}></Grid>
                              </Hidden>

                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={8}
                                className={classes.py0}
                              >
                                {this.state.student_attachment.length > 0 ? (
                                  this.state.student_attachment.map(
                                    (attachment, index) => {
                                      return(                                    
                                        <div className="certificationData">
                                          <span className="certificationName">
                                            <IconF icon={fileDocumentOutline} style={{ fontSize: "16px", marginRight: "15px" }}/>
                                            {attachment.certification}
                                          </span>
                                          <span className="deleteIcon">
                                            {(attachment.id > 0 && (attachment.certification !== "" || attachment.certification !== null)) ? (
                                              <DeleteOutlineIcon 
                                                onClick={(e) => {
                                                  this.handleChangeRemoveCertification(index, false, attachment, 0);
                                                }}
                                              />
                                            ) : (
                                              <DeleteOutlineIcon 
                                                onClick={(e) => {
                                                  this.handleChangeRemoveCertification(index, true, {}, attachment.new_id-1);
                                                }}
                                              />
                                            )}
                                          </span>
                                        </div>                                    
                                      )
                                    })
                                ) : ""}
                              </Grid>
                              <Hidden>
                                <Grid xs={0} sm={0} md={4}></Grid>
                              </Hidden>

                              <Grid
                                item
                                xs={12}
                                className={classes.pb0}
                                style={{ color: "#0077B5", fontWeight: 700, marginTop: "15px" }}
                              >
                                Social Links
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={4}
                                className={classes.py0}
                              >
                                <CustomInput
                                  labelText="GitHub"
                                  id="github_url"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    value: this.state.student_details.length > 0
                                      ? this.state.student_details[0].github_url
                                      : "",
                                    onChange: (e) => {
                                      ths.handleChangeGithubUrl(e.target.value);
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={4}
                                className={classes.py0}
                              >
                                <CustomInput
                                  labelText="Linkedin"
                                  id="linkedin_url"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    value: this.state.student_details.length > 0
                                      ? this.state.student_details[0].linkedin_url
                                      : "",
                                    onChange: (e) => {
                                      ths.handleChangeLinkedinUrl(e.target.value);
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={4}
                                className={classes.py0}
                              >
                                <CustomInput
                                  labelText="Personal Website"
                                  id="website_url"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    value: this.state.student_details.length > 0
                                      ? this.state.student_details[0].website_url
                                      : "",
                                    onChange: (e) => {
                                      ths.handleChangeWebsiteUrl(e.target.value);
                                    },
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} className={classes.textCenter}>
                                <Button
                                  color="info"
                                  size="lg"
                                  className={classes.newButton}
                                  onClick={(e) => {
                                    this.updateSpecSheet();
                                  }}
                                >
                                  Submit
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        ),
                      }
                    ]}
                  />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
const mapStatetoProps = (state) => {
  // console.log("maptostate : ",state)
  return {
    user: state.authReducer.user,
    all_skills: state.authReducer.all_skills,
    cities: state.authReducer.cities,
    career_path: state.authReducer.career_path
  };
};
const mapDispatchtoProps = {
  logoutUser,
  getAllcities,
  getAllSkills,
  fetchCareerPath,
};
const combinedStyles = combineStyles(
  customSelectStyle,
  dashboardStyle,
  styles,
  customStyle
);
export default connect(
  mapStatetoProps,
  mapDispatchtoProps
)(withStyles(combinedStyles)(SpecSheet));
