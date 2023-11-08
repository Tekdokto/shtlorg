/*eslint-disable*/
//changesv1
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {config} from "../../helpers/config.js"
import styles from "assets/jss/material-dashboard-pro-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { fluid, white, rtlActive } = props;
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  });
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white
    });
  var block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white
  });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        {/* <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="#home" className={block}>
                {rtlActive ? "الصفحة الرئيسية" : "Home"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#company" className={block}>
                {rtlActive ? "شركة" : "Company"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#portfolio" className={block}>
                {rtlActive ? "بعدسة" : "Portfolio"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={block}>
                {rtlActive ? "مدونة" : "Blog"}
              </a>
            </ListItem>
          </List>
        </div> */}
        <p className={classes.center}>
          &copy; {1900 + new Date().getYear()}{" "}
          <a
            href={config.footerLink}
            className={anchor}
            target="_blank"
          >
            {rtlActive ? "توقيت الإبداعية" : config.footerText}
          </a>
         
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool
};
