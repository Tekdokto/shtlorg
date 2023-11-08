import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

import styles from "assets/jss/material-dashboard-pro-react/components/customTabsStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTabs(props) {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const { headerColor, plainTabs, tabs, title, rtlActive, parentChange } = props;
  const cardTitle = classNames({
    [classes.cardTitle]: true,
    [classes.cardTitleRTL]: rtlActive
  });

  const handleChange = (event, value) => {
    setValue(value);
    if(parentChange){
      parentChange(value);
    }    
  };

  return (
    // SHTUDY ADDED ADDED
    <div plain={plainTabs} className="custom-tabs">
      {title !== undefined ? <div className={cardTitle}>{title}</div> : null}
      <Tabs
        value={value}
        onChange={handleChange}
        classes={{
          root: classes.tabsRoot,
          indicator: classes.displayNone
        }}
      >
        {tabs.map((prop, key) => {
          var icon = {};
          if (prop.tabIcon) {
            icon = {
              icon: <prop.tabIcon />
            };
          }
          if(prop.tabHide) {
            return '';
          } else {
            return (
              <Tab
                classes={{
                  root: classes.tabRootButton,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper
                }}
                key={key}
                label={prop.tabName}
                {...icon}
              />
            );
          }
        })}
      </Tabs>
      {tabs.map((prop, key) => {
        if (key === value) {
          return <div key={key}>{prop.tabContent}</div>;
        }
        return null;
      })}
    </div>
  );
}

CustomTabs.propTypes = {
  headerColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose"
  ]),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node.isRequired,
      tabHide: PropTypes.bool
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool,
  parentChange: PropTypes.func
};
