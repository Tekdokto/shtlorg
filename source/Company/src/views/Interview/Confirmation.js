import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import moment from "moment";
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
import playlistRemove from '@iconify/icons-mdi/playlist-remove';
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
// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
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

class Confirmation extends React.Component {
  // const classes = useStyles();
  // const classesCustom = useCustomSpace();
  // const customStyle = useCustomStyle();
  // const checkBoxStyle = useCheckStyles();
  // const selectStyle = useSelectStyles();
  // const modalStyle = useModalStyles();

  constructor(props) {
    super(props);
    this.props = props;
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.state = {
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
      pagesize: 7,
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


  setModal(val = false, confirm_id = 0, student_id = 0, student_name = "", watchlistname = "") {
    this.setState({
      modal: val,
      confirm_id: (val) ? confirm_id : "",
      student_id: (val) ? student_id : "",
      student_name: (val) ? student_name : "",
      watchlistname: (val) ? watchlistname : ""
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
    get_watchlist.sort_param = sorted
    get_watchlist.order = order
    // get_watchlist.filtred = this.state.filter;
    const res = await axios.post(`${API_URL}/company/watchlist/get_offer_confirmed_list`, get_watchlist, headers);
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
        offer_date: (prop['offer_date'] && prop['offer_date'] !== "") ? moment(prop['offer_date']).format("MM/DD/YYYY") : " - ",
        is_offer_sent: (prop['offer_confirm_date'] && prop['offer_confirm_date'] !== "") ? moment(prop['offer_confirm_date']).format("MM/DD/YYYY") : " - ",
        location: prop['place'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ "cursor": "pointer" }} onClick={() => this.redirectToCandidateDetail(prop['student_id'])} /></CustomTooltip>{" "}
          </div>
        )
      };
    }) : []
  }

  redirectToViewWatchlistDetail(name = "", id) {
    this.props.history.push(`/company/watchlistdetail/${name}/${id}`)
  }

  redirectToCandidateDetail(id) {
    this.props.history.push(`/company/candidatedetail/${id}/1`)
  }

  passOnsiteIntroList(params) {
    params.user_id = this.props.user.user_id;
    // console.log("PASS", params)
    this.passFailOnsiteIntroList(params);
  }


  failOnsiteIntroList() {
    let params = {}
    params.user_id = this.props.user.user_id;
    // console.log("FQAIL", params)
    if (this.state.remarks.trim() !== "") {
      params.id = this.state.confirm_id;
      params.student_id = this.state.student_id;
      params.status = '0';
      params.remark = this.state.remarks;
      this.passFailOnsiteIntroList(params);
    } else {

    }
  }

  async passFailOnsiteIntroList(params) {
    let ths = this;
    let response = await this.callPassFailIntroList(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
      setTimeout(function () {
        ths.getDataFromDb({ page: ths.state.page, pageSize: ths.state.pagesize })
      }, 500)
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async callPassFailIntroList(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/pass_fail_intro_discovery_call`, params, headers)
    return await res.data;
  }

  render() {
    // console.log("State: ",this.state)
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Past Hires</h1>
            <h5>List of Candidates you have hired</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Hired List
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
                      width: 150,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Offer Accepted Date",
                      accessor: "is_offer_sent",
                      width: 215,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Location",
                      accessor: "location",
                      width: 205,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Action",
                      accessor: "actions",
                      width: 140,
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
                    onClick={(e) => this.failOnsiteIntroList()}
                  >
                    Submit
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(Confirmation));