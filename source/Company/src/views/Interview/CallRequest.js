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
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
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

class CallRequest extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.state = {
      activeTab: 0,
      all_watchlist: [],
      watchlist: "",
      custom_slot: '',
      confirm_id: 0,
      student_id: 0,
      student_name: "",
      watchlistname: "",
      on_date: "",
      intro_discovery_response_type: '0',
      time_slot1: "",
      time_slot2: "",
      time_slot3: "",
      data: [],
      totalStudent: 0,
      page: 0,
      pagesize: 10,
      modal: false,
      checked: [24, 22],
      simpleSelect: "",
      offermodal : false
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
    this.setState({ activeTab: value });
  };

  setSimpleSelect(val = "") {
    this.setState({
      custom_slot: val
    })
  }

  handleSimple = (event) => {
    this.setSimpleSelect(event.target.value);
  };

  isValidDate(currentDate) {
    if (moment(currentDate).diff(moment(), "hours") > 0) {
      return true;
    } else {
      return false;
    }
  }

  handleChangeDate(val) {
    // console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {
      this.setState({
        on_date: moment(val).format("MM-DD-YYYY")
      });
    }
  }

  setModal(val = false, confirm_id = 0, student_id = 0, student_name = "", on_date = "", temp_object = {},is_got_other_company_offer=0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true);
    }else{
      let temp_on_date = '';
      if(temp_object.intro_discovery_response_type === 1 || temp_object.intro_discovery_response_type === '1'){
        temp_on_date = (on_date) ? (moment(on_date).format('MM-DD-YYYY')) : "";
      } else {
        temp_on_date = (on_date) ? (moment(on_date).format("MM/DD/YYYY") === "Invalid date" ? on_date : moment(on_date).format("MM/DD/YYYY")) : " - ";
      }
      this.setState({
        modal: val,
        confirm_id: confirm_id,
        student_id: student_id,
        student_name: student_name,
        watchlistname: (temp_object.watchlistname && temp_object.watchlistname !== "") ? temp_object.watchlistname : "",
        on_date: temp_on_date,
        intro_discovery_response_type: temp_object.intro_discovery_response_type,
        time_slot1: (temp_object.intro_discovery_response_timeslot1 && temp_object.intro_discovery_response_timeslot1 !== "") ? temp_object.intro_discovery_response_timeslot1 : "",
        time_slot2: (temp_object.intro_discovery_response_timeslot2 && temp_object.intro_discovery_response_timeslot2 !== "") ? temp_object.intro_discovery_response_timeslot2 : "",
        time_slot3: (temp_object.intro_discovery_response_timeslot3 && temp_object.intro_discovery_response_timeslot3 !== "") ? temp_object.intro_discovery_response_timeslot3 : ""
      })
    }
  }

  setOfferModal(val=false){
    this.setState({
      offermodal : val
    })
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
    let API_ENDPOINT = (this.state.activeTab === 0) ? 'get_intro_discovery_request' : 'get_intro_discovery_response';
    const res = await axios.post(`${API_URL}/company/watchlist/${API_ENDPOINT}`, get_watchlist, headers);
    return await res.data;
  }

  createTablecontent(data) {
    const { classes } = this.props;
    let ths = this;
    return data.length > 0 ? data.map((prop, key) => {
        return {
          sr_no: this.state.pagesize * this.state.page + key + 1,
          watchlist: prop['watchlistname'],
          candidate: prop['candidatename'],
          request_date: (prop['requested_date']) ? moment(prop['requested_date']).format('MM/DD/YYYY') : " - ",
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'])} /></CustomTooltip>{" "}
            </div>
          )
        };
      })
      : [];
  }

  createTablecontent1(data) {
    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        watchlist: prop['watchlistname'],
        candidate: prop['candidatename'],
        interview_date: (prop['intro_discovery_response_on_date']) ? moment(prop['intro_discovery_response_on_date']).format("MM/DD/YYYY") : " - ",
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'])} /></CustomTooltip>{" "}
            <CustomTooltip title="Confirm" position="left"><PlaylistAddCheckIcon style={{ "cursor": "pointer" }} onClick={() => this.setModal(true, prop['id'], prop['student_id'], prop['candidatename'], prop['intro_discovery_response_on_date'], prop,prop['is_got_other_company_offer'])} /></CustomTooltip>{" "}
          </div>
        )
      };
    }) : []
  }

  redirectToCandidateDetail(id) {
    this.props.history.push(`/company/candidatedetail/${id}/0`)
  }

  confirmInterview() {
    if (this.state.intro_discovery_response_type === 1 || this.state.intro_discovery_response_type === '1') {
      let temp_date = moment(this.state.on_date, ["MM-DD-YYYY"]).format("YYYY-MM-DD")
      let current_date = moment().format("YYYY-MM-DD");

      if (this.state.on_date && this.state.on_date !== "" && temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') > 0 && this.state.custom_slot && this.state.custom_slot !== "") {
        let temp_obj = {}
        temp_obj.id = this.state.confirm_id;
        temp_obj.student_id = this.state.student_id;
        temp_obj.on_date = temp_date;
        temp_obj.timeslot1 = this.state.custom_slot;
        temp_obj.user_id = this.props.user.user_id;
        // console.log("temp_obj",temp_obj)
        this.ConfirmInterview(temp_obj);
      } else {
        if (!(this.state.on_date && this.state.on_date !== "" && new Date(this.state.on_date) !== "Invalid Date")) {
          toast.error("Please select valid date.")
        } else if (!(this.state.custom_slot && this.state.custom_slot !== "")) {
          toast.error("Select time slot to confirm interview.")
        } else if (temp_date !== "Invalid date" && moment(temp_date).diff(moment(current_date, ["YYYY-MM-DD"]), 'days') <= 0) {
          toast.error("Please select valid date.")
        }
      }
    } else {
      let temp_obj = {}
      temp_obj.id = this.state.confirm_id;
      temp_obj.student_id = this.state.student_id;
      temp_obj.on_date = moment(this.state.on_date).format('YYYY-MM-DD');
      temp_obj.timeslot1 = this.state.time_slot1;
      temp_obj.user_id = this.props.user.user_id;
      // console.log("temp_obj1",temp_obj)
      this.ConfirmInterview(temp_obj);
    }
  }

  async ConfirmInterview(params) {
    let ths = this;
    let response = await this.callConfirminterview(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }      
      setTimeout(function () {
        ths.setModal(false);        
        ths.getDataFromDb({page: ths.state.page, pageSize: ths.state.pagesize});
      }, 500)
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async callConfirminterview(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/confirm_intro_discovery_call_timeslot`, params, headers);
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
              tabName: "Sent Intro Call",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={`${classes.mt0}`}>Sent Intro Call</h1>
                      <h5>Here are the candidates who have already received your Intro Call request.</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                          Candidates
                        </CardHeader>
                        <CardBody className="cardCustomBody">
                          <ReactTableFixedColumns
                            noDataText={"No data found"}
                            data={this.createTablecontent(this.state.data)}
                            filterable
                            PaginationComponent={UpdatedPagination}
                            columns={[
                                {
                                Header: "#",
                                accessor: "sr_no",
                                sortable: false,
                                filterable: false,
                                },
                                {
                                  Header: "Job Role",
                                  accessor: "watchlist",
                                  sortable: true,
                                  filterable: true
                                },
                                {
                                  Header: "Engineer",
                                  accessor: "candidate",
                                  sortable: false,
                                  filterable: false
                                },
                                {
                                  Header: "Requested Date",
                                  accessor: "request_date",
                                  sortable: true,
                                  filterable: true
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
              tabName: "Request To Confirm",
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem>
                      <h1 className={` ${classes.mt0}`}>Request To Confirm</h1>
                      <h5>Respond to candidates.</h5>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12}>
                      <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                          Candidates
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
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Job Role",
                                accessor: "watchlist",
                                sortable: true,
                                filterable: true
                              },
                              {
                                Header: "Engineer",
                                accessor: "candidate",
                                sortable: false,
                                filterable: false
                              },
                              {
                                Header: "Interview Date",
                                accessor: "interview_date",
                                sortable: true,
                                filterable: true
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
                              // console.log("STATEL 2:", state)
                              // this.setState({ page: state.page, pagesize: state.pageSize })
                              this.setState({ page: state.page, pagesize: 10 });
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
                            <h4 className={classes.modalTitle}>Confirm Interview</h4>
                          </DialogTitle>
                          <DialogContent
                            id="modal-slide-description"
                            className={classes.modalBody}
                          >
                            <GridContainer>
                              <GridItem xs={8}>
                                <CustomInput
                                  labelText="Name"
                                  id="name"
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
                                  id="watchlist"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                    value: `${this.state.watchlistname}`,
                                    endAdornment: (
                                      <InputAdornment position="end"></InputAdornment>
                                    ),
                                  }}
                                />
                              </GridItem>
                              {(this.state.intro_discovery_response_type === 0 || this.state.intro_discovery_response_type === '0') ? <GridItem xs={12}>
                                <CustomInput
                                  labelText="Preferred Date"
                                  id="preferred_date"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                    value: `${this.state.on_date}`,
                                    endAdornment: (
                                      <InputAdornment position="end"></InputAdornment>
                                    ),
                                  }}
                                />
                              </GridItem> : null}
                              {(this.state.intro_discovery_response_type === 0 || this.state.intro_discovery_response_type === '0') ? <GridItem xs={12}>
                                <CustomInput
                                  labelText="Preferred Slot"
                                  id="prefer_slot"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                    value: `${this.state.time_slot1}`,
                                    endAdornment: (
                                      <InputAdornment position="end"></InputAdornment>
                                    ),
                                  }}
                                />
                              </GridItem> : null}
                              {(this.state.intro_discovery_response_type === 1 || this.state.intro_discovery_response_type === '1') ? <GridItem xs={12} sm={6} md={6}>
                                <FormControl component="fieldset" fullWidth>
                                  <FormLabel className="label-radio label-time">
                                    Preferred Date
                                  </FormLabel>
                                  <Datetime
                                    isValidDate={this.isValidDate}
                                    dateFormat="MM-DD-YYYY"
                                    value={this.state.on_date}
                                    inputProps={{
                                      id: "preferred_date",
                                      placeholder: "Preferred Date",
                                    }}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    onChange={(e) =>
                                      this.handleChangeDate(e)}
                                  />
                                </FormControl>
                              </GridItem> : null}
                              {(this.state.intro_discovery_response_type === 1 || this.state.intro_discovery_response_type === '1') ? <GridItem xs={12} sm={6} md={6}>
                                <FormControl fullWidth className={classes.selectFormControl}>
                                  <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}
                                  >
                                    Time Slot
                                </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu,
                                    }}
                                    classes={{
                                      select: classes.select,
                                    }}
                                    value={this.state.custom_slot}
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
                                      Select Time
                                  </MenuItem>
                                    {(this.state.time_slot1 !== "") ? <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected,
                                      }}
                                      value={this.state.time_slot1}
                                    >
                                      {this.state.time_slot1}
                                    </MenuItem> : null}
                                    {(this.state.time_slot2 !== "") ? <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected,
                                      }}
                                      value={this.state.time_slot2}
                                    >
                                      {this.state.time_slot2}
                                    </MenuItem> : null}
                                    {(this.state.time_slot3 !== "") ? <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected,
                                      }}
                                      value={this.state.time_slot3}
                                    >
                                      {this.state.time_slot3}
                                    </MenuItem> : null}
                                  </Select>
                                </FormControl>
                              </GridItem> : null}
                            </GridContainer>

                          </DialogContent>
                          <DialogActions
                            className={classes.modalFooter + " " + classes.modalFooterCenter}
                          >
                            <Button
                              color="info"
                              size="lg"
                              className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                              onClick={(e) => this.confirmInterview()}
                            >
                              Confirm Interview
                          </Button>
                          </DialogActions>
                        </Dialog>
                        {/* Modal Ends */}                        

                        {/* Modal Start */}
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
                    </GridItem>
                  </GridContainer>
                </div>
              )
            }
          ]}
        />        
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
export default connect(mapStatetoProps, mapDispatchtoProps)(withStyles(combinedStyles)(CallRequest))
