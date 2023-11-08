import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import Edit from "@material-ui/icons/Edit";
import Remove from "@material-ui/icons/Remove";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Contacts from "@material-ui/icons/Contacts";
import PeopleIcon from '@material-ui/icons/People';
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
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Icon as IconF, InlineIcon } from "@iconify/react";
import { dataTable } from "variables/general.js";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { listVideo, deleteVideo, setEditVideo, resetVideoNotifcation } from '../../redux/action';
import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import { PAGE_SIZE } from "../../constants/defaultValues.js"
import CustomTooltip  from "../Tooltip/tooltip"
import customStyle from "assets/jss/customStyle";
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


class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      categoryName: "",
      categoryNameState: "",
      users: [],
      totaluser: 0,
      page: 0,
      pagesize: 5,
      iseditModal: false,
      alert: null
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
    this.props.listVideo({
      admin_id: admin_id,
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
  addvideo() {
    this.props.history.push('/admin/video-management/add')
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }
  deleteVideo(id, newstatus) {
    let admin_id = this.props.user.user_id;
    this.props.deleteVideo({ admin_id, id, status: newstatus }, this.props.history);
    this.setAlert();
    this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
  }
  warningWithConfirmAndCancelMessage(id, status) {
    let ths = this;
    const { classes } = this.props;
    if (status == 1) {
      var newstatus = '0';
      var title = "Are you want to deactivate video?"
    } else if (status == 0) {
      var newstatus = '1';
      var title = "Are you want to activate video?"
    } else {
      var newstatus = '2';
      var title = "Are you want to delete video?"
    }
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
        video_title: prop['video_title'],
        video_order: prop['video_order'],
        created_date: prop['created_date'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a like kind of action */}
                {/* <VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="medium"   /> 
              
               {" "} */}
               <CustomTooltip title="Edit" position="right" style={{"left":"34px"}}><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={(e) => ths.props.setEditVideo(prop,ths.props.history)}
                /></CustomTooltip>{" "}
             
              
           {" "}
           <CustomTooltip title="Delete" position="left"><DeleteOutlineIcon
                  style={{ cursor: "pointer", title: "Delete" }}
                  onClick={(e) => this.warningDeleteMessage(prop['id'], prop['status'])}
                /></CustomTooltip>
           {" "}
            
          </div>
        )
      };
    }) : []
  }
  render() {
    const { classes } = this.props;
    console.log("1", this.state);

    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Interview Prep Management</h1>
            <h5>Manage Interview Prep Video Library</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
            <Button
             onClick={() => {
              this.addvideo()
            }}
              color="info"
              size="md"
              className={`${classes.newButton} ${classes.mt30}`}
            >
              + Add Video
            </Button>
          </GridItem>
        </GridContainer>

     
        <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Interview Preparation
              
            </CardHeader>
              <CardBody className="cardCustomBody">
                <ReactTableFixedColumns
                  noDataText={"No data found"} 
                  data={this.createTablecontent(this.state.users)}
                  filterable
                  PaginationComponent={UpdatedPagination}
                  columns={[
                    {
                      Header: "Video Title",
                      accessor: "video_title",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Sequence",
                      accessor: "video_order",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Created Date",
                      accessor: "created_date",
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
    shownotification: state.videoReducer.shownotification,
    user_error: state.videoReducer.user_error,
    users: state.videoReducer.users,
    total_user: state.videoReducer.total_user,
    notification_message: state.videoReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle, styles);
const mapDispatchToProps = { listVideo, deleteVideo, setEditVideo, resetVideoNotifcation };
export default withStyles(customStyle)(connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(VideoList)));