import React, { Fragment } from "react";
import { connect } from 'react-redux';
import ReactTable from "react-table";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import { API_URL } from "constants/defaultValues.js"
import CustomTooltip  from "../Tooltip/tooltip"
import { toast } from "react-toastify";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

// @material-ui/icons
import { Icon as IconF, InlineIcon } from '@iconify/react';
import circleEditOutline from '@iconify/icons-mdi/circle-edit-outline';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import playlistRemove from '@iconify/icons-mdi/playlist-remove';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Close from "@material-ui/icons/Close";

// Select Box
import FormControl from "@material-ui/core/FormControl"; 
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import * as Datetime from "react-datetime";

import combineStyles from '../../combineStyles';
import { logoutUser } from '../../redux/action';
import moment from "moment";
// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
};

class CurrentInterviews extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.state = {
      activeTab: 0,
      current_status: 4,
      new_status: 4,
      all_watchlist: [],
      watchlist: "",
      watchlistname: "",      
      student_id: 0,
      student_name: "",
      confirm_id: 0,      
      remarks: "",
      remarksState: "",
      data: [],
      totalStudent: 0,
      page: 0,
      pagesize: 10,
      onsiteinterviewdate: "",
      onsiteinterviewtime: "",
      checked: [24, 22],
      simpleSelect: "",
      modal: false,
      offermodal : false,
      interviewModal: false,
      editModal: false,
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
    setTimeout(() => {
      ths.hideLoader()
    }, 500)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user) {
        return {
          user: props.user ? props.user : null,
        };
      } else {
        return {
          ...state,
        };
      }
  }
  
  handleTabsChange = (value) => {
    // console.log("handleTabsChange ", val);
    if(this.state.activeTab !== value){
      let currentStatus = 4;
      if(value === 0) {
        currentStatus = 4;
      } else if(value === 1) {
        currentStatus = 6;
      } else if(value === 2) {
        currentStatus = 8;
      } else if(value === 3) {
        currentStatus = 14;
      }
      this.setState({ current_status: currentStatus, remarks: "", remarksState: "" }); 
    }
    this.setState({ activeTab: value });    
  }

  handleChangeDate(val) {
    // console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {
      this.setState({
        onsiteinterviewdate: moment(val).format("MM-DD-YYYY")
      });
    }
  }

  handleTimeSlot(val) {
    if (val && val !== "" && moment(val).format("hh:mm A") !== "Invalid date") {
      this.setState({
        onsiteinterviewtime: moment(val).format("hh:mm A")
      })
    }
  }

  isValidDate(currentDate) {
    if (moment(currentDate).diff(moment(), "hours") > 0) {
      return true;
    } else {
      return false;
    }
  }

  setRemarks(val = "") {
    this.setState({
      remarks: val
    })
  }

  setRemarksState(val = "") {
    this.setState({
      remarksState: val
    })
  }

  setSimpleSelect(val = "") {
    this.setState({
      new_status: val
    })
  }

  handleSimple = (event) => {
    this.setSimpleSelect(event.target.value);
  };
  
  setModal(val = false, confirm_id = 0, student_id = 0, student_name = "",  watchlistname = "",is_got_other_company_offer =0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true);
    }else{
      this.setState({
        modal: val,
        confirm_id: (val) ? confirm_id : "",
        student_id: (val) ? student_id : "",
        student_name: (val) ? student_name : "",
        watchlistname: (val) ? watchlistname : ""
      })
    }
  }

  setOfferModal(val=false){
    this.setState({
      offermodal : val
    })
  }

  setInterviewModal(val = false, confirm_id = 0, student_id = 0, student_name = "", watchlistname = "", is_got_other_company_offer =0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true)
    }else{
      this.setState({
        interviewModal: val,
        new_status: this.state.current_status,
        confirm_id: (val) ? confirm_id : "",
        student_id: (val) ? student_id : "",
        student_name: (val) ? student_name : "",
        watchlistname: (val) ? watchlistname : "",        
      })
    }
  }

  setEditModal(val = false, confirm_id = 0, student_id = 0, student_name = "", watchlistname = "", interview_date = "", interview_time = "", is_got_other_company_offer =0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true)
    }else{
      this.setState({
        editModal: val,
        new_status: this.state.current_status,
        confirm_id: (val) ? confirm_id : "",
        student_id: (val) ? student_id : "",
        student_name: (val) ? student_name : "",
        watchlistname: (val) ? watchlistname : "",
        onsiteinterviewdate: (val) ? ((moment(interview_date).format('MM-DD-YYYY'))) : "",
        onsiteinterviewtime: (val) ? interview_time : "",      
      })
    }
  }  

  async getDataFromDb(state) {    
    this.showLoader();
    let response = await this.getData(state);
    setTimeout(() => {
        this.hideLoader();
    }, 500)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message);
      } else {
        this.setState({
          data: (response.data && response.data.data.length > 0) ? response.data.data : [],
          totalStudent: (response.data && response.data.data.length > 0) ? response.data.total : 0
        });
      }
    } else {
      this.props.logoutUser(this.props.history);
    }
  }

  async getData(state) {
    let sorted, order;
    let filtered = {}
    if (state.sorted && state.sorted.length > 0) {
      sorted = state.sorted[0].id
    }
    if (state.sorted && state.sorted.length > 0) {
      if (state.sorted[0].desc == false) {
        order = 1
      } else {
        order = -1
      }
    }
    if (state.filtered && state.filtered.length > 0) {
      state.filtered.forEach(element => {
        filtered[element.id] = element.value;
      });
    }
    let User = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : null;
    let token = User ? (User.token ? User.token : "") : "";
    let headers = { headers: { token: `${token}` } };
    let get_watchlist = {};
    get_watchlist.user_id = this.props.user.user_id;
    get_watchlist.page = state.page;
    get_watchlist.page_size = state.pagesize;
    get_watchlist.filtred = filtered;
    get_watchlist.sort_param = sorted
    get_watchlist.order = order

    let API_ENDPOINT = 'get_intro_discovery_confirm';
    if(this.state.activeTab === 0) {
      API_ENDPOINT = 'get_intro_discovery_confirm';
    } else if(this.state.activeTab === 1) {
      API_ENDPOINT = 'get_onsite_intro_discovery_call_list';
    } else if(this.state.activeTab === 2) {
      API_ENDPOINT = 'get_final_round_list';
    } else if(this.state.activeTab === 3) {
      API_ENDPOINT = 'get_offer_extended_list';
    }

    const res = await axios.post(`${API_URL}/company/watchlist/${API_ENDPOINT}`, get_watchlist, headers);
    return await res.data;
  }

  createTablecontent1(data) {
    const { classes } = this.props;
    let ths = this;
    return data.length > 0 ? data.map((prop, key) => {
        return {
          sr_no: this.state.pagesize * this.state.page + key + 1,
          watchlist: prop['watchlistname'],
          candidate: prop['candidatename'],
          interview_date: (prop['intro_discovery_response_on_date']) ? moment(prop['intro_discovery_response_on_date']).format("MM/DD/YYYY") : " - ",
          interview_time: (prop['intro_discovery_response_on_time']) ? prop['intro_discovery_response_on_time'] : " - ",
          place: (prop['place']) ? prop['place'] : " - ",
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'], prop['candidatename'], prop['display_name'])} /></CustomTooltip>{" "}
              <CustomTooltip title="Pass"><PlaylistAddCheckIcon style={{ "cursor": "pointer" }} onClick={() => this.setInterviewModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'], prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
              <CustomTooltip title="Reject"><IconF inputProps={{"title":"Reject"}} icon={playlistRemove} style={{ cursor: "pointer", width: "25px", height: "25px" }} onClick={() => this.setModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'],prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
            </div>
          )
        };
      })
      : [];
  }

  createTablecontent2(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        watchlist: prop['watchlistname'],
        candidate: prop['candidatename'],
        interview_date: (prop['intro_discovery_response_on_date']) ? moment(prop['intro_discovery_response_on_date']).format("MM/DD/YYYY") : " - ",
        interview_time: (prop['intro_discovery_response_on_time']) ? prop['intro_discovery_response_on_time'] : " - ",
        place: (prop['place']) ? prop['place'] : " - ",
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'], prop['candidatename'], prop['display_name'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Edit" position="left"><IconF icon={circleEditOutline} style={{ "cursor": "pointer" }} onClick={() => this.setEditModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'], prop['intro_discovery_response_on_date'], prop['intro_discovery_response_on_time'],prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Pass" position="left"><PlaylistAddCheckIcon style={{ "cursor": "pointer" }} onClick={() => this.setInterviewModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'], prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Reject" position="left"><IconF icon={playlistRemove} style={{ cursor: "pointer", width: "25px", height: "25px" }} onClick={() => this.setModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'],prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
          </div>
        )
      };
    }) : []
  }

  createTablecontent3(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        watchlist: prop['watchlistname'],
        candidate: prop['candidatename'],
        interview_date: (prop['intro_discovery_response_on_date']) ? moment(prop['intro_discovery_response_on_date']).format("MM/DD/YYYY") : " - ",
        interview_time: (prop['intro_discovery_response_on_time']) ? prop['intro_discovery_response_on_time'] : " - ",
        place: (prop['place']) ? prop['place'] : " - ",
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'], prop['candidatename'], prop['display_name'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Edit" position="left"><IconF icon={circleEditOutline} style={{ "cursor": "pointer" }} onClick={() => this.setEditModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'], prop['intro_discovery_response_on_date'], prop['intro_discovery_response_on_time'],prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Pass" position="left"><PlaylistAddCheckIcon style={{ "cursor": "pointer" }} onClick={() => this.passFinalRoundList({ id: prop['id'], student_id: prop['student_id'], new_status: 14 },prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Reject" position="left"><IconF icon={playlistRemove} style={{ cursor: "pointer", width: "25px", height: "25px" }} onClick={() => this.setModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['watchlistname'],prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
          </div>
        )
      };
    }) : []
  }

  createTablecontent4(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        watchlist: prop['watchlistname'],
        candidate: prop['candidatename'],
        interview_date: (prop['intro_discovery_response_on_date']) ? moment(prop['intro_discovery_response_on_date']).format("MM/DD/YYYY") : " - ",
        offer_date: (prop['offer_date'] && prop['offer_date'] !== "") ? moment(prop['offer_date']).format("MM/DD/YYYY") : " - ",
        is_offer_sent: (prop['is_offer_sent'] !== "undefined") ? (prop['is_offer_sent'] !== 0 ? 'Offered' : 'Pending') : " - ",
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'])} /></CustomTooltip>{" "}
            {prop['is_offer_sent'] === 0 ? <CustomTooltip title="Email" position="left"><PlaylistAddCheckIcon style={{ "cursor": "pointer" }} onClick={(e) => this.redirectSendConfirmation(prop['id'], prop['student_id'], prop['watchlistname'], prop['candidatename'],prop['is_got_other_company_offer'])} /></CustomTooltip> : null}{" "}
            {prop['is_offer_sent'] === 1 ? <CustomTooltip title="Email" position="left"><PlaylistAddCheckIcon style={{ "cursor": "pointer", "color": "grey" }} /></CustomTooltip> : null}{" "}
          </div>
        )
      };
    }) : []
  }

  redirectToCandidateDetail(id, name, show) {
    if (show === 0) {
      this.props.history.push(`/company/candidatedetail/${id}/0/${name}`)
    } else {
      this.props.history.push(`/company/candidatedetail/${id}/1`)
    }
  }
  
  redirectSendConfirmation(id, student_id, watchlistname, name,is_got_other_company_offer=0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true);
    }else{
    this.props.history.push(`/company/confirmcandidate/${watchlistname}/${name}/${id}/${student_id}`)
    }
  }

  passCurrentList() {
    let params = {}
    params.user_id = this.props.user.user_id;
    let temp_date = moment(this.state.onsiteinterviewdate, ["MM-DD-YYYY"]).format("YYYY-MM-DD")
    let current_date = moment().format("YYYY-MM-DD");

    if(this.state.new_status !== 14){
      if (this.state.current_status && this.state.new_status && this.state.current_status !== this.state.new_status && this.state.onsiteinterviewdate && this.state.onsiteinterviewdate !== "" && temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') > 0 && this.state.onsiteinterviewtime && this.state.onsiteinterviewtime !== "") {
        params.id = this.state.confirm_id;
        params.student_id = this.state.student_id;
        // params.status = '1';
        params.current_status = this.state.current_status;
        params.new_status = this.state.new_status;
        params.onsiteinterviewdate = temp_date;
        params.onsiteinterviewtime = this.state.onsiteinterviewtime;
        this.passFailCurrentList(params);
      } else {
        if(this.state.current_status === this.state.new_status) {
          toast.error("Please select other status both status are same.")
        } else if (!(this.state.onsiteinterviewdate && this.state.onsiteinterviewdate !== "" && new Date(this.state.onsiteinterviewdate) !== "Invalid Date")) {
          toast.error("Please select valid date.")
        } else if (!(this.state.onsiteinterviewtime && this.state.onsiteinterviewtime !== "")) {
          toast.error("Please select time slot.")
        } else if (temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') <= 0) {
          toast.error("Please select valid date.")
        }
      }
    } else {
      params.id = this.state.confirm_id;
      params.student_id = this.state.student_id;
      // params.status = '1';
      params.current_status = this.state.current_status;
      params.new_status = this.state.new_status;
      this.passFailCurrentList(params);
    }
  }

  passFinalRoundList(params,is_got_other_company_offer=0) {
    params.user_id = this.props.user.user_id;
    params.current_status = this.state.current_status;
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true)
    }else{
    this.passFailCurrentList(params);
    }
  }

  failCurrentList() {
    let params = {}
    params.user_id = this.props.user.user_id;    
    if (this.state.remarks.trim() !== "") {
      let newStatus = 5;
      if(this.state.activeTab === 0) {
        newStatus = 5;
      } else if(this.state.activeTab === 1) {
        newStatus = 7;
      } else if(this.state.activeTab === 2) {
        newStatus = 13;
      }

      params.id = this.state.confirm_id;
      params.student_id = this.state.student_id;
      // params.status = '0';
      params.current_status = this.state.current_status;
      params.new_status = newStatus;
      params.remark = this.state.remarks;
      this.passFailCurrentList(params);
    } else {

    }
  }

  editCurrentList() {
    let params = {}
    params.user_id = this.props.user.user_id;
    let temp_date = moment(this.state.onsiteinterviewdate, ["MM-DD-YYYY"]).format("YYYY-MM-DD")
    let current_date = moment().format("YYYY-MM-DD");
    
    if (this.state.onsiteinterviewdate && this.state.onsiteinterviewdate !== "" && temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') > 0 && this.state.onsiteinterviewtime && this.state.onsiteinterviewtime !== "") {
      params.id = this.state.confirm_id;
      params.student_id = this.state.student_id;
      // params.status = '0';
      params.current_status = this.state.current_status;
      params.change_date = 1;
      params.onsiteinterviewdate = temp_date;
      params.onsiteinterviewtime = this.state.onsiteinterviewtime;
      this.passFailCurrentList(params);
    } else {
      if (!(this.state.onsiteinterviewdate && this.state.onsiteinterviewdate !== "" && new Date(this.state.onsiteinterviewdate) !== "Invalid Date")) {
        toast.error("Please select valid date.")
      } else if (!(this.state.onsiteinterviewtime && this.state.onsiteinterviewtime !== "")) {
        toast.error("Please select time slot.")
      } else if (temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') <= 0) {
        toast.error("Please select valid date.")
      }
    }
  }

  async passFailCurrentList(params) {
    let ths = this;
    let response = await this.callPassFailCurrentList(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
      setTimeout(function () {
        ths.setModal(false);
        ths.setInterviewModal(false);
        ths.setEditModal(false);
        ths.getDataFromDb({ page: ths.state.page, pageSize: ths.state.pagesize })
      }, 500)
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async callPassFailCurrentList(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/pass_fail_current_interviews`, params, headers)
    return await res.data;
  }

  render() {
    // console.log("State: ",this.state)
    const { classes } = this.props;
    let ths = this;
    return (
      <div className={`main-right-panel ${classes.pt30}`}>
        <CustomTabs
          headerColor="transparent" 
          parentChange={this.handleTabsChange}
          tabs={[
            {
              tabName: "Phone Screening",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={`${classes.mt0}`}>Phone Screening</h1>
                      <h5>Contact your candidate</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                          Interview List
                        </CardHeader>
                        <CardBody className="cardCustomBody">
                          <ReactTableFixedColumns
                            noDataText={"No data found"}
                            data={this.createTablecontent1(this.state.data)}
                            filterable
                            PaginationComponent={UpdatedPagination}
                            columns={[
                            {
                              Header: "#",
                              accessor: "sr_no",
                              width: 40,
                              sortable: false,
                              filterable: false
                            },
                            {
                              Header: "Job Role",
                              accessor: "watchlist",
                              width: 170,
                              sortable: true,
                              filterable: true
                            },
                            {
                              Header: "Candidate Name",
                              accessor: "candidate",
                              width: 170,
                              sortable: false,
                              filterable: false
                            },
                            {
                              Header: "Interview Date",
                              accessor: "interview_date",
                              width: 170,
                              sortable: true,
                              filterable: true
                            },
                            {
                              Header: "Interview Time",
                              accessor: "interview_time",
                              width: 170,
                              sortable: true,
                              filterable: true
                            },
                            {
                              Header: "Location",
                              accessor: "place",
                              width: 150,
                              sortable: true,
                              filterable: true
                            },
                            {
                              Header: "Action",
                              accessor: "actions",
                              width: 150,
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
                                // console.log("STATEL 1:", state)
                                // this.setState({ page: state.page, pagesize: state.pageSize })
                                this.setState({ page: state.page, pagesize: 10 });
                                this.getDataFromDb(state);
                            }}
                          />
                        </CardBody>
                      </Card>                  
                    </GridItem>
                  </GridContainer>
                </div> 
              )
            },
            {
              tabName: "In-Process",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={` ${classes.mt0}`}>In-Process</h1>
                      <h5>Contact your candidate</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                        Interview List
                      </CardHeader>
                        <CardBody className="cardCustomBody">
                          <ReactTableFixedColumns
                            noDataText={"No data found"}
                            data={this.createTablecontent2(this.state.data)}
                            filterable
                            PaginationComponent={UpdatedPagination}
                            columns={[
                              {
                                Header: "#",
                                accessor: "sr_no",
                                width: 40,
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Job Role",
                                accessor: "watchlist",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Candidate Name",
                                accessor: "candidate",
                                width: 180,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Interview Date",
                                accessor: "interview_date",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Interview Time",
                                accessor: "interview_time",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Location",
                                accessor: "place",
                                width: 150,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Action",          
                                accessor: "actions",
                                fixed: "right",
                                sortable: false,
                                filterable: false,
                                width: 170,
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
                              // console.log("STATEL 2:", state)
                              // this.setState({ page: state.page, pagesize: state.pageSize })
                              this.setState({ page: state.page, pagesize: 10 });
                              this.getDataFromDb(state);
                            }}
                          />
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </div>
              )
            },
            {
              tabName: "Final Round",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={`${classes.mt0}`}>Final Round</h1>
                      <h5>Contact your candidate</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                          Interview List
                        </CardHeader>
                        <CardBody className="cardCustomBody">
                        <ReactTableFixedColumns
                            noDataText={"No data found"}
                            data={this.createTablecontent3(this.state.data)}
                            filterable
                            PaginationComponent={UpdatedPagination}
                            columns={[
                              {
                                Header: "#",
                                accessor: "sr_no",
                                width: 40,
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Job Role",
                                accessor: "watchlist",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Candidate Name",
                                accessor: "candidate",
                                width: 180,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Interview Date",
                                accessor: "interview_date",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Interview Time",
                                accessor: "interview_time",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Location",
                                accessor: "place",
                                width: 150,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Action",          
                                accessor: "actions",
                                sortable: false,
                                fixed: "right",
                                filterable: false,
                                width: 170,
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
                              // console.log("STATEL 3:", state)
                              // this.setState({ page: state.page, pagesize: state.pageSize })
                              this.setState({ page: state.page, pagesize: 10 });
                              this.getDataFromDb(state);
                            }}
                          />
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </div> 
              )
            },
            {
              tabName: "Move to Offer",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={`${classes.mt0}`}>Move to Offer</h1>
                      <h5>Contact your candidate</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                          Interview List
                        </CardHeader>
                        <CardBody className="cardCustomBody">
                          <ReactTableFixedColumns
                            noDataText={"No data found"}
                            data={this.createTablecontent4(this.state.data)}
                            filterable
                            PaginationComponent={UpdatedPagination}
                            columns={[
                              {
                                Header: "#",
                                accessor: "sr_no",
                                width: 40,
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Job Role",
                                accessor: "watchlist",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Candidate Name",
                                accessor: "candidate",
                                width: 180,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Interview Date",
                                accessor: "interview_date",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Offer Date",
                                accessor: "offer_date",
                                width: 170,
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Offer Status",
                                accessor: "is_offer_sent",
                                width: 150,
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Action",
                                accessor: "actions",
                                width: 150,
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
                                // console.log("STATEL 4:", state)
                                // this.setState({ page: state.page, pagesize: state.pageSize })
                                this.setState({ page: state.page, pagesize: 10 });
                                this.getDataFromDb(state);
                            }}
                          />
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </div> 
              )
            },
          ]}
        />
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
              <h4 className={classes.modalTitle}>Candidate Reject</h4>
            </DialogTitle>
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer>
                <GridItem xs={8}>
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
                <GridItem xs={4}>
                  <CustomInput
                    labelText="My Openings"
                    id="emailLog"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      value: this.state.watchlistname,
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <CustomInput
                    error={this.state.remarksState === "error"}
                    success={this.state.remarksState === "success"}
                    labelText="Rejection Remark"
                    id="rejectionremark"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: this.state.remarks,
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                      onChange: ((e) => {
                        if (e.target.value.trim() === "") {
                          this.setRemarksState("error");
                        } else {
                          this.setRemarksState("success");
                        }
                        this.setRemarks(e.target.value)
                      })
                    }}
                  />
                </GridItem>
              </GridContainer>

            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={() => this.setModal(false)}
                color="info"
                size="lg"
                className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                onClick={(e) => this.failCurrentList()}
              >
                Submit
            </Button>
            </DialogActions>
          </Dialog>
          {/* Modal Ends */}
        
          {/* Modal Set Interview  Start */}
          <Dialog
            className="height500"
            modalStyle={{
              root: classes.center,
              paper: classes.modal
            }}
            open={this.state.interviewModal}
            transition={Transition}
            keepMounted
            onClose={() => this.setInterviewModal(false)}
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
                onClick={() => this.setInterviewModal(false)}
              >
                <Close className={classes.modalClose} />
              </Button>
              <h4 className={classes.modalTitle}>Select Interview Date</h4>
            </DialogTitle>
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="simple-select"
                      className={classes.selectLabel}
                    >
                      Status
                  </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={this.state.new_status}
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
                        Select Interview Status
                      </MenuItem>
                      {(this.state.current_status == 4 || this.state.current_status == '4') ? <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={4}
                      >
                        Phone Screening 
                      </MenuItem> : null}
                      {(this.state.current_status == 4 || this.state.current_status == '4' || this.state.current_status == 6 || this.state.current_status == '6') ? <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={6}
                      >
                        In-Process
                      </MenuItem> : null}
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={8}
                      >
                        Final Round
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={14}
                      >
                        Move to Offer
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}></GridItem>
                {(this.state.new_status != 14 || this.state.new_status != '14') ?
                <>
                  <GridItem xs={12} sm={6} md={6}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel className="label-radio label-time">
                        Interview Date
                      </FormLabel>
                      <Datetime
                        isValidDate={this.isValidDate}
                        dateFormat="MM-DD-YYYY"
                        value={this.state.onsiteinterviewdate}
                        inputProps={{
                          id: "interview_date",
                          placeholder: "Interview Date",
                        }}
                        timeFormat={false}
                        closeOnSelect={true}
                        onChange={(e) =>
                          this.handleChangeDate(e)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <FormControl component="fieldset" fullWidth >
                      <FormLabel className="label-radio label-time">
                        Interview Time
                      </FormLabel>
                      <Datetime
                        dateFormat={false}
                        className="interviewTime"
                        inputProps={{ placeholder: "Time Slot" }}
                        timeFormat="hh:mm A"
                        value={this.state.onsiteinterviewtime}
                        onChange={(time) => this.handleTimeSlot(time)}
                      />
                    </FormControl>
                  </GridItem>
                </>
                : null}
              </GridContainer>
            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={() => this.setInterviewModal(false)}
                color="info"
                size="lg"
                className={`${classes.blockButton} ${classes.mt30} `}
                onClick={(e) => this.passCurrentList()}
              >
                Submit
            </Button>
            </DialogActions>
          </Dialog>
          {/* Modal Ends */}

          {/* Modal Set Edit  Start */}
          <Dialog
            className="height500"
            modalStyle={{
              root: classes.center,
              paper: classes.modal
            }}
            open={this.state.editModal}
            transition={Transition}
            keepMounted
            onClose={() => this.setEditModal(false)}
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
                onClick={() => this.setEditModal(false)}
              >
                <Close className={classes.modalClose} />
              </Button>
              <h4 className={classes.modalTitle}>Select Interview Date</h4>
            </DialogTitle>
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel className="label-radio label-time">
                      Interview Date
                    </FormLabel>
                    <Datetime
                      isValidDate={this.isValidDate}
                      dateFormat="MM-DD-YYYY"
                      value={this.state.onsiteinterviewdate}
                      inputProps={{
                        id: "interview_date",
                        placeholder: "Interview Date",
                      }}
                      timeFormat={false}
                      closeOnSelect={true}
                      onChange={(e) =>
                        this.handleChangeDate(e)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <FormControl component="fieldset" fullWidth >
                    <FormLabel className="label-radio label-time">
                      Interview Time
                    </FormLabel>
                    <Datetime
                      dateFormat={false}
                      className="interviewTime"
                      inputProps={{ placeholder: "Time Slot" }}
                      timeFormat="hh:mm A"
                      value={this.state.onsiteinterviewtime}
                      onChange={(time) => this.handleTimeSlot(time)}
                    />
                  </FormControl>
                </GridItem>                
              </GridContainer>
            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={() => this.setEditModal(false)}
                color="info"
                size="lg"
                className={`${classes.blockButton} ${classes.mt30} `}
                onClick={(e) => this.editCurrentList()}
              >
                Submit
            </Button>
            </DialogActions>
          </Dialog>
          {/* Modal Ends */}
        
          {/* Modal Set Offer Start */}
          <Dialog
            modalStyle={{
              root: classes.center,
              paper: classes.modal
            }}
            open={this.state.offermodal}
            transition={Transition}
            keepMounted
            onClose={() => this.setOfferModal(false)}
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
                onClick={() => this.setOfferModal(false)}
              >
                <Close className={classes.modalClose} />
              </Button>
              <h4 className={classes.modalTitle}>Search Engineers</h4>
            </DialogTitle>
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer>
                <GridItem xs={12} className={`${classes.textCenter} ${'cardTitle1'} ${'cardCustomHeader'}`}>
                  Candidate Accepted Offer from Another Company.
              </GridItem>
              </GridContainer>

            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={() => this.setOfferModal(false)}
                color="info"
                size="lg"
                className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                onClick={(e) => this.setOfferModal(false)}
              >
                Ok
            </Button>
            </DialogActions>
          </Dialog>
          {/* Modal Ends */}
        </div>   
      </div>      
    )
  }
}
const mapStatetoProps = state => {
  // console.log("in maptostate : ",state)
  return {
    user: state.authReducer.user
  }
}
const mapDispatchtoProps = { logoutUser }
const combinedStyles = combineStyles(styles, useCustomSpace1, checkBoxStyle, modalStyles, customSelect, customStyle);
export default connect(mapStatetoProps, mapDispatchtoProps)(withStyles(combinedStyles)(CurrentInterviews))
