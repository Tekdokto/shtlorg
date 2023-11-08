import React from "react";

// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";
import DefaultProfilePic from "../../assets/img/faces/default-avatar.png";
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


import Link from "@material-ui/core/Link";
import Switch from '@material-ui/core/Switch';

import EditProfilePic from "../../assets/img/edit-profile-pic.png";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";

import ExamIcon from "assets/img/exam-icon.svg";
import combineStyles from '../../combineStyles';

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

import { connect } from "react-redux";
import { editProfile,getProfileLatestData  } from '../../redux/action';
import {API_URL} from "constants/defaultValues.js"
import Avatar from 'react-avatar-edit';
import moment from "moment";
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
    this.state = {
      user : null,
      career_path : [],
      firstNameState : "",
      lastNameState : "",
      company_nameState : "",
      profile_pic : null,
      original_source_image : null,
      selected_profile_pic : null,
      profile_picState : "",
      modal : false
    }
  }
  setModal(val=false){
    this.setState({
      modal : val
    })
  }
  onClose() {
    this.setState({selected_profile_pic: null,modal : false})
  }
  
  onCrop(selected_profile_pic) {
    this.setState({selected_profile_pic})
  }
  onFileLoad(file){
    // console.log("File:",file)
    this.setState({
      original_source_image : file
    })
  }
  static getDerivedStateFromProps(props, state) {    
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if((state.career_path.length !== props.career_path.length)||(!(state.user))||(state.user && props.user && ((state.user.full_name !== props.user.full_name)||(state.user.title !== props.user.title)||(state.user.company_name !== props.user.company_name)||(state.user.profile_pic !== props.user.profile_pic)))){    
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
    ths.showLoader();
    setTimeout(()=>{
      ths.hideLoader()
    },500)
  }

  verifyLength(val, length){
    if (val.length >= length) {
      return true;
    }
    return false;
  };


  verifyPhone(val,len=1){
    // console.log("company_name:",isNaN(val.trim()));
    
    if(val.trim().length >= len && (!isNaN(val.trim()))){
        return true
    }
    return false;
}

  setfirstname(val=""){
    let user = this.state.user
    user.full_name = val;
    this.setState({user: user})
  }
  setfirstnameState(val=""){
    this.setState({firstNameState:val})
  }

  setlastname(val=""){
    let user = this.state.user
    user.title = val;
    this.setState({user: user})
  }
  setlastnameState(val=""){
    this.setState({lastNameState:val})
  }

  setPhone(val=""){
    let user = this.state.user
    user.company_name = val;
    this.setState({user: user})
  }
  setcompany_nameState(val=""){
    this.setState({company_nameState:val})
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

  handleChange = (event) => {
    this.setState({ ...this.state.state, [event.target.name]: event.target.checked });
  };

  hangleProfilePic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log("Event : ",e)
      const reader = new FileReader()
      let ths =this;
      reader.addEventListener('load', () =>
          ths.setState({
            original_source_image : reader.result,
          }),
          false
      )
      reader.readAsDataURL(e.target.files[0])      
  }
  }
  
  editProfile(e){
    if(this.state.user){
      // console.log("STATE:",this.state)
      if(!(this.verifyLength(this.state.user.full_name,1))){
          this.setfirstnameState("error");
      } 
      if(!(this.verifyLength(this.state.user.title,1))){
          this.setlastnameState("error");
      }
      if(!(this.verifyPhone(this.state.user.company_name,8))){
          this.setcompany_nameState("error");
      }
      if(this.verifyLength(this.state.user.full_name,1) && this.verifyLength(this.state.user.title,1)&& this.verifyPhone(this.state.user.company_name,8)){
          // console.log("In")
          let user_obj  = new FormData();
          // let user_obj = {}
          this.state.user.looking_for_job = `${this.state.user.looking_for_job}`
          user_obj.append("user_id", `${this.state.user.user_id}`);
          user_obj.append("full_name", `${this.state.user.full_name}`);
          user_obj.append("title", `${this.state.user.title}`);
          user_obj.append("company_name", `${this.state.user.company_name}`);
          user_obj.append("looking_for_job", `${this.state.user.looking_for_job}`);
          if(this.state.original_source_image){
            user_obj.append("profile_pic",this.state.original_source_image)
          }
          // user_obj.full_name = `${this.state.user.full_name}`
          // user_obj.title = `${this.state.user.title}`
          // user_obj.company_name = `${this.state.user.company_name}`
          // user_obj.looking_for_job = `${this.state.user.looking_for_job}`
          // console.log("user_obj :",user_obj);
          
          this.props.editProfile(user_obj,this.props.history);
          // this.setfirstnameState();
          // this.setlastnameState();
          // this.setcompany_nameState();
          let ths = this;
          setTimeout(()=>{
            ths.props.getProfileLatestData({user_id:ths.props.user.user_id},ths.props.history)
          },500)
      }
    }
    e.preventDefault()
}

  render(){
    // console.log("DATQA:",this.state)
    const { classes } = this.props;
    let ths = this;
    return (
    <div className="main-right-panel">
      <GridContainer>     
        <GridItem xs={12}>
          <h1>My Profile</h1>
          {/* <h5>See your Profile</h5> */}
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
                  {/* <Button
                    color="info"
                    size="lg"
                    className={classes.editBtn}
                    onClick={e=>{ this.setModal(true) }}
                  >
                    <EditIcon />
                  </Button> */}
                </div>
                <span className={`${classes.myProfileName} ${classes.pt30} ${classes.pb10}`}>{(this.state.user)?((this.state.user.full_name)?this.state.user.full_name:""):""}</span>
                <span className={`${classes.dateJoin} ${classes.pb15}`}>Date Registered : {(this.state.user)?((this.state.user.created_date && moment(this.state.user.created_date).format("DD MMMM YYYY") !== "Invalid date" )?moment(this.state.user.created_date).format("DD MMMM YYYY"):" - "):" - "}</span>                
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={8}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              My Profile
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container className={classes.root} spacing={4}>
                <Grid item sm={6} xs={12} className={classes.py0}>
                  <CustomInput
                    success={this.state.firstNameState === "success"}
                    error={this.state.firstNameState === "error"}
                    labelText="Full Name"
                    id="fName"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled : true,
                      value : (this.state.user)?((this.state.user.full_name)?this.state.user.full_name:""):"",
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
                    success={this.state.lastNameState === "success"}
                    error={this.state.lastNameState === "error"}
                    labelText="Title/Role"
                    id="lName"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled : true,
                      value : (this.state.user)?((this.state.user.title)?this.state.user.title:" - "):" - ",
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
                    success={this.state.company_nameState === "success"}
                    error={this.state.company_nameState === "error"}
                    labelText="Company Name"
                    id="mobile"
                    multiline
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled : true,
                      value : (this.state.user)?((this.state.user.company_name)?this.state.user.company_name:" - "):" - ",
                      type: "text",
                      autoComplete: "off",
                      onChange:((e)=>{
                              if(this.verifyPhone(e.target.value,8)){
                                this.setcompany_nameState("success");
                              }else{
                                this.setcompany_nameState("error");
                              }
                              this.setPhone(e.target.value)
                            })
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.py0}>
                  <CustomInput
                      success={this.state.company_websiteState === "success"}
                      error={this.state.company_websiteState === "error"}
                      labelText="Website"
                      id="mobile"
                      multiline
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled : true,
                        value : (this.state.user)?((this.state.user.company_website)?this.state.user.company_website:" - "):" - ",
                        type: "text",
                        autoComplete: "off",
                        onChange:((e)=>{
                                if(this.verifyPhone(e.target.value,8)){
                                  this.setcompany_websiteState("success");
                                }else{
                                  this.setcompany_websiteState("error");
                                }
                                this.setPhone(e.target.value)
                              })
                      }}
                    />
                </Grid>
                <Grid item xs={12} className={classes.textCenter}>
                  {/* <Button
                    color="info"
                    size="lg"
                    className={`${classes.newButton} ${classes.mt15}`}
                    onClick={(e)=>this.editProfile(e)}
                  >
                    Update
                    </Button> */}
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
                  <GridItem xs={12}>
                      <Avatar
                        width={390}
                        height={295}
                        cropRadius={50}
                        onCrop={this.onCrop}
                        onClose={this.onClose}
                        onFileLoad={this.onFileLoad}
                        src={this.state.original_source_image}
                      />
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter+" "+classes.root}
              >              
                {/* <Button color="gray" size="lg" onClick={() => this.setModal(false)} className={`${customStyle.outlineButton} ${customStyle.mt30} ${customStyle.mb30}`}>Cancel</Button> */}
                <Button
                  onClick={(e) => this.setModal(false)}
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

const mapDispatchToProps ={ editProfile,getProfileLatestData };
const combinedStyles = combineStyles(useCustomSpace1,customStyle,modalStyles);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(Profile));