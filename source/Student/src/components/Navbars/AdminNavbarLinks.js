import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";

// @material-ui/icons
// import Person from "@material-ui/icons/KeyboardDownArrow";
// import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
// import Search from "@material-ui/icons/Search";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import ProfilePic from "../../assets/img/profile-icon.png";
import defaultAvatar from "../../assets/img/default-avatar.png"
import DownArrow from "../../assets/img/down-arrow.svg";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const [alert, setAlert] = React.useState(null);
  const warningWithConfirmAndCancelMessage = (event) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title="Are you sure you want to sign out?"
        onConfirm={() => handleLogoutProfile()}
        onCancel={() => setAlert(null)}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.info}
        confirmBtnText="Sign Out"
        cancelBtnText="Cancel"
        showCancel
      />
    );
  };
  const handleLogoutProfile = () => {
 
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('edit_user');
    localStorage.removeItem('userdata');
    history.push('/auth/login')
    setOpenProfile(null);
  }
  const redirectChangePassword = () => {
    history.push('/candidate/changepassword')
    setOpenProfile(null);
  }
  const redirectMyProfile = () => {
    history.push('/candidate/profile')
    setOpenProfile(null);
  }
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const { rtlActive,history } = props;
  const searchButton =
    classes.top +
    " " +
    classes.searchButton +
    " " +
    classNames({
      [classes.searchRTL]: rtlActive,
    });
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive,
  });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive,
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true,
  }); 
  const Imagepreview = React.forwardRef((props, ref) => (    
    // onError={()=>{ref.src =defaultAvatar}}
    <img ref={ref} src={(props.authUser)?((props.authUser.profile_pic)?props.authUser.profile_pic:defaultAvatar):defaultAvatar} className="top-profile-pic" ></img>
  ));
  const ref = React.createRef();
  // console.log("Useer:",props)
  return (
    <div className={wrapper}>
      {/* <CustomInput
        rtlActive={rtlActive}
        formControlProps={{
          className: classes.top + " " + classes.search,
        }}
        inputProps={{
          placeholder: rtlActive ? "بحث" : "Search",
          inputProps: {
            "aria-label": rtlActive ? "بحث" : "Search",
            className: classes.searchInput,
          },
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        className={searchButton}
      >
        <Search className={classes.headerLinksSvg + " " + classes.searchIcon} />
      </Button> */}
      {/* <Button
        color="transparent"
        simple
        aria-label="Dashboard"
        justIcon
        className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
        muiClasses={{
          label: rtlActive ? classes.labelRTL : ""
        }}
      >
        <Dashboard
          className={
            classes.headerLinksSvg +
            " " +
            (rtlActive ? classes.links + " " + classes.linksRTL : classes.links)
          }
        />
        <Hidden mdUp implementation="css">
          <span className={classes.linkText}>
            {rtlActive ? "لوحة القيادة" : "Dashboard"}
          </span>
        </Hidden>
      </Button> */}
      <div className={managerClasses}>
        {/* <Button
          color="transparent"
          justIcon
          aria-label="Notifications"
          aria-owns={openNotification ? "notification-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Notifications
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <span className={classes.notifications}>5</span>
          <Hidden mdUp implementation="css">
            <span
              onClick={handleClickNotification}
              className={classes.linkText}
            >
              {rtlActive ? "إعلام" : "Notification"}
            </span>
          </Hidden>
        </Button> */}
        <Popper
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openNotification,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "إجلاء أوزار الأسيوي حين بل, كما"
                        : "Mike John responded to your email"}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "شعار إعلان الأرضية قد ذلك"
                        : "You have 5 new tasks"}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "ثمّة الخاصّة و على. مع جيما"
                        : "You're now friend with Andrew"}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ? "قد علاقة" : "Another Notification"}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ? "قد فاتّبع" : "Another One"}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      <div className={managerClasses}>       
        {/* <img ref={ref} src={(props.authUser)?((props.authUser.profile_pic)?props.authUser.profile_pic:defaultAvatar):defaultAvatar} className="top-profile-pic" onError={()=>{ref.src=defaultAvatar;}}></img> */}
        <Imagepreview ref={ref} {...props}/>
        <span className={classes.profileName}>{(props.authUser)?((props.authUser.first_name)?props.authUser.first_name+" "+(props.authUser.last_name?props.authUser.last_name:""):""):""}</span>
        <Button
          color="transparent"
          aria-label="DownArrow"
          justIcon
          aria-owns={openProfile ? "profile-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={`${
            rtlActive ? classes.buttonLinkRTL : classes.buttonLink
            } ${classes.downArrow}`}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : "",
          }}
          style={{ display: "inline-block", marginTop: "0" }}
        >
          {/* <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          /> */}
          <img src={DownArrow}></img>

          <Hidden mdUp implementation="css">
            <span onClick={handleClickProfile} className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : ""}
            </span>
          </Hidden>
        </Button>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list"
              style={{ transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={redirectMyProfile}
                      className={dropdownItem}
                    >
                      {rtlActive ? "الملف الشخصي" : "Profile"}
                    </MenuItem>
                    <MenuItem
                      onClick={redirectChangePassword}
                      className={dropdownItem}
                    >
                      {rtlActive ? "الإعدادات" : "Change Password"}
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={warningWithConfirmAndCancelMessage}
                      className={dropdownItem}
                    >
                      {rtlActive ? "الخروج" : "Log out"}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        {alert}
      </div>
      </div>
  );
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool,
  authUser : PropTypes.object
};
