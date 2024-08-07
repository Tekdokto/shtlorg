import {
  defaultFont,
  container,
  containerFluid,
  primaryColor,
  whiteColor,
  grayColor,
  infoColor,
} from "assets/jss/material-dashboard-pro-react.js";

const footerStyle = {
  block: {},
  left: {
    float: "left!important",
    display: "block",
  },
  right: {
    margin: "0",
    fontSize: "14px",
    float: "right!important",
    padding: "15px",

    textAlign: 'center'
  },
  footer: {
    bottom: "0",
    borderTop: "1px solid " + infoColor[11],
    padding: "0",
    ...defaultFont,
    zIndex: 4,
  },
  container: {
    zIndex: 3,
    ...container,
    position: "relative",
  },
  containerFluid: {
    zIndex: 3,
    ...containerFluid,
    position: "relative",
  },
  a: {
    color: primaryColor[0],
    textDecoration: "none",
    backgroundColor: "transparent",
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0",
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0",
    width: "auto",
  },
  whiteColor: {
    "&,&:hover,&:focus": {
      color: whiteColor,
    },
  },
  infoColor: {
    ...infoColor,
    fontWeight: "400",
    "&, &:hover, &:focus": {
      color: infoColor[5],
    },
  },
  copyRight: {
    fontSize: "16px",
    color: infoColor[5],
    marginBottom: "17px",
    marginTop: "15px"
  },
  footerLinks: {
    fontSize: "16px",
  },
};
export default footerStyle;
