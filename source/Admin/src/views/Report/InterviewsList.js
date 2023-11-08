import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import Edit from "@material-ui/icons/Edit";

// Select Box
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import * as Datetime from "react-datetime";
import { toast } from "react-toastify";
import moment from "moment";
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

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { dataTable } from "variables/general.js";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import Slide from "@material-ui/core/Slide";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import customStyle from "assets/jss/customStyle";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";

import { Icon as IconF, InlineIcon } from "@iconify/react";
import eyeIcon from "@iconify/icons-fa/eye"; 
import eyeSlash from "@iconify/icons-fa/eye-slash";
import { PAGE_SIZE } from "../../constants/defaultValues.js";
import CustomTooltip  from "../Tooltip/tooltip"
import { rlistUser,editUser,resetUserNotifcation } from '../../redux/action'
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
export const validatePassword = function (password) {
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$$/
  return re.test(password)
}
class UserList extends Component {
  constructor(props) {
    super(props);
    
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.customsearch = this.customsearch.bind(this);
    this.customsearchreset = this.customsearchreset.bind(this);
    
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
      candidateid:'',

      status_data: [{id: 1, status_name: "Pass"}, {id: 0, status_name: "Fail"}],
      round_data: [{id: 1, status_name: "Intro Round"}, {id: 2, status_name: "Onsite Round"},{id: 3, status_name: "Final Round"}],
      statusvalue: "",
      roundvalue: "",
      companyvalue: "",
      company_data: [],
      interviewdatefrom : "",
      interviewdateto : "",
      
      customsearchfilter:{}
      
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
  setSimpleSelect(val) {
    this.setState({
      companyvalue: val
    })
  }
  handleSimple = (event) => {
    console.log("event.target.value",event.target.value)
    this.setSimpleSelect(event.target.value);
  };
  setSimpleSelectstatus(val) {
    this.setState({
      statusvalue: val
    })
  }
  handleSimplestatus = (event) => {
    console.log("event.target.value",event.target.value)
    this.setSimpleSelectstatus(event.target.value);
  };
  setSimpleSelectround(val) {
    this.setState({
      roundvalue: val
    })
  }
  handleSimpleround = (event) => {
    console.log("event.target.value",event.target.value)
    this.setSimpleSelectround(event.target.value);
  };
  handleChangeDate(val) {    
    console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {    
      this.setState({
        interviewdatefrom : moment(val).format("MM-DD-YYYY")
      });
    }
  }
  
  handleChangeDateto(val) {    
    console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {    
      this.setState({
        interviewdateto : moment(val).format("MM-DD-YYYY")
      });
    }
  }

  handleChangeDateo(val) {    
    console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {    
      this.setState({
        ointerviewdatefrom : moment(val).format("MM-DD-YYYY")
      });
    }
  }
  
  handleChangeDatetoo(val) {    
    console.log("VALL:", val);
    if (moment(val).format("MM-DD-YYYY") !== "Invalid date") {    
      this.setState({
        ointerviewdateto : moment(val).format("MM-DD-YYYY")
      });
    }
  }
  customsearchreset(){
    let params =  {}
    let ths=this;    
    params.companyid = '';
    params.interviewfrom = '';
    params.interviewto = '';
    params.statusvalue = '';
    params.roundvalue = '';
    
    ths.setState({
      customsearchfilter :params,
      roundvalue: "",
      statusvalue: "",
      companyvalue: "",
      interviewdatefrom : "",
      interviewdateto : "",
    },()=>{
      this.getDataFromDb({ "page": 0, "page_size": ths.state.pagesize,"filtered":{} });
    });
   
  }
  customsearch(){
    
    let params =  {}
    let ths= this;
      console.log("this.stateonsubmit",new Date(ths.state.interviewdatefrom))
    let interviewdatefrom = moment(ths.state.interviewdatefrom,["MM-DD-YYYY"]).format("YYYY-MM-DD")
    let interviewdateto = moment(ths.state.interviewdateto,["MM-DD-YYYY"]).format("YYYY-MM-DD")
    // if((ths.state.interviewdatefrom && ths.state.interviewdatefrom !== "" && new Date(ths.state.interviewdatefrom) == "Invalid Date")){
    //   toast.error("Please select valid interview from date.")
    // }else if((ths.state.interviewdateto && ths.state.interviewdateto !== "" && new Date(ths.state.interviewdateto) == "Invalid Date")){
    //   toast.error("Please select valid interview to date.")
    // }else 
    if((ths.state.interviewdatefrom && ths.state.interviewdatefrom !== "" && ths.state.interviewdateto && ths.state.interviewdateto !== "" && interviewdatefrom > interviewdateto)){
      toast.error("Interview to date should be greater than from date.")
    }else{
      params.roundvalue = ths.state.roundvalue;
      params.statusvalue = ths.state.statusvalue;
      params.companyid = ths.state.companyvalue;
      params.interviewfrom = interviewdatefrom;
      params.interviewto = interviewdateto;
      ths.setState({
        customsearchfilter :params
      },()=>{
        this.getDataFromDb({ "page": 0, "page_size": ths.state.pagesize,"filtered":{} });
      });
    }
     
  }
  getDataFromDb(state) {
    let ths = this;
    ths.showLoader();
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

    let admin_id = this.props.user.user_id
    console.log('admin_id', this.props.user);
    this.props.rlistUser({
      admin_id:admin_id,
      report_type:3,
      page: state.page,
      page_size: this.state.pagesize,
      sort_param: sorted,
      order: order,
      filtred : filtered,
      customfilter:this.state.customsearchfilter
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
      totaluser: props.total_user,
      company_data: (props.company_data) ? props.company_data : []
    };
  }
  setAlert(val = null) {
    this.setState({ alert: val })
  }
  
  
  redirectToCandidateDetail(id){
    console.log(`admin/engineer-management/detail/${id}`)
    this.props.history.push(`/admin/engineer-management/detail/${id}`)
  }
  

  
  createTablecontent(data) {
    console.log("2", this.state, data);

    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no : (PAGE_SIZE * this.state.page)+key+1,
        name: prop['name'],
        watchlistname: prop['watchlistname'],
        company_name: prop['company_name'],
        atplace: prop['atplace'],
        interviewstatus: prop['interviewstatus'],
        is_offer_sent: (prop['is_offer_sent'] == 1)?'Offered':'Pending',   
        intro_discovery_response_on_date:prop['intro_discovery_response_on_date'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
              <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => this.redirectToCandidateDetail(prop['id'])}  style={{ 'width': '24px' }}   /> </CustomTooltip>
             
           {" "}
           
          </div>
        )
      };
    }) : []
  }
  render() {
    const { classes } = this.props;
    console.log("123", this.state);
    let { companyvalue,statusvalue,roundvalue } = this.state;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Engineer Report</h1>
            <h5>Interviews Engineers</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
           
          </GridItem>
          <GridItem xs={12} sm={12}>
                <form>
                <GridContainer className='filterBlocks'>
                      <GridItem xs={12} md={6} lg={3} className={classes.mt15}>
                      <FormControl fullWidth className={classes.selectFormControl + ' filterBlockSelect'}>
                      <InputLabel
                          htmlFor="simple-select"
                          className=' label-select'
                        >
                          Company
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={companyvalue}
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
                            value={0}
                          >
                            Company
                          </MenuItem>
                          {(this.state.company_data) ? this.state.company_data.map((company) => {

                            return <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value={company.id}
                            >
                              {company.company_name}
                            </MenuItem>

                          }) : null}
                        </Select>
                      </FormControl>
                        </GridItem>
                        {/* <GridItem xs={12} sm={6}>
                          <FormControl fullWidth className={classes.selectFormControl}>
                            <InputLabel
                              htmlFor="simple-selectstatus"
                              className={classes.selectLabel + " logDdLabel"}
                            >
                              Offer Status
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={statusvalue}
                              onChange={this.handleSimplestatus}
                              inputProps={{
                                name: "simpleSelectstatus",
                                id: "simple-selectstatus",
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                                value={0}
                              >
                                Offer Status
                              </MenuItem>
                              {(this.state.status_data) ? this.state.status_data.map((status) => {

                                return <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={status.id}
                                >
                                  {status.status_name}
                                </MenuItem>

                              }) : null}
                            </Select>
                          </FormControl>
                            </GridItem> */}
                           <GridItem xs={12} md={6} lg={3} className={classes.mt15}>
                          <FormControl fullWidth className={classes.selectFormControl + ' filterBlockSelect'}>
                            <InputLabel
                              htmlFor="simple-select"
                              className=' label-select'
                            >
                              Interview Round
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={roundvalue}
                              onChange={this.handleSimpleround}
                              inputProps={{
                                name: "simpleSelectround",
                                id: "simple-selectround",
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                                value={0}
                              >
                                Interview Round
                              </MenuItem>
                              {(this.state.round_data) ? this.state.round_data.map((round) => {

                                return <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={round.id}
                                >
                                  {round.status_name}
                                </MenuItem>

                              }) : null}
                            </Select>
                          </FormControl>
                            </GridItem>
                            <GridItem xs={12} md={6} lg={3} xl={2} className={classes.mt15}>
                            <FormControl component="fieldset" fullWidth>
                            <FormLabel className="label-radio label-time">
                              Interview Date From
                            </FormLabel>
                            <Datetime                        
                               
                                dateFormat="MM-DD-YYYY"
                                value={this.state.interviewdatefrom}
                                inputProps={{
                                              id: "interview_datefrom",
                                              placeholder: "Interview Date From",
                                              readOnly: true
                                            }}
                                timeFormat={false}
                                closeOnSelect={true}
                                onChange={(e) =>
                                      this.handleChangeDate(e)} 
                                                        
                                />
                            </FormControl>

                    </GridItem>
                    <GridItem xs={12} md={6} lg={3} xl={2} className={classes.mt15}>
                        <FormControl component="fieldset" fullWidth>
                            <FormLabel className="label-radio label-time">
                              Interview Date To
                            </FormLabel>
                            <Datetime                        
                                
                                dateFormat="MM-DD-YYYY"
                                value={this.state.interviewdateto}
                                inputProps={{
                                              id: "interview_dateto",
                                              placeholder: "Interview Date To",
                                              readOnly: true
                                            }}
                                timeFormat={false}
                                closeOnSelect={true}
                                onChange={(e) =>
                                      this.handleChangeDateto(e)}                         
                                />
                            </FormControl>
                            
                    </GridItem>
                    {/* <GridItem xs={12} sm={6}>
                          <FormControl fullWidth className={classes.selectFormControl}>
                            <InputLabel
                              htmlFor="simple-selectround"
                              className={classes.selectLabel + " logDdLabel"}
                            >
                              Interview Round
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={roundvalue}
                              onChange={this.handleSimpleround}
                              inputProps={{
                                name: "simpleSelectround",
                                id: "simple-selectround",
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                                value={0}
                              >
                                Interview Round
                              </MenuItem>
                              {(this.state.round_data) ? this.state.round_data.map((round) => {

                                return <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={round.id}
                                >
                                  {round.status_name}
                                </MenuItem>

                              }) : null}
                            </Select>
                          </FormControl>
                            </GridItem> */}
                    <GridItem xs={12} xl={2} className={classes.mt15}>
                        <div className={classes.center}>   
                                <Button color="info"
                                    size="md" onClick={this.customsearch}
                                    className={`${classes.mt10} ${classes.mr10}`}>
                                    Search
                                </Button>
                                {" "}
                                <Button color="info"
                                    size="md" onClick={this.customsearchreset}
                                    className={`${classes.mt10}`}>
                                    Reset
                                </Button>
                              
                            </div>
                         </GridItem>
                </GridContainer>
              </form>
              </GridItem>
        
        
        </GridContainer>

     
        <GridContainer>
        <GridItem xs={12} className={classes.mt30}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Interviews Engineers Details
              
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
                      width: 40,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Company",
                      accessor: "company_name",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Watchlist",
                      accessor: "watchlistname",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Engineer",
                      accessor: "name",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Interview Date",
                      accessor: "intro_discovery_response_on_date",
                      width: 210,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "On Round",
                      accessor: "atplace",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Status",
                      accessor: "interviewstatus",
                      sortable: false,
                      filterable: false
                    },
                    
                    {
                      Header: "Actions",
                      accessor: "actions",
                      width: 90,
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
         
          {this.state.alert}
          <Snackbar
            place="tr"
            color={(this.props.user_error) ? "danger" : "info"}
            icon={AddAlert}
            message={`${this.props.notification_message}`}
            open={this.props.shownotification}
            closeNotification={() => {
              this.props.resetUserNotifcation();
            }}
            close
          />
        </GridContainer>
      </div>

    )
  }
}
const mapStateToProps = state => {
  console.log('in userlist maptoprops:', state);

  return {
    user: state.authReducer.user,
    shownotification: state.userReducer.shownotification,
    user_error : state.userReducer.user_error,    
    users : state.userReducer.users,
    total_user : state.userReducer.total_user,
    notification_message:state.userReducer.notification_message,
    company_data: state.userReducer.company_data
  };
};
const combinedStyles = combineStyles(customSelectStyle,customStyle,modalStyles, styles);
const mapDispatchToProps = { rlistUser,editUser,resetUserNotifcation };
export default withStyles(customStyle)(connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(UserList)));