import Buttons from "views/Components/Buttons.js";
import Calendar from "views/Calendar/Calendar.js";
import Charts from "views/Charts/Charts.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import GridSystem from "views/Components/GridSystem.js";
import Icons from "views/Components/Icons.js";
import LoginPage from "views/Pages/LoginPage.js";
import ErrorPage from "views/Pages/ErrorPage.js";
// import AdminDashboard from "views/pages/Dashboard.js";
import ForgotPasswordPage from "views/Pages/ForgotPasswordPage.js";
import ResetPasswordPage from "views/Pages/ResetPasswordPage.js";

import ChangePasswordPage from "views/Admin/ChangePasswordPage.js";
import AdminProfile from "views/Admin/AdminProfile.js";
import AdminTimeslot from "views/Admin/Timeslot.js";

import CategoryList from "views/CategoryManagement/List.js";
import SkillsList from "views/SkillsManagement/List.js";
import UserList from "views/UserManagement/List.js";
import UserAddEdit from "views/UserManagement/AddEdit.js";
import UserDetail from "views/UserManagement/CandidateDetails.js";
import UserDetailEdit from "views/UserManagement/EditCandidateDetails.js";
import VideoList from "views/VideoManagement/List.js";
import VideoAddEdit from "views/VideoManagement/AddEdit.js";


import MockInterviewList from "views/MockInterview/List.js";
import MockInterviewArchivedList from "views/MockInterview/ArchivedList.js";
import Assignment from '@material-ui/icons/Assignment';
import CompanyuserList from "views/Companyuser/List.js";
import ReportHired from "views/Report/List.js";
import ReportInterviews from "views/Report/InterviewsList.js";
import ReportOffer from "views/Report/OfferList.js";

import CmsList from "views/CmsManagement/List.js";
import CmsAddEdit from "views/CmsManagement/AddEdit.js";
import AdminCompanyUserManagement from "views/Pages/AdminCompanyUserManagement.js";

import Notifications from "views/Components/Notifications.js";
import Panels from "views/Components/Panels.js";
import RegisterPage from "views/Pages/Register.js";
import SweetAlert from "views/Components/SweetAlert.js";
import Typography from "views/Components/Typography.js";
import Widgets from "views/Widgets/Widgets.js";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import PeopleIcon from "@material-ui/icons/People";
import CategoryIcon from "@material-ui/icons/Category";
import SubCategoryIcon from "@material-ui/icons/Subtitles";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from '@material-ui/icons/Person';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import ReorderIcon from '@material-ui/icons/Reorder';

// Iconify Icons
import homeIcon from "@iconify/icons-ion/home";
import videoIcon from "@iconify/icons-mdi/video";
import skillLevel from "@iconify/icons-carbon/skill-level";
import ReportIcon from "@iconify/icons-carbon/skill-level";
import userOutlined from "@iconify/icons-ant-design/user-outlined";
import Logout from "views/Admin/logout.js"
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
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
    name: "Forgot password",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: ForgotPasswordPage,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/changepassword",
    name: "Change Password",
    rtlName: "لوحة القيادة",
    mini: "CP",
    component: ChangePasswordPage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "لوحة القيادة",
    mini: "EP",
    component: AdminProfile,
    layout: "/admin",
    invisible: true,
  },
  
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    // icon: DashboardIcon,
    icon: homeIcon,
    iconify: true,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/user-management/add",
    name: "Add User",
    rtlName: "لوحة القيادة",
    mini: "UA",
    component: UserAddEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/user-management/edit111",
    name: "Edit User",
    rtlName: "لوحة القيادة",
    mini: "EU",
    component: UserAddEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/engineer-management/list",
    name: "Engineers",
    rtlName: "لوحة القيادة",
    // mini: "CL",
    icon: PeopleIcon,
    component: UserList,
    layout: "/admin",
  },
  {
    path: "/engineer-management/detail/:id",
    name: "Candidate Details",
    rtlName: "لوحة القيادة",
    icon: PeopleIcon,
    iconify: true,
    component: UserDetail,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/engineer-management/specsheet/:id",
    name: "Edit Candidate Details",
    rtlName: "لوحة القيادة",
    icon: PeopleIcon,
    iconify: true,
    component: UserDetailEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/company-user-management/list",
    name: "Company Users",
    rtlName: "لوحة القيادة",
    // mini: "CL",
    icon: PersonIcon,
    component: CompanyuserList,
    layout: "/admin",
  },
  {
    path: "/video-management/list",
    name: "Interview Prep Library",
    rtlName: "لوحة القيادة",
    // icon: PeopleIcon,
    icon: videoIcon,
    iconify: true,
    component: VideoList,
    layout: "/admin",
  },
  {
    path: "/video-management/add",
    name: "Add Video",
    rtlName: "لوحة القيادة",
    mini: "UA",
    component: VideoAddEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/video-management/edit",
    name: "Edit Video",
    rtlName: "لوحة القيادة",
    mini: "EU",
    component: VideoAddEdit,
    layout: "/admin",
    invisible: true,
  },

  {
    collapse: true,
    name: "Mock Interviews",
    rtlName: "صفحات",
    icon: EventAvailableIcon,
    state: "mockinteviewCollapse",
    views: [
      {
        path: "/timeslot",
        name: "Set Timeslot",
        rtlName: "لوحة القيادة",
        mini: "TS",
        component: AdminTimeslot,
        layout: "/admin",
      },
      {
        path: "/mock-interview/list",
        name: "Pending List",
        rtlName: "لوحة القيادة",
        mini: "PL",
        component: MockInterviewList,
        layout: "/admin",
      },
      {
        path: "/mock-interview/archivedlist",
        name: "Archived List",
        rtlName: "لوحة القيادة",
        mini: "AL",
        component: MockInterviewArchivedList,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/career-path",
    name: "Career Path",
    rtlName: "لوحة القيادة",
    // mini: "CL",
    // icon: CategoryIcon,
    icon: ReorderIcon,
    iconify: false,
    component: CategoryList,
    layout: "/admin",
  },
  {
    path: "/skills-management",
    name: "Skills",
    rtlName: "لوحة القيادة",
    // mini: "CL",
    // icon: CategoryIcon,    
    icon: skillLevel,
    iconify: true,
    component: SkillsList,
    layout: "/admin",
  },
  {
   path: "/content/list",
      name: "Content",
      rtlName: "لوحة القيادة",
      icon: Assignment,
      component: CmsList,
      layout: "/admin"
    },
    {
      path: "/content/edit",
      name: "Edit Content",
      rtlName: "لوحة القيادة",
      mini: "EU",
      component: CmsAddEdit,
      layout: "/admin",
      invisible: true
    },
    {
      collapse: true,
      name: "Report",
      rtlName: "صفحات",
      icon: PeopleIcon,
      state: "reportCollapse",
      views: [
        {
          path: "/report/list",
          name: "Candidates Hired",
          rtlName: "لوحة القيادة",
          mini: "CH",
          component: ReportHired,
          layout: "/admin",
        },
        {
          path: "/report/offer-list",
          name: "Candidates Offered",
          rtlName: "لوحة القيادة",
          mini: "CO",
          component: ReportOffer,
          layout: "/admin",
        },
        {
          path: "/report/interviews-list",
          name: "Candidates Interviews",
          rtlName: "لوحة القيادة",
          mini: "CI",
          component: ReportInterviews,
          layout: "/admin",
        },
      ],
    },
    {
      path: "/logout",
      name: "Sign out",
      rtlName: "لوحة القيادة",
      icon: ExitToAppIcon,
      // icon: signOut,
      // iconify: true,
      component: Logout,
      layout: "/admin",
      visible: false,
    },

  // {
  //   path: "/company-management",
  //   name: "Company User management",
  //   rtlName: "لوحة القيادة",
  //   // mini: "CL",
  //   // icon: CategoryIcon,
  //   icon: userOutlined,
  //   iconify: true,
  //   component: AdminCompanyUserManagement,
  //   layout: "/admin",
  // },
];

export default newdashRoutes;
