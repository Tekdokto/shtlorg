import {
  primaryColor,
  infoColor,
  grayColor
} from "assets/jss/material-dashboard-pro-react.js";

const accordionStyle = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px"
  },
  expansionPanel: {
    boxShadow: "none",
    "&:before": {
      display: "none !important"
    }
  },
  expansionPanelExpanded: {
    margin: "0 !important"
  },
  expansionPanelSummary: {
    minHeight: "auto !important",
    backgroundColor: "transparent",
    borderBottom: "1px solid " + grayColor[5],
    padding: "25px 10px 5px 0px",
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "3px",
    paddingLeft: "30px",
    paddingRight: "30px",
    color: grayColor[2],
    "&:hover": {
      color: primaryColor[0]
    }
  },
  expansionPanelSummaryExpaned: {
    color: primaryColor[0],
    "& $expansionPanelSummaryExpandIcon": {
      [theme.breakpoints.up("md")]: {
        top: "auto !important"
      },
      transform: "rotate(180deg)",
      [theme.breakpoints.down("sm")]: {
        top: "10px !important"
      }
    }
  },
  expansionPanelSummaryContent: {
    margin: "0 !important"
  },
  expansionPanelSummaryExpandIcon: {
    [theme.breakpoints.up("md")]: {
      top: "auto !important"
    },
    transform: "rotate(0deg)",
    color: "inherit",
    position: "absolute",
    right: "20px",
    [theme.breakpoints.down("sm")]: {
      top: "10px !important"
    }
  },
  expansionPanelSummaryExpandIconExpanded: {},
  title: {
    fontSize: "28px",
    fontWeight: "500",
    marginTop: "0",
    marginBottom: "10px",
    color: infoColor[0],
    [theme.breakpoints.down("lg")]: {
      fontSize: "16px",
    },
  },
  expansionPanelDetails: {
    padding: "15px 0px 5px"
  }
});

export default accordionStyle;
