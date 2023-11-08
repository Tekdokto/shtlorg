import React from "react";
import { connect } from "react-redux"
// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Link from "@material-ui/core/Link";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js"


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import combineStyles from '../../combineStyles';
import { listPreperationVideo,changeVideoWatchStatus,getProfileLatestData } from "../../redux/action";

import { toast } from "react-toastify";
import VideoPlayer from "assets/img/video-player.jpg";
import ReactPlayer from 'react-player'

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
class InterviewPreperation extends React.Component{
  constructor(props){
    super(props);
    this.videoPlayed = this.videoPlayed.bind(this);
    this.videoPlayedEnd = this.videoPlayedEnd.bind(this);
    
    this.handleProgress = this.handleProgress.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.props = props;
    this.state = {
      user : null,
      videos : [],
      page : '0',
      current_video : [],
      lastPlaying_video_id : 0,
      lastwatchedcount : 0,
    }
  }
  static getDerivedStateFromProps(props, state) {    
    // console.log("props cattt",props);
    // console.log("props state cattt",state); 
    // let check_for_change_status_of_current_song = false
    // if(state.lastPlaying_video_id > 0 && state.videos.length > 0 && props.videos.length > 0) {
    //   let latest_status_watchcount_arr = props.videos.filter((video)=>{if(state.lastPlaying_video_id === video.id){return video.watchedcount}})
    //   let latest_matched_video_prop_watch_count = (latest_status_watchcount_arr.length > 0)?((latest_status_watchcount_arr[0].watchedcount)?latest_status_watchcount_arr[0].watchedcount:-1):-1;
      
    //   let current_status_watchcount_arr = state.videos.filter((video)=>{if(state.lastPlaying_video_id === video.id){return video.watchedcount}})
    //   let current_matched_video_state_watch_count = (current_status_watchcount_arr.length > 0)?((current_status_watchcount_arr[0].watchedcount)?current_status_watchcount_arr[0].watchedcount:0):0;
      
    //   console.log("current_status_watchcount:",current_status_watchcount_arr,current_matched_video_state_watch_count,"latest_status_watchcount:",latest_status_watchcount_arr,latest_matched_video_prop_watch_count)
    //   check_for_change_status_of_current_song = (current_matched_video_state_watch_count === 0 && current_matched_video_state_watch_count !== latest_matched_video_prop_watch_count);
    // }
    let latest_watch_count = state.lastwatchedcount;
    let condition = false
    if(state.lastPlaying_video_id > 0 && state.videos.length > 0 && props.videos.length > 0) {
      let latest_status_watchcount_arr = props.videos.filter((video)=>{if(state.lastPlaying_video_id === video.id){return video}})
      latest_watch_count = (latest_status_watchcount_arr.length > 0)?((latest_status_watchcount_arr[0].watchedcount)?latest_status_watchcount_arr[0].watchedcount:state.lastwatchedcount):state.lastwatchedcount;      
      console.log("current_status_watchcount:",state.videos,state.lastwatchedcount,"latest_status_watchcount:",latest_status_watchcount_arr,latest_watch_count)
      condition = (state.lastwatchedcount === 0 && state.lastwatchedcount !== latest_watch_count);
    }
    if((state.videos.length !== props.videos.length)||(condition)||((props.user && state.user && props.user.current_progress_status != "undefined" && state.user.current_progress_status != "undefined" && state.user.current_progress_status !== props.user.current_progress_status ))){ 
      // if(condition) {
      //   console.log("Current Previous diff: ",props.videos,state.videos)
      // } 
      let prop_current_video = (props.videos.length > 0)?props.videos.filter((video)=>state.lastPlaying_video_id === video.id):[]
      return {      
        user : (props.user)?props.user:state.user,  
        videos:(props.videos.length > 0)?props.videos:[],
        current_video : (state.lastPlaying_video_id !== 0)?((props.videos.length > 0)?prop_current_video:[]):((props.videos.length > 0)?props.videos[0]:[]),
        lastPlaying_video_id : (state.lastPlaying_video_id !== 0)?((props.videos.length > 0)?state.lastPlaying_video_id:((props.videos.length > 0)?props.videos[0].id:0)):((props.videos.length > 0)?props.videos[0].id:0),
        lastwatchedcount : (state.lastwatchedcount !== 0)?state.lastwatchedcount:((props.videos.length > 0)?props.videos[0].watchedcount:0)
      };   
    }else{
      return {
        ...state
      } 
    }               
  }
  ref = player => {
    this.player = player
  }
  selectVideo(video){
    //console.log("selected",video)
    
    this.setState({current_video : video,lastPlaying_video_id:video.id,lastwatchedcount:video.watchedcount})

  }
  videoPlayed(){
    
  }
  videoPlayedEnd(currentvideoid){
    //console.log("videos1111:",this.state.videos,currentvideoid,this.state.lastPlaying_video_id);
    setTimeout(()=>{
      var allvideolengthcheck = this.state.videos.length - 1;
      var findvideoindex = this.state.videos.findIndex(x => x.id === this.state.lastPlaying_video_id);
      //if last video
      if(allvideolengthcheck == findvideoindex){
        //not play next video
       // console.log("if")
      }else{
        //play next video
      //  console.log("else")
        this.selectVideo(this.state.videos[findvideoindex+1])
      }
    },2000)
    
    // console.log("findvideoindex",this.state.videos.length,findvideoindex)
    // console.log("nextobjectdata",this.state.videos[findvideoindex+1])
    // this.selectVideo({created_date: "2020-06-22",
    // id: 7,
    // status: 1,
    // video_order: 101,
    // video_title: "abc111",
    // video_url: "https://vimeo.com/440532542/da006f38e0",
    // watchedcount: 1})

  }
  handleProgress = state => {
    let ths = this;
    let current_video_duration = this.player.getDuration()
    let remaining_duration = Math.round(current_video_duration) - Math.round(state.playedSeconds);
    // console.log('onProgress',current_video_duration,remaining_duration,this.state.current_video.id,this.state.current_video.watchedcount)
    //console.log("tttttttt",current_video_duration,state.playedSeconds,remaining_duration)
    if(current_video_duration && remaining_duration < 7 && remaining_duration > 5 && this.state.current_video.watchedcount === 0){
      setTimeout(()=>{
        ths.props.changeVideoWatchStatus({user_id:ths.props.user.user_id,id:ths.state.current_video.id},ths.props.history)
      },1000)
      setTimeout(()=>{
        ths.props.listPreperationVideo({user_id:ths.props.user.user_id, page : ths.state.page},ths.props.history)
      },6000)
      setTimeout(()=>{
        ///console.log("testekseiffffffffffff",remaining_duration)
        this.videoPlayedEnd(this.state.current_video.id)
      },8000)
      
      
    } 
    else if(current_video_duration <= state.playedSeconds && this.state.current_video.watchedcount === 1){
     // console.log("testekseeeeeeeeeeeeeeeeeee",remaining_duration)
      this.videoPlayedEnd(this.state.current_video.id)
    }
  }

  handleDuration = (duration) => {
    // console.log('onDuration', duration)
    // this.setState({ duration })
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
    this.props.listPreperationVideo({user_id:this.props.user.user_id, page : this.state.page},this.props.history)
    this.props.getProfileLatestData({user_id : this.props.user.user_id},this.props.history);
    ths.showLoader();
    let { match } = this.props;
    if (match.params.isMessage) {
      toast.success("You must complete the Interview Prep before you can take a Mock Interview")
    }
    setTimeout(()=>{
      ths.hideLoader()
    },1500)
    setTimeout(()=>{
      if(!(ths.props.user.current_progress_status >= 1)){
        ths.props.history.push("/candidate/skillassesment/true/interviewprep")
      }
    })
    
  }
  render(){
    // console.log("videos render:",this.state.current_video);
    const { classes } = this.props;
  return (
    <div className="main-right-panel">
      <GridContainer>
        <Hidden xsDown>
          <CustomBreadscrumb {...this.props}/>          
        </Hidden>

        <GridItem xs={12} sm={12}>
          <h1>Interview Preparation</h1>
          <h5>Check your progress</h5>
        </GridItem>
      </GridContainer>
      <GridContainer >
        <GridItem md={12} xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Play Video
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container className={classes.root} spacing={4}>
                <Grid item xs={12} md={12} lg={7}>
                  <div className="player-wrapper">
                  {/* <ReactPlayer controls={true} url="https://www.youtube.com/watch?v=yL19XilAtO0"/> */}
                    {/* <img src={VideoPlayer} alt=""></img> */}
                    {((this.state.current_video))?
                    <ReactPlayer 
                        className='react-player'
                        ref={this.ref}
                        playing={true}
                        autoplay={true}
                        url = { (this.state.current_video)?((this.state.current_video.video_url)?this.state.current_video.video_url:""):""}
                        controls={true} 
                        onPlay={(e)=>{this.videoPlayed()}} 
                        onProgress={this.handleProgress} 
                        //onEnded={this.videoPlayedEnd}
                        width='100%'
                        height='100%'   
                    />:<img src={VideoPlayer} alt=""></img>}
                    <h2 className={`${classes.h2} ${classes.mb15}`}>{(this.state.current_video)?((this.state.current_video.video_title)?this.state.current_video.video_title:"Select Video"):"Select Video"}</h2>
                  </div>
                </Grid>
                <Grid item xs={12} md={12} lg={5} className={`${classes.opacity7}`}>
                  <h4 className={`${classes.h4} ${classes.mb15}`}>Select a Video</h4>
                  <List>
                    {(this.state.videos.length > 0)?this.state.videos.map((video)=>
                    <ListItem className={classes.listItems} style={(this.state.lastPlaying_video_id === video.id)?{'background':'#d4d4d4'}:{}} onClick={(e)=>{this.selectVideo(video)}}>
                      <ListItemIcon>
                      {(video.watchedcount > 0)
                        ?<CheckCircleOutlineIcon style={{'color':'#E68523'}} className={classes.listIcon} />
                        :((this.state.lastPlaying_video_id === video.id)
                          ?<CheckCircleOutlineIcon className={classes.listIcon} />
                            :<PlayCircleOutlineIcon className={classes.listIcon} />)
                      }
                      {/* {(this.state.lastPlaying_video_id === video.id)
                        ?<CheckCircleOutlineIcon className={classes.listIcon} />
                        :((video.watchedcount > 0)
                            ?<CheckCircleOutlineIcon style={{'color':'#E68523'}} className={classes.listIcon} /> 
                              :<PlayCircleOutlineIcon className={classes.listIcon} />)
                      } */}
                      {/* {(video.watchedcount > 0)?
                        <CheckCircleOutlineIcon style={{'color':'#E68523'}} className={classes.listIcon} />
                        :((this.state.current_video.length > 0 && this.state.current_video[0].watchedcount == 0)?<CheckCircleOutlineIcon className={classes.listIcon} />
                            :<PlayCircleOutlineIcon className={classes.listIcon} />)} */}
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary={video.video_title}
                      />
                    </ListItem>
                    ):
                    <ListItem className={classes.listItems}>
                      {/* <ListItemIcon>
                        <CheckCircleOutlineIcon className={classes.listIcon} />
                      </ListItemIcon> */}
                      <ListItemText className='listItemsContent'
                        primary="Videos not Available"
                      />
                    </ListItem>
                    }
                    {/* <ListItem className={classes.listItems}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon className={`${classes.listIcon} ${classes.listCompletedIcon}`} />
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary="Real-World SPAs & React Web Apps"
                      />
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon className={`${classes.listIcon} ${classes.listCompletedIcon}`} />
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary="Writing our First React Code"
                      />
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <ListItemIcon>
                        <PlayCircleOutlineIcon className={classes.listIcon} />
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary="Why Should we Choose React?"
                      />
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <ListItemIcon>
                        <PlayCircleOutlineIcon className={classes.listIcon} />
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary='Understanding "let" and "const"'
                      />
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <ListItemIcon>
                        <PlayCircleOutlineIcon className={classes.listIcon} />
                      </ListItemIcon>
                      <ListItemText className='listItemsContent'
                        primary="Exports and Imports "
                      />
                    </ListItem> */}
                  </List>

                </Grid>
              </Grid>
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
    videos: state.preperationReducer.videos,
    page : state.preperationReducer.page,
    user: state.authReducer.user    
  };
};

const mapDispatchToProps = { listPreperationVideo,changeVideoWatchStatus,getProfileLatestData }

const combinedStyles = combineStyles(customStyle, useCustomSpace1);
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(InterviewPreperation));
