import {
  container,
  cardTitle,
  whiteColor,
  grayColor,
  containerFluid,
  infoColor,
} from "assets/jss/material-dashboard-pro-react.js";

const loginPageStyle = (theme) => ({
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px",
    },
  },
  containerFluid: {
    zIndex: 3,
    ...containerFluid,
    position: "relative",
    width: "84%",
    [theme.breakpoints.down("md")]: {
      width: "96%",
    },
  },
  cardTitle: {
    ...cardTitle,
    color: whiteColor,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  justifyContentCenter: {
    justifyContent: "center !important",
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: whiteColor,
    },
    marginLeft: "5px",
    marginRight: "5px",
  },
  inputAdornment: {
    marginRight: "18px",
  },
  inputAdornmentIcon: {
    color: grayColor[6],
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)",
  },
  cardHeader: {
    marginBottom: "0",
    marginTop: "0",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  socialLine: {
    padding: "0.9375rem 0",
  },
  logLeftContentH2: {
    fontSize: "40px",
    color: infoColor[6],
    fontWeight: "500",
    marginBottom: "50px",
    marginTop: "0",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
      marginTop: "50px",
      marginBottom: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
      lineHeight: "30px",
      marginBottom: "20px",
    },
  },
  logLeftContentP: {
    fontSize: "30px",
    color: infoColor[6],
    lineHeight: "42px",
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
      lineHeight: "30px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "18px",
      lineHeight: "30px",
    },
  },
  logLeftContentH3: {
    fontSize: "36px",
    color: infoColor[0],
    fontWeight: "500",
    marginTop: "50px",
    marginBottom: "60px",
    [theme.breakpoints.down("md")]: {
      fontSize: "22px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
      marginTop: "30px",
      marginBottom: "30px",
    },
  },
  logArrows: {
    marginLeft: "50px",
    marginRight: "50px",
    [theme.breakpoints.down("lg")]: {
      marginLeft: "20px",
      marginRight: "20px",
    },
  },
  logButton: {
    padding: "20px 5rem",
    fontSize: "20px",
    borderRadius: "5px",
    margin: "15px 0",
  },
  forgotLink: {
    fontSize: "19px",
    color: infoColor[5],
    fontWeight: "300",
    marginTop: "21px",
    marginBottom: "15px",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0",
    },
  },
  singUpBlock: {
    margin: "20px 0 30px",
    fontSize: "14px",
    color: infoColor[7],
  },
  singUpBlock1: {
    margin: "20px 0 10px",
  },
  signUpLink: {
    fontSize: "14px",
    fontWeight: "500",
    color: infoColor[0],
  },
  rememberOne: {
    fontSize: "19px",
    fontWeight: "500",
  },
  logCardHeaderTitle: {
    fontSize: "30px",
    color: infoColor[6],
  },
  bodyPadding: {
    padding: "0 30px",
    marginLeft: "0",
    marginRight: "0",
  },
  logSubTitle: {
    fontSize: "16px",
    color: infoColor[5],
    marginTop: "30px",
    display: "block",
  },
  mb30: {
    marginBottom: "30px",
  },
});

export default loginPageStyle;
