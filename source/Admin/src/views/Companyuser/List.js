import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { listcUser,deletecUser,addcUser,resetUserNotifcation } from '../../redux/action'
import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import Slide from "@material-ui/core/Slide";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import customStyle from "assets/jss/customStyle";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { toast } from "react-toastify";

import { Icon as IconF, InlineIcon } from "@iconify/react";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import eyeIcon from "@iconify/icons-fa/eye"; 
import eyeSlash from "@iconify/icons-fa/eye-slash";
import TextField from '@material-ui/core/TextField';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { PAGE_SIZE } from "../../constants/defaultValues.js"
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CompanyuserList extends Component {
  constructor(props) {
    super(props);
    this.setModal = this.setModal.bind(this);
    this.openpopup = this.openpopup.bind(this);
    this.openpopupadd = this.openpopupadd.bind(this);
    this.openpopupview = this.openpopupview.bind(this);
    this.verifyString = this.verifyString.bind(this);
    
   
    this.setcfull_name = this.setcfull_name.bind(this);
    this.setcfull_nameState = this.setcfull_nameState.bind(this);
    this.setcrole = this.setcrole.bind(this);
    this.setcroleState = this.setcroleState.bind(this);
    this.setcemail = this.setcemail.bind(this);
    this.setcemailState = this.setcemailState.bind(this);
    this.setscompany_name = this.setscompany_name.bind(this);
    this.setscompany_nameState = this.setscompany_nameState.bind(this);
    this.setscompany_email = this.setscompany_email.bind(this);
    this.setscompany_emailState = this.setscompany_emailState.bind(this);
    this.setscompany_website = this.setscompany_website.bind(this);
    this.setscompany_websiteState = this.setscompany_websiteState.bind(this);
    this.setcpassword = this.setcpassword.bind(this);
    this.setcpasswordState = this.setcpasswordState.bind(this);
    this.Updatestatus = this.Updatestatus.bind(this);
    
    this.state = {
      data: [],
      categoryName: "",
      categoryNameState: "",
      users: [],
      company:[],
      totaluser: 0,
      page: 0,
      pagesize: 5,
      iseditModal: false,
      alert: null,
      modal:false,
      userid:'',
      cfull_name:'',
      crole:'',
      cemail: "",
      scompany_name:"",
      scompany_email:"",
      scompany_website:"",
      cpassword:"",
      isedit:0,
      isdisable:false,
      company_id:0,
      isview:false,
    }
  }
  verifyurl(val,len){
    if(val.trim().length >= len){
      var urlcheck =/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|(www\.)?[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      if (urlcheck.test(val)) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  
  } 
  verifyEmail(val,len){
    if(val.trim().length >= len){
      var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailRex.test(val)) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
   
   
  }
  setcpassword(val=""){
    this.setState({cpassword:val})
  }
  setcpasswordState(val=""){
      this.setState({cpasswordState:val})
  }
  setscompany_website(val=""){
    this.setState({scompany_website:val})
  }
  setscompany_websiteState(val=""){
      this.setState({scompany_websiteState:val})
  }
  setscompany_email(val=""){
    this.setState({scompany_email:val})
  }
  setscompany_emailState(val=""){
      this.setState({scompany_emailState:val})
  }
  setscompany_name(val=""){
    console.log("companyname",val)
    //search name in company name 
    var val = val.trim()
    this.setState({scompany_name:val})
   
  }
  setscompany_nameadd(val=""){
    console.log("companyname",val)
    //search name in company name 
    var val = ( val)?val.trim():''
    if(val){
     // const companydata = this.state.company.filter(company => company.company_name == val);
      const companydata = this.state.company.find((company) => company.company_name == val)
      
      if(companydata && companydata != undefined){
          console.log("companydata",companydata)
          this.setState({scompany_name:val,scompany_email:companydata.company_email,scompany_website:companydata.company_website,company_id:companydata.id,isdisable:true})
      }else{
        this.setState({scompany_name:val,scompany_email:'',scompany_website:'',company_id:0,isdisable:false})
      }
     
    }else{
      this.setState({scompany_name:val,scompany_email:'',scompany_website:'',company_id:0,isdisable:false})
    }
   
  }
  setscompany_nameState(val=""){
      this.setState({scompany_nameState:val})
  }
  setcemail(val=""){
    this.setState({cemail:val})
  }
  setcemailState(val=""){
      this.setState({cemailState:val})
  }
  setcrole(val=""){
    this.setState({crole:val})
  }
  setcroleState(val=""){
      this.setState({croleState:val})
  }
  setcfull_name(val=""){
    this.setState({cfull_name:val})
  }
  setcfull_nameState(val=""){
      this.setState({cfull_nameState:val})
  }
  componentDidMount() {

  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
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
    this.props.listcUser({
      admin_id: admin_id,
      status: 'pending',
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
      company: (props.company) ? props.company : [],
      totaluser: props.total_user
    };
  }
  setAlert(val = null) {
    this.setState({ alert: val })
  }
  setModal(val) {
    console.log("testest",val)
    this.setState({ modal: false,isview:false, userid:'',crole:'',croleState:'',cemail:'',cemailState:'',cfull_name:'',cfull_nameState:'',scompany_name:'',scompany_nameState:'',scompany_email:'',scompany_emailState:'',scompany_website:'',scompany_websiteState:'',isedit:0,cpassword:'',cpasswordState:'',isdisable:false })
  }
  openpopup(id,props,company) {
   console.log("props dataccc",id,props,company)

    this.setState({ modal: true,isedit:1, userid:id,crole:props.company_user_role,croleState:'',cemail:props.email,cemailState:'',cfull_name:props.full_name,cfull_nameState:'',scompany_name:props.company_name,scompany_nameState:'',scompany_email:props.company_email,scompany_emailState:'',scompany_website:props.company_website,scompany_emailState:'' })
  }
  openpopupview(id,props,company) {
    
 
     this.setState({ modal: true,isedit:1,isdisable:true,isview:true, userid:id,crole:props.company_user_role,croleState:'',cemail:props.email,cfull_name:props.full_name,scompany_name:props.company_name,scompany_email:props.company_email,scompany_website:props.company_website })
   }
  
  openpopupadd(company) {
    console.log("props data",company)
     this.setState({ modal: true,isdisable:true,crole:'',croleState:'',cemail:'',cemailState:'',cfull_name:'',cfull_nameState:'',scompany_name:'',scompany_nameState:'',scompany_email:'',scompany_emailState:'',scompany_website:'',scompany_websiteState:'',isedit:0,cpassword:'',cpasswordState:'' })
   }
  verifyString(val,len=1){
    console.log('val',val,len);
    
      if(val.trim().length >= len){
          return true
      }
      return false;
  }
 
 
  Updatestatus(){
    if(this.state.isedit){
      if(!this.verifyString(this.state.cfull_name,1)){
        toast.error('Please write user name.')
        this.setcfull_nameState("error");
      }else if(!this.verifyString(this.state.crole,1)){
        toast.error('Please write user role.')
        this.setcroleState("error");
      }else if(!this.verifyEmail(this.state.cemail,1)){
        toast.error('Please write valid user email.')
        this.setcemailState("error");
      }else if(!this.verifyString(this.state.scompany_name,1)){
        toast.error('Please write company name.')
        this.setscompany_nameState("error");
      }else if(!this.verifyEmail(this.state.scompany_email,1)){
        toast.error('Please write valid company email.')
        this.setscompany_emailState("error");
      }else if(!this.verifyurl(this.state.scompany_website,1)){
        toast.error('Please write valid company website url.')
        this.setscompany_websiteState("error");
      }else{
        
          let admin_id = this.props.user.user_id
          let user = {
              admin_id,
              'id':this.state.userid,
              'cfull_name':this.state.cfull_name,
              'crole':this.state.crole,
              'cemail':this.state.cemail,
              'scompany_name':this.state.scompany_name,
              'scompany_email':this.state.scompany_email,
              'scompany_website':this.state.scompany_website,
              'cpassword':this.state.cpassword,
              'isedit':1
          }
          this.props.addcUser(user, this.props.history);
          this.setState({ modal: false, userid:'',crole:'',cemail:'',cfull_name:'',scompany_name:'',scompany_email:'',scompany_website:'',isedit:0,cpassword:'' })
          this.setAlert();
          setTimeout(() => {
            this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
          }, 2000);
          
       
      }

    }else{
      if(!this.verifyString(this.state.cfull_name,1)){
        toast.error('Please write user name.')
        this.setcfull_nameState("error");
      }else if(!this.verifyString(this.state.crole,1)){
        toast.error('Please write user role.')
        this.setcroleState("error");
      }else if(!this.verifyEmail(this.state.cemail,1)){
        toast.error('Please write valid user email.')
        this.setcemailState("error");
      }else if(!this.verifyString(this.state.scompany_name,1)){
        toast.error('Please write company name.')
        this.setscompany_nameState("error");
      }else if(!this.verifyEmail(this.state.scompany_email,1)){
        toast.error('Please write valid company email.')
        this.setscompany_emailState("error");
      }else if(!this.verifyurl(this.state.scompany_website,1)){
        toast.error('Please write valid company website url.')
        this.setscompany_websiteState("error");
      }else if(!this.verifyString(this.state.cpassword,1)){
        toast.error('Please Enter password.')
        this.setcpasswordState("error");
      }else{
          console.log("inedit all data")
          let admin_id = this.props.user.user_id
          let user = {
              admin_id,
              'id':this.state.userid,
              'cfull_name':this.state.cfull_name,
              'crole':this.state.crole,
              'cemail':this.state.cemail,
              'scompany_name':this.state.scompany_name,
              'scompany_email':this.state.scompany_email,
              'scompany_website':this.state.scompany_website,
              'cpassword':this.state.cpassword,
              'company_id':this.state.company_id,
              'isedit':0
          }
          this.props.addcUser(user, this.props.history);
          this.setState({ modal: false, userid:'',crole:'',cemail:'',cfull_name:'',scompany_name:'',scompany_email:'',scompany_website:'',isedit:0,cpassword:'',company_id:0,isdisable:false })
          this.setAlert();
          setTimeout(() => {
            this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
          }, 2000);
         
      }
    }
    
    
   
  }
  
  changestatus(id, newstatus) {
    let admin_id = this.props.user.user_id;
    this.props.deletecUser({ admin_id, id, status: newstatus }, this.props.history);
    this.setAlert();
    this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
  }
  warningWithConfirmAndCancelMessage(id, status) {
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
        style={{ display: "block", marginTop: "-200px" }}
        title={title}
        onConfirm={() => ths.changestatus(id, newstatus)}
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
    console.log("2", this.state, data);

    const { classes } = this.props;
    let ths = this;
    return (data.length > 0) ? data.map((prop, key) => {
      return {
        sr_no: (PAGE_SIZE * this.state.page) + key + 1,
        full_name: prop['full_name'],
        company_user_role: prop['company_user_role'],
        company_name: prop['company_name'],
        created_date: prop['created_date'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
              <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" style={{ 'width': '24px' }} onClick={() => this.openpopupview(prop['id'], prop,this.props.company)}   /></CustomTooltip> 
             
           {" "}
           <CustomTooltip title="Edit" position="left"><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={(e) => this.openpopup(prop['id'], prop,this.props.company)}
                /></CustomTooltip>
           {" "}
          <span>{(prop['status']) ?  <CustomTooltip title="Deactivate" position="left"><PowerSettingsNewIcon onClick={() => {
                 this.warningWithConfirmAndCancelMessage(prop['id'], prop['status']);
              }} className="vertical-middle" fontSize="large" style={{ cursor: "pointer", width: "20px", height: "20px" }}  /></CustomTooltip> : <CustomTooltip title="Activate" position="left"><PowerSettingsNewIcon onClick={() => {
                this.warningWithConfirmAndCancelMessage(prop['id'], prop['status']);
              }} className="vertical-middle" fontSize="large" style={{ color: "#999",cursor: "pointer", width: "20px", height: "20px" }} /></CustomTooltip>}</span>
           {" "}
            
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
            <h1>Company User Management</h1>
            <h5>Manage Company User</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
          <Button
            color="info"
            size="md"
            className={`${classes.newButton} ${classes.mt30}`}
            onClick={() => {
              this.openpopupadd(this.props.company);
            }} 
          >
            + Company
          </Button>
          </GridItem>
        </GridContainer>

     
        <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Company User Details
              
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
                      Header: "Company User",
                      accessor: "full_name",
                      width: 175,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Role",
                      accessor: "company_user_role",
                      width: 120,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Company Name",
                      accessor: "company_name",
                      width: 180,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Created Date",
                      accessor: "created_date",
                      width: 150,
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
                  defaultPageSize={(this.state.users.length < PAGE_SIZE) ? ((this.state.users.length > 0) ? this.state.users.length : PAGE_SIZE) : PAGE_SIZE}
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
                <h4 className={classes.modalTitle}>
                {(!this.state.isedit)?'User Create Form':(this.state.isedit && !this.state.isdisable)?'User Edit Form':'User View Form'}</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer>
                  <GridItem md={6}>
                  <CustomInput
                      success={this.state.cfull_nameState === "success"}
                      error={this.state.cfull_nameState === "error"}
                      labelText="User Full Name"
                      id="cfull_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyString(event.target.value,1)) {
                                this.setcfull_nameState("success");
                            } else {
                                this.setcfull_nameState("error");
                            }
                            this.setcfull_name(event.target.value);
                        },
                        value: this.state.cfull_name,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:false
                      }}
                    />
                  </GridItem>
                  <GridItem md={6}>
                    <CustomInput
                      success={this.state.croleState === "success"}
                      error={this.state.croleState === "error"}
                      labelText="Title/role"
                      id="crole"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyString(event.target.value,1)) {
                                this.setcroleState("success");
                            } else {
                                this.setcroleState("error");
                            }
                            this.setcrole(event.target.value);
                        },
                        value: this.state.crole,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:false
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      success={this.state.cemailState === "success"}
                      error={this.state.cemailState === "error"}
                      labelText="User Email Address"
                      id="cemail"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyEmail(event.target.value,1)) {
                                this.setcemailState("success");
                            } else {
                                this.setcemailState("error");
                            }
                            this.setcemail(event.target.value);
                        },
                        value: this.state.cemail,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:false
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      success={this.state.cpasswordState === "success"}
                      error={this.state.cpasswordState === "error"}
                      labelText="Password"
                      id="cpassword"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if(!this.state.isedit){
                              if (this.verifyString(event.target.value,1)) {
                                  this.setcpasswordState("success");
                              } else {
                                  this.setcpasswordState("error");
                              }
                            }
                          
                            this.setcpassword(event.target.value);
                        },
                        value: this.state.cpassword,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:false
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <h4 className="block-title mt30">Company Details</h4>
                  </GridItem>
                  <GridItem md={6}>
                 { (!this.state.isedit)?
                      <Autocomplete
                      freeSolo
                      id="free-solo-2-demo"
                      className="auto-select"
                      onChange={(event, newValue) => {
                        console.log("innewvalu",event.target.value)
                        this.setscompany_nameadd(newValue);
                        event.preventDefault();
                      }}
                      disableClearable
                      value={this.state.scompany_name}
                      options={this.state.company.map((option) => option.company_name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          success={this.state.scompany_nameState === "success"}
                          error={this.state.scompany_nameState === "error"}
                          label="Company Name"
                          margin="normal"
                          variant="outlined"
                          InputProps={{ ...params.InputProps, type: 'search',
                          onChange: event => {
                            if (this.verifyString(event.target.value,1)) {
                                this.setscompany_nameState("success");
                            } else {
                                this.setscompany_nameState("error");
                            }
                            this.setscompany_nameadd(event.target.value);
                        }, }}
                        />
                      )}
                    />
                   
                    :
                    <CustomInput
                      success={this.state.scompany_nameState === "success"}
                      error={this.state.scompany_nameState === "error"}
                      labelText="Company Name"
                      id="ccompany_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyString(event.target.value,1)) {
                                this.setscompany_nameState("success");
                            } else {
                                this.setscompany_nameState("error");
                            }
                            this.setscompany_name(event.target.value);
                        },
                        value: this.state.scompany_name,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:false
                      }}
                    />
                 }
                  </GridItem>
                  <GridItem md={6}>
                    <CustomInput
                      success={this.state.scompany_emailState === "success"}
                      error={this.state.scompany_emailState === "error"}
                      labelText="Company Email Address"
                      id="scompany_email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      
                      inputProps={{
                        onChange: event => {
                            if (this.verifyEmail(event.target.value,1)) {
                                this.setscompany_emailState("success");
                            } else {
                                this.setscompany_emailState("error");
                            }
                            this.setscompany_email(event.target.value);
                        },
                        value: this.state.scompany_email,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:this.state.isdisable
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      success={this.state.scompany_websiteState === "success"}
                      error={this.state.scompany_websiteState === "error"}
                      labelText="Company Website"
                      id="scompany_website"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyurl(event.target.value,1)) {
                                this.setscompany_websiteState("success");
                            } else {
                                this.setscompany_websiteState("error");
                            }
                            this.setscompany_website(event.target.value);
                        },
                        value: this.state.scompany_website,
                        type: "text",
                        disabled:(this.state.isedit)?this.state.isdisable:this.state.isdisable
                      }}
                    />
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter}
              >
                {(!this.state.isview)?
               <Button
                  onClick={() => this.Updatestatus()}
                  color="info"
                  size="lg"
                  className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                >
                  Submit
                </Button>
                :''
                }
              </DialogActions>
            </Dialog>
            {/* Modal Ends */}
          {this.state.alert}
          {/* <Snackbar
            place="tr"
            color={(this.props.user_error) ? "danger" : "info"}
            icon={AddAlert}
            message={`${this.props.notification_message}`}
            open={this.props.shownotification}
            closeNotification={() => {
              this.props.resetUserNotifcation();
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
    shownotification: state.userReducer.shownotification,
    user_error: state.userReducer.user_error,
    users: state.userReducer.users,
    company: state.userReducer.company,
    
    total_user: state.userReducer.total_user,
    notification_message: state.userReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles, styles);
const mapDispatchToProps = { listcUser,deletecUser,addcUser,resetUserNotifcation };
export default withStyles(customStyle)(connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(CompanyuserList)));