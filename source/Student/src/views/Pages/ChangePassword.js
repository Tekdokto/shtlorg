import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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
import EditIcon from "@material-ui/icons/Edit";

import Link from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";

import EditProfilePic from "../../assets/img/edit-profile-pic.png";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import customStyle from "assets/jss/customStyle";

import ExamIcon from "assets/img/exam-icon.svg";

const useStyles = makeStyles(styles);
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomStyle = makeStyles(customStyle);

export default function Dashboard() {
  const classes = useStyles();
  const customStyle = useCustomStyle();
  const classesCustom = useCustomSpace();
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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
          <h1>Change Password</h1>
          <h5>Change your password</h5>
        </GridItem>
      </GridContainer>
      <GridContainer spacing={10}>
        <GridItem
          xs={12}
          sm={6}
          md={6}
          lg={5}
          className={customStyle.centerBlock}
        >
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Reset your password
            </CardHeader>
            <CardBody className="cardCustomBody">
              <CustomInput
                labelText="New Password"
                id="passwordLog"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "password",
                  autoComplete: "off",
                }}
              />
              <CustomInput
                labelText="Comfirm New Password"
                id="confPassword"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "password",
                  autoComplete: "off",
                }}
              />

              <Grid item xs={12} className={customStyle.textCenter}>
                <Button
                  color="info"
                  size="lg"
                  className={`${customStyle.blockButton} ${customStyle.mt30}`}
                >
                  Change Password
                </Button>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
