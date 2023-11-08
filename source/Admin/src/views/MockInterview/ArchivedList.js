import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

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


class MockList extends Component {
  constructor(props) {
    super(props);
   
    this.verifyString = this.verifyString.bind(this);
   
    
    
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
      
    }
  }
  componentDidMount() {

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
      status: 'archived',
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
  
  verifyString(val,len=1){
    console.log('val',val,len);
    
      if(val.trim().length >= len){
          return true
      }
      return false;
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
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
        sr_no: (PAGE_SIZE * this.state.page) + key + 1,
        name: prop['name'],
        on_date: prop['on_date'],
        on_time: prop['on_time'],
        status: (prop['status']==1)?'Fail':'Pass',
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
              <CustomTooltip title="View" position="left"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => this.redirectToCandidateDetail(prop['user_id'])}  style={{ 'width': '24px' }}   /></CustomTooltip> 
            

          </div>
        )
      };
    }) : []
  }
  render() {
    const { classes } = this.props;
    console.log("123", this.state);

    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Archived Mock Interview</h1>
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
                      width: 50,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Engineer",
                      accessor: "name",
                      width: 150,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Interview Date",
                      accessor: "on_date",
                      width: 170,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Interview Time",
                      accessor: "on_time",
                      width: 170,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Status",
                      accessor: "status",
                      width: 80,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      width: 100,
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