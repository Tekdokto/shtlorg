import {
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  infoBoxShadow,
  successColor,
  successBoxShadow,
  warningColor,
  warningBoxShadow,
  dangerColor,
  dangerBoxShadow,
  roseColor,
  roseBoxShadow,
  whiteColor,
  blackColor,
  grayColor,
  hexToRgb,
  customDib,
} from "assets/jss/material-dashboard-pro-react.js";

const CustomStyle = (theme) => ({
  my0: {
    marginTop: "0",
    marginBottom: "0",
  },
  mt15: {
    marginTop: "15px",
  },
  mb15: {
    marginBottom: "15px",
  },
  ml15: {
    marginLeft: "15px",
  },
  mr15: {
    marginRight: "15px",
  },
  m30: {
    margin: "30px",
  },
  mt20: {
    marginTop: "20px",
  },
  mb20: {
    marginBottom: "20px",
  },
  ml20: {
    marginLeft: "20px",
  },
  mr20: {
    marginRight: "20px",
  },
  mt30: {
    marginTop: "30px",
  },
  mb30: {
    marginBottom: "30px",
  },
  ml30: {
    marginLeft: "30px",
  },
  mr30: {
    marginRight: "30px",
  },
  my50: {
    marginTop: "50px",
    marginBottom: "50px",
  },
  mt50: {
    marginTop: "50px",
  },
  mb50: {
    marginBottom: "50px",
  },
  ml50: {
    marginLeft: "50px",
  },
  mr50: {
    marginRight: "50px",
  },
  py0: {
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
  },
  py30: {
    paddingTop: "30px",
    paddingBottom: "30px",
  },
  pt0: {
    paddingTop: "0",
  },
  pb0: {
    paddingBottom: "0 !important",
  },
  pl0: {
    paddingLeft: "0",
  },
  pr0: {
    paddingRight: "0 !important",
  },
  pt5: {
    paddingTop: "5px",
  },
  pb5: {
    paddingBottom: "5px",
  },
  pl5: {
    paddingLeft: "5px",
  },
  pr5: {
    paddingRight: "5px",
  },
  pt10: {
    paddingTop: "10px",
  },
  pb10: {
    paddingBottom: "10px",
  },
  pl10: {
    paddingLeft: "10px",
  },
  pr10: {
    paddingRight: "10px",
  },
  pt15: {
    paddingTop: "15px",
  },
  pb15: {
    paddingBottom: "15px",
  },
  pl15: {
    paddingLeft: "15px",
  },
  pr15: {
    paddingRight: "15px",
  },
  px30: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  pt30: {
    paddingTop: "30px",
  },
  pb30: {
    paddingBottom: "30px",
  },
  pl30: {
    paddingLeft: "30px",
  },
  pr30: {
    paddingRight: "30px",
  },
  py50: {
    paddingTop: "50px",
    paddingBottom: "50px",
  },
  px50: {
    paddingLeft: "50px",
    paddingRight: "50px",
  },
  primaryColor: {
    color: infoColor[0],
  },
  mtResp30: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "30px",
    },
  },
  opacity7: {
    opacity: "0.7",
  },
  rightLeftResponsive: {
    textAlign: "right",
  },
  rightLeftResponsiveMdDown: {
    textAlign: "right",
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
    },
  },
  h2: {
    fontSize: "30px",
    color: blackColor,
    fontWeight: "500",
  },
  h4: {
    fontSize: "23px",
    color: blackColor,
    marginTop: "0",
    fontWeight: "500",
  },
  centerBlock: {
    margin: "auto",
  },
  textCenter: {
    textAlign: "center",
  },
  dBlock: {
    display: customDib[1],
  },
  dInlineBlock: {
    display: customDib[0],
  },
  outlineButton: {
    background: "transparent",
    border: "1px solid " + infoColor[0],
    color: infoColor[0],
    fontSize: "1rem",
    padding: "1rem 1.5rem",
  },
  examBlock: {
    display: customDib[1],
    border: "1px solid " + infoColor[0],
    borderRadius: "13px",
    padding: "50px",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      marginBottom: "0",
      padding: "20px",
    },
  },
  examName: {
    display: customDib[1],
    fontSize: "20px",
    fontWeight: "600",
  },
  blockButton: {
    fontSize: "1rem",
    textTransform: "none",
  },
  newButton: {
    fontSize: "22px",
    textTransform: "none",
    [theme.breakpoints.down("lg")]: {
      fontSize: "20px",
    },
  },
  imgEditIcnButton: {
    fontSize: "22px",
    textTransform: "none",
    padding: "7px 5px",
    borderRadius: "20px",
    float: "right",
    marginTop: "-10px",
    marginRight: "30px",
  },
  labelIconButton: {
    fontSize: "22px",
    textTransform: "none",
    padding: "5px",
    borderRadius: "20px",
    marginLeft: "10px",
    "& svg": {
      margin: "0",
      width: "12px",
      height: "12px",
    },
  },
  listItems: {
    border: "1px solid" + infoColor[8],
    borderTop: "none",
    padding: "25px 30px",
    "&:first-child": {
      borderTop: "1px solid" + infoColor[8],
    },
    "&:hover": {
      background: infoColor[8],
      cursor: "pointer",
    },
  },
  listIcon: {
    width: "30px",
    height: "30px",
    color: infoColor[0],
  },
  listCompletedIcon: {
    color: infoColor[17],
  },
  myProfileName: {
    fontSize: "30px",
    display: customDib[1],
  },
  myProfileImg: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "75px",
  },
  dateJoin: {
    fontSize: "18px",
    display: customDib[1],
  },
  jobLook: {
    fontSize: "26px",
    [theme.breakpoints.down("lg")]: {
      fontSize: "18px",
    },
  },
  hired: {
    fontSize: "26px",
    fontWeight: "500",
  },
  profilePicEdit: {
    position: "relative",
    maxWidth: "150px",
    maxHeight: "150px",
    margin: "0 auto",
  },
  editBtn: {
    padding: "10px 8px",
    borderRadius: "100%",
    position: "absolute",
    bottom: "0",
    right: "5px",
    left: "unset",
    margin: "auto",
  },
  selectedTime: {
    fontSize: "30px",
    color: blackColor,
  },
  selectedTimeDate: {
    display: customDib[1],
    color: infoColor[17],
  },
  notClearText: {
    display: customDib[1],
    textAlign: "center",
    fontSize: "1.5rem",
    color: infoColor[18],
  },
  resultsBlock: {
    display: customDib[1],
    fontSize: "1.5rem",
    lineHeight: "2.5rem",
  },
  examinerName: {
    display: customDib[1],
    fontSize: "3rem",
    padding: "30px 0",
    fontWeight: "500",
  },
  generalCounts: {
    fontSize: "2.3rem",
    color: infoColor[0],
    fontWeight: "500",
  },
  filterIcon: {
    float: "right",
    marginTop: "5px",
  },
  filterBar: {
    position: "fixed",
    right: "0",
    top: "0",
    zIndex: "9999",
    width: "400px",
    padding: "10vh 0",
    height: "100vh",
    backgroundColor: whiteColor,
    boxShadow: "-3px -6px 15px " + grayColor[4],
    "& h3": {
      fontSize: "28px",
      padding: "0 30px",
    },
  },
  filterCloseIcon: {
    float: "right",
    marginTop: "5px",
  },
  filterOptions: {
    display: customDib[1],
  },
  simpleList: {
    display: customDib[1],
    margin: "0",
    padding: "0",
    listStyle: "none",
    "& li": {
      fontSize: "28px",
      padding: "0 0 10px",
      fontSize: "18px",
    },
  },
  bigCalendarTop: {
    display: customDib[2],
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarMonth: {
    fontSize: "26px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  candidateInfo: {
    fontSize: "24px",
    color: infoColor[3],
    "& span": {
      display: "block",
      marginBottom: "5px",
      fontSize: "14px",
      fontWeight: "600",
      color: infoColor[0],
    },
  },
  highlighText: {
    color: infoColor[17] + "!important",
  },
  contentp: {
    color: infoColor[6],
  }
});

export default CustomStyle;
