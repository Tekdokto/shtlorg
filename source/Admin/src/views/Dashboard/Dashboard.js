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
import { logoutUser, dashboard } from "../../redux/action";




// const useStyles = makeStyles(styles);
// const useCustomStyle = makeStyles(customStyle);

// const classes = useStyles();
// const customStyle = useCustomStyle();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      active_watchlist: 0,
      company_name: " - ",
      pending_interview: "0",
      total_hired: "0",
      total_inflight: "0",
      watchlist: [],
      dashboard_count: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      user: props.user,
      dashboard_count: props.dashboard_count
    }
  }

  componentDidMount() {
    let ths = this;
    this.props.dashboard({ admin_id: this.props.user.user_id })
  }

  render() {
    console.log("dashboard_count", this.state.dashboard_count)
    const { classes } = this.props;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>Admin Panel</h1>
            <h5>Admin stats</h5>
          </GridItem>

        </GridContainer>
        <GridContainer spacing={10}>
          <GridItem xs={12} lg={12} className="dashboard-blocks">
            <Grid container className={classes.root} spacing={4}>
              <Grid item md={6} xl={4} xs={12} className={classes.pb0}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Total Engineers
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_engineers ? this.state.dashboard_count.total_engineers : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pb0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    New Engineers This Month
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_new_engineers_this_month ? this.state.dashboard_count.total_new_engineers_this_month : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Total Hired Engineers
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_hired ? this.state.dashboard_count.total_hired : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Engineers Hired This Month
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_hired_this_month ? this.state.dashboard_count.total_hired_this_month : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Total Company Users
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_company_users ? this.state.dashboard_count.total_company_users : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    New Company Users This Month
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_company_users_this_month ? this.state.dashboard_count.total_company_users_this_month : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Pending Mock Interview Request
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_pending_mock_interview ? this.state.dashboard_count.total_pending_mock_interview : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Total Active Watchlist
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_active_watchlist ? this.state.dashboard_count.total_active_watchlist : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
              <Grid item md={6} xl={4} xs={12} className={`${classes.pt0}`}>
                <Card className="paddingTopBottom cardCustom mb0">
                  <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                    Watchlist Closed This Month
                </CardHeader>
                  <CardBody className="cardCustomBody py0">
                    <span className={classes.generalCounts}>
                      {(this.state.dashboard_count) ? (this.state.dashboard_count.total_watchlist_closed_this_month ? this.state.dashboard_count.total_watchlist_closed_this_month : 0) : 0}
                    </span>
                  </CardBody>
                </Card>
              </Grid>
            </Grid>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('in maptoprops:', state);
  return {
    user: state.authReducer.user,
    dashboard_count: state.authReducer.dashboard_count
  };
};

const mapDispatchToProps = { logoutUser, dashboard };
const combinedStyles = combineStyles(customStyle, styles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(Dashboard))