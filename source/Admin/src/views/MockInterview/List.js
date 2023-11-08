import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

import axios from "axios";
import moment from "moment";
import { API_URL } from "constants/defaultValues.js";
import { toast } from "react-toastify";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import Edit from "@material-ui/icons/Edit";
import Remove from "@material-ui/icons/Remove";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";

import Contacts from "@material-ui/icons/Contacts";
import PeopleIcon from '@material-ui/icons/People';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import playlistRemove from '@iconify/icons-mdi/playlist-remove';
import circleEditOutline from '@iconify/icons-mdi/circle-edit-outline';
import { Icon as IconF, InlineIcon } from '@iconify/react';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { dataTable } from "variables/general.js";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { listMock,updateMock, resetMockNotifcation } from '../../redux/action';
import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import Slide from "@material-ui/core/Slide";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import customStyle from "assets/jss/customStyle";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl"; 
import FormLabel from "@material-ui/core/FormLabel";
import * as Datetime from "react-datetime";
import { PAGE_SIZE } from "../../constants/defaultValues.js";
import CustomTooltip  from "../Tooltip/tooltip"
// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  ...sweetAlertStyle
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class MockList extends Component {
  constructor(props) {
    super(props);
    this.setModal = this.setModal.bind(this);
    this.rejectcandidate = this.rejectcandidate.bind(this);
    this.verifyString = this.verifyString.bind(this);
    this.setRemark = this.setRemark.bind(this);
    this.setRemarkState = this.setRemarkState.bind(this);
    this.Updatestatus = this.Updatestatus.bind(this);
    
    this.state = {
      data: [],
      categoryName: "",
      categoryNameState: "",
      users: [],
      totaluser: 0,
      page: 0,
      pagesize: 5,
      iseditModal: false,
      alert: null,
      modal:false,
      interviewModal: false,
      mockinterviewdate: "",
      mockinterviewtime: "",
      candidateid:'',
      candidatename:'',
      candidateremark:'',
      candidateremarkState: "",
    }
  }
  componentDidMount() {
    
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }
  getDataFromDb(state) {
    let ths = this;
    ths.showLoader();
    let sorted, order;
    let filtered = {}
    if (state.sorted.length > 0) {
      sorted = state.sorted[0].id
    }
    if (state.sorted.length > 0) {
      if (state.sorted[0].desc == false) {
        order = 1
      } else {
        order = -1
      }
    }
    if (state.filtered.length > 0) {
      state.filtered.forEach(element => {
        filtered[element.id] = element.value;
      });
    }

    let admin_id = this.props.user.user_id
    console.log('admin_id', this.props.user);
    this.props.listMock({
      admin_id: admin_id,
      status: 'pending',
      page: state.page,
      page_size: state.pageSize,
      sort_param: sorted,
      order: order,
      filtred: filtered
    }, this.props.history);
    setTimeout(()=>{
      ths.hideLoader()
    },1500)
  }
  static getDerivedStateFromProps(props, state) {
    console.log("props cattt", props);
    // console.log("props state cattt",state);      
    return {
      users: (props.users) ? props.users : [],
      totaluser: props.total_user
    };
  }
  setAlert(val = null) {
    this.setState({ alert: val })
  }
  setModal(val) {
    console.log("testest",val)
    this.setState({ modal: false,candidateid:'',candidatename:'',candidateremark:'',candidateremarkState:'' })
  }
  setInterviewModal(val = false, id, on_date, on_time) {
    this.setState({
      interviewModal: val,
      candidateid: (val) ? id : "",
      mockinterviewdate: (val) ? ((moment(on_date).format('MM-DD-YYYY'))) : "",
      mockinterviewtime: (val) ? on_time : ""
    })
  }
  rejectcandidate(id,name) {
   
    this.setState({ modal: true, candidateid:id,candidatename:name })
  }
  verifyString(val,len=1){
    console.log('val',val,len);
    
      if(val.trim().length >= len){
          return true
      }
      return false;
  }
  setRemark(val=""){
    this.setState({candidateremark:val})
  }
  setRemarkState(val=""){
      this.setState({candidateremarkState:val})
  }
  redirectToCandidateDetail(id){
    console.log(`admin/engineer-management/detail/${id}`)
    this.props.history.push(`/admin/engineer-management/detail/${id}`)
  }
  Updatestatus(){
    console.log("this.state.candidateremark",this.state.candidateremark)
    if(!this.verifyString(this.state.candidateremark,3)){
      this.setRemarkState("error");
    }else{
      if(this.verifyString(this.state.candidateremark,3)){
        let admin_id = this.props.user.user_id
        let user = {
            admin_id,
            'id':this.state.candidateid,
            'remark':this.state.candidateremark,
            'status':1,
        }
        this.props.updateMock(user, this.props.history);
        this.setState({ modal: false,candidateid:'',candidatename:'',candidateremark:'' })
        this.setAlert();
        this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
      }
    }
    
   
  }
  
  deleteVideo(id, newstatus) {
    let admin_id = this.props.user.user_id;
    this.props.updateMock({ admin_id, id, status: newstatus }, this.props.history);
    this.setAlert();
    this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
  }
  warningWithConfirmAndCancelMessage(id, status) {
    let ths = this;
    const { classes } = this.props;
     var newstatus = '2';
      var title = "Are you want to pass this candidate?"
    
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title={title}
        onConfirm={() => ths.deleteVideo(id, newstatus)}
        onCancel={() => ths.setAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.info}
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
      >
      </SweetAlert>
    );
  };

  warningDeleteMessage(id, status) {
    let ths = this;
    const { classes } = this.props;
    var newstatus = '2';
    var title = "Are you want to delete Video?"
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title={title}
        onConfirm={() => ths.deleteVideo(id, newstatus)}
        onCancel={() => ths.setAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
      >
      </SweetAlert>
    );
  };
  createTablecontent(data) {
    console.log("2", this.state, data);

    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (PAGE_SIZE * this.state.page) + key + 1,
        name: prop['name'],
        on_date: prop['on_date'],
        on_time: prop['on_time'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
              
          <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => this.redirectToCandidateDetail(prop['user_id'])}  style={{ 'width': '24px' }}   /></CustomTooltip>{" "}
          <CustomTooltip title="Edit"><IconF icon={circleEditOutline} style={{ "cursor": "pointer" }} onClick={() => this.setInterviewModal(true, prop['id'], prop['on_date'], prop['on_time'])} /></CustomTooltip>{" "}
           <CustomTooltip title="Pass" position="left"><PlaylistAddCheckIcon style={{"cursor":"pointer"}} onClick={()=> this.warningWithConfirmAndCancelMessage(prop['id'], prop['status'])}/></CustomTooltip>{" "}
           <CustomTooltip title="Reject" position="left"><IconF icon={playlistRemove} style={{ cursor: "pointer", width: "25px", height: "25px" }} onClick={()=> this.rejectcandidate(prop['id'], prop['name'])}/></CustomTooltip>{" "}   
           {" "}

          </div>
        )
      };
    }) : []
  }

  isValidDate(currentDate) {
    if (moment(currentDate).diff(moment(), "hours") > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  handleChangeDate(val) {
   if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {
      this.setState({
        mockinterviewdate: moment(val).format("MM-DD-YYYY")
      });
    }
  }

  handleTimeSlot(val) {
    if (val && val !== "" && moment(val).format("hh:mm A") !== "Invalid date") {
      this.setState({
        mockinterviewtime: moment(val).format("hh:mm A")
      })
    }
  }

  updateMockInterview() {
    let params = {}
    params.admin_id = this.props.user.user_id;
    let temp_date = moment(this.state.mockinterviewdate, ["MM-DD-YYYY"]).format("YYYY-MM-DD")
    let current_date = moment().format("YYYY-MM-DD");
    if (this.state.mockinterviewdate && this.state.mockinterviewdate !== "" && temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') > 0 && this.state.mockinterviewtime && this.state.mockinterviewtime !== "") {
      params.id = this.state.candidateid;
      params.on_date = temp_date;
      params.on_time = this.state.mockinterviewtime;
      this.updateMockInterviewMiddle(params);
    } else {
      if (!(this.state.mockinterviewdate && this.state.mockinterviewdate !== "" && new Date(this.state.mockinterviewdate) !== "Invalid Date")) {
        toast.error("Please select valid date.")
      } else if (!(this.state.mockinterviewtime && this.state.mockinterviewtime !== "")) {
        toast.error("Please select time slot.")
      } else if (temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') <= 0) {
        toast.error("Please select valid date.")
      }
    }
  }

  async updateMockInterviewMiddle(params) {
    let ths = this;
    let response = await this.callupdateMockInterview(params);
    if (response.status !== -2) {
      console.log("response", response)
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
      setTimeout(function () {
        ths.setModal(false);
        ths.setInterviewModal(false);
        ths.getDataFromDb({ page: ths.state.page, pageSize: ths.state.pagesize, sorted: [], filtered: [] })
      }, 500)
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async callupdateMockInterview(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/mockinterview/updatemockinterview`, params, headers)
    return await res.data;
  }

  render() {
    const { classes } = this.props;
    console.log("123", this.state);

    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Mock Interview</h1>
            <h5>Mock Interview requested by Engineers</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
           
          </GridItem>
        </GridContainer>

     
        <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Mock Interview List
              
            </CardHeader>
              <CardBody className="cardCustomBody">
                <ReactTableFixedColumns
                  noDataText={"No data found"} 
                  data={this.createTablecontent(this.state.users)}
                  filterable
                  PaginationComponent={UpdatedPagination}
                  columns={[
                    {
                      Header: "#",
                      accessor: "sr_no",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Engineer",
                      accessor: "name",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Interview Date",
                      accessor: "on_date",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Interview Time",
                      accessor: "on_time",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      width: 150,
                      fixed: "right",
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultPageSize={PAGE_SIZE}
                  pages={Math.ceil(this.state.totaluser / PAGE_SIZE)}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                  manual
                  onFetchData={(state, instance) => {
                    // show the loading overlay                        
                    // fetch your data   
                    console.log("STATEL:", state)
                    this.setState({ page: state.page, pagesize: state.pageSize })
                    this.getDataFromDb(state);
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>
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
                  <GridItem xs={12}>
                    <CustomInput
                      labelText="Name"
                      id="name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                      value: this.state.candidatename,
                      type: "text"
                    }}
                      
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      success={this.state.candidateremarkState === "success"}
                      error={this.state.candidateremarkState === "error"}
                      labelText="Rejection Remark"
                      id="remark"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyString(event.target.value,3)) {
                                this.setRemarkState("success");
                            } else {
                                this.setRemarkState("error");
                            }
                            this.setRemark(event.target.value);
                        },
                        value: this.state.candidateremark,
                        type: "text"
                      }}
                    />
                  </GridItem>
                  
                  
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter}
              >
               <Button
                  onClick={() => this.Updatestatus()}
                  color="info"
                  size="lg"
                  className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
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
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel className="label-radio label-time">
                        Mock Interview Date
                      </FormLabel>
                      <Datetime
                        isValidDate={this.isValidDate}
                        dateFormat="MM-DD-YYYY"
                        value={this.state.mockinterviewdate}
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
                        Mock Interview Time
                    </FormLabel>
                      <Datetime
                        dateFormat={false}
                        className="interviewTime"
                        inputProps={{ placeholder: "Time Slot" }}
                        timeFormat="hh:mm A"
                        value={this.state.mockinterviewtime}
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
                  onClick={() => this.setInterviewModal(false)}
                  color="info"
                  size="lg"
                  className={`${classes.blockButton} ${classes.mt30} `}
                  onClick={(e) => this.updateMockInterview()}
                >
                  Submit
              </Button>
            </DialogActions>
          </Dialog>
          {/* Modal Ends */}
          {this.state.alert}
          {/* <Snackbar
            place="tr"
            color={(this.props.user_error) ? "danger" : "info"}
            icon={AddAlert}
            message={`${this.props.notification_message}`}
            open={this.props.shownotification}
            closeNotification={() => {
              this.props.resetVideoNotifcation();
            }}
            close
          /> */}
        </GridContainer>
      </div>

    )
  }
}
const mapStateToProps = state => {
  console.log('in userlist maptoprops:', state);

  return {
    user: state.authReducer.user,
    shownotification: state.mockinterviewReducer.shownotification,
    user_error: state.mockinterviewReducer.user_error,
    users: state.mockinterviewReducer.users,
    total_user: state.mockinterviewReducer.total_user,
    notification_message: state.mockinterviewReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles, styles);
const mapDispatchToProps = { listMock,updateMock, resetMockNotifcation };
export default withStyles(customStyle)(connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(MockList)));