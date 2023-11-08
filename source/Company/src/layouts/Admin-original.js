import React, { Component } from "react";
import cx from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
//changesv1
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import authHeader from "../helpers/auth-header.js";
import {config} from "../helpers/config.js"
import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";

var ps;



class Dashboard extends Component{
  mainPanel = React.createRef();
  constructor(props){
    super(props);
    this.setMobileOpen = this.setMobileOpen.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.sidebarMinimize = this.sidebarMinimize.bind(this);
    this.setMiniActive = this.setMiniActive.bind(this);
    this.state = {
      mobileOpen: false,
      miniActive: false,
      image: require("assets/img/sidebar-2.jpg"),
      color: "blue",
      bgColor: "black",
      fixedClasses: "dropdown",
      logo: require("assets/img/default/logo-white.svg")
    }
  }
  componentDidMount(){
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
  }
  // componentWillMount(){
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     this.ps.destroy();
  //   }
  // }
  setMobileOpen(val=false){
    this.setState({mobileOpen:val})
  }
  setMiniActive(val=false){
    console.log('in set mini');
    this.setState({miniActive:val})
  }
  setImage(val){
    this.setState({image:val})
  }
  setColor(val="blue"){
    this.setState({color:val})
  }
  setBgColor(val="black"){
    this.setState({bgColor:val})
  }
  setFixedClasses(val="dropdown"){
    this.setState({fixedClasses:val})
  }
  setLogo(val){
    this.setState({logo:val})
  }
  handleDrawerToggle(){    
    this.setMobileOpen(!this.state.mobileOpen);   
  }
  handleImageClick = image => {
    this.setImage(image);
  };
  handleColorClick = color => {
    this.setColor(color);
  };
  handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        this.setLogo(require("assets/img/default/logo.svg"));
        break;
      default:
        this.setLogo(require("assets/img/default/logo-white.svg"));
        break;
    }
    this.setBgColor(bgColor);
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setFixedClasses("dropdown show");
    } else {
      this.setFixedClasses("dropdown");
    }
  };
  getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  sidebarMinimize = () => {
    console.log('in sidebar min');
    
    this.setMiniActive(!this.state.miniActive);
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setMobileOpen(false);
    }
  };

  render(){
    const { classes }= this.props;
    const { ...rest } = this.props;
    const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: this.state.miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
    });
    return(
      <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={config.LogoText}
        logo={this.state.logo}
        image={this.state.image}
        handleDrawerToggle={this.handleDrawerToggle}
        open={this.state.mobileOpen}
        color={this.state.color}
        bgColor={this.state.bgColor}
        miniActive={this.state.miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={this.mainPanel}>
        <AdminNavbar
          sidebarMinimize={this.sidebarMinimize}
          miniActive={this.state.miniActive}
          brandText={this.getActiveRoute(routes)}
          handleDrawerToggle={this.handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {this.getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
              {(authHeader())?
                this.getRoutes(routes)
                :
                <Redirect from="/" to="/auth/login" />
              }
              </Switch>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Switch>
            {(authHeader())?
              this.getRoutes(routes)
              :            
                <Redirect from="/" to="/auth/login" />
              }
            </Switch>
          </div>
        )}
        {this.getRoute() ? <Footer fluid /> : null}
        <FixedPlugin
          handleImageClick={this.handleImageClick}
          handleColorClick={this.handleColorClick}
          handleBgColorClick={this.handleBgColorClick}
          color={this.state.color}
          bgColor={this.state.bgColor}
          bgImage={this.state.image}
          handleFixedClick={this.handleFixedClick}
          fixedClasses={this.state.fixedClasses}
          sidebarMinimize={this.sidebarMinimize}
          miniActive={this.state.miniActive}
        />
      </div>
    </div>
    )
  }
}
export default withStyles(styles)(Dashboard)
