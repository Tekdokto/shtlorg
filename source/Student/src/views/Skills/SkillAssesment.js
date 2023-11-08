import React from "react";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Link from "@material-ui/core/Link";
import CustomBreadscrumb from "../CustomBreadscrumb/CustomBreadscrumb.js";
import { toast } from "react-toastify";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomInput from "components/CustomInput/CustomInput.js";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import combineStyles from "../../combineStyles";
import {
  addStudentSkill,
  listStudent,
  listCareerPathSkill,
  changeStudentSillStatus,
  getProfileLatestData,
} from "../../redux/action";



import ExamIcon from "assets/img/exam-icon.svg";
import { log } from "async";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// const useStyles = makeStyles(styles);
// const useCustomStyle = makeStyles(customStyle);
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
  },
};
// const classesCustom = useCustomSpace();
// const customStyle = useCustomStyle();

class SkillsAssesment extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleSimple = this.handleSimple.bind(this);
    this.addNewSkill = this.addNewSkill.bind(this);
    this.changeExamStatus = this.changeExamStatus.bind(this);
    this.state = {
      user: null,
      skill_list: [],
      career_path_skill_list: [],
      modal: false,
      skill_id: 0,
      lastrefresh:''
    };
  }

  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }

  componentDidMount() {
    let ths = this;
    ths.showLoader();
    this.props.listStudent(
      { user_id: this.props.user.user_id },
      this.props.history
    );
    this.props.listCareerPathSkill(
      {
        user_id: this.props.user.user_id,
        career_path_id: this.props.user.career_path_id,
      },
      this.props.history
    );
    this.props.getProfileLatestData(
      { user_id: this.props.user.user_id },
      this.props.history
    );
    let { match } = this.props;
    if (match.params.isMessage && match.params.pageName && match.params.pageName === "interviewprep") {
      toast.success("You must complete the Skill Assessment before you can go to Interview Prep")
    }
    if (match.params.isMessage && match.params.pageName && match.params.pageName === "interviewscheduler") {
      toast.success("You must complete the Skill Assessment and Interview Prep before you can take a Mock Interview")
    }
    setTimeout(() => {
      ths.hideLoader()
    }, 1500)
  }

  handleSimple = (event) => {
    // console.log("Event:",event.target);

    this.setState({ skill_id: event.target.value });
  };

  refreshResult = () => {
    window.location.reload();
  };

  addNewSkill = (event) => {
    // console.log("skill_id:",this.state.skill_id);
    let ths = this;
    if (this.state.skill_id !== "" && this.state.skill_id !== 0) {
      this.props.addStudentSkill(
        { user_id: this.props.user.user_id, skill_id: this.state.skill_id },
        this.props.history
      );
      setTimeout(function () {
        ths.props.listStudent(
          { user_id: ths.props.user.user_id },
          ths.props.history
        );
        ths.setModal(false);
      }, 1000);
    } else {
      toast.error("Please Select Skill.");
    }
    event.preventDefault();
  };

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);
    if (
      state.skill_list.length !== props.skill_list.length ||
      state.career_path_skill_list.length !==
      props.career_path_skill_list.length ||
      (props.user &&
        state.user &&
        props.user.current_progress_status != "undefined" &&
        state.user.current_progress_status != "undefined" &&
        state.user.current_progress_status !==
        props.user.current_progress_status)
    ) {
      return {
        user: props.user ? props.user : state.user,
        skill_list: props.skill_list.length > 0 ? props.skill_list : [],
        lastrefresh:props.lastrefresh,
        career_path_skill_list:
          props.career_path_skill_list.length > 0
            ? props.career_path_skill_list
            : [],
      };
    } else {
      return {
        ...state,
      };
    }
  }

  changeExamStatus(skill_id, skill_url, skill_exam_status, skill_key) {
    // console.log("Skill Id:",skill_id)
    let email = this.props.user
      ? this.props.user.email
        ? this.props.user.email
        : ""
      : "";
      //console.log("skillllllll",skill_url + "&email=" + email, "_blank")
    window.open(skill_url + "&email=" + email, "_blank");
    let ths = this;
    if (skill_exam_status === 0 || skill_exam_status === 2) {
      this.props.changeStudentSillStatus(
        { user_id: this.props.user.user_id, skill_id: skill_id, status: 1 },
        this.props.history
      );
    }
    setTimeout(function () {
      ths.props.listStudent(
        { user_id: ths.props.user.user_id },
        ths.props.history
      );
    }, 1000);
  }

  setModal(val = false) {
    this.setState({
      modal: val,
      skill_id: 0,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <Hidden xsDown>
            <CustomBreadscrumb {...this.props} />
          </Hidden>

          <GridItem xs={12} sm={8}>
            <h1>Skill Assessment</h1>
            <h5>Check your progress</h5>
          </GridItem>
          <GridItem sm={4} className={classes.rightLeftResponsive}>
            <Button
              color="info"
              className={`${classes.newButton} ${classes.mt30}`}
              onClick={(e) => {
                this.setModal(true);
              }}
              disabled={
                this.props.user
                  ? this.props.user.current_progress_status != "undefined" &&
                    this.props.user.current_progress_status >= 1
                    ? false
                    : true
                  : true
              }
            >
              + New Skill
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={12} xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative has-buttons">
                <GridContainer spacing={6}>
                  <GridItem xs={12} md={7} className="has-btn-title">
                    My Skills
                  </GridItem>
                  <GridItem
                    xs={12}
                    md={5}
                    className={classes.rightLeftResponsiveMdDown}
                  >
                    <Button
                      color="info"
                      size="sm"
                      className={`${classes.newButton} ${classes.mb30} ${classes.mt15}`}
                      disabled={true}
                    >
                      Last Refresh:{' '} 
                      {this.props.lastrefresh}
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardHeader>
              <CardBody className="cardCustomBody">
                <Grid container className={classes.root} spacing={6}>
                  {this.props.skill_list.length > 0 ? (
                    this.props.skill_list.map((skill) => (
                      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <div className={`${classes.examBlock} ${classes.mb30}`}>
                          <img src={ExamIcon} className={classes.my50}></img>
                          <span
                            className={`${classes.examName} ${classes.pb30}`}
                          >
                            {skill.skill_name}
                          </span>
                          {skill.skill_exam_status === 0 || skill.skill_exam_status === 1  || skill.skill_exam_status === 2 ? (
                            <Button
                              color="info"
                              size="lg"
                              className={classes.blockButton}
                              onClick={(e) =>
                                this.changeExamStatus(
                                  skill.skill_id,
                                  skill.skill_url,
                                  skill.skill_exam_status,
                                  skill.skill_key
                                )
                              }
                            >
                              {skill.skill_exam_status === 0 ? 'Take Assessment' : skill.skill_exam_status === 1 ? 'Pending' : 'Try Again'}
                            </Button>
                          ) : (
                              <Button
                                color="info"
                                size="lg"
                                className={classes.blockButton}
                              >
                                {skill.skill_exam_status === 3 ? 'Completed' : 'Pending'}
                              </Button>
                            )}
                        </div>
                      </Grid>
                    ))
                  ) : (
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          className={classes.py0 + " " + classes.textCenter}
                        >
                          No Skill Available
                      </Grid>
                      </Grid>
                    )}
                </Grid>
                {/* <Grid container className={classes.root} spacing={6}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <div className={`${classes.examBlock} ${classes.mb30}`}>
                    <img src={ExamIcon} className={classes.my50}></img>
                    <span className={`${classes.examName} ${classes.pb30}`}>Front-end</span>
                    <Button
                      color="info"
                      size="lg"
                      className={classes.blockButton}
                    >
                      Congratulations
                    </Button>
                  </div>
                </Grid>
              </Grid> */}
              </CardBody>
            </Card>
            {/* Modal Start */}
            <Dialog
              modalStyle={{
                root: classes.center,
                paper: classes.modal,
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
                <h4 className={classes.modalTitle}>Add New Skill</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer justify="center">
                  <GridItem xs={8}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Skill
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={this.state.skill_id}
                        onChange={this.handleSimple}
                        inputProps={{
                          name: "skill_id",
                          id: "simple-select",
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={0}
                        >
                          Select Skill
                        </MenuItem>
                        {this.state.career_path_skill_list.length > 0
                          ? this.state.career_path_skill_list.map((skill) => {
                            let my_skills = this.state.skill_list.map(myskill => myskill.skill_id)
                            if (!(my_skills.includes(skill.id))) {
                              console.log("my_skills", my_skills)
                              return (
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={skill.id}
                                >
                                  {skill.skill_name}
                                </MenuItem>
                              );
                            } else {
                              return null
                            }
                          })
                          : null}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
              </DialogContent>
              <DialogActions
                className={
                  classes.modalFooter +
                  " " +
                  classes.modalFooterCenter +
                  " " +
                  classes.root
                }
              >
                <Button
                  color="gray"
                  size="lg"
                  onClick={() => this.setModal(false)}
                  className={`${customStyle.outlineButton} ${customStyle.mt30} ${customStyle.mb30}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => this.addNewSkill(e)}
                  color="info"
                  size="lg"
                  className={`${customStyle.blockButton} ${customStyle.mt30} ${customStyle.mb30}`}
                >
                  + New Skill
                </Button>
              </DialogActions>
            </Dialog>
            {/* Modal Ends */}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('in maptoprops:',state);

  return {
    user: state.authReducer.user,
    skill_list: state.skillsReducer.skill_list,
    lastrefresh:state.skillsReducer.lastrefresh,
    career_path_skill_list: state.skillsReducer.career_path_skill_list,
  };
};

const mapDispatchToProps = {
  addStudentSkill,
  listStudent,
  listCareerPathSkill,
  changeStudentSillStatus,
  getProfileLatestData,
};
const combinedStyles = combineStyles(
  customStyle,
  useCustomSpace1,
  modalStyles,
  customSelect
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(SkillsAssesment));
