import React from "react";
import cx from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import authHeader from "../helpers/auth-header.js";
import routes from "routes.js";
import { ToastContainer } from 'react-toastify';
import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import Loader from "../assets/img/loader.svg"
var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image, setImage] = React.useState(require("assets/img/sidebar-2.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/admin-logo.svg"));
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini + ' nol']: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1,
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
      
    }
    console.log("navigator.platform.indexOf",navigator.platform)
    // setMiniActive(!miniActive)
    //   setMobileOpen(false);
   
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });
  // functions for changeing the states from components
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleBgColorClick = (bgColor) => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.svg"));
        break;
      default:
        setLogo(require("assets/img/logo-white.svg"));
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  //this is for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    console.log("miniActive111",miniActive)
    if (window.innerWidth >= 960 ) {
      setMiniActive(!miniActive)
    }else{
      setMiniActive(false)
    }
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
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
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
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
  const sidebarMinimize = () => {
    //setMiniActive(!miniActive);
    console.log("miniActive",miniActive)
    if (window.innerWidth >= 960) {
      setMiniActive(!miniActive)
    }else{
     
      setMiniActive(false)
    }
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  // let adminBgColor = "#eeeeee";
  // let filePath = props.location.pathname;
  // let fullPath = filePath.replace(/\//g, " ").split(' ');
  // let bodyPath = fullPath[1];
  // let mainBody = document.getElementsByTagName("BODY")[0];
  // const bodyBg = () => {
  //   if (bodyPath === "admin") {
  //     mainBody.setAttribute('class', "bodyGray");
  //   }
  // }

  // bodyBg();


  return (
    <div className={classes.wrapper}>
      <div id="Loader" className='loader'>
        <span></span>
        <img src={Loader}></img>
      </div>
      <Sidebar
        routes={routes}
        logoText={"shtudy"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel} id="pagescrollontop">
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {(authHeader()) ?
                  getRoutes(routes)
                  :
                  <Redirect from="/" to="/auth/login" />
                }
                {/* Uncomment below code to bypass authentication */}
                {/* {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/dashboard" /> */}
              </Switch>
            </div>
          </div>
        ) : (
            <div className={classes.map}>
              <Switch>
                {(authHeader()) ?
                  this.getRoutes(routes)
                  :
                  <Redirect from="/" to="/auth/login" />
                }
                {/* Uncomment below code to bypass authentication */}
                {/* {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/dashboard" /> */}
              </Switch>
            </div>
          )}
        {getRoute() ? <Footer fluid /> : null}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}
