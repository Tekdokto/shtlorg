import {
  containerFluid,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
  infoBoxShadow,
  hexToRgb,
  blackColor,
  drawerWidth,
  drawerMiniWidth,
} from "assets/jss/material-dashboard-pro-react.js";

const headerStyle = () => ({
  appBar: {
    backgroundColor: whiteColor,
    boxShadow:
      "0 0px 3px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.42), 0 1px 10px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 3px 3px -10px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    borderBottom: "0",
    marginBottom: "0",
    position: "fixed",
    width: "100%",
    paddingTop: "10px",
    zIndex: "1029",
    color: grayColor[6],
    border: "0",
    borderRadius: "3px",
    padding: "10px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block",
  },
  container: {
    ...containerFluid,
    minHeight: "50px",
  },
  flex: {
    flex: 1,
  },
  title: {
    ...defaultFont,
    lineHeight: "30px",
    fontSize: "18px",
    borderRadius: "3px",
    textTransform: "none",
    color: "inherit",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    margin: "0 !important",
    letterSpacing: "unset",
    "&:hover,&:focus": {
      background: "transparent",
    },
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  sidebarMinimize: {
    float: "left",
    padding: "0 0 0 31px",
    display: "block",
    color: grayColor[6],
    position: "absolute",
    left: drawerWidth,
    top: "11px",
  },
  sidebarMinimizeRTL: {
    padding: "0 15px 0 0 !important",
  },
  sidebarMiniIcon: {
    width: "20px",
    height: "17px",
  },
  menuIcon: {
    paddingLeft: "15px",
  },
});

export default headerStyle;
