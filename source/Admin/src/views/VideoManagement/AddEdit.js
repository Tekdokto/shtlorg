import React , { Component } from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// material ui icons
import Contacts from "@material-ui/icons/Contacts";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Select from 'react-select';

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import { addVideo,editVideo } from '../../redux/action'
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";


class UserAddEdit extends Component{
    constructor(props){
        super(props);
        this.addUser = this.addUser.bind(this);
        this.state = {
            isEditPage : false,
            videoTitle : "",
            videoTitleState: "",
            videoUrl : "",
            videoUrlState: "",
            sequence : "",
            sequenceState: "",
            user_id : 0,
            alert : null
        }
    }
    componentDidMount(){
        // console.log("IN MOUNT:",this.props.location)
        let pathcheck = this.props.location.pathname.split('/');
        let path = pathcheck[pathcheck.length-1];
        let isEdit = path === "edit"
        this.setState({
            users: (this.props.edit_user_obj)?this.props.users:[],
            isEditPage : (this.props.edit_user_obj && isEdit)?true:false,
            videoTitle : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['video_title']?this.props.edit_user_obj['video_title']:""):"",            
            videoUrl : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['video_url']?this.props.edit_user_obj['video_url']:""):"",            
            sequence : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['video_order']?this.props.edit_user_obj['video_order']:""):"",        
            id : (this.props.edit_user_obj && isEdit)?(this.props.edit_user_obj['id']?this.props.edit_user_obj['id']:0):0, 

        })
    }
   
    setAlert(val=null){
        this.setState({alert:val})
    }
    verifyString(val,len=1){
        console.log('val',val,len);
        
        if(val.trim().length >= len){
            return true
        }
        return false;
    }
    
    setvideoTitle(val=""){
        this.setState({videoTitle:val})
    }
    setvideoTitleState(val=""){
        this.setState({videoTitleState:val})
    }

    setvideoUrl(val=""){
        this.setState({videoUrl:val})
    }
    setvideoUrlState(val=""){
        this.setState({videoUrlState:val})
    }

    setsequence(val=""){
        this.setState({sequence:val})
    }
    setsequenceState(val=""){
        this.setState({sequenceState:val})
    }
    verifysequence(val){
        var seqcheck =/^[1-9]\d*$/;
        if (seqcheck.test(val)) {
            return true;
          }
          this.setsequenceState("error");
          return false;
      
      }
      verifyurl(val){
        var urlcheck =/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if (urlcheck.test(val)) {
            return true;
          }
          this.setvideoUrlState("error");
          return false;
      
      }  
    
  
    addUser(){
        console.log("State:0",this.state);
        
        if(!this.verifyString(this.state.videoTitle,2)){
            console.log("this.state.videoTitle",this.state.isEditPage)
            this.setvideoTitleState("error");
        }
        if(!this.verifyurl(this.state.videoUrl)){
            this.setvideoUrlState("error");
        }
       
        if(!this.verifysequence(this.state.sequence)){
           
            this.setsequenceState("error");
        }
       
        if(this.verifyString(this.state.videoTitle,2) && this.verifyurl(this.state.videoUrl) && this.verifysequence(this.state.sequence)){
            let admin_id = this.props.user.user_id
            let user = {
                admin_id,
                'id':this.state.id,
                'title':this.state.videoTitle,
                'url':this.state.videoUrl,
                'sequence':this.state.sequence,
                
            }
            console.log("USER OBJECT:",user);
            
            if(this.state.isEditPage === true){
                
                this.props.editVideo(user,this.props.history);
            }else{
                console.log("inadddd")
                this.props.addVideo(user,this.props.history);
                // this.setState({
                //     isEditPage : false,
                //     videoTitle : "",
                //     videoTitleState: "",
                //     videoUrl : "",
                //     videoUrlState: "",
                //     sequence : "",
                //     sequenceState: "",
                  
                // })
            }
        }
    }
options = [
    { value: 'one', label: 'One' },
    { value: 'one', label: 'Two' }
  ];
       
logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
}
    render(){
        const { classes } = this.props;
        return(
            <div className="main-right-panel">
                <GridContainer>
                    <GridItem xs={12} sm={8}>
                        <h1>Interview Prep Management</h1>
                        <h5>Manage Interview Prep Video Library</h5>
                    </GridItem>
                    
                </GridContainer>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12}>
                    <Card className="paddingTopBottom cardCustom">
                        <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                        {(this.state.isEditPage===false)?"Add Video":"Edit Video"}
                        
                        </CardHeader>
                   
                   
                    <CardBody className="cardCustomBody">
                        <form>
                        <CustomInput
                            success={this.state.videoTitleState === "success"}
                            error={this.state.videoTitleState === "error"}
                            labelText="Title*"
                            id="videotitle"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setvideoTitleState("success");
                                } else {
                                    this.setvideoTitleState("error");
                                }
                                this.setvideoTitle(event.target.value);
                            },
                            value: this.state.videoTitle,
                            type: "textarea"
                            }}
                        />
                        <CustomInput
                            success={this.state.videoUrlState === "success"}
                            error={this.state.videoUrlState === "error"}
                            labelText="Video URL*"
                            id="videourl"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyurl(event.target.value)) {
                                    this.setvideoUrlState("success");
                                } else {
                                    this.setvideoUrlState("error");
                                }
                                this.setvideoUrl(event.target.value);
                            },
                            value: this.state.videoUrl,
                            type: "text"
                            }}
                        />
                        <CustomInput
                            success={this.state.sequenceState === "success"}
                            error={this.state.sequenceState === "error"}
                            labelText="Sequence *"
                            id="sequence"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifysequence(event.target.value)) {
                                    this.setsequenceState("success");
                                } else {
                                    this.setsequenceState("error");
                                }
                                this.setsequence(event.target.value);
                            },
                            value: this.state.sequence,
                            type: "number"
                            }}
                        />
                        
                       
                        
                        <div className={classes.center}>
                            <Button color="info"
                                size="md" onClick={this.addUser}>
                                {(this.state.isEditPage===false)?"Add Video":"Edit Video"}
                            </Button>
                           
                        </div>
                        </form>
                    </CardBody>
                    </Card>
                </GridItem>
                {/* <Snackbar
                    place="tr"
                    color={(this.props.user_error)?"danger":"info"}
                    icon={AddAlert}
                    message={`${this.props.notification_message}`}
                    open={this.props.shownotification}
                    closeNotification={() =>{
                                
                        }}
                    close
                /> */}
            </GridContainer>
           
            </div>
        )
    }
}

const mapStateToProps = state => {
    // console.log('in maptoprops:',state);
    
    return {
      user: state.authReducer.user,
      shownotification: state.videoReducer.shownotification,
      user_error : state.videoReducer.user_error,    
      edit_user_id : state.videoReducer.edit_user_id,
      edit_user_obj : state.videoReducer.edit_user_obj,
      total_user : state.videoReducer.total_user,
      notification_message:state.videoReducer.notification_message
    };
  };
  const mapDispatchToProps = { addVideo,editVideo };

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(UserAddEdit))