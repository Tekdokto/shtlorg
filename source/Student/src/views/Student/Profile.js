import React from "react";

// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import EditIcon from '@material-ui/icons/Edit';

// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Link from "@material-ui/core/Link";
import Switch from '@material-ui/core/Switch';

import EditProfilePic from "../../assets/img/edit-profile-pic.png";
import DefaultProfilePic from "../../assets/img/default-avatar.png";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import customStyle from "assets/jss/customStyle";

import ExamIcon from "assets/img/exam-icon.svg";
import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js"
import combineStyles from '../../combineStyles';

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

import { connect } from "react-redux";
import { fetchCareerPath,editProfile,getProfileLatestData  } from '../../redux/action';
import {API_URL} from "constants/defaultValues.js"
import Avatar from 'react-avatar-edit';
import AvatarEditor from 'react-avatar-editor'
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles(styles);
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
};
const useCustomStyle = makeStyles(customStyle);

// const classes = useStyles();
// const customStyle = useCustomStyle();
// const classesCustom = useCustomSpace();
class Profile extends React.Component{
  // const [state, setState] = React.useState({
  //   checkedA: true,
  //   checkedB: true,
  // });
  constructor(props){
    super(props);
    this.props = props;
    this.hangleProfilePic = this.hangleProfilePic.bind(this);
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFileLoad  = this.onFileLoad.bind(this);
    this.loadImageFail = this.loadImageFail.bind(this);
    this.fileLoaded = this.fileLoaded.bind(this);
    this.toBase64 = this.toBase64.bind(this);
    this.Main = this.Main.bind(this);
    this.state = {
      user : null,
      career_path : [],
      firstNameState : "",
      firstnameerrortext : "",
      lastNameState : "",
      lastnameerrortext : "",
      phoneState : "",
      phoneerrortext : "",
      profile_pic : null,
      original_source_image : null,
      selected_profile_pic : null,
      selected_1_profile_pic : null,
      profile_picState : "",
      modal : false
    }
  }
  setModal(val=false,callSave = false){
    if(callSave){
      this.onClickSave()
    }
    this.setState({
      modal : val
    })
  }
  onClose() {
    this.setState({original_source_image: null,selected_profile_pic: null,selected_1_profile_pic:null,modal : false})
  }

  dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}
  
  onCrop(selected_profile_pic) {
    //  console.log("In Crop",selected_profile_pic);
    let temp_file = this.dataURLtoFile(selected_profile_pic,this.state.original_source_image.name)
    // console.log("Temp File",temp_file,this.state.original_source_image)
    this.setState({selected_profile_pic,selected_1_profile_pic:temp_file})
  }
  onFileLoad(file){
    // console.log("In Before fileload");
    // console.log("File:",file.target.files[0].size)
    let fileSize =file.target.files[0].size / 1024;
    if(fileSize <= 1024){
    this.setState({
      original_source_image : file.target.files[0]
    })
  }else{
    file.target.value = "";
    this.setState({
      original_source_image : null
    })
    toast.error("Allowed maximum image size is 1 MB.")
  }
  }

  fileLoaded(){
    this.setModal(false)
  }
  static getDerivedStateFromProps(props, state) {    
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if((state.career_path.length !== props.career_path.length)||(!(state.user))||(state.user && props.user && ((state.user.first_name !== props.user.first_name)||(state.user.last_name !== props.user.last_name)||(state.user.phone !== props.user.phone)||(state.user.profile_pic !== props.user.profile_pic)||(state.user.racial_identity !== props.user.racial_identity)))){    
      return {        
        user: (props.user)?props.user:{},
        career_path: (props.career_path.length > 0)?props.career_path:[]        
      };   
    }else{
      return {
        ...state
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

  componentDidMount(){
    let ths = this;
    // ths.props.getProfileLatestData({user_id:ths.props.user.user_id},ths.props.history)
    this.props.fetchCareerPath();
    ths.showLoader();
    setTimeout(()=>{
      ths.hideLoader()
    },1000)
  }

  verifyLength(val, length){
    if (val.trim().length >= length) {
      return true;
    }
    return false;
  };


  verifyPhone(val,len=1){
    //  console.log("phone:",isNaN(val.trim()));
    
    if(val.trim().length >= len){
      // console.log("inif")
        return true
    }
    return false;
}
verifymobilenumber(val){
  //var numbercheck = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/g;
  // console.log("check")
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  
  if(val.match(phoneno)) {
    // console.log("match");
    return true;
  }
  else {
    // console.log("message");
    return false;
  }
  
}

  setfirstname(val=""){
    let user = this.state.user
    user.first_name = val;
    this.setState({user: user})
  }
  setfirstnameState(val=""){
    this.setState({firstNameState:val,firstnameerrortext:(val == "error")?"First name shouldn't be empty.":""})
  }

  setlastname(val=""){
    let user = this.state.user
    user.last_name = val;
    this.setState({user: user})
  }
  setlastnameState(val=""){
    this.setState({lastNameState:val,lastnameerrortext:(val == "error")?"Last name shouldn't be empty.":""})
  }

  setPhone(val=""){
    // console.log("VALL:",val)
    let user = this.state.user
    var cleaned = ('' + val).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
    // var intlCode = (match[1] ? '+1 ' : '')
      var intlCode = ('')
      var newnumber = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
      user.phone = newnumber;
      this.setState({user: user})
      //this.setState({ candidatephone: newnumber })
    }else{
      user.phone = val;
      this.setState({user: user})
     // this.setState({ candidatephone: val })
    }
    
   
  }
  setphoneState(val=""){
    this.setState({phoneState:val,phoneerrortext:(val == "error")?"Phone number have at least 10 digit.":""})
  }

  handleRacialIdentity = (event) => {
    this.setRacialIdentitySelect(event.target.value);
  };

  setRacialIdentitySelect(val) {
    let user = this.state.user
    user.racial_identity = val;
    this.setState({user: user})
  }

  setProfilePic(val){
      this.setState({
        profile_pic : val
      })
  }

  handleLookingForJob(){
    let user = this.state.user
    if(user.looking_for_job  == 1){
      user.looking_for_job = 0;
    }else{
      user.looking_for_job = 1;
    }
    this.setState({user:user})
  }

  loadImageFail() {
    this.setState({
      original_source_image: null
    })
  }


  setEditorRef = (editor) => this.editor = editor

  setUploadProfilepic = (button) => this.fileupload = button

  onClickSave = () => {
    let ths = this;
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage().toDataURL();
      // console.log("sdfSD:",canvas)
      let temp_file = this.dataURLtoFile(canvas,'test.png')
      this.setState({
        selected_1_profile_pic : temp_file
      })
      let imageURL;
      fetch(canvas)
        .then(res => res.blob())
        .then(blob => (ths.setState({ selected_profile_pic: window.URL.createObjectURL(blob) })));

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }


  handleChange = (event) => {
    this.setState({ ...this.state.state, [event.target.name]: event.target.checked });
  };

  hangleProfilePic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log("Event : ",e.target.files[0])
      if((e.target.files[0].size / 1024) <= 1024 ){
      const reader = new FileReader()
      let ths =this;
      // this.setState({selected_1_profile_pic : e.target.files[0]})
      this.updateProfilePic(e.target.files[0]);
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

  async updateProfilePic(profile_pic) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { "Content-Type": "multipart/form-data", token: `${token}` } }

    let user_obj  = new FormData();
    user_obj.append("user_id", `${this.props.user.user_id}`);
    if(profile_pic){
      // console.log("profile_pic:", profile_pic)
      user_obj.append("profile_pic",profile_pic)
    }

    const response = await axios.post(`${API_URL}/student/updateprofilepic`, user_obj, headers)
    // console.log("Response",response.data);
    if(response.data.status !== -2){
      if (response.data.status === false) {
          toast.error(response.data.message)               
      } else {
        toast.success("Profile picture updated successfully.")
      }
    }else{
        toast.error(response.data.message)
        this.props.logoutUser(this.props.history)
    }

    let ths = this;
    setTimeout(() => {
      ths.props.getProfileLatestData(
        { user_id: ths.props.user.user_id },
        ths.props.history
      );      
    }, 500);
  }
  
  editProfile(e){
    if(this.state.user){
      // console.log("STATE:",this.state)
      if(!(this.verifyLength(this.state.user.first_name,1))){
          toast.error("Please enter First Name")
          this.setfirstnameState("error");
      }else if(!(this.verifyLength(this.state.user.last_name,1))){
        toast.error("Please enter Last Name")
          this.setlastnameState("error");
      }else if(!(this.verifyPhone(this.state.user.phone,10)) ){
          toast.error("Please enter Mobile number")
          this.setphoneState("error");
      }
      else if(!this.verifymobilenumber(this.state.user.phone)){
        toast.error("Please enter valid Mobile number")
        this.setphoneState("error");
      }
      else if(this.state.user.racial_identity == 0){
        toast.error("Please select racial identity.")
      }
      if(this.verifyLength(this.state.user.first_name,1) && this.verifyLength(this.state.user.last_name,1)&& this.verifyPhone(this.state.user.phone,10) && this.verifymobilenumber(this.state.user.phone) && this.state.user.racial_identity != 0){
          // console.log("In")
          let user_obj  = new FormData();
          // let user_obj = {}
          this.state.user.looking_for_job = `${this.state.user.looking_for_job}`
          user_obj.append("user_id", `${this.state.user.user_id}`);
          user_obj.append("first_name", `${this.state.user.first_name}`);
          user_obj.append("last_name", `${this.state.user.last_name}`);
          user_obj.append("phone", `${this.state.user.phone}`);
          user_obj.append("racial_identity", `${this.state.user.racial_identity}`);
          user_obj.append("looking_for_job", `${this.state.user.looking_for_job}`);
          // if(this.state.selected_1_profile_pic){
          //   // console.log("selected_1_profile_pic:",this.state.selected_1_profile_pic)
          //   user_obj.append("profile_pic",this.state.selected_1_profile_pic)
          // }
          // user_obj.first_name = `${this.state.user.first_name}`
          // user_obj.last_name = `${this.state.user.last_name}`
          // user_obj.phone = `${this.state.user.phone}`
          // user_obj.looking_for_job = `${this.state.user.looking_for_job}`
          // console.log("user_obj :",user_obj);
          this.showLoader();
          this.props.editProfile(user_obj,this.props.history);
          this.setfirstnameState();
          this.setlastnameState();
          this.setphoneState();
          let ths = this;
          setTimeout(()=>{
            // window.location.reload()
            // ths.props.getProfileLatestData({user_id:ths.props.user.user_id},ths.props.history)
            // setTimeout(()=>{              
              ths.hideLoader();
            // },200)
          },3000)
      }
    }
    e.preventDefault()
}
toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

async Main(file){
//  const file = document.querySelector('#myfile').files[0];
//  console.log(await this.toBase64(file));
}
handleClick = (e) => {
  this.inputElement.click();
}
fileChange(e){
  // console.log("E",e.target.files)
  if(e.target.files.length > 0){
    this.Main(e.target.files[0])
  }else{

  }
}
  render(){
    // console.log("DATQA:",this.state)
    const { classes } = this.props;
    let ths = this;
    return (
    <div className="main-right-panel">
      <GridContainer>
        <Hidden xsDown>
          <CustomBreadscrumb {...this.props} />
        </Hidden>

        <GridItem xs={12}>
          <h1>My Profile</h1>
          <h5>Edit your Profile</h5>
        </GridItem>
      </GridContainer>
      <GridContainer spacing={10}>
        <GridItem xs={12} sm={12} md={12} lg={4}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              My Profile
            </CardHeader>
            <CardBody className="cardCustomBody">
              <div className={`${classes.myProfile} ${classes.textCenter}`}>
                <div className={classes.profilePicEdit}>                  
                  <img src={(this.state.selected_profile_pic !== null)?this.state.selected_profile_pic:((this.state.user && this.state.user.profile_pic)?this.state.user.profile_pic:DefaultProfilePic)} className={classes.myProfileImg}></img>                                 
                  <Button
                    color="info"
                    size="lg"
                    className={classes.editBtn}
                    // onClick={e=>{ this.setModal(true)}}
                    onClick={e=>{ this.handleClick(e)}}
                  >
                    <EditIcon />
                    <input type="file" accept="image/*"  ref={input => this.inputElement = input} onChange={this.hangleProfilePic} style={{"display":"none"}}/>
                  </Button>
                </div>
                <span className={`${classes.myProfileName} ${classes.pt30} ${classes.pb10}`}>{(this.props.user)?((this.props.user.full_name)?this.props.user.full_name:""):""}</span>
                <span className={`${classes.dateJoin} ${classes.pb15}`}>Date Joined : {(this.state.user)?((this.state.user.created_date && moment(this.state.user.created_date).format("DD MMMM YYYY") !== "Invalid date" )?moment(this.state.user.created_date).format("DD MMMM YYYY"):" - "):" - "}</span>
                <div className={`${classes.jobLook} ${classes.pb30}`}>
                  <Switch inputProps={{ 'aria-label': 'primary checkbox' }} 
                    className={classes.mr15} 
                    checked={(this.state.user)?((this.state.user.looking_for_job == 1)?true:false):false} 
                    onChange={(e)=>{this.handleLookingForJob()}}
                  />
                  Looking for Job
                </div>
                {(this.state.user)?((this.state.user.looking_for_job == 0)?<div className={classes.hired}>
                  <img src={ExamIcon} alt="" width='70' className={classes.mr15}></img>
                  Hired!
                </div>:null):null}
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={8}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Edit Profile
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container className={classes.root} spacing={4}>
                <Grid item sm={6} xs={12} className={classes.py0}>
                  <CustomInput
                    // helperText={(this.state.firstNameState === "error")?this.state.firstnameerrortext:""}
                    // success={this.state.firstNameState === "success"}
                    error={this.state.firstNameState === "error"}
                    labelText="First Name"
                    id="fName"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value : (this.state.user)?((this.state.user.first_name)?this.state.user.first_name:""):"",
                      type: "text",
                      autoComplete: "off",
                      onChange:((e)=>{
                              if(this.verifyLength(e.target.value,1)){
                                this.setfirstnameState("success");
                              }else{
                                this.setfirstnameState("error");
                              }
                              this.setfirstname(e.target.value)
                            })
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.py0}>
                  <CustomInput
                    // helperText={(this.state.lastNameState === "error")?this.state.lastnameerrortext:""}
                    // success={this.state.lastNameState === "success"}
                    error={this.state.lastNameState === "error"}
                    labelText="Last Name"
                    id="lName"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value : (this.state.user)?((this.state.user.last_name)?this.state.user.last_name:""):"",
                      type: "text",
                      autoComplete: "off",
                      onChange:((e)=>{
                              if(this.verifyLength(e.target.value,1)){
                                this.setlastnameState("success");
                              }else{
                                this.setlastnameState("error");
                              }
                              this.setlastname(e.target.value)
                            })
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={12} className={classes.py0}>
                  <CustomInput
                    labelText="E-mail Address"
                    id="emailLog"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value : (this.state.user)?((this.state.user.email)?this.state.user.email:""):"",
                      disabled:true
                    }}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.py0}>
                  <CustomInput
                    // helperText={(this.state.phoneState === "error")?this.state.phoneerrortext:""}
                    // success={this.state.phoneState === "success"}
                    error={this.state.phoneState === "error"}
                    labelText="Mobile Number"
                    id="mobile"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value : (this.state.user)?((this.state.user.phone)?this.state.user.phone:""):"",
                      type: "text",
                      autoComplete: "off",
                      onChange:((e)=>{
                              if(this.verifyPhone(e.target.value,10)){
                                this.setphoneState("success");
                              }else{
                                this.setphoneState("error");
                              }
                              this.setPhone(e.target.value)
                            })
                    }}
                  />
                  {/* <PhoneInput
                    inputClass="form-group label-floating has-error"
                    country={'us'}
                    disableDropdown={true}
                    onlyCountries={['us']}
                    disableCountryCode={false}
                    value={(this.state.user)?((this.state.user.phone)?this.state.user.phone:""):""}
                    onChange={phone => this.setPhone( phone)}
                  /> */}
                </Grid>
                <Grid item xs={12} sm={6} className={classes.py0}>
                  <CustomInput
                    labelText="Career Path"
                    id="careerPath"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value :(this.state.user)?((this.state.user.career_name)?this.state.user.career_name:""):"",
                      disabled:true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.py0}>
                <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="racial-identity-select"
                      className={classes.selectLabel + " logDdLabel"}
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
                      value={(this.state.user)?((this.state.user.racial_identity)?this.state.user.racial_identity:""):""}
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
                </Grid>
                <Grid item xs={12} className={classes.textCenter}>
                  <Button
                    color="info"
                    size="lg"
                    className={`${classes.newButton} ${classes.mt15}`}
                    onClick={(e)=>this.editProfile(e)}
                  >
                    Update
                    </Button>
                </Grid>
              </Grid>
            </CardBody>
          </Card>
          <Dialog
              modalStyle={{
                root: classes.center,
                paper: classes.modal
              }}
              open={this.state.modal}
              transition={Transition}
              keepMounted
              onClose={() => this.onClose()}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader + " modal-header"}
              >
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => this.onClose()}
                >
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Select Profile Picture</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer justify="center">                  
                  <GridItem xs={5}>
                  {/* {!(this.state.original_source_image) ? */}
                      <Avatar
                        width={'100%'}
                        height={295}
                        cropRadius={50}
                        onCrop={this.onCrop}
                        onClose={this.onClose}
                        onBeforeFileLoad={this.onFileLoad}   
                        onFileLoad={this.fileLoaded}
                        img={this.state.original_source_image}
                      /> 
                       {/* <AvatarEditor
                        ref={this.setEditorRef}
                        image={this.state.original_source_image}
                        width={300}
                        height={400}
                        onLoadFailure={this.loadImageFail}                        
                        border={0}
                        rotate={0}
                      />} */}
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter+" "+classes.root}
              >              
                {/* <Button color="gray" size="lg" onClick={() => this.setModal(false)} className={`${customStyle.outlineButton} ${customStyle.mt30} ${customStyle.mb30}`}>Cancel</Button> */}
                <Button
                  onClick={(e) => this.setModal(false,true)}
                  color="info"
                  size="lg"
                  className={`${customStyle.blockButton} ${customStyle.mt30} ${customStyle.mb30}`}
                >
                    Done
                </Button>
              </DialogActions>
            </Dialog>
        </GridItem>
      </GridContainer>
    </div>


  );
  }
}
const mapStateToProps = state => {
  // console.log('Profile Props:',state);

  return {
    user: state.authReducer.user,    
    career_path: state.authReducer.career_path
  };
};

const mapDispatchToProps ={ fetchCareerPath,editProfile,getProfileLatestData };
const combinedStyles = combineStyles(useCustomSpace1,customStyle,modalStyles,customSelect);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(Profile));