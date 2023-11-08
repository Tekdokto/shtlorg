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


import { Icon as IconF, InlineIcon } from '@iconify/react';
import ListIcon from '@material-ui/icons/List';
import circleEditOutline from '@iconify/icons-mdi/circle-edit-outline';
import accountMultiple from '@iconify/icons-mdi/account-multiple';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

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
import { logoutUser } from "../../redux/action";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// const useStyles = makeStyles(styles);
// const useCheckStyles = makeStyles(checkBoxStyle);
// const useModalStyles = makeStyles(modalStyles);
// const useSelectStyles = makeStyles(customSelect);
// const useButtonStyles = makeStyles(buttonStyles);
// const useCustomSpace = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   control: {
//     padding: theme.spacing(2),
//   },
// }));
const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
};
const useCustomStyle = makeStyles(customStyle);

class SentIntroDiscoveryCallList extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.redirectToIntroDiscoveryCallList = this.redirectToIntroDiscoveryCallList.bind(this);
    this.state = {
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
      pagesize: 7,
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
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if (props.user) {
      return {
        user: (props.user) ? props.user : []
      };
    } else {
      return {
        ...state
      }
    }
  }

  setSimpleSelect(val = "") {
    this.setState({
      custom_slot: val
    })
  }

  handleSimple = (event) => {
    this.setSimpleSelect(event.target.value);
  };

  setModal(val = false, confirm_id = 0, student_id = 0, student_name = "", on_date = "", temp_object = {},is_got_other_company_offer=0) {
    if(is_got_other_company_offer == 1){
      this.setOfferModal(true);
    }else{
    this.setState({
      modal: val,
      confirm_id: confirm_id,
      student_id: student_id,
      student_name: student_name,
      watchlistname: (temp_object.watchlistname && temp_object.watchlistname !== "") ? temp_object.watchlistname : "",
      on_date: (on_date) ? (moment(on_date).format("MM/DD/YYYY") === "Invalid date" ? on_date : moment(on_date).format("MM/DD/YYYY")) : " - ",
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
    let response = await this.getData(state);
    // set totalStudent and data
    // console.log("DATTA:",response)
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
      this.props.history.push("/auth/login")
      this.props.logoutUser(this.props.history)
    }
  }

  async getData(state) {
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
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    let get_watchlist = {}
    get_watchlist.user_id = this.props.user.user_id;
    get_watchlist.page = state.page;
    get_watchlist.page_size = state.pagesize;
    get_watchlist.filtred = filtered;
    get_watchlist.sort_param= sorted
    get_watchlist.order= order	
    const res = await axios.post(`${API_URL}/company/watchlist/get_intro_discovery_response`, get_watchlist, headers);
    return await res.data;
  }

  createTablecontent(data) {

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

  redirectToIntroDiscoveryCallList() {
    this.props.history.push(`/company/sentcallrequest`)
  }

  confirmInterview() {
    if (this.state.intro_discovery_response_type === 1 || this.state.intro_discovery_response_type === '1') {
      if (this.state.custom_slot && this.state.custom_slot !== '') {
        let temp_obj = {}
        temp_obj.id = this.state.confirm_id;
        temp_obj.student_id = this.state.student_id;
        temp_obj.on_date = moment(this.state.on_date).format('YYYY-MM-DD');;
        temp_obj.timeslot1 = this.state.custom_slot;
        temp_obj.user_id = this.props.user.user_id;
        // console.log("temp_obj",temp_obj)
        this.ConfirmInterview(temp_obj);
      } else {
        toast.error("Select time slot to confirm interview.")
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
    let response = await this.callConfirminterview(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.setModal(false)
        setTimeout(function () {
          window.location.reload();
        }, 500)
      } else {
        this.setModal(false)
        toast.success(response.message)
        setTimeout(function () {
          window.location.reload();
        }, 500)
      }
    } else {
      this.props.history.push("/auth/login")
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
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} lg={8}>
            <h1>Intro Discovery Call Request to Confirm</h1>
            <h5>Contact your candidate</h5>
          </GridItem>
          <GridItem lg={4} className={classes.rightLeftResponsive}>
            <Button
              color="info"
              size="lg"
              className={` ${classes.mt30}`}
              onClick={this.redirectToIntroDiscoveryCallList}
            >
              <VisibilityOutlinedIcon />{" "}Sent Interview request
          </Button>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Contact My Openings
            </CardHeader>
              <CardBody className="cardCustomBody">
                <ReactTable
                  noDataText={"No data found"}
                  data={this.createTablecontent(this.state.data)}
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
                      Header: "My Openings",
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
                    <GridItem xs={12}>
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
                    </GridItem>
                    <GridItem xs={12}>
                      {(this.state.intro_discovery_response_type === 0 || this.state.intro_discovery_response_type === '0') ? <CustomInput
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
                      /> : null}
                    </GridItem>
                    {(this.state.intro_discovery_response_type === 1 || this.state.intro_discovery_response_type === '1') ? <GridItem xs={12}>
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
                            Select My Openings
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
    );
  }
}
const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = { logoutUser }
const combinedStyles = combineStyles(styles, useCustomSpace1, checkBoxStyle, modalStyles, customSelect, customStyle);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(SentIntroDiscoveryCallList));