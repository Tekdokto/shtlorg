import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import {  withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import Edit from "@material-ui/icons/Edit";
import Remove from "@material-ui/icons/Remove";
// @material-ui/icons
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import { Icon as IconF, InlineIcon } from "@iconify/react";
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
import { dataTable } from "variables/general.js";
import  sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { listCms,resetCmsNotifcation,setEditCms } from '../../redux/action'
import UpdatedPagination from "../paginationupdated.js";
import customStyle from "assets/jss/customStyle";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import combineStyles from "../../combineStyles.js"
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


class CmsList extends Component{
    constructor(props){
        super(props);                        
        this.state = { 
            data : [],            
            users : [],
            totaluser : 0,
            page : 0,
            pagesize : 5,            
            iseditModal : false,          
            alert: null
        }
    }
    componentDidMount(){
        
    }
    showLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'block';
    }
  
    hideLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'none';
    }
    getDataFromDb(state){
      let ths = this;
      ths.showLoader();
      let sorted,order;
      let filtered = {}
      if(state.sorted.length > 0){
        sorted = state.sorted[0].id
      }
      if(state.sorted.length > 0){
        if(state.sorted[0].desc == false){
          order = 1
        }else{
          order = -1
        }
      }
      if(state.filtered.length > 0){
        state.filtered.forEach(element => {
          filtered[element.id] = element.value;
        });
      }

      let admin_id = this.props.user.user_id
      console.log('admin_id111',this.props.user);
      this.props.listCms({
        admin_id:admin_id,
        page: state.page,
        page_size: state.pageSize,
        sort_param: sorted,
        order: order,
        filtred : filtered
      },this.props.history);
      setTimeout(()=>{
        ths.hideLoader()
      },1500)
    }
    static getDerivedStateFromProps(props, state) {    
      console.log("props cattt",props);
      // console.log("props state cattt",state);      
        return {        
          users: (props.users)?props.users:[],
          totaluser : props.total_user          
        };        
    }             
    
    createTablecontent(data){
      console.log("2",this.state,data);
      
      const { classes } = this.props;
      let ths = this;
      return (data.length>0)?data.map((prop, key) => {
          return {
            sr_no : (PAGE_SIZE * this.state.page)+key+1,
            title: prop['title'],
            panel: prop['panel'],
            content: prop['content'],
            actions: (
              // we've added some custom button actions
              <div className="actions-right">
                {/* use this button to add a like kind of action */}
                
                <CustomTooltip title="Edit" position="left"><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={() => {
                    ths.props.setEditCms(prop,ths.props.history)
                  }}
                /></CustomTooltip>{" "}
                
                
              </div>
            )
          };
        }):[]
    }
    render(){      
        const { classes } = this.props;
        console.log("1",this.state);
        
        return (
          <div className="main-right-panel">
          <GridContainer>
            <GridItem xs={12} sm={8}>
              <h1>Content</h1>
              <h5>Manage Content</h5>
            </GridItem>
            <GridItem sm={4} className={classes.rightLeftResponsive}>
            
            </GridItem>
          </GridContainer>
          <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Content Details
                
              </CardHeader>
                <CardBody className="cardCustomBody">
                  <ReactTableFixedColumns
                  noDataText={"No data found"} 
                    data={this.createTablecontent(this.state.users)}
                    filterable
                    PaginationComponent={UpdatedPagination}
                    columns={[
                      {
                        Header: "Title",
                        accessor: "title",
                        sortable: false,
                        filterable: false
                      },
                      {
                        Header: "Panel",
                        accessor: "panel",
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
                    pages={Math.ceil(this.state.totaluser/PAGE_SIZE)}               
                    showPaginationBottom={true}                    
                    className="-striped -highlight"
                    manual
                    onFetchData={(state, instance) => {
                      // show the loading overlay                        
                      // fetch your data   
                      console.log("STATEL:",state) 
                      this.setState({page:state.page,pagesize : state.pageSize})
                      this.getDataFromDb(state);
                    }}
                  />
                </CardBody>
              </Card>
            </GridItem>
            {this.state.alert}
            <Snackbar
              place="tr"
              color={(this.props.user_error)?"danger":"info"}
              icon={AddAlert}
              message={`${this.props.notification_message}`}
              open={this.props.shownotification}
              closeNotification={() =>{
                  this.props.resetCmsNotifcation();
                }}
              close
            />              
          </GridContainer> 
          </div>
        )
    }
}
const mapStateToProps = state => {
  console.log('in maptoprops:',state);
  
  return {
    user: state.authReducer.user,
    shownotification: state.cmsReducer.shownotification,
    user_error : state.cmsReducer.user_error,    
    users : state.cmsReducer.users,
    total_user : state.cmsReducer.total_user,
    notification_message:state.cmsReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles, styles);
const mapDispatchToProps = { listCms,setEditCms,resetCmsNotifcation };
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(CmsList));