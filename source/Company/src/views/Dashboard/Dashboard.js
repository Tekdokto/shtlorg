import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import ProfilePic from "../../assets/img/profile-pic.png";
import CalendarIcon from "../../assets/img/calendar-icon.svg";
import MailIcon from "../../assets/img/mail-icon.svg";
import UniversityIcon from "../../assets/img/university-icon.svg";
import CheckLiIcon from "../../assets/img/check-li.svg";
import TempGraph from "../../assets/img/temp-graph.png";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { classnames } from "classnames";
import { Home } from "@material-ui/icons/Home";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div className="main-right-panel">
      <GridContainer>
        <Hidden xsDown>
          <GridItem xs={12}>
            <ul className="custom-breadcrumb">
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">Skill Assessment</Link>
              </li>
              <li>
                <Link href="#">Interview Preperation</Link>
              </li>
              <li>
                <Link href="#">Interviewing</Link>
              </li>
              <li className="last-child">
                <Link href="#">Hired!</Link>
              </li>
            </ul>
          </GridItem>
        </Hidden>

        <GridItem xs={12}>
          <h1>Welcome Eliza Hart!</h1>
          <h5>Check your progress</h5>
        </GridItem>
      </GridContainer>
      <GridContainer spacing={10}>
        <GridItem xs={12} lg={7}>

          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Candidate Profile
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container>
                <Grid>
                  <img src={ProfilePic} className="profileImage"></img>
                </Grid>
                <Grid xs={12} sm={7} md={6} lg={8}>
                  <Grid className="userName">Eliza Hart</Grid>
                  <Grid>
                    <ul className="userInfo">
                      <li>
                        <img src={CalendarIcon}></img> Oct 24,2020
                      </li>
                      <li>
                        <img src={MailIcon}></img> eliza.h@gmail.com
                      </li>
                      <li>
                        <img src={UniversityIcon}></img> LSU University
                      </li>
                    </ul>
                  </Grid>
                  <Grid className="skills">
                    <span>Skills:</span> JAVA, My SQL, PHP, React, AWS
                  </Grid>
                  <Grid className="skills">
                    <span>Status:</span> Actively looking for job
                  </Grid>
                </Grid>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={5}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Shtudy Progress
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Grid container>
                <Grid sm={5} xs={12}>
                  <CircularProgressbar
                    value={33}
                    text={`${33}%`}
                    circleRatio={0.75}
                    styles={buildStyles({
                      rotation: 1 / 2 + 1 / 8,
                      strokeLinecap: "butt",
                      trailColor: "#eee",
                    })}
                  />
                </Grid>
                <Grid xs={12} sm={7}>
                  <ul className="simple-list">
                    <li>
                      Qualification Information{" "}
                      <img src={CheckLiIcon} className="check-icon"></img>
                    </li>
                    <li>
                      Technical Assessment
                      <img src={CheckLiIcon} className="check-icon"></img>
                    </li>
                    <li>
                      Interview Prep Library
                      <img src={CheckLiIcon} className="check-icon"></img>
                    </li>
                    <li>Mock Interview</li>
                    <li>Interview Scheduler</li>
                  </ul>
                </Grid>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Companies Interested
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Table
                striped
                tableHead={[
                  "#",
                  "Company",
                  "Position",
                  "Place",
                  "Salary",
                  "Interviewed",
                ]}
                tableData={[
                  ["1", "IBM", "Software Engineer", "NY", "$9000", "Yes"],
                  ["2", "Apple", "Data Analyst", "BOS", "$10000", "Yes"],
                  ["3", "Microsoft", "Data Analyst", "NY", "$9000", "No"],
                ]}
                customCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customClassesForCells={[0, 5, 6]}
                customHeadCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customHeadClassesForCells={[0, 5, 6]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
