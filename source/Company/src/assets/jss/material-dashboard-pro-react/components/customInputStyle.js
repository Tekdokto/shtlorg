import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont,
  whiteColor,
  grayColor,
  infoColor,
} from "assets/jss/material-dashboard-pro-react.js";

const customInputStyle = (theme) => ({
  disabled: {
    "&:before": {
      borderColor: "transparent !important",
    },
  },
  underline: {
    "&:hover:not($disabled):before,&:before": {
      borderColor: infoColor[8] + "!important",
      borderWidth: "1px !important",
    },
    "&:after": {
      borderColor: infoColor[0],
    },
    "& + p": {
      fontWeight: "300",
    },
  },
  underlineError: {
    "&:after": {
      borderColor: dangerColor[0],
    },
  },
  underlineSuccess: {
    "&:after": {
      borderColor: successColor[0],
    },
  },
  labelRoot: {
    ...defaultFont,
    color: infoColor[0] + " !important",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "1.42857",
    top: "10px",
    letterSpacing: "unset",
    "& + $underline": {
      marginTop: "0px",
    },
  },
  labelRootError: {
    color: dangerColor[0] + " !important",
  },
  labelRootSuccess: {
    color: successColor[0] + " !important",
  },
  formControl: {
    margin: "0 0 10px 0",
    paddingTop: "27px",
    position: "relative",
    verticalAlign: "unset",
    "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
      color: grayColor[14],
    },
  },
  whiteUnderline: {
    "&:hover:not($disabled):before,&:before": {
      backgroundColor: whiteColor,
    },
    "&:after": {
      backgroundColor: whiteColor,
    },
  },
  input: {
    color: infoColor[3],
    height: "unset",
    "&,&::placeholder": {
      fontSize: "19px",
      fontWeight: "400",
      lineHeight: "1.42857",
      opacity: "1",
    },
    "&::placeholder": {
      color: grayColor[3],
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "16px",
    },
  },
  whiteInput: {
    "&,&::placeholder": {
      color: whiteColor,
      opacity: "1",
    },
  },
});

export default customInputStyle;
