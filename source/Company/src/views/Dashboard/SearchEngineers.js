import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import { API_URL } from "constants/defaultValues.js"
import { APP_URL } from "constants/defaultValues.js"
import CustomTooltip  from "../Tooltip/tooltip"
import { toast } from "react-toastify";
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
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "components/Table/Table.js";
import Link from "@material-ui/core/Link";

import CloseIcon from "../../assets/img/close-icon.svg"


import filterIcon from "../../assets/img/filter-icon.svg";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

import Accordion from "components/Accordion/Accordion.js";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel"
// @material-ui/icons
import Check from "@material-ui/icons/Check";

import Paginations from "components/Pagination/Pagination.js";

import ListIcon from '@material-ui/icons/List';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { Icon as IconF, InlineIcon } from "@iconify/react";
import playlistPlus from '@iconify/icons-mdi/playlist-plus';

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Close from "@material-ui/icons/Close";
import buttonStyles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";


// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

import combineStyles from '../../combineStyles';
import { getAllcities, getAllSkills, fetchCareerPath, logoutUser } from "../../redux/action";

// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(styles);
const useCheckStyles = makeStyles(checkBoxStyle);
const useModalStyles = makeStyles(modalStyles);
const useSelectStyles = makeStyles(customSelect);
const useButtonStyles = makeStyles(buttonStyles);
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
const useCustomStyle = makeStyles(customStyle);

class SearchEngineers extends React.Component {
  // const classes = useStyles();
  // const classesCustom = useCustomSpace();
  // const customStyle = useCustomStyle();
  // const checkBoxStyle = useCheckStyles();
  // const selectStyle = useSelectStyles();
  // const modalStyle = useModalStyles();

  constructor(props) {
    super(props);
    this.props = props;
    this.clearFilter = this.clearFilter.bind(this);
    this.state = {
      all_watchlist: [],
      watchlist: "",
      default_watchlist: 0,
      student_id: 0,
      student_name: "",
      data: [],
      totalStudent: 0,
      page: 0,
      pagesize: 10,
      modal: false,
      checked: [24, 22],
      simpleSelect: "",
      career_path: [],
      cities: [],
      all_skills: [],
      filter: {
        "career_path": "",
        "location": "",
        "remortely": "",
        "experience_level": "",
        "skills": ""
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
    this.props.getAllcities();
    this.props.getAllSkills();
    this.fetchWatchList({ 'user_id': this.props.user.user_id })
    this.props.fetchCareerPath();
    ths.showLoader();
    let { match } = this.props;
    if (match.params.id && match.params.id > 0) {
      this.setState({
        watchlist: match.params.id,
        default_watchlist: match.params.id
      })
    }
    setTimeout(() => {
      ths.hideLoader()
    }, 500)
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if ((state.career_path.length !== props.career_path.length) || (state.cities.length !== props.cities.length) || (state.all_skills.length !== props.all_skills.length)) {
      return {
        career_path: (props.career_path.length > 0) ? props.career_path : [],
        cities: (props.cities.length > 0) ? props.cities : [],
        all_skills: (props.all_skills.length > 0) ? props.all_skills : []
      };
    } else {
      return {
        ...state
      }
    }
  }


  setModal(val = false, student_id = 0, student_name = "") {
    this.setState({
      modal: val,
      student_id: student_id,
      student_name: student_name,
      watchlist: (this.state.default_watchlist > 0) ? this.state.default_watchlist : ''
    })
  }

  setChecked(val = []) {
    this.setState({
      checked: val
    })
  }

  setSimpleSelect(val = "") {
    this.setState({
      watchlist: val
    })
  }

  // const [modal, setModal] = React.useState(false);
  // const [checked, setChecked] = React.useState([24, 22]);
  handleToggle = value => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setChecked(newChecked);
  };

  // const [simpleSelect, setSimpleSelect] = React.useState("");
  handleSimple = (event) => {
    this.setSimpleSelect(event.target.value);
  };

  showFilter() {
    let element = document.getElementById("filterBar");
    element.classList.add("show-filter");
  }

  hideFilter() {
    let element = document.getElementById("filterBar");
    element.classList.remove("show-filter");
  }

  handleFilterCareerPath(val = "") {
    let temp_filter = this.state.filter;
    if (temp_filter.career_path.trim() === "") {
      temp_filter.career_path = `${val}`
      this.setState({
        filter: temp_filter
      })
    } else {
      let career_path_index = temp_filter.career_path.trim().indexOf(val);
      let temp_arr = temp_filter.career_path.trim().split(',');
      let index_of = temp_arr.indexOf(val);
      if (index_of < 0) {
        temp_filter.career_path = `${temp_filter.career_path},${val}`
        this.setState({
          filter: temp_filter
        })
      } else {
        let x = temp_arr.splice(index_of, 1);
        temp_filter.career_path = temp_arr.join(',');
        this.setState({
          filter: temp_filter
        })
      }
    }
  }

  handleFilterRemoteJob(val = "") {
    let temp_filter = this.state.filter;
    if (temp_filter.remortely.trim() === "") {
      temp_filter.remortely = `${val}`
      this.setState({
        filter: temp_filter
      })
    } else {
      let remortely_index = temp_filter.remortely.trim().indexOf(val);
      let temp_arr = temp_filter.remortely.trim().split(',');
      let index_of = temp_arr.indexOf(val);
      if (index_of < 0) {
        temp_filter.remortely = `${temp_filter.remortely},${val}`
        this.setState({
          filter: temp_filter
        })
      } else {
        let x = temp_arr.splice(index_of, 1);
        temp_filter.remortely = temp_arr.join(',');
        this.setState({
          filter: temp_filter
        })
      }
    }
  }

  handleFilterLocation(val = "") {
    let temp_filter = this.state.filter;
    if (temp_filter.location.trim() === "") {
      temp_filter.location = `${val}`
      this.setState({
        filter: temp_filter
      })
    } else {
      let location_index = temp_filter.location.trim().indexOf(val);
      let temp_arr = temp_filter.location.trim().split(',');
      let index_of = temp_arr.indexOf(val);
      if (index_of < 0) {
        temp_filter.location = `${temp_filter.location},${val}`
        this.setState({
          filter: temp_filter
        })
      } else {
        let x = temp_arr.splice(index_of, 1);
        temp_filter.location = temp_arr.join(',');
        this.setState({
          filter: temp_filter
        })
      }
    }
  }

  handleFilterExperienceLevel(val = "") {
    let temp_filter = this.state.filter;
    if (temp_filter.experience_level.trim() === "") {
      temp_filter.experience_level = `${val}`
      this.setState({
        filter: temp_filter
      })
    } else {
      let experience_level_index = temp_filter.experience_level.trim().indexOf(val);
      let temp_arr = temp_filter.experience_level.trim().split(',');
      let index_of = temp_arr.indexOf(val);
      if (index_of < 0) {
        temp_filter.experience_level = `${temp_filter.experience_level},${val}`
        this.setState({
          filter: temp_filter
        })
      } else {
        let x = temp_arr.splice(index_of, 1);
        temp_filter.experience_level = temp_arr.join(',');
        this.setState({
          filter: temp_filter
        })
      }
    }
  }

  handleFilterSkills(val = "") {
    let temp_filter = this.state.filter;
    if (temp_filter.skills.trim() === "") {
      temp_filter.skills = `${val}`
      this.setState({
        filter: temp_filter
      })
    } else {
      let skills_index = temp_filter.skills.trim().indexOf(val);
      let temp_arr = temp_filter.skills.trim().split(',');
      let index_of = temp_arr.indexOf(val);
      if (index_of < 0) {
        temp_filter.skills = `${temp_filter.skills},${val}`
        this.setState({
          filter: temp_filter
        })
      } else {
        let x = temp_arr.splice(index_of, 1);
        temp_filter.skills = temp_arr.join(',');
        this.setState({
          filter: temp_filter
        })
      }
    }
  }
  onSubmitFilter() {
    this.getDataFromDb({ "page": this.state.page, "pageSize": this.state.pagesize });
    this.hideFilter();
  }

  clearFilter(){
    let ths=this;    
    let initialfilter = {
          "career_path": "",
          "location": "",
          "remortely": "",
          "experience_level": "",
          "skills": ""
        }
    this.setState(
      {filter : initialfilter},
      function () {
        this.getDataFromDb({ "page": this.state.page, "pageSize": this.state.pagesize });
      }
    )
  }

  async getDataFromDb(state) {
    console.log("satte;",state)
    // if(this.state.filter.career_path.trim() !== ""||this.state.filter.location.trim() !== ""||this.state.filter.remortely.trim() !== ""||this.state.filter.experience_level.trim() !== ""||this.state.filter.skills.trim() !== ""){
      // console.log("IN FILTERD")
    let response = await this.getData(state);
    // set totalStudent and data
    // console.log("DATTA:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        this.setState({
          data: (response.data && response.data.data.length > 0) ? response.data.data : [],
          totalStudent: (response.data && response.data.data.length > 0) ? response.data.total : 0
        })        
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  // }else{
    
  // }
  }

  async getData(state) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    let studentsearch = {}
    studentsearch.user_id = this.props.user.user_id;
    studentsearch.page = state.page;
    studentsearch.page_size = state.pageSize;
    studentsearch.filtred = this.state.filter;
    const res = await axios.post(`${API_URL}/company/student/searchstudent`, studentsearch, headers);
    return await res.data;
  }

  createTablecontent(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        candidatename: prop['candidatename'],
        career_path: prop['career_path'],
        skill: (prop['skill'])?prop['skill'].split(",").map((x) => {return(<p>{x}</p>)}):"-",
        place: (prop['place'])?prop['place']:"-",
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ 'cursor': 'pointer' }} onClick={() => this.redirectToCandidateDetail(prop['id'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Shortlist" position="left"><IconF icon={playlistPlus} style={{ cursor: "pointer" }} onClick={() => this.setModal(true, prop['id'], prop['candidatename'])} /></CustomTooltip>
          </div>
        )
      };
    }) : []
  }

  redirectToCandidateDetail(id) {
   // this.props.history.push(`/company/candidatedetail/${id}`)
    var url = APP_URL+"/company/candidatedetail/"+id
    const win = window.open(url, '_blank');
    if (win != null) {
      win.focus();
    }
   
  }


  //  Add student to watch list
  addStudentToWatchlistOnClick() {
    if (this.state.watchlist && this.state.watchlist !== "") {
      let params = {
        user_id: this.props.user.user_id,
        watchlist_id: this.state.watchlist,
        student_id: this.state.student_id
      }
      this.addToWatchList(params)
      this.setModal(false)
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


  render() {
    // console.log("State: ", this.state.filter, this.state.all_skills)
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem>
            <h1>Search Talent</h1>
            <h5>Find talent suited for your open roles!</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative talentFilterHeader">
                Filter Talent
                <CustomTooltip title="Filters for search engineer" position="left" customClass="searchTalentTooltip">
                  <Link className="showFilter" onClick={this.showFilter}>
                    <img src={filterIcon} alt="" className={classes.filterIcon}></img>
                  </Link>
                </CustomTooltip>
              </CardHeader>
              <CardBody className="cardCustomBody">
                <ReactTableFixedColumns
                  noDataText={"No data found"}
                  data={this.createTablecontent(this.state.data)}
                  // data={[
                  //   { "id":"1", "engineer":"Candidate 1", "career_path" : "Generalist", "skills":"React JS, Vue Js, Angular JS", "place" : "NY", "cid": <VisibilityOutlinedIcon onClick={() => this.setModal(true)} />},
                  //   { "id":"2", "engineer": "Candidate 2","career_path": "Front-End", "skills" : "Node JS","place" : "BOS", "cid": <VisibilityOutlinedIcon />},
                  //   { "id": "3", "engineer": "Candidate 3","career_path":  "Back-End","skills" : "React JS, Vue Js, Angular JS","place" : "NY","cid": <VisibilityOutlinedIcon /> }
                  // ]}
                  filterable
                  PaginationComponent={UpdatedPagination}
                  // { "id":"1", 
                  // "candidatename":"Candidate 1", 
                  // "career_path" : "Generalist", 
                  // "skill":"React JS, Vue Js, Angular JS",
                  //  "place" : "NY", 
                  //  "id": <VisibilityOutlinedIcon onClick={() => this.setModal(true)} />
                  // }
                  columns={[
                    {
                      Header: "#",
                      accessor: "sr_no",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Engineer",
                      accessor: "candidatename",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Career Path",
                      accessor: "career_path",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Skills",
                      accessor: "skill",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Location",
                      accessor: "place",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Action",
                      accessor: "actions",
                      fixed: "right",
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultPageSize={(this.state.data.length < this.state.pagesize) ? ((this.state.data.length > 0) ? this.state.data.length : this.state.pagesize) : this.state.pagesize}
                  pages={Math.ceil(this.state.totalStudent / this.state.pagesize)}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                  manual
                  resizable={false}
                  onFetchData={(state, instance) => {
                    // show the loading overlay                        
                    // fetch your data   
                    // console.log("STATEL:", state)
                    this.setState({ page: state.page, pagesize: state.pageSize })
                    this.getDataFromDb(state);
                  }}
                />
              </CardBody>
            </Card>
            <div className={`${classes.textCenter} ${classes.dBlock}`}>

              {/* Modal Start */}
              <Dialog
                modalStyle={{
                  root: classes.center,
                  paper: classes.modal
                }}
                open={this.state.modal}
                transition={Transition}
                keepMounted
                onClose={() => this.setModal(false)}
                aria-labelledby="modal-slide-title"
                aria-describedby="modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader + " modal-header modal-title-border"}
                >
                  <Button
                    justIcon
                    className={classes.modalCloseButton}
                    key="close"
                    aria-label="Close"
                    color="transparent"
                    onClick={() => this.setModal(false)}
                  >
                    <Close className={classes.modalClose} />
                  </Button>
                  <h4 className={classes.modalTitle}>Select An Opening</h4>
                </DialogTitle>
                <DialogContent
                  id="modal-slide-description"
                  className={classes.modalBody}
                >
                  <GridContainer>
                    <GridItem md={8}>
                      <CustomInput
                        labelText="Name"
                        id="emailLog"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                          value: this.state.student_name,
                          endAdornment: (
                            <InputAdornment position="end"></InputAdornment>
                          ),
                        }}
                      />
                    </GridItem>
                    <GridItem md={4}>
                      <CustomInput
                        labelText="Profile Number"
                        id="emailLog"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                          value: `#${this.state.student_id}`,
                          endAdornment: (
                            <InputAdornment position="end"></InputAdornment>
                          ),
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          My Openings
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
                            name: "simpleSelect",
                            id: "simple-select",
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Select An Opening
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
                  </GridContainer>

                </DialogContent>
                <DialogActions
                  className={classes.modalFooter + " " + classes.modalFooterCenter}
                >
                  <Button onClick={() => this.setModal(false)} className={`${classes.outlineButton} ${classes.mt30} ${classes.mb30}` + " small-btn"}>Cancel</Button>
                  <Button
                    onClick={() => this.setModal(false)}
                    color="info"
                    size="lg"
                    className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}` + " small-btn"}
                    onClick={(e) => this.addStudentToWatchlistOnClick()}
                  >
                    Add Candidate
                </Button>
                </DialogActions>
              </Dialog>
              {/* Modal Ends */}

            </div>
          </GridItem>
        </GridContainer>
        <div className={classes.filterBar + " filterbar"} id="filterBar">
          <h3>Filter
          <Link onClick={this.hideFilter} className="pointer">
              <img src={CloseIcon} alt='' className={classes.filterCloseIcon}></img>
            </Link>
          </h3>

          <div className="filterHeight">
            <Accordion
              active={0}
              collapses={[
                {
                  title: "Career Path ",
                  content:
                    <div className={`${classes.filterOptions} ${classes.px30}`}>
                      <ul className={classes.simpleList}>
                        {(this.state.career_path.length > 0) ? this.state.career_path.map((career,index) => <li>
                          <FormControlLabel
                            control={
                              <Checkbox                                                                
                                tabIndex={-1}
                                checked={this.state.filter.career_path.includes(`${career.id}`)}
                                onClick={() => this.handleFilterCareerPath(`${career.id}`)}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label={`${career.career_name}`}
                          />
                        </li>) : null}
                      </ul>
                    </div>
                },
                {
                  title: "Remote",
                  content:
                    <div className={`${classes.filterOptions} ${classes.px30}`}>
                      <ul className={classes.simpleList}>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.remortely.includes(`1`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterRemoteJob('1')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Yes"
                          />
                        </li>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox                                
                                checked={this.state.filter.remortely.includes(`0`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterRemoteJob('0')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="No"
                          />
                        </li>
                      </ul>
                    </div>
                },
                {
                  title: "Location (Metro)",
                  content:
                    <div className={`${classes.filterOptions} ${classes.px30}`}>
                      <ul className={classes.simpleList}>
                        {(this.state.cities.length > 0) ? this.state.cities.map((city) => <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.location.includes(`${city.id}`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterLocation(`${city.id}`)}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label={`${city.name}`}
                          />
                        </li>) : null}
                      </ul>
                    </div>
                },
                {
                  title: "Experience Level",
                  content:
                    <div className={`${classes.filterOptions} ${classes.px30}`}>
                      <ul className={classes.simpleList}>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.experience_level.includes(`1`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterExperienceLevel('1')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Undergraduate Student"
                          />
                        </li>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.experience_level.includes(`2`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterExperienceLevel('2')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Graduate Student"
                          />
                        </li>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.experience_level.includes(`3`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterExperienceLevel('3')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Entry Level"
                          />
                        </li>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.experience_level.includes(`4`)}
                                tabIndex={-1}
                                onClick={() => this.handleFilterExperienceLevel('4')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Mid-level"
                          />
                        </li>
                        <li>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.filter.experience_level.includes(`5`)}
                                tabIndex={-1}                              
                                onClick={() => this.handleFilterExperienceLevel('5')}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot
                                }}
                              />
                            }
                            classes={{ label: classes.label }}
                            label="Senior-Level"
                          />
                        </li>
                      </ul>
                    </div>
                },
                {
                  title: "Skills",
                  content:
                    <div className={`${classes.filterOptions} ${classes.px30}`}>
                      <ul className={classes.simpleList}>
                        {(this.state.all_skills.length > 0) ? this.state.all_skills.map((skill) => {
                          if(skill.is_default_skill === 0) {
                            var skill_career_path_index = this.state.career_path.findIndex(x => x.id == skill.career_path_id);
                            //var skill_name = (this.state.career_path.length > 0 && this.state.career_path[skill_career_path_index]) ? `${skill.skill_name}(${this.state.career_path[skill_career_path_index].career_name})`: skill.skill_name;
                            var skill_name = skill.skill_name;
                            return (
                              <li>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={this.state.filter.skills.includes(`${skill.id}`)}
                                      tabIndex={-1}
                                      onClick={() => this.handleFilterSkills(`${skill.id}`)}
                                      checkedIcon={<Check className={classes.checkedIcon} />}
                                      icon={<Check className={classes.uncheckedIcon} />}
                                      classes={{
                                        checked: classes.checked,
                                        root: classes.checkRoot
                                      }}
                                    />
                                  }
                                  classes={{ label: classes.label }}
                                  label={`${skill_name}`}
                                />
                              </li>
                            )
                          }
                        }) : null}
                      </ul>
                    </div>
                }
              ]}
            />
          </div>

          <Button
            color="info"
            size="lg"
            className={`${classes.blockButton} ${classes.m30}`}
            onClick={(e) => this.onSubmitFilter()}
          >
            Submit
        </Button>
        <Button
            color="info"
            size="lg"
            className={`${classes.blockButton} ${classes.m30}`}
            onClick={(e) => this.clearFilter()}
          >            
              Clear Filter          
        </Button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
    all_skills: state.authReducer.all_skills,
    cities: state.authReducer.cities,
    career_path: state.authReducer.career_path
  };
};

const mapDispatchToProps = { getAllcities, getAllSkills, fetchCareerPath, logoutUser }
const combinedStyles = combineStyles(styles, useCustomSpace1, checkBoxStyle, modalStyles, customSelect, customStyle);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(SearchEngineers));
