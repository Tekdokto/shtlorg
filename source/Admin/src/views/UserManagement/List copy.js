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
import UpdatedPagination from "components/Pagination/paginationupdated.js"
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { dataTable } from "variables/general.js";
import  sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Paginations from "components/Pagination/Pagination.js";
import { listUser,deleteUser,setEditUser,resetUserNotifcation } from '../../redux/action'

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  ...sweetAlertStyle
};


class UserList extends Component{
    constructor(props){
        super(props);                        
        this.state = { 
            data : [],            
            categoryName: "",
            categoryNameState : "",
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
    getDataFromDb(state){
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
      console.log('admin_id',this.props.user);
      this.props.listUser({
        admin_id:admin_id,
        page: state.page,
        page_size: state.pageSize,
        sort_param: sorted,
        order: order,
        filtred : filtered
      },this.props.history);
    }
    static getDerivedStateFromProps(props, state) {    
      console.log("props cattt",props);
      // console.log("props state cattt",state);      
        return {        
          users: (props.users)?props.users:[],
          totaluser : props.total_user          
        };        
    }             
    setAlert(val=null){
      this.setState({alert:val})
    }
    deleteUser(id,newstatus){
      let admin_id = this.props.user.user_id;
      this.props.deleteUser({admin_id,id,status: newstatus},this.props.history);
      this.setAlert();
      this.getDataFromDb({page: this.state.page,pageSize: this.state.pagesize,sorted:[],filtered:[]});
    }
    warningWithConfirmAndCancelMessage(id,status){
      let ths = this;
      const { classes } = this.props;
      if(status == 1){
        var newstatus = '0';
        var title="Are you want to deactivate user?"
      }else if(status == 0){
        var newstatus = '1';
        var title="Are you want to activate user?"
      }else{
        var newstatus = '2';
        var title="Are you want to delete user?"
      }
      this.setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          onConfirm={() => ths.deleteUser(id,newstatus)}
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

    warningDeleteMessage(id,status){
      let ths = this;
      const { classes } = this.props;
      var newstatus = '2';
      var title="Are you want to delete user?"
      this.setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          onConfirm={() => ths.deleteUser(id,newstatus)}
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
    createTablecontent(data){
      console.log("2",this.state,data);
      
      const { classes } = this.props;
      let ths = this;
      return (data.length>0)?data.map((prop, key) => {
          return {
            sr_no : (this.state.pagesize * this.state.page)+key+1,
            first_name: prop['first_name'],
            last_name: prop['last_name'],
            phone: prop['phone'],
            email: prop['email'],              
            actions: (
              // we've added some custom button actions
              <div className="actions-right">
                {/* use this button to add a like kind of action */}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    ths.props.setEditUser(prop,ths.props.history)
                  }}
                  color="info"
                  className="like"
                >
                  <Edit />
                </Button>{" "}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    this.warningWithConfirmAndCancelMessage(prop['id'],prop['status']);            
                  }}
                  color="danger"
                  className="remove"
                >
                 {(prop['status'])?<VisibilityIcon />:<VisibilityOffIcon />}
                </Button>{" "}
                {/* use this button to remove the data row */}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    this.warningDeleteMessage(prop['id'],prop['status']);            
                  }}
                  color="danger"
                  className="remove"
                >
                  <Close />
                </Button>{" "}
                
              </div>
            )
          };
        }):[]
    }
    render(){      
        const { classes } = this.props;
        console.log("1",this.state);
        
        return (
            <GridContainer>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="primary" icon>
                <GridContainer>
                <GridItem xs={9} md={9} lg={9}>
                  <CardIcon color="primary">
                    <PeopleIcon/>
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Users</h4>
                  </GridItem>
                  <GridItem xs={3} md={3} lg={3}>
                  <NavLink to={"/admin/user-management/add"} className={classes.navLink}>
                  <Button
                    color="info"
                    round
                    className={classes.marginRight}  
                    onClick={() => this.props.resetUserNotifcation()}                 
                    >
                        Add new User
                    </Button>
                  </NavLink>
                  </GridItem>
                  </GridContainer>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={this.createTablecontent(this.state.users)}
                    filterable
                    columns={[
                      {
                        Header: "First Name",
                        accessor: "first_name"
                      },
                      {
                        Header: "Last Name",
                        accessor: "last_name"
                      },
                      {
                        Header: "Phone",
                        accessor: "phone"
                      },
                      {
                        Header: "Email",
                        accessor: "email"
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    defaultPageSize={(this.state.users.length<this.state.pagesize)?((this.state.users.length > 0)?this.state.users.length:this.state.pagesize):this.state.pagesize}
                    pages={Math.ceil(this.state.totaluser/this.state.pagesize)}               
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
                  this.props.resetUserNotifcation();
                }}
              close
            />              
          </GridContainer> 
        )
    }
}
const mapStateToProps = state => {
  console.log('in userlist maptoprops:',state);
  
  return {
    user: state.authReducer.user,
    shownotification: state.userReducer.shownotification,
    user_error : state.userReducer.user_error,    
    users : state.userReducer.users,
    total_user : state.userReducer.total_user,
    notification_message:state.userReducer.notification_message
  };
};
const mapDispatchToProps = { listUser,deleteUser,setEditUser,resetUserNotifcation };
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(UserList));