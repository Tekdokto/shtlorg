import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";

// core components
import AdminNavbarLinks from "./AdminNavbarLinks";
import Button from "components/CustomButtons/Button.js";

import MenuIcon from "../../assets/img/menu-icon.svg";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarStyle.js";
import { image } from "assets/img/faces/card-profile1-square.jpg";

import { APP_URL } from "constants/defaultValues.js"

const useStyles = makeStyles(styles);

export default function AdminNavbar(props) {
  const classes = useStyles();
  const { color, rtlActive, brandText } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color,
  });
  const sidebarMinimize =
    classes.sidebarMinimize +
    " " +
    cx({
      [classes.sidebarMinimizeRTL]: rtlActive,
    });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css">
          <div className={sidebarMinimize + 'small-left'}>
            {props.miniActive ? (
              <Button
                simple
                onClick={props.sidebarMinimize}
                className={classes.menuIcon}
              >
                <img src={MenuIcon}></img>
              </Button>
            ) : (
                <Button
                  simple
                  onClick={props.sidebarMinimize}
                  className={classes.menuIcon}
                >
                  {/* <MoreVert className={classes.sidebarMiniIcon} /> */}
                  <img src={MenuIcon}></img>
                </Button>
              )}
          </div>
        </Hidden>

        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Hidden mdUp>
            <Button href={APP_URL} className={classes.title} color="transparent">
              SHTUDY
            </Button>
          </Hidden>
        </div>


        <Hidden smDown implementation="css">
          <AdminNavbarLinks rtlActive={rtlActive} {...props} />
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

AdminNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  brandText: PropTypes.string,
  miniActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  sidebarMinimize: PropTypes.func,
};
