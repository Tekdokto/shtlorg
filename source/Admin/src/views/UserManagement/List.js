import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
import Edit from "@material-ui/icons/Edit";

import DefaultProfilePic from "../../assets/img/default-avatar.png";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "components/Grid/GridItem.js";
import Hidden from "@material-ui/core/Hidden";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";

// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { dataTable } from "variables/general.js";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import Slide from "@material-ui/core/Slide";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import customStyle from "assets/jss/customStyle";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import EyeIcon from "../../assets/img/eye-slash.svg";
import EyeSlash from "../../assets/img/eye-slash.svg";
import { Icon as IconF, InlineIcon } from "@iconify/react";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import accountCheckOutline from "@iconify/icons-mdi/account-check-outline";
import eyeIcon from "@iconify/icons-fa/eye"; 
import eyeSlash from "@iconify/icons-fa/eye-slash";
import { listUser,deleteUser,specialUser,addUser,editUser,resetUserNotifcation, fetchCareerPath } from '../../redux/action'
import { toast } from "react-toastify";
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
export const validatePassword = function (password) {
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$$/
  return re.test(password)
}
class UserList extends Component {
  constructor(props) {
    super(props);
    this.hangleProfilePic = this.hangleProfilePic.bind(this);
    this.setModal = this.setModal.bind(this);
    this.editcandidate = this.editcandidate.bind(this);
    this.verifyString = this.verifyString.bind(this);
    this.setRemark = this.setRemark.bind(this);
    this.setRemarkState = this.setRemarkState.bind(this);
    this.Updatestatus = this.Updatestatus.bind(this);
    
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
      candidatefname:'',
      candidatefnameState: "",
      fnameerrorText:'',
      candidatelname:'',
      candidatelnameState: "",
      candidatepassword:'',
      candidatepasswordState: "",
      passworderrorText:'',
      candidatephone:'',
      candidatephoneState: "",
      phoneerrorText:'',
      passwordShow: false,
      candidateProfilePic : '',
      selected_profile_pic : null,
      selected_1_profile_pic : null,
      candidateEmail:'',
      candidateEmailState:'',
      career_path: [],
      candidateCareerPath:'',
      candidateCareerPathId: '',
      candidateRacialIdentity: '',      
    }
  }
  setcandidatefname(val = "") {
      this.setState({ candidatefname: val })
  }
  candidatefnameState(val = "") {
    
    this.setState({ candidatefnameState: val })
}
setcandidatelname(val = "") {
  this.setState({ candidatelname: val })
}
candidatelnameState(val = "") {

this.setState({ candidatelnameState: val })
}
setcandidatephone(val = "") {
  var cleaned = ('' + val).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
   // var intlCode = (match[1] ? '+1 ' : '')
    var intlCode = ('')
    var newnumber = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    this.setState({ candidatephone: newnumber })
  }else{
    this.setState({ candidatephone: val })
  }
  
  /*
  //without +1
   var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  */
}
candidatephoneState(val = "") {

this.setState({ candidatephoneState: val })
}
  verifyPassword(value) {
    var paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    // console.log("value.match(paswd)", value.match(paswd))
    if (value.match(paswd)) {
      return true;
    }
    return false
  }
  setcandidatepassword(val = "") {
    this.setState({ candidatepassword: val })
  }
  candidatepasswordState(val = "") {
    
    this.setState({ candidatepasswordState: val })
  }
  setcandidateEmail(val = "") {
    this.setState({ candidateEmail: val })
  }
  candidateEmailState(val = "") {
    
    this.setState({ candidateEmailState: val })
  }
  handleCareerPathId = (event) => {
    this.setCandidateCareerPathId(event.target.value);
  };
  setCandidateCareerPathId(val) {
    this.setState({ candidateCareerPathId: val })
  }
  handleRacialIdentity = (event) => {
    this.setCandidateRacialIdentity(event.target.value);
  };
  setCandidateRacialIdentity(val) {
    this.setState({ candidateRacialIdentity: val })
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
    this.props.listUser({
      admin_id:admin_id,
      page: state.page,
      page_size: state.pageSize,
      sort_param: sorted,
      order: order,
      filtred : filtered
    }, this.props.history);
    setTimeout(()=>{
      ths.hideLoader()
    },1500)
  }

  componentDidMount() {
    this.props.fetchCareerPath();
  }

  static getDerivedStateFromProps(props, state) {
    console.log("props cattt", props);
    // console.log("props state cattt",state);      
    return {
      users: (props.users) ? props.users : [],
      totaluser: props.total_user,
      career_path :(props.career_path) ? props.career_path : []
    };
  }
  setAlert(val = null) {
    this.setState({ alert: val })
  }
  setModal(val) {
    console.log("testest",val)
    this.setState({ modal: val,iseditModal:false,candidateid:'',candidatefname:'',candidatefnameState:'',candidatelname:'',candidatelnameState:'',candidatephone:'',candidatephoneState:'',candidatepassword:'',candidatepasswordState:'',candidateProfilePic:'',selected_profile_pic:null, selected_1_profile_pic:null, candidateEmail:'',candidateEmailState:'',candidateCareerPath:'',candidateCareerPathId:'',candidateRacialIdentity: '' })
  }
  editcandidate(id,prop) {
   console.log("proppropprop",prop)
    this.setState({ modal: true,iseditModal:true,candidateid:id,candidatefname:prop['first_name'],candidatelname:prop['last_name'],candidatephone:prop['phone'],candidateProfilePic:prop['profile_pic'],selected_profile_pic:null, selected_1_profile_pic:null, candidateEmail:prop['email'],candidateCareerPath:prop['career_path'], candidateCareerPathId:'',candidateRacialIdentity:prop['racial_identity'] })
  }
  verifyString(val,len=1){
    console.log('val',val,len);
    
      if(val.trim().length >= len){
          return true
      }
      return false;
  }
  verifyEmail(val) {
    var val = val.trim();
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }
  verifyLengthmobile(val,len=1){
    console.log('val',val,len);
    
      if(val.trim().length >= len){
          return true
      }
      return false;
  }
  verifymobilenumber(val){
    //var numbercheck = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/g;
    console.log("check")
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    
    if(val.match(phoneno)) {
      console.log("match");
      return true;
    }
    else {
      console.log("message");
      return false;
    }
    
  }
  verifyLength1(val, length){
    console.log("verifyLength1",val)
      if (val.trim() == "") {
        console.log("err1",val)
        this.setState({passworderrorText : ''})
        console.log("trueeee")
        return true;
      } else if (!validatePassword(val.trim())) {
          console.log("err222",val)
          this.setState({passworderrorText : 'Password requires one uppercase, one lowercase, one number, one symbol and minimum 8 charcters.'})
          return false
      }else{
        this.setState({passworderrorText : ''})
        console.log("trueeee")
        return true;
      }
  };
  setRemark(val=""){
    this.setState({candidateremark:val})
  }
  setRemarkState(val=""){
      this.setState({candidateremarkState:val})
  }
  passwordShowHide() {
    this.setState({ passwordShow: !this.state.passwordShow });
  }

  handleClick = (e) => {
    this.inputElement.click();
  }

  hangleProfilePic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log("Event : ",e.target.files[0])
      if((e.target.files[0].size / 1024) <= 1024 ){
        const reader = new FileReader()
        let ths =this;
        this.setState({selected_1_profile_pic : e.target.files[0]})
        reader.addEventListener('load', () =>
            ths.setState({
              selected_profile_pic : reader.result,
            }),
            false
        )
        reader.readAsDataURL(e.target.files[0])   
        }else{
          toast.error("Allowed maximum image size is 1 MB.")
          return false
      }   
    }else{
      return false
    }
  }

  Updatestatus(){
    console.log("here1")
    if(!this.verifyString(this.state.candidatefname,1)){
      console.log("here2")
      toast.error('Please write first name.')
      this.candidatefnameState("error");
      
    }else if(!this.verifyString(this.state.candidatelname,1)){
      console.log("here3")
      toast.error('Please write last name.')
      this.candidatelnameState("error");
      
    }else if(!this.state.iseditModal && !this.verifyEmail(this.state.candidateEmail)){
      console.log("here4")
      this.candidateEmailState("error");
      toast.error('Please enter valid email.')

    }else if(!this.verifyString(this.state.candidatephone,14) || !this.verifymobilenumber(this.state.candidatephone)){
      console.log("here5")
      toast.error('Please write valid mobile number.')
      this.candidatephoneState("error");
      
    }else if(!this.state.iseditModal && !this.verifyPassword(this.state.candidatepassword,1)){
      console.log("here6") 
      toast.error('Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
      this.candidatepasswordState("error");
      
    }else if(this.state.candidatepassword && !this.verifyPassword(this.state.candidatepassword,1)){
      console.log("here7")
      this.candidatelnameState("error");
      toast.error('Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
      this.candidatepasswordState("error");

    }else if(!this.state.iseditModal && this.state.candidateCareerPathId == 0){
      console.log("here8")
      toast.error('Please select career path.')

    }else if (this.state.candidateRacialIdentity == 0){
      toast.error('Please select racial identity.')
    }else{
      console.log("here")
      let admin_id = this.props.user.user_id
      // let user = {
      //     admin_id,
      //     'id':this.state.candidateid,
      //     'first_name':this.state.candidatefname,
      //     'last_name':this.state.candidatelname,
      //     'phone':this.state.candidatephone,
      //     'password':this.state.candidatepassword
      // }
      let user  = new FormData();
      user.append("admin_id", `${admin_id}`);
      user.append("id", `${this.state.candidateid}`);
      user.append("first_name", `${this.state.candidatefname}`);
      user.append("last_name", `${this.state.candidatelname}`);
      user.append("phone", `${this.state.candidatephone}`);
      user.append("password", `${this.state.candidatepassword}`);
      user.append("racial_identity", `${this.state.candidateRacialIdentity}`);
      if(this.state.selected_1_profile_pic){
        // console.log("selected_1_profile_pic:",this.state.selected_1_profile_pic)
        user.append("profile_pic",this.state.selected_1_profile_pic)
      }
      console.log("here",user)
      if(this.state.iseditModal){
        this.props.editUser(user, this.props.history);
      }else{
        user.append("email", `${this.state.candidateEmail}`);
        user.append("career_path_id", `${this.state.candidateCareerPathId}`);      
        this.props.addUser(user, this.props.history);
      }
      this.setModal();
      this.setAlert();
      setTimeout(()=>{
        this.getDataFromDb({ page: this.state.page, pageSize: PAGE_SIZE, sorted: [], filtered: [] });
      },1500)
    }
  }
  redirectToCandidateDetail(id){
    console.log(`admin/engineer-management/detail/${id}`)
    this.props.history.push(`/admin/engineer-management/detail/${id}`)
  }
  deleteUser(id,newstatus){
    let admin_id = this.props.user.user_id;
    this.props.deleteUser({admin_id,id,status: newstatus},this.props.history);
    this.setAlert();
    this.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
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
        style={{ display: "block", marginTop: "-200px" }}
        title={title}
        onConfirm={() => ths.deleteUser(id,newstatus)}
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
  specialUser(id,special){
    let admin_id = this.props.user.user_id;
    this.props.specialUser({admin_id,id,special_candidate: special},this.props.history);
    this.setAlert();
    this.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
  }
  warningWithConfirmMessage(id, name){
    let ths = this;
    const { classes } = this.props;
    var special = '1';
    var title = `Are you sure you want to make ${name} visible to companies?`
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title={title}
        onConfirm={() => ths.specialUser(id,special)}
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
        sr_no : (PAGE_SIZE * this.state.page)+key+1,
        profile_number : `#${prop['id']}`,
        name: prop['name'],
        email: prop['email'],
        careerpath: prop['career_path'],
        created_date: prop['created_date'],
        place: prop['place'],
        is_verified: (prop['is_verified']==1)?'Yes':'No', 
        last_login_date: prop['last_login_date'],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
              <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" style={{ 'width': '24px' }} onClick={() => this.redirectToCandidateDetail(prop['id'])}   /></CustomTooltip> 
             
           {" "}
           <CustomTooltip title="Edit" position="left"><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={(e) => this.editcandidate(prop['id'], prop)}
                /></CustomTooltip>
           {" "}
          <span>{(prop['status']) ? <CustomTooltip title="Deactivate" position="left"><PowerSettingsNewIcon onClick={() => {
                this.warningWithConfirmAndCancelMessage(prop['id'], prop['status']);
              }} className="vertical-middle" fontSize="large" style={{ cursor: "pointer", width: "20px", height: "20px" }}  /></CustomTooltip> : <CustomTooltip title="Activate" position="left"><PowerSettingsNewIcon onClick={() => {
                this.warningWithConfirmAndCancelMessage(prop['id'], prop['status']);
              }} className="vertical-middle" fontSize="large" style={{ color: "#999",cursor: "pointer", width: "20px", height: "20px" }} /></CustomTooltip>}</span>
           {" "}
           <span>{(prop['is_verified']) ? 
           (prop['is_special_candidate']) ? 
              <IconF
                icon={accountCheckOutline}
                style={{ color: "#999", cursor: "not-allowed", width: "20px", height: "20px" }}
              /> : 
              <CustomTooltip title="Advance Candidate" position="left" style={{ width: "140px" }}><IconF
                icon={accountCheckOutline}
                style={{ cursor: "pointer", width: "20px", height: "20px" }}
                onClick={() => {this.warningWithConfirmMessage(prop['id'], prop['name']);}} 
              /></CustomTooltip>
            : <span className="blank-action"></span>}
            </span>
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
            <h1>Engineer Management</h1>
            <h5>Manage Engineers</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
              <Button
                color="info"
                size="md"
                className={`${classes.newButton} ${classes.mt30}`}
                onClick={() => this.setModal(true)}
              >
                + Candidate
              </Button>
          </GridItem>
        </GridContainer>

     
        <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Engineers Details
              
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
                      width : 50,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Profile Number",
                      accessor: "profile_number",
                      width : 170,
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Engineer",
                      accessor: "name",
                      width : 125,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Email",
                      accessor: "email",
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Career Path",
                      accessor: "careerpath",
                      width : 170,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Created Date",
                      accessor: "created_date",
                      width : 170,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Location",
                      accessor: "place",
                      width: 130,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Verification",
                      accessor: "is_verified",
                      width: 140,
                      sortable: true,
                      filterable: false
                    },
                    {
                      Header: "Last Login",
                      accessor: "last_login_date",
                      width : 170,
                      sortable: true,
                      filterable: true
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                       width: 200,
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
                <h4 className={classes.modalTitle}>{(this.state.iseditModal)?'Candidate Edit':'Add Candidate Form'}</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer>
                  <GridItem xs={12}>
                    <div className={`${classes.profilePicEdit} mb30`}>
                      <div className={classes.myProfileImgWrapper}>
                        <img src={(this.state.selected_profile_pic !== null)?this.state.selected_profile_pic:((this.state.candidateProfilePic && this.state.candidateProfilePic !== null)?this.state.candidateProfilePic:DefaultProfilePic)} className={classes.myProfileImg}></img>                
                        <Button
                          color="info"
                          size="lg"
                          className={classes.editBtn}
                          onClick={e=>{ this.handleClick(e)}}
                        >
                          <Edit />
                          <input type="file" accept="image/*"  ref={input => this.inputElement = input} onChange={this.hangleProfilePic} style={{"display":"none"}}/>
                        </Button>
                      </div>
                    </div>
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                     // helperText='sdfdsf'
                      success={this.state.candidatefnameState === "success"}
                      error={this.state.candidatefnameState === "error"}
                      labelText="First Name"
                      id="first_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                          if (this.verifyString(event.target.value,1)) {
                              this.candidatefnameState("success");
                          } else {
                              this.candidatefnameState("error");
                          }
                          this.setcandidatefname(event.target.value);
                        },
                        value: this.state.candidatefname,
                        type: "text"
                    }}
                      
                    />
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                      success={this.state.candidatelnameState === "success"}
                      error={this.state.candidatelnameState === "error"}
                      labelText="Last Name"
                      id="last_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                            if (this.verifyString(event.target.value,1)) {
                                this.candidatelnameState("success");
                            } else {
                                this.candidatelnameState("error");
                            }
                            this.setcandidatelname(event.target.value);
                        },
                        value: this.state.candidatelname,
                        type: "text"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6}>
                  {(this.state.iseditModal) ? (
                    <CustomInput
                      labelText="E-mail Address"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.candidateEmail,
                        disabled:true
                      }}
                    />
                  ) : (
                    <CustomInput
                      success={this.state.candidateEmailState === "success"}
                      error={this.state.candidateEmailState === "error"}
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                          if (this.verifyEmail(event.target.value)) {
                            this.candidateEmailState("success");
                          } else {
                            this.candidateEmailState("error");
                          }
                          this.setcandidateEmail(event.target.value)
                        },
                        value: this.state.candidateEmail,
                      }}
                    />
                  )}
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                      success={this.state.candidatephoneState === "success"}
                      error={this.state.candidatephoneState === "error"}
                      labelText="Mobile Number"
                      id="phone"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                          if (this.verifyLengthmobile(event.target.value,10)) {
                              this.candidatephoneState("success");
                          } else {
                              this.candidatephoneState("error");
                          }
                          this.setcandidatephone(event.target.value);
                        },
                        value: this.state.candidatephone,
                        type: "text"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                    //helperText={this.state.passworderrorText}
                      success={this.state.candidatepasswordState === "success"}
                      error={this.state.candidatepasswordState === "error"}
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              this.passwordShowHide();
                            }}
                          >
                            {this.state.passwordShow ? (
                              <IconF icon={eyeIcon} />
                            ) : (
                              <IconF icon={eyeSlash} />
                            )}
                          </InputAdornment>
                        ),
                        type: this.state.passwordShow ? "text" : "password",
                        onChange: event => {
                            if (this.verifyPassword(event.target.value,1)) {
                                this.candidatepasswordState("success");
                            } else {
                                this.candidatepasswordState("error");
                            }
                            this.setcandidatepassword(event.target.value);
                        },
                        value: this.state.candidatepassword,
                        
                      }}
                    />
                  </GridItem>
                  <Hidden>
                    <GridItem xs={0} sm={0} md={6}></GridItem>
                  </Hidden>
                  <GridItem xs={6}>
                    {(this.state.iseditModal) ? (
                        <CustomInput
                          labelText="Career Path"
                          id="careerPath"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: this.state.candidateCareerPath,
                            disabled:true
                          }}
                        />
                    ) : (
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="career-select"
                          className={classes.selectLabel}
                        >
                          Career Path
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={this.state.candidateCareerPathId}
                          onChange={this.handleCareerPathId}
                          inputProps={{
                            name: "career",
                            id: "career-select",
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                            value={0}
                          >
                            Career Path
                          </MenuItem>
                          {(this.state.career_path) ? this.state.career_path.map((career) => {
                            return <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value={career.id}
                            >
                              {career.career_name}
                            </MenuItem>

                          }) : null}
                        </Select>
                      </FormControl>
                    )}
                    
                  </GridItem>
                  <GridItem xs={6} className={(this.state.iseditModal) ? 'custom-mt': ''}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <InputLabel
                        htmlFor="racial-identity-select"
                        className={classes.selectLabel}
                      >
                        Racial Identity
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={this.state.candidateRacialIdentity}
                        onChange={this.handleRacialIdentity}
                        inputProps={{
                          name: "racial-identity",
                          id: "racial-identity-select",
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={0}
                        >
                          Racial Identity
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={1}
                        >
                          Hispanic or Latino
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={2}
                        >
                          Black or African American (Not Hispanic or Latino)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={3}
                        >
                          Native American or Alaska Native (Not Hispanic or Latino)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={4}
                        >
                          Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={5}
                        >
                          Asian (Not Hispanic or Latino)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={6}
                        >
                          White (Not Hispanic or Latino)
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={7}
                        >
                          Multi-Racial (Two or more races)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter}
              >
               <Button
                  onClick={() => this.Updatestatus()}
                  color="info"
                  size="lg"
                  className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                >
                  Submit
                </Button>
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
    career_path : state.authReducer.career_path,
    shownotification: state.userReducer.shownotification,
    user_error : state.userReducer.user_error,    
    users : state.userReducer.users,
    total_user : state.userReducer.total_user,
    notification_message:state.userReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles, styles, customSelect);
const mapDispatchToProps = { listUser,deleteUser,specialUser,addUser,editUser,resetUserNotifcation, fetchCareerPath };
export default withStyles(customStyle)(connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(UserList)));