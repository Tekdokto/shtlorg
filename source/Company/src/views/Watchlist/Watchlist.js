import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import { API_URL } from "constants/defaultValues.js";
import CustomTooltip  from "../Tooltip/tooltip"
import { toast } from "react-toastify";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";

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

import CloseIcon from "../../assets/img/close-icon.svg";

import filterIcon from "../../assets/img/filter-icon.svg";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

import Accordion from "components/Accordion/Accordion.js";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// @material-ui/icons
import Check from "@material-ui/icons/Check";

import Paginations from "components/Pagination/Pagination.js";

import { Icon as IconF, InlineIcon } from "@iconify/react";
import ListIcon from "@material-ui/icons/List";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import accountMultiple from "@iconify/icons-mdi/account-multiple";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";

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

import combineStyles from "../../combineStyles";
import { logoutUser } from "../../redux/action";
// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const styles1 = {
  ...sweetAlertStyle
};

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
  },
};
const useCustomStyle = makeStyles(customStyle);

class WatchList extends React.Component {
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
    this.redirectToAddWatchList = this.redirectToAddWatchList.bind(this);
    this.state = {
      user: null,
      all_watchlist: [],
      watchlist: "",
      student_id: 0,
      student_name: "",
      data: [],
      totalStudent: 0,
      page: 0,
      pagesize: 7,
      alert: null,
      modal: false,
      checked: [24, 22],
      simpleSelect: "",
      career_path: [],
      cities: [],
      all_skills: [],
      filter: {
        career_path: "",
        location: "",
        remortely: "",
        experience_level: "",
        skills: "",
      },
    };
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
    // console.log("PROPS", this.props.location);
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
        user: props.user ? props.user : null,
      };
    } else {
      return {
        ...state,
      };
    }
  }

  setAlert(val = null) {
    this.setState({ alert: val })
  }

  setModal(val = false, student_id = 0, student_name = "") {
    this.setState({
      modal: val,
      student_id: student_id,
      student_name: student_name,
    });
  }

  setChecked(val = []) {
    this.setState({
      checked: val,
    });
  }

  setSimpleSelect(val = "") {
    this.setState({
      watchlist: val,
    });
  }

  // const [modal, setModal] = React.useState(false);
  // const [checked, setChecked] = React.useState([24, 22]);
  handleToggle = (value) => {
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
  async getDataFromDb(state) {
    let response = await this.getData(state);
    // set totalStudent and data
    // console.log("DATTA:", response);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message);
      } else {
        this.setState({
          data:
            response.data && response.data.data.length > 0
              ? response.data.data
              : [],
          totalStudent:
            response.data && response.data.data.length > 0
              ? response.data.total
              : 0,
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
    let User = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let token = User ? (User.token ? User.token : "") : "";
    let headers = { headers: { token: `${token}` } };
    let get_watchlist = {};
    get_watchlist.user_id = this.props.user.user_id;
    get_watchlist.page = state.page;
    get_watchlist.page_size = state.pagesize;
     get_watchlist.filtred = filtered;
     get_watchlist.sort_param= sorted
     get_watchlist.order= order
    const res = await axios.post(
      `${API_URL}/company/watchlist/get_watchlist`,
      get_watchlist,
      headers
    );
    return await res.data;
  }

  warningWithConfirmAndCancelMessage(id, status, message) {
    let ths = this;
    const { classes } = this.props;
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title={message}
        onConfirm={() => ths.changeWatchListStatus(id, status)}
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

  createTablecontent(data) {
    const { classes } = this.props;
    let ths = this;
    return data.length > 0
      ? data.map((prop, key) => {
        // "role_title": "Fullstack",
        // "created_date": "0000-00-00 00:00:00",
        //             "shortlisted": 1,
        //             "interviewed": 0,
        //             "hired": 0
        return {
          sr_no: this.state.pagesize * this.state.page + key + 1,
          role_title: prop["role_title"],
          role_title: (prop['role_title'])?(<a onClick={() => this.redirectToViewWatchlistDetail(prop["role_title"], prop["id"])}>{prop['role_title']}</a>):'',
          career_path: prop["career_path"],
          shortlisted: prop["shortlisted"],
          interviewed: prop["interviewed"],
          hired: prop["hired"],
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              <CustomTooltip title="Review Talent" position="right" customClass="watchlistTooltip"><IconF
                icon={accountMultiple}
                style={{ cursor: "pointer", width: "25px", height: "25px" }}
                onClick={() =>
                  this.redirectToViewWatchlistDetail(
                    prop["role_title"],
                    prop["id"]
                  )
                }
              /></CustomTooltip>{" "}
              {/* <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon
                style={{ cursor: "pointer" }}
                onClick={(e) => this.redirectToViewWatchList(prop["id"])}
              /></CustomTooltip>{" "} */}
              <CustomTooltip title="Edit" position="left"><IconF
                icon={circleEditOutline}
                style={{ cursor: "pointer", width: "20px", height: "20px" }}
                onClick={(e) => this.redirectToEditWatchList(prop["id"])}
              /></CustomTooltip>{" "} 
              <CustomTooltip title="Mark Complete" position="left" customClass="watchlistTooltip"><PlaylistAddCheckIcon
                style={{
                  cursor: "pointer",
                  title: "Mark Done",
                  width: "26px",
                  height: "26px",
                }}
                onClick={(e) => this.warningWithConfirmAndCancelMessage(prop["id"], 3, "Do you want to mark this opening as complete? This cannot be undone.")}
              /></CustomTooltip>{" "}
              <CustomTooltip title="Delete" position="left"><DeleteOutlineIcon
                style={{ cursor: "pointer", title: "Delete" }}
                onClick={(e) => this.warningWithConfirmAndCancelMessage(prop["id"], 2, "Do you want to delete this opening? This cannot be undone.")}
              /></CustomTooltip>
              {/* <ListIcon onClick={() => this.setModal(true,prop['id'],prop['candidatename'])} /> */}
            </div>
          ),
        };
      })
      : [];
  }

  redirectToViewWatchlistDetail(name = "", id) {
    this.props.history.push(`/company/watchlistdetail/${id}`);
  }

  redirectToAddWatchList() {
    this.props.history.push(`/company/addwatchlist`);
  }

  redirectToEditWatchList(id) {
    this.props.history.push(`/company/editwatchlist/${id}`);
  }
  redirectToViewWatchList(id) {
    this.props.history.push(`/company/viewwatchlist/${id}/1`);
  }

  changeWatchListStatus(id, status) {
    let params = {};
    params.user_id = this.props.user.user_id;
    params.id = id;
    params.status = status;
    this.changeWatchListstatus(params);
  }

  async changeWatchListstatus(params) {
    this.showLoader()
    let response = await this.callChangeWatchListStatus(params);
    if (response.status !== -2) {
      this.hideLoader()
      if (response.status === false) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
      let ths = this;
      this.setAlert();
      setTimeout(function () {
        ths.getDataFromDb({
          page: ths.state.page,
          pageSize: ths.state.pagesize,
        });
      }, 500);
    } else {
      this.props.logoutUser(this.props.history);
    }
  }

  async callChangeWatchListStatus(params) {
    let User = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let token = User ? (User.token ? User.token : "") : "";
    let headers = { headers: { token: `${token}` } };
    const res = await axios.post(
      `${API_URL}/company/watchlist/changestatus`,
      params,
      headers
    );
    return res.data;
  }

  render() {
    // console.log("State: ",this.state)
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>My Openings</h1>
            <h5>Check your open roles</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
            <Button
              color="info"
              className={`${classes.newButton} ${classes.mt30}`}
              onClick={this.redirectToAddWatchList}
            >
              Add Job Role
            </Button>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                My Openings
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
                  columns={[
                    {
                      Header: "#",
                      accessor: "sr_no",
                      sortable: false,
                      filterable: false,
                    },
                    {
                      Header: "Name",
                      accessor: "role_title",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      Header: "Shortlisted",
                      accessor: "shortlisted",
                      sortable: false,
                      filterable: false,
                    },
                    {
                      Header: "Interviewed",
                      accessor: "interviewed",
                      sortable: false,
                      filterable: false,
                    },
                    {
                      Header: "Hired",
                      accessor: "hired",
                      sortable: false,
                      filterable: false,
                    },
                    {
                      Header: "Action",
                      accessor: "actions",
                      width: 200,
                      fixed: "right",
                      sortable: false,
                      filterable: false,
                    },
                  ]}
                  defaultPageSize={
                    this.state.data.length < this.state.pagesize
                      ? this.state.data.length > 0
                        ? this.state.data.length
                        : this.state.pagesize
                      : this.state.pagesize
                  }
                  pages={Math.ceil(
                    this.state.totalStudent / this.state.pagesize
                  )}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                  manual
                  resizable={false}
                  onFetchData={(state, instance) => {
                    // show the loading overlay
                    // fetch your data
                    // console.log("STATEL:", state)
                    this.setState({
                      page: state.page,
                      pagesize: state.pageSize,
                    });
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
                  paper: classes.modal,
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
                  <h4 className={classes.modalTitle}>Select My Openings</h4>
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
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
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
                            Select My Openings
                          </MenuItem>
                          {this.state.all_watchlist.length > 0
                            ? this.state.all_watchlist.map((watch_list) => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={watch_list.id}
                              >
                                {watch_list.role_title}
                              </MenuItem>
                            ))
                            : null}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </DialogContent>
                <DialogActions
                  className={
                    classes.modalFooter + " " + classes.modalFooterCenter
                  }
                >
                  <Button
                    onClick={() => this.setModal(false)}
                    className={`${classes.outlineButton} ${classes.mr15} ${classes.mt30} ${classes.mb30}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => this.setModal(false)}
                    color="info"
                    size="lg"
                    className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    My Openings
                  </Button>
                </DialogActions>
              </Dialog>
              {/* Modal Ends */}
            </div>
          </GridItem>
          {this.state.alert}
        </GridContainer>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = { logoutUser };
const combinedStyles = combineStyles(
  styles,
  useCustomSpace1,
  checkBoxStyle,
  modalStyles,
  customSelect,
  customStyle,
  styles1
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(WatchList));
