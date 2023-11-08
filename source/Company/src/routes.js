// Without auth routes
import LoginPage from "views/Pages/LoginPage.js";
import ForgotPasswordPage from "views/Pages/ForgotPasswordPage.js";
import ResetPasswordPage from "views/Pages/ResetPasswordPage.js";
import ResetPasswordSuccess from "views/Pages/ResetPasswordSuccess.js";
import VerifyEmailPage from "views/Pages/EmailVerifyPage.js";
import Logout from "views/Pages/logout.js"
// Company Profile and change password
import MyProfile from "views/Company/Profile";
import ChangePasswordPage from "views/Company/ChangePasswordPage.js";
import EditCompanySpecSheet from "views/Company/EditCompanySpecSheet";
import TermsPage from "views/Pages/TermsPage.js";
import PolicyPage from "views/Pages/PolicyPage.js";

//Dashboard
import CompanyDashboard from "views/Dashboard/CompanyDashboard";
import SearchEngineers from "views/Dashboard/SearchEngineers";
import CandidateDetails from "views/Dashboard/CandidateDetails";
// Watch List
import Watchlist from "views/Watchlist/Watchlist";
import SpecificWatchlist from "views/Watchlist/SpecificWatchlist";
import AddWatchlist from "views/Watchlist/AddWatchlist";

// Interview
import IntroDiscoveryCallList from "views/Interview/IntroDiscoveryCallList.js";
import RequestToConfirm from "views/Interview/RequestToConfirm.js";
import SentIntroDiscoveryCallRequest from "views/Interview/SentIntroDiscoveryCallRequest.js";
import OnsiteIntroDiscoveryCallList from "views/Interview/OnsiteIntroDiscoveryCallList.js";
import OfferExtendList from "views/Interview/OfferExtendList.js";
import SendConfirmation from "views/Interview/SendConfirmation.js";
import CallRequest from "views/Interview/CallRequest.js";
import CurrentInterviews from "views/Interview/CurrentInterviews.js";

import Confirmation from "views/Interview/Confirmation.js";

import CompanyTimeSlot from "views/Interview/Interview.js";

import ErrorPage from "views/Pages/ErrorPage.js";

// @material-ui/icons
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DateRange from "@material-ui/icons/DateRange";
import ReorderIcon from "@material-ui/icons/Reorder";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Iconify Icons
import homeIcon from "@iconify/icons-ion/home";
import calendarClock from "@iconify/icons-mdi/calendar-clock";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import accountMultiple from "@iconify/icons-mdi/account-multiple";
import emailIcon from "@iconify/icons-mdi/email";
import playlistRemove from "@iconify/icons-mdi/playlist-remove";
import signOut from "@iconify/icons-fa/sign-out";
import pastIcon from '@iconify/icons-wpf/past';
import avTimer from '@iconify/icons-mdi/av-timer';
import accountSearchOutline from '@iconify/icons-mdi/account-search-outline';


// This routes is proper for admmin panel only
var newdashRoutes = [
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
  // {
  //   path: "/resetpassword",
  //   name: "Reset Password",
  //   rtlName: "هعذاتسجيل الدخول",
  //   mini: "L",
  //   rtlMini: "هعذا",
  //   component: ResetPasswordPage,
  //   layout: "/auth",
  //   invisible: true
  // },
  // {
  //   path: "/resetpasswordsuccess",
  //   name: "Reset Password",
  //   rtlName: "هعذاتسجيل الدخول",
  //   mini: "L",
  //   rtlMini: "هعذا",
  //   component: ResetPasswordSuccess,
  //   layout: "/auth",
  //   invisible: true
  // },
  // {
  //   path: "/emailverify",
  //   name: "Email Verify",
  //   rtlName: "هعذاتسجيل الدخول",
  //   mini: "L",
  //   rtlMini: "هعذا",
  //   component: VerifyEmailPage,
  //   layout: "/auth",
  //   invisible: true
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: homeIcon,
    iconify: true,
    component: CompanyDashboard,
    layout: "/company",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "صودعم رتل",
    mini: "-",
    rtlMini: "صو",
    component: MyProfile,
    layout: "/company",
    invisible: true,
  },  
  // {
  //   path: "/candidatedetail/:id/:hide",
  //   name: "Candidate Details",
  //   rtlName: "لوحة القيادة",
  //   // icon: HomeIcon,
  //   icon: homeIcon,
  //   iconify: true,
  //   component: CandidateDetails,
  //   layout: "/company",
  //   invisible: true,
  // },
  {
    path: "/candidatedetail/:id/:hide",
    name: "Candidate Details",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: homeIcon,
    iconify: true,
    component: CandidateDetails,
    layout: "/company",
    invisible : true
  },
  {
    path: "/candidatedetail/:id",
    name: "Candidate Details",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: homeIcon,
    iconify: true,
    component: CandidateDetails,
    layout: "/company",
    invisible: true,
  },  
  {
    path: "/changepassword",
    name: "Change Password",
    rtlName: "صودعم رتل",
    mini: "-",
    rtlMini: "صو",
    component: ChangePasswordPage,
    layout: "/company",
    invisible: true,
  },
  {
    path: "/editspecsheet",
    name: "Company Profile",
    rtlName: "لوحة القيادة",
    icon: PlaylistAddCheckIcon,
    component: EditCompanySpecSheet,
    layout: "/company"
  },
  {
    path: "/watchlist",
    name: "My Openings",
    rtlName: "لوحة القيادة",
    icon: ReorderIcon,
    component: Watchlist,
    layout: "/company",
  },
  {
    path: "/search/:id",
    name: "Search Talent",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: accountSearchOutline,
    iconify: true,
    component: SearchEngineers,
    layout: "/company",
    invisible: true,
  },
  {
    path: "/search",
    name: "Search Talent",
    rtlName: "لوحة القيادة",
    // icon: HomeIcon,
    icon: accountSearchOutline,
    iconify: true,
    component: SearchEngineers,
    layout: "/company",
  },
  {
    path: "/settimeslot",
    name: "Set Interview Time",
    rtlName: "لوحة القيادة",
    icon: avTimer,
    iconify: true,
    component: CompanyTimeSlot,
    layout: "/company",
    invisible : false
  },
  {
    collapse: true,
    name: "My Interview Pipeline",
    rtlName: "صفحات",
    // icon: EventIcon,
    icon: calendarClock,
    iconify: true,
    state: "interviewCollapse",
    views: [
      // {
      //   path: "/sentcallrequest",
      //   name: "Sent Intro Discovery Call Request",
      //   rtlName: "لوحة القيادة",
      //   mini: "-",
      //   component: SentIntroDiscoveryCallRequest,
      //   layout: "/company",
      // },
      // {
      //   path: "/requestconfirm",
      //   name: "Request to Confirm",
      //   rtlName: "لوحة القيادة",
      //   mini: "-",
      //   component: RequestToConfirm,
      //   layout: "/company",
      // },
      // {
      //   path: "/introdiscoverylist",
      //   name: "Intro Discovery Call List",
      //   rtlName: "لوحة القيادة",
      //   mini: "-",
      //   component: IntroDiscoveryCallList,
      //   layout: "/company",
      // },
      // {
      //   path: "/onsitelist",
      //   name: "Onsite Intro Discovery Call List",
      //   rtlName: "لوحة القيادة",
      //   mini: "-",
      //   component: OnsiteIntroDiscoveryCallList,
      //   layout: "/company",
      // },
      // {
      //   path: "/offerlist",
      //   name: "Offer Extend List",
      //   rtlName: "لوحة القيادة",
      //   mini: "-",
      //   component: OfferExtendList,
      //   layout: "/company"
      // },
      {
        path: "/confirmcandidate/:watchlist/:name/:id/:std_id",
        name: "Confirm Candidate",
        rtlName: "لوحة القيادة",
        mini: "-",
        component: SendConfirmation,
        layout: "/company",
        invisible : true
      },
      {
        path: "/callrequest",
        name: "Requested Intro Calls",
        rtlName: "لوحة القيادة",
        mini: "-",
        component: CallRequest,
        layout: "/company"
      },
      {
        path: "/currentinterviews",
        name: "Current Interviews",
        rtlName: "لوحة القيادة",
        mini: "-",
        component: CurrentInterviews,
        layout: "/company"
      },
    ]
  },
  {
    path: "/addwatchlist",
    name: "Add My Openings",
    rtlName: "لوحة القيادة",
    icon: ReorderIcon,
    component: AddWatchlist,
    layout: "/company",
    invisible: true,
  },
  {
    path: "/editwatchlist/:id",
    name: "Edit My Openings",
    rtlName: "لوحة القيادة",
    icon: ReorderIcon,
    component: AddWatchlist,
    layout: "/company",
    invisible: true,
  },
  {
    path: "/viewwatchlist/:id/:view",
    name: "Edit My Openings",
    rtlName: "لوحة القيادة",
    icon: ReorderIcon,
    component: AddWatchlist,
    layout: "/company",
    invisible: true,
  },
  {
    path: "/watchlistdetail/:id",
    name: "My Openings",
    rtlName: "لوحة القيادة",
    icon: ReorderIcon,
    component: SpecificWatchlist,
    layout: "/company",
    invisible: true,
  },   
  {
    path: "/confirmation",
    name: "Past Hires",
    rtlName: "لوحة القيادة",
    // icon: EventAvailableIcon,
    icon: pastIcon,
    iconify: true,
    component: Confirmation,
    layout: "/company"
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
    layout: "/company",
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
    layout: "/company",
    invisible: true,
  },
  {
    path: "/logout",
    name: "Sign out",
    rtlName: "لوحة القيادة",
    icon: ExitToAppIcon,
    // icon: signOut,
    // iconify: true,
    component: Logout,
    layout: "/company",
    visible: false,
  },
];

export default newdashRoutes;
