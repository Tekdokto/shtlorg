import {
  primaryColor,
  primaryBoxShadow,
  whiteColor,
  blackColor,
  grayColor,
  hexToRgb,
  // SHTUDY ADDED ADDED
  infoColor,
} from "assets/jss/material-dashboard-pro-react.js";

const customSelectStyle = (theme) => ({
  select: {
    whiteSpace: "normal",
    padding: "12px 0 7px",
    fontSize: "19px",
    fontWeight: "400",
    lineHeight: "1.42857",
    textDecoration: "none",
    // textTransform: "uppercase",
    color: infoColor[6],
    letterSpacing: "0",
    "&:focus": {
      backgroundColor: "transparent"
    },
    "&[aria-owns] + input + svg": {
      transform: "rotate(180deg)"
    },
    "& + input + svg": {
      transition: "all 300ms linear"
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "16px",
    },
  },
  selectFormControl: {
    margin: "7px 0 17px 0 !important",
    "& > div": {
      "&:before": {
        borderBottomWidth: "1px !important",
        borderBottomColor: grayColor[4] + "!important"
      },
      "&:after": {
        borderBottomColor: infoColor[0] + "!important"
      }
    }
  },
  selectLabel: {
    // SHTUDY ADDED ADDED
    fontSize: "16px",
    // textTransform: "uppercase",
    color: infoColor[0] + " !important",
    top: "0",
    fontWeight: "500",
    minWidth: "320px",
  },
  selectMenu: {
    "& > div > ul": {
      // SHTUDY ADDED ADDED
      border: "0",
      padding: "0",
      margin: "0",
      boxShadow: "none",
      minWidth: "100%",
      borderRadius: "4px",
      boxSizing: "border-box",
      display: "block",
      fontSize: "14px",
      textAlign: "left",
      listStyle: "none",
      backgroundColor: whiteColor,
      backgroundClip: "padding-box"
    },
    "& $selectPaper $selectMenuItemSelectedMultiple": {
      backgroundColor: "inherit"
    },
    "& > div + div": {
      maxHeight: "266px !important"
    }
  },
  selectMenuItem: {
    // SHTUDY ADDED ADDED
    fontSize: "19px",
    padding: "8px 20px",
    margin: "0 5px",
    borderRadius: "2px",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    textAlign: "center",
    fontWeight: "400",
    lineHeight: "2",
    whiteSpace: "normal",
    color: infoColor[6],
    paddingRight: "30px",
    borderTop: "1px solid " + infoColor[8],
    "&:hover": {
      backgroundColor: infoColor[12],
      color: infoColor[6],
      //...primaryBoxShadow
    }
  },
  selectMenuItemSelected: {
    backgroundColor: infoColor[0] + "!important",
    color: whiteColor,
    "&:hover": {
      color: whiteColor
    }
  },
  selectMenuItemSelectedMultiple: {
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: primaryColor[0] + "!important",
      color: whiteColor,
      ...primaryBoxShadow,
      "&:after": {
        color: whiteColor
      }
    },
    "&:after": {
      top: "16px",
      right: "12px",
      width: "12px",
      height: "5px",
      borderLeft: "2px solid " + infoColor[0],
      transform: "rotate(-45deg)",
      opacity: "1",
      color: grayColor[2],
      position: "absolute",
      content: "''",
      borderBottom: "2px solid " + infoColor[0],
      transition: "opacity 90ms cubic-bezier(0,0,.2,.1)"
    }
  },
  selectPaper: {
    boxSizing: "borderBox",
    borderRadius: "4px",
    padding: "0",
    minWidth: "100%",
    display: "block",
    border: "0",
    boxShadow: "0 2px 5px 0 rgba(" + hexToRgb(blackColor) + ", 0.26)",
    backgroundClip: "padding-box",
    margin: "2px 0 0",
    fontSize: "14px",
    textAlign: "left",
    listStyle: "none",
    backgroundColor: "transparent",
    maxHeight: "266px"
  }
});

export default customSelectStyle;
