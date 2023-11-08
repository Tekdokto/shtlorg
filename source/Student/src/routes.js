// Student Without Auth pages
import LoginPage from "views/Pages/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import ForgotPasswordPage from "views/Pages/ForgotPasswordPage.js";
import IntroDiscoveryCallRequest from "views/Pages/IntroDiscoveryCallRequest.js";
import AcceptRejectOffer from "views/Pages/AcceptRejectOffer.js";
import ResetPasswordPage from "views/Pages/ResetPasswordPage.js";
import ResetPasswordSuccess from "views/Pages/ResetPasswordSuccess.js";
import VerifyEmailPage from "views/Pages/EmailVerifyPage.js";
import TermsPage from "views/Pages/TermsPage.js";
import PolicyPage from "views/Pages/PolicyPage.js";

import Logout from "views/Pages/logout.js"

// Dashboard
import Dashboard from "views/Dashboard/Dashboard.js";
// Student Pages
import ChangePasswordPage from "views/Student/ChangePasswordPage.js";
import MyProfile from "views/Student/Profile.js";

// Skill assetments
import SkillAssesment from "views/Skills/SkillAssesment.js";

// Interview Preperation video gallery
import VideoGallery from "views/InterviewPreperation/VideoGallery.js";

// Interview Scheduler
import InterviewScheduler from "views/InterviewScheduler/InterviewScheduler.js";
import InterviewResult from "views/InterviewScheduler/InterviewResult.js";
import SpecSheet from "views/Dashboard/SpecSheet.js";

import ErrorPage from "views/Pages/ErrorPage.js";

import Calendar from "views/Calendar/Calendar.js";

// @material-ui/icons
import HomeIcon from "@material-ui/icons/Home";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import VideocamIcon from "@material-ui/icons/Videocam";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import PeopleIcon from "@material-ui/icons/People";
import CategoryIcon from "@material-ui/icons/Category";
import SubCategoryIcon from "@material-ui/icons/Subtitles";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";

// Iconify Icons
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import signOut from "@iconify/icons-fa/sign-out";
import videoIcon from "@iconify/icons-mdi/video";
import homeIcon from "@iconify/icons-ion/home";
import userOutlined from "@iconify/icons-ant-design/user-outlined";
//import skillLevelAdvanced from '@iconify/icons-carbon/skill-level-advanced';
import skillLevelAdvanced from '@iconify/icons-la/award-solid';

// This routes is proper for user panel only
var newdashRoutes = [
  {
    path: "/signup",
    name: "Register Page",
    rtlName: "تسجيل",
    mini: "-",
    rtlMini: "صع",
    component: RegisterPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/login",
    name: "Login Page",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: LoginPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: ForgotPasswordPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/resetpassword",
    name: "Reset Password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: ResetPasswordPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/resetpasswordsuccess",
    name: "Reset Password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: ResetPasswordSuccess,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/emailverify",
    name: "Email Verify",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: VerifyEmailPage,
    layout: "/confirm",
    invisible: true,
  },
  {
    path: "/intro_discovery_call_request/:id/:declined",
    name: "Forgot Password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: IntroDiscoveryCallRequest,
    layout: "/confirm",
    invisible: true,
  },
  {
    path: "/intro_discovery_call_request/:id",
    name: "Forgot Password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: IntroDiscoveryCallRequest,
    layout: "/confirm",
    invisible: true,
  },
  {
    path: "/offer/:id/:status",
    name: "Offer Accept-Reject",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: AcceptRejectOffer,
    layout: "/confirm",
    invisible: true,
  },
  {
    path: "/content/terms",
    name: "Terms",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: TermsPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/content/terms",
    name: "Terms",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: TermsPage,
    layout: "/candidate",
    invisible: true,
  },
  {
    path: "/content/policy",
    name: "Policy",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: PolicyPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/content/policy",
    name: "Policy",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: PolicyPage,
    layout: "/candidate",
    invisible: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: homeIcon,
    iconify: true,
    component: Dashboard,
    layout: "/candidate",
  },
  {
    path: "/changepassword",
    name: "ChangePassword",
    rtlName: "صودعم رتل",
    mini: "-",
    rtlMini: "صو",
    component: ChangePasswordPage,
    layout: "/candidate",
    invisible: true,
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "صودعم رتل",
    mini: "-",
    rtlMini: "صو",
    component: MyProfile,
    layout: "/candidate",
    invisible: true,
  },
  {
    path: "/specsheet",
    name: "My Resume",
    rtlName: "لوحة القيادة",
    icon: PlaylistAddCheckIcon,
    component: SpecSheet,
    layout: "/candidate",
    invisible: false,
  },
  {
    path: "/skillassesment/:isMessage/:pageName",
    name: "Skill Assessment",
    rtlName: "لوحة القيادة",
    // icon: PersonOutlineIcon,
    icon: skillLevelAdvanced,
    iconify: true,
    component: SkillAssesment,
    layout: "/candidate",
    invisible: true
  },
  {
    path: "/skillassesment",
    name: "Skill Assessment",
    rtlName: "لوحة القيادة",
    // icon: PersonOutlineIcon,
    icon: skillLevelAdvanced,
    iconify: true,
    component: SkillAssesment,
    layout: "/candidate",
  },
  {
    path: "/interviewprep/:isMessage",
    name: "Interview Prep",
    rtlName: "لوحة القيادة",
    // icon: VideocamIcon,
    icon: videoIcon,
    iconify: true,
    component: VideoGallery,
    layout: "/candidate",
    invisible: true
  },
  {
    path: "/interviewprep",
    name: "Interview Prep",
    rtlName: "لوحة القيادة",
    // icon: VideocamIcon,
    icon: videoIcon,
    iconify: true,
    component: VideoGallery,
    layout: "/candidate",
  },
  {
    path: "/interviewscheduler",
    name: "Mock Interview",
    rtlName: "لوحة القيادة",
    icon: EventAvailableIcon,
    component: InterviewScheduler,
    layout: "/candidate",
  },
  {
    path: "/interviewresult",
    name: "Interview Results",
    rtlName: "لوحة القيادة",
    icon: PlaylistAddCheckIcon,
    component: InterviewResult,
    layout: "/candidate",
    invisible: true,
  },
  // {
  //   path: "/logout",
  //   name: "Logout",
  //   rtlName: "لوحة القيادة",
  //   icon: ExitToAppIcon,
  //   component: Dashboard,
  //   layout: "/candidate",
  //   invisible: false
  // }
  {
    path: "/logout",
    name: "Sign out",
    rtlName: "لوحة القيادة",
    icon: ExitToAppIcon,
    // icon: signOut,
    // iconify: true,
    component: Logout,
    layout: "/candidate",
    visible: false,
  },
];

export default newdashRoutes;
