import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import moment from "moment";
import { API_URL } from "constants/defaultValues.js"
import { toast } from "react-toastify";
// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";

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
import circleEditOutline from '@iconify/icons-mdi/circle-edit-outline';
import accountMultiple from '@iconify/icons-mdi/account-multiple';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import playlistRemove from '@iconify/icons-mdi/playlist-remove';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

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

class SendConfirmation extends React.Component{
  // const classes = useStyles();
  // const classesCustom = useCustomSpace();
  // const customStyle = useCustomStyle();
  // const checkBoxStyle = useCheckStyles();
  // const selectStyle = useSelectStyles();
  // const modalStyle = useModalStyles();

  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      all_watchlist : [],
      watchlist : "",
      watchlistname : "",
      student_id : 0,
      student_name : "",
      confirm_id : 0,
      remarks: "",
      remarksState : "",
      data : [],
      totalStudent : 0,
      page: 0,
      pagesize: 7,
      modal : false,
      checked : [24,22],
      simpleSelect : "",
      career_path : [],
      cities : [],
      all_skills : [],    
      filter : {
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
  componentDidMount(){
    const { match } = this.props;
    let ths = this;
    if(match.params.watchlist && match.params.name && match.params.id && match.params.std_id){
        console.log("match;",match)
        this.setState({
            student_id : match.params.std_id,
            student_name : match.params.name,
            watchlistname : match.params.watchlist,
            confirm_id : match.params.id
        })
    }else{
        this.props.history.push('/company/offerlist')
    }
    ths.showLoader();
    setTimeout(()=>{
      ths.hideLoader()
    },500)
  }

  static getDerivedStateFromProps(props, state) {    
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if(props.user){    
      return {        
        user : (props.user)?props.user:[]       
      };   
    }else{
      return {
        ...state
      } 
    }               
  }
  

  setModal(val=false,confirm_id=0,student_id=0,student_name="",watchlistname=""){
    this.setState({
      modal : val,
      confirm_id : (val)?confirm_id:"",
      student_id : (val)?student_id:"",
      student_name : (val)?student_name:"",
      watchlistname : (val)?watchlistname:""
    })
  }

  setChecked(val=[]){
    this.setState({
      checked : val
    })
  }

  setSimpleSelect(val=""){
    this.setState({
      watchlist : val
    })
  }

  setRemarks(val=""){
    this.setState({
      remarks : val.substring(0,250)
    })
  }

  setRemarksState(val=""){
    this.setState({
      remarksState : val
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

confirmCandidate(){
  let params = {}
  params.user_id = this.props.user.user_id;
  // console.log("FQAIL",params)
  if(this.state.remarks.trim() !== ""){
    params.id = this.state.confirm_id;
    params.student_id = this.state.student_id;    
    params.note = this.state.remarks;
    this.confirmCandidateCall(params);
  }else{
    toast.error("Please add offer note")
  }
}

async confirmCandidateCall(params){
  let ths = this;
  let response = await this.callToConfirmCandidate(params);
  if(response.status !== -2){
    if(response.status === false){
      toast.error(response.message)
    }else{
      toast.success(response.message)
    }
    setTimeout(function(){
      ths.props.history.push('/company/offerlist')
    },500)
  }else{
    this.props.logoutUser(this.props.history)
  }
}

async callToConfirmCandidate(params){
  let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
  let token = (User)?((User.token)?User.token:''):'';
  let headers = { headers: { token: `${token}` } }
  const res = await axios.post(`${API_URL}/company/watchlist/send_offer_to_candidate`,params,headers)
  return await res.data; 
}

render(){
  // console.log("State: ",this.state)
  const { classes } = this.props;
  return (
    <div className="main-right-panel">
      <GridContainer>       
        <GridItem xs={12} sm={8}>
          <h1>Confirm Candidate Offer</h1>
          <h5>Contact your candidate</h5>
        </GridItem>       
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
            Confirm Candidate Offer         
            </CardHeader>
            <CardBody className="cardCustomBody">
            <GridContainer>
                  <GridItem xs={8}>
                    <CustomInput
                      labelText="Name"
                      id="candidate"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled : true,
                        value : this.state.student_name,
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={4}>
                    <CustomInput
                      labelText="My Openings"
                      id="watchlist"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled : true,
                        value : this.state.watchlistname,
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                  <CustomInput
                      error={this.state.remarksState === "error"}
                      success={this.state.remarksState === "success"}
                      labelText="Note"
                      id="rejectionremark"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline :  true,
                        multiline: true,
                        rows: 3,                        
                        value : this.state.remarks,
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                        onChange : ((e)=>{
                            if(e.target.value.trim() === ""){
                              this.setRemarksState("error");
                            }else{
                              this.setRemarksState("success");
                            }
                            this.setRemarks(e.target.value)
                        })
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <Button                    
                        color="info"
                        size="lg"
                        className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                        onClick={(e)=> this.confirmCandidate()}
                    >
                        Send Offer
                    </Button>
                  </GridItem>
                </GridContainer>   
            </CardBody>
          </Card>                
        </GridItem>
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

const mapDispatchToProps = { logoutUser  }
const combinedStyles = combineStyles(styles,useCustomSpace1,checkBoxStyle,modalStyles,customSelect,customStyle);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(SendConfirmation));