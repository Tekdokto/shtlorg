import React from "react";
import { connect } from "react-redux";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

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

import Table from "components/Table/Table.js";
import Link from "@material-ui/core/Link";

import CloseIcon from "../../assets/img/close-icon.svg"


import filterIcon from "../../assets/img/filter-icon.svg";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";
import combineStyles from '../../combineStyles';

import Accordion from "components/Accordion/Accordion.js";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel"
// @material-ui/icons
import Check from "@material-ui/icons/Check";

import ListIcon from '@material-ui/icons/List';
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "constants/defaultValues.js";
import { logoutUser } from "../../redux/action";
import { APP_URL } from "constants/defaultValues.js"



// const useStyles = makeStyles(styles);
// const useCustomStyle = makeStyles(customStyle);

// const classes = useStyles();
// const customStyle = useCustomStyle();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.redirectToAddWatchList = this.redirectToAddWatchList.bind(this);
    this.state = {
      active_watchlist: 0,
      company_name: " - ",
      pending_interview: "0",
      total_hired: "0",
      total_inflight: "0",
      watchlist: []
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

  componentDidMount() {
    let ths = this;
    this.fetchDashboardList(this.props.user.user_id)
    ths.showLoader();
    setTimeout(() => {
      ths.hideLoader()
    }, 500)
  }
  redirectToAddWatchList() {
    this.props.history.push("/company/addwatchlist")
  }
  async fetchDashboardList(id) {
    let params = {}
    params.user_id = this.props.user.user_id;
    let formdata = new FormData()
    formdata.append('user_id', this.props.user.user_id)
    let response = await this.fetchDashboardCall(formdata);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push('/company/dashboard')
      } else {
        if (response.data) {
          // console.log("SPECSHEET DATTA:",response)
          this.setState({
            active_watchlist: response.data.active_watchlist,
            company_name: response.data.company_name,
            pending_interview: response.data.pending_interview,
            total_hired: response.data.total_hired,
            total_inflight: response.data.total_inflight,
            watchlist: response.data.watchlist
          })
        }
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchDashboardCall(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }

    const res = await axios.post(`${API_URL}/company/user/getdashboard`, params, headers);
    return await res.data;
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer className="dashboard-title">
          <GridItem xs={12}>
            <h1>Company: {this.state.company_name}</h1>
          </GridItem>
          <GridItem xs={12}>
            <Button
              color="info"
              className={`${classes.newButton} ${classes.mt30} ${classes.mb30}`}
              onClick={this.redirectToAddWatchList}
            >
              Hire Talent
            </Button>
          </GridItem>
          <GridItem xs={12}>
            <h5>Start adding talent to your pipeline now!</h5>
          </GridItem>          
        </GridContainer>
        <GridContainer spacing={10}>
          <GridItem xs={12} lg={8} className="dashboard-blocks">
            <Grid container className={classes.root} spacing={4}>
              <Grid item md={6} xs={12} className={classes.pb0}>
                <a href={APP_URL+"/company/currentinterviews"}>
                  <Card className="paddingTopBottom cardCustom mb0">
                    <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                      Total Candidates in Pipeline
                  </CardHeader>
                    <CardBody className="cardCustomBody py0">
                      <span className={classes.generalCounts}>
                        {this.state.total_inflight}
                      </span>
                    </CardBody>
                  </Card>
                </a>
              </Grid>
              <Grid item md={6} xs={12} className={`${classes.pb0}`}>
                <a href={APP_URL+"/company/confirmation"}>
                  <Card className="paddingTopBottom cardCustom mb0">
                    <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                      People Hired
                  </CardHeader>
                    <CardBody className="cardCustomBody py0">
                      <span className={classes.generalCounts}>
                        {this.state.total_hired}
                      </span>
                    </CardBody>
                  </Card>
                </a>
              </Grid>
            </Grid>
            <Grid container className={classes.root} spacing={4}>
              <Grid item md={6} xs={12} className={`${classes.pt0}`}>
                <a href={APP_URL+"/company/watchlist"}>
                  <Card className="paddingTopBottom cardCustom mb0">
                    <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                      My Openings
                  </CardHeader>
                    <CardBody className="cardCustomBody py0">
                      <span className={classes.generalCounts}>
                        {this.state.active_watchlist}
                      </span>
                    </CardBody>
                  </Card>
                </a>
              </Grid>
              <Grid item md={6} xs={12} className={`${classes.pt0}`}>
                <a href={APP_URL+"/company/callrequest"}>
                  <Card className="paddingTopBottom cardCustom mb0">
                    <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                      Pending Interview Request
                  </CardHeader>
                    <CardBody className="cardCustomBody py0">
                      <span className={classes.generalCounts}>
                        {this.state.pending_interview}
                      </span>
                    </CardBody>
                  </Card>
                </a>
              </Grid>
            </Grid>
          </GridItem>
          <GridItem xs={12} lg={4} className="dashboard-blocks">
            <a href={APP_URL+"/company/watchlist"}>
              <Card className="paddingTopBottom cardCustom tempMinHeight">
                <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                  My Openings
              </CardHeader>
                <CardBody className="cardCustomBody">
                  <Grid container>
                    <Grid xs={12} sm={12}>
                      <ul className="simple-list">
                        {(this.state.watchlist.length > 0) ? this.state.watchlist.map((wL) =>
                          <li>{wL.role_title}</li>
                        ) : <li>My openings not available</li>
                        }
                        {/* <li>
                        Qualification Information
                      </li>
                      <li>
                        Technical Assessment
                      </li>
                      <li>
                        Interview Prep Library
                      </li>
                      <li>Mock Interview</li>
                      <li>Interview Scheduler</li> */}
                      </ul>
                    </Grid>
                  </Grid>
                </CardBody>
              </Card>
            </a>
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
  };
};

const mapDispatchToProps = { logoutUser };
const combinedStyles = combineStyles(customStyle, styles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(Dashboard))