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

import CloseIcon from "../../assets/img/close-icon.svg"


import filterIcon from "../../assets/img/filter-icon.svg";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
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
import emailIcon from '@iconify/icons-mdi/email';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';


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
  }
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
    this.redirectToAddWatchList = this.redirectToAddWatchList.bind(this);
    this.state = {
      watch_list_name: "",
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
    // console.log("MATCH", this.props.match)
    let { match } = this.props;
    let watch_list_name = (match.params.name) ? match.params.name : ""
    // this.setState({
    //   watch_list_name
    // })
    if (match.params.id) {
      this.fetchWatchList(match.params.id);
    }
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

  setAlert(val = null) {
    this.setState({ alert: val })
  }

  setModal(val = false, student_id = 0, student_name = "") {
    this.setState({
      modal: val,
      student_id: student_id,
      student_name: student_name
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

  async fetchWatchList(id) {
    let params = {}
    params.watchlist_id = id;
    params.user_id = this.props.user.user_id;
    let response = await this.fetchWatchListCall(params);
    // console.log("DATTA:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push('/company/watchlist')
      } else {
        if (response.data.length > 0) {
          this.setState({
            watch_list_name: response.data[0].role_title
          })
        }
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchWatchListCall(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }

    const res = await axios.post(`${API_URL}/company/watchlist/get_watchlist_detail`, params, headers);
    return await res.data;
  }


  async getDataFromDb(state) {
    let { match } = this.props;
    // let path_arr = match.params.split('/');
    // let watchlist_id = (path_arr.length)?path_arr[path_arr.length-1] : 0;
    if (match.params.id) {
      state.watchlist_id = match.params.id;
    } else {
      this.props.history.push('/company/watchlist')
    }
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
    get_watchlist.watchlist_id = state.watchlist_id;
    get_watchlist.page = state.page;
    get_watchlist.page_size = state.pagesize;
     get_watchlist.filtred = filtered;
     get_watchlist.sort_param= sorted
     get_watchlist.order= order	
    const res = await axios.post(`${API_URL}/company/watchlist/get_watchlist_students`, get_watchlist, headers);
    return await res.data;
  }

  warningWithConfirmAndCancelMessage(status, student_id, id) {
    let ths = this;
    const { classes } = this.props;
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title="Are you sure you want to request a phone call?"
        onConfirm={() => ths.sentIntroInvitationReq(status, student_id, id)}
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
    return (data.length > 0) ? data.map((prop, key) => {
      // "role_title": "Fullstack",
      // "created_date": "0000-00-00 00:00:00",
      //             "shortlisted": 1,
      //             "interviewed": 0,
      //             "hired": 0
      return {
        sr_no: (this.state.pagesize * this.state.page) + key + 1,
        candidatename: (prop['candidatename'])?(<a onClick={() => this.redirectToViewWatchlistDetail(prop['student_id'])}>{prop['candidatename']}</a>):'',
        career_path: prop['career_path'],
        place: (prop['place']!="")?prop['place']:"-",

        actions: ( 
          // we've added some custom button actions
          <div className="actions-right">
            <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon style={{ 'cursor': 'pointer' }} onClick={() => this.redirectToViewWatchlistDetail(prop['student_id'])} /></CustomTooltip>{" "}
            {(prop['is_got_other_company_offer'] == 1) ? <CustomTooltip title="Request Phone Call" position="left"><IconF icon={emailIcon} style={{ 'cursor': 'pointer', 'color': '#CACCCE' }} onClick={() => this.warningWithConfirmAndCancelMessage(1, prop['student_id'], prop['id'])} /></CustomTooltip> : <CustomTooltip title="Request Phone Call" position="left" customClass="watchlistDetailTooltip"><IconF icon={emailIcon} style={{ 'cursor': 'pointer'}} onClick={() => this.warningWithConfirmAndCancelMessage(0, prop['student_id'], prop['id'])} /></CustomTooltip>}
            {" "}
            {/* <ListIcon onClick={() => this.setModal(true,prop['id'],prop['candidatename'])} /> */}
          </div>
        )
      };
    }) : []
  }

  redirectToViewWatchlistDetail(id) {
    this.props.history.push(`/company/candidatedetail/${id}/0`)
  }

  redirectToAddWatchList() {
    this.props.history.push(`/company/addwatchlist`)
  }

  sentIntroInvitationReq(status, student_id, id) {

    if (status == 0) {

      this.sentIntroInvitationRequest({
        user_id: this.props.user.user_id,
        student_id: student_id,
        id: id
      })
      setTimeout(function () {
        window.location.reload();
      }, 500)
    } else {
      this.setAlert();
      this.setState({
        modal: true
      })
    }
  }

  async sentIntroInvitationRequest(params) {
    let response = await this.callIntroRequest(params);
    // set totalStudent and data
    // console.log("DATTA:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
      this.setAlert();
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async callIntroRequest(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    const res = await axios.post(`${API_URL}/company/watchlist/sent_intro_discovery_request`, params, headers);
    return await res.data;
  }


  render() {
    // console.log("State: ", this.state)
    const { classes } = this.props;
    let { watch_list_name } = this.state;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>{watch_list_name}</h1>
            <h5>Contact your candidate</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Review Talent
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
                      Header: "Candidate",
                      accessor: "candidatename",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Career Path",
                      accessor: "career_path",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Location",
                      accessor: "place",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Action",
                      accessor: "actions",
                      width: 200,
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
                    onClick={() => this.setModal(false)}
                    color="info"
                    size="lg"
                    className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                    onClick={(e) => this.setModal(false)}
                  >
                    Ok
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
const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = { logoutUser }
const combinedStyles = combineStyles(styles, useCustomSpace1, checkBoxStyle, modalStyles, customSelect, customStyle, styles1);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(WatchList));
