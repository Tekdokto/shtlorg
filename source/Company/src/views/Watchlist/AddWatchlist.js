import React from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import UpdatedPagination from "../paginationupdated.js";
import axios from "axios";
import { API_URL } from "constants/defaultValues.js"
import { toast } from "react-toastify";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "components/Table/Table.js";
import Link from "@material-ui/core/Link";

import CloseIcon from "../../assets/img/close-icon.svg"


import filterIcon from "../../assets/img/filter-icon.svg";

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

import Accordion from "components/Accordion/Accordion.js";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel"
// @material-ui/icons
import Check from "@material-ui/icons/Check";

import Paginations from "components/Pagination/Pagination.js";

import ListIcon from '@material-ui/icons/List';
import circleEditOutline from '@iconify/icons-mdi/circle-edit-outline';
import accountMultiple from '@iconify/icons-mdi/account-multiple';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

// Modal
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import Close from "@material-ui/icons/Close";
import buttonStyles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";


// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

import combineStyles from '../../combineStyles';
import { getAllcities, fetchCareerPath, logoutUser } from "../../redux/action";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
};

const styles1 = {
  ...sweetAlertStyle
};

const useCustomStyle = makeStyles(customStyle);

class AddWatchList extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.redirectSearchEngineer = this.redirectSearchEngineer.bind(this);
    this.handleCareerPathChange = this.handleCareerPathChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.onAddWatchList = this.onAddWatchList.bind(this);
    this.state = {
      watchlist_id: 0,
      mode: 0,//0=add,1==edit,2=view
      add_talent_disabled: false,
      add_talent_watchlist_id: 0,
      role_title: "",
      role_title_State: "",
      description: "",
      description_State: "",
      primary_contact: "",
      primary_contact_State: "",
      how_many_engineers_looking: 0,
      how_many_engineers_looking_State: "",
      salary: "",
      salary_State: "",
      career_path_id: 0,
      career_path_id_State: "",
      city: 0,
      all_watchlist: [],
      watchlist: "",
      simpleSelect: "",
      career_path: [],
      cities: [],
      all_skills: [],
      alert: null
    }
  }
  showLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'block';
  }

  hideLoader() {
    let element = document.getElementById("Loader");
    element.style.display = 'none';
  }

  componentDidMount() {
    this.props.fetchCareerPath();
    this.props.getAllcities();
    let ths = this;
    let { match } = this.props;
    if (match.params.id) {
      // console.log("PPPP:",match.params);
      if (match.params.view !== "1") {
        this.setState({
          mode: 1,
          watchlist_id: match.params.id
        })
        this.fetchWatchList(match.params.id);
      } else {
        this.setState({
          mode: 2
        })
        this.fetchWatchList(match.params.id);
      }
    }
    ths.showLoader();
    setTimeout(() => {
      ths.hideLoader()
    }, 500)
  }

  redirectSearchEngineer() {    
    if (this.state.add_talent_watchlist_id > 0) {
      this.props.history.push(`/company/search/${this.state.add_talent_watchlist_id}`)
    } else {
      this.props.history.push(`/company/search`)
    }
  }

  setAlert(val = null) {
    this.setState({ alert: val })
  }

  warningWithConfirmAndCancelMessage() {
    let ths = this;
    const { classes } = this.props;
    this.setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-200px" }}
        title="All Done! Are you ready to source talent for this role?"
        onConfirm={() => ths.redirectSearchEngineer()}
        onCancel={() => ths.setAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        confirmBtnText="Add Talent"
      >
      </SweetAlert>
    );
  };

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt",props);
    // console.log("props state cattt",state);  
    if (props.user || (state.career_path.length !== props.career_path.length) || (state.cities.length !== props.cities.length)) {
      return {
        user: (props.user) ? props.user : [],
        career_path: (props.career_path.length > 0) ? props.career_path : [],
        cities: (props.cities) ? props.cities : [],
      };
    } else {
      return {
        ...state
      }
    }
  }

  // #####################
  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  };

  verifyNumber(val, len = 1) {
    // console.log("phone:",isNaN(val.trim()));

    if (val.trim().length >= len && (!isNaN(val.trim()))) {
      if (+(val) > 0) {
        return true
      } else {
        return false
      }
    }
    return false;
  }

  setRoleTitleState(val = "") {
    this.setState({ role_title_State: val })
  }

  setRoleTitle(val = "") {
    this.setState({ role_title: val })
  }

  setRoleDescriptionState(val = "") {
    this.setState({ description_State: val })
  }

  setRoleDescription(val = "") {
    this.setState({ description: val })
  }

  setPrimaryContactState(val = "") {
    this.setState({ primary_contact_State: val })
  }

  setPrimaryContact(val = "") {
    this.setState({ primary_contact: val })
  }

  setNumbersOfEnggState(val = "") {
    this.setState({ how_many_engineers_looking_State: val })
  }

  setNumbersOfEngg(val = "") {
    if (!isNaN(val.trim())) {
      this.setState({ how_many_engineers_looking: (val.length !== 0) ? +(val) : 0 })
    }
  }

  setSalaryState(val = "") {
    this.setState({ salary_State: val })
  }

  setSalary(val = "") {
    this.setState({ salary: val })
  }

  handleCareerPathChange(e) {
    this.setState({
      career_path_id: e.target.value
    })
    e.preventDefault();
  }
  handleCityChange(e) {
    this.setState({
      city: e.target.value
    })
    e.preventDefault();
  }
  checkForCareerPathState(val = 0) {
    if (val === 0) {
      this.setState({
        career_path_id_State: "error"
      })
      return false;
    } else {
      return true;
    }
  }

  async fetchWatchList(id) {
    let params = {}
    params.watchlist_id = id;
    params.user_id = this.props.user.user_id;
    let response = await this.fetchWatchListCall(params);
    // console.log("DATTA:", response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push('/company/watchlist')
      } else {
        if (response.data.length > 0) {
          this.setState({
            role_title: response.data[0].role_title,
            description: response.data[0].description,
            primary_contact: response.data[0].primary_contact,
            how_many_engineers_looking: response.data[0].how_many_engineers_looking,
            salary: response.data[0].salary,
            career_path_id: response.data[0].career_path_id,
            city: response.data[0].city,
          })
        }
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchWatchListCall(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }

    const res = await axios.post(`${API_URL}/company/watchlist/get_watchlist_detail`, params, headers);
    return await res.data;
  }

  onAddWatchList(e, val = {}) {
    // console.log("val1",val)
    if (!(this.verifyLength(val.role_title, 1))) {
      toast.error("Please write role title.")
      this.setRoleTitleState("error")
    } else if (!(this.verifyLength(val.salary, 1))) {
      toast.error("Please write salary.")
      this.setSalaryState("error")
    } else if (!(val.city && (val.city !== "" || val.city !== 0))) {
      toast.error("Please select city.")
    } else if (!(this.checkForCareerPathState(val.career_path_id))) {
      toast.error('Please select career path for role.')
    } else if (!(this.verifyNumber(`${val.how_many_engineers_looking}`, 1))) {
      toast.error("Please number of engineers looking to hire.")
      this.setNumbersOfEnggState("error")
    } else if (!(this.verifyLength(val.primary_contact, 1))) {
      toast.error("Please write primary contact.")
      this.setPrimaryContactState("error")
    }
    // console.log("conditions", this.verifyLength(val.role_title, 1), this.verifyNumber(`${val.how_many_engineers_looking}`, 1), this.checkForCareerPathState(val.career_path_id))
    if (this.verifyLength(val.role_title, 1) && this.verifyLength(val.salary, 1)
      && this.verifyNumber(`${val.how_many_engineers_looking}`, 1) && this.verifyLength(val.role_title, 1)
      && this.verifyLength(val.primary_contact, 1) && this.checkForCareerPathState(val.career_path_id) && val.city && val.city !== "") {
      // console.log("val",val)
      this.addWatchListReqest(val)
    }


    e.preventDefault();
  }

  async addWatchListReqest(params) {
    let response = await this.addWatchlistRequest(params);
    //   console.log("DATTA:",response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        // this.props.history.push('/company/watchlist')
        this.setState({
          add_talent_disabled: true,
          add_talent_watchlist_id: (response.data.watchlistInsertId) ? response.data.watchlistInsertId : 0,
          role_title: "",
          role_title_State: "",
          description: "",
          description_State: "",
          primary_contact: "",
          primary_contact_State: "",
          how_many_engineers_looking: 0,
          how_many_engineers_looking_State: "",
          salary: "",
          salary_State: "",
          career_path_id: 0,
          career_path_id_State: "",
          city: 0,
        })
        this.warningWithConfirmAndCancelMessage();
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async addWatchlistRequest(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    params.user_id = this.props.user.user_id;
    // get_watchlist.filtred = this.state.filter;
    const res = await axios.post(`${API_URL}/company/watchlist/create`, params, headers);
    return await res.data;
  }

  onEditWatchList(e, val = {}) {
    // console.log("val1", val)
    if (!(this.verifyLength(val.role_title, 1))) {
      toast.error("Please write role title.")
      this.setRoleTitleState("error")
    } else if (!(this.verifyLength(val.salary, 1))) {
      toast.error("Please write salary.")
      this.setSalaryState("error")
    } else if (!(val.city && (val.city !== "" || val.city !== 0))) {
      toast.error("Please select city.")
    } else if (!(this.checkForCareerPathState(val.career_path_id))) {
      toast.error('Please select career path for role.')
    } else if (!(this.verifyNumber(`${val.how_many_engineers_looking}`, 1))) {
      toast.error("Please number of engineers looking to hire.")
      this.setNumbersOfEnggState("error")
    } else if (!(this.verifyLength(val.primary_contact, 1))) {
      toast.error("Please write primary contact.")
      this.setPrimaryContactState("error")
    }
    // console.log("conditions", this.verifyLength(val.role_title, 1), this.verifyNumber(`${val.how_many_engineers_looking}`, 1), this.checkForCareerPathState(val.career_path_id))
    if (this.verifyLength(val.role_title, 1) && this.verifyLength(val.salary, 1)
      && this.verifyNumber(`${val.how_many_engineers_looking}`, 1) && this.verifyLength(val.role_title, 1)
      && this.verifyLength(val.primary_contact, 1) && this.checkForCareerPathState(val.career_path_id) && val.city && val.city !== "") {
      // console.log("val",val)
      this.editWatchListReqest(val)
    }


    e.preventDefault();
  }


  async editWatchListReqest(params) {
    let response = await this.editWatchlistRequest(params);
    //   console.log("DATTA:",response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        this.props.history.push('/company/watchlist')
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async editWatchlistRequest(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    params.user_id = this.props.user.user_id;
    // get_watchlist.filtred = this.state.filter;
    const res = await axios.post(`${API_URL}/company/watchlist/update`, params, headers);
    return await res.data;
  }

  //  #####################
  setModal(val = false, student_id = 0, student_name = "") {
    this.setState({
      modal: val,
      student_id: student_id,
      student_name: student_name
    })
  }

  setChecked(val = []) {
    this.setState({
      checked: val
    })
  }



  render() {
    //   console.log("State: ",this.state)
    const { classes } = this.props;
    const { role_title, role_title_State, salary, salary_State, career_path_id, city, how_many_engineers_looking, how_many_engineers_looking_State, primary_contact, primary_contact_State, description, description_State } = this.state;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem xs={12} sm={8}>
            <h1>{(this.state.mode !== 0) ? ((this.state.mode !== 1) ? 'View My Openings' : 'Edit My Openings') : 'My Openings'}</h1>
            <h5>{(this.state.mode !== 0) ? ((this.state.mode !== 1) ? 'View your candidate my openings' : 'Edit your candidate my openings') : 'Add your open role'} </h5>
          </GridItem>
          {(this.state.mode === 0) ?          
          <GridItem sm={4} className={classes.rightLeftResponsive}>
            <Button
              color="info"
              className={`${classes.newButton} ${classes.mt30}`}
              onClick={this.redirectSearchEngineer}
              disabled={(this.state.add_talent_disabled && this.state.add_talent_watchlist_id > 0) ? false : true }
            >
              Add Talent
            </Button>
          </GridItem>
          : null}
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <form>
              <Card className="paddingTopBottom cardCustom">
                <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                  {(this.state.mode !== 0) ? ((this.state.mode !== 1) ? 'View' : 'Edit') : 'Add'} Form
            </CardHeader>
                <CardBody className="cardCustomBody">
                  <GridContainer>
                    <GridItem xs={12}>
                      <div className="indicationMessage">Candidates will see this information so make it meaningful</div>
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <CustomInput
                        // success={role_title_State === "success"}
                        error={role_title_State === "error"}
                        labelText="What is the role title?"
                        id="role_title"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.role_title,
                          onChange: ((e) => {
                            if (this.verifyLength(e.target.value, 1)) {
                              this.setRoleTitleState("success");
                            } else {
                              this.setRoleTitleState("error");
                            }
                            this.setRoleTitle(e.target.value)
                          }),
                          disabled: (this.state.mode === 2) ? true : false
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <CustomInput
                        // success={salary_State === "success"}
                        error={salary_State === "error"}
                        labelText="Salary"
                        id="salary"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.salary,
                          onChange: ((e) => {
                            if (this.verifyLength(e.target.value, 1)) {
                              this.setSalaryState("success");
                            } else {
                              this.setSalaryState("error");
                            }
                            this.setSalary(e.target.value)
                          }),
                          disabled: (this.state.mode === 2) ? true : false
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          City
                    </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={city}
                          onChange={this.handleCityChange}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select",
                            disabled: (this.state.mode === 2) ? true : false
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                            value={0}
                          >
                            Select City
                      </MenuItem>
                          {(this.state.cities) ? this.state.cities.map((city) => {

                            return <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value={city.id}
                            >
                              {city.name}
                            </MenuItem>

                          }) : null}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={6}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          What kind of talent do you need for this role?
                    </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={career_path_id}
                          onChange={this.handleCareerPathChange}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select",
                            disabled: (this.state.mode === 2) ? true : false
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                            value={0}
                          >
                            Career Path
                      </MenuItem>
                          {(this.state.career_path) ? this.state.career_path.map((career) => {

                            return <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value={career.id}
                            >
                              {career.career_name}
                            </MenuItem>

                          }) : null}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={6}>
                      <CustomInput
                        // success={how_many_engineers_looking_State === "success"}
                        error={how_many_engineers_looking_State === "error"}
                        labelText="How many engineers are you looking to hire for this role?"
                        id="how_many_engineers_looking"
                        formControlProps={{
                          fullWidth: true,
                          className: "watchlist-custom-input"
                        }}                        
                        inputProps={{
                          value: this.state.how_many_engineers_looking,
                          type: "text",
                          onChange: ((e) => {
                            if (this.verifyNumber(e.target.value, 1)) {
                              this.setNumbersOfEnggState("success");
                            } else {
                              this.setNumbersOfEnggState("error");
                            }
                            this.setNumbersOfEngg(e.target.value)
                          }),
                          disabled: (this.state.mode === 2) ? true : false
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                      <CustomInput
                        // success={primary_contact_State === "success"}
                        error={primary_contact_State === "error"}
                        labelText="Who is the primary contact?"
                        id="primary_contact"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.primary_contact,
                          onChange: ((e) => {
                            if (this.verifyLength(e.target.value, 1)) {
                              this.setPrimaryContactState("success");
                            } else {
                              this.setPrimaryContactState("error");
                            }
                            this.setPrimaryContact(e.target.value)
                          }),
                          disabled: (this.state.mode === 2) ? true : false
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                      <CustomInput
                        // success={description_State === "success"}
                        error={description_State === "error"}
                        labelText="Role Description"
                        id="description"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: this.state.description,
                          multiline: true,
                          rows: 3,
                          onChange: ((e) => {
                            this.setRoleDescription(e.target.value)
                          }),
                          disabled: (this.state.mode === 2) ? true : false
                        }}
                      />
                    </GridItem>
                    <Grid item xs={12} className={classes.textCenter}>
                      {(this.state.mode === 0) ? <Button
                        color="info"
                        size="lg"
                        className={classes.newButton}
                        onClick={(e) => this.onAddWatchList(e, { role_title, salary, career_path_id, city, how_many_engineers_looking, primary_contact, description })}
                      >
                        Submit
                        </Button> : null}
                      {(this.state.mode === 1) ? <Button
                        color="info"
                        size="lg"
                        className={classes.newButton}
                        onClick={(e) => this.onEditWatchList(e, { id: this.state.watchlist_id, role_title, salary, career_path_id, city, how_many_engineers_looking, primary_contact, description })}
                      >
                        Submit
                        </Button> : null}
                    </Grid>
                  </GridContainer>
                </CardBody>
              </Card>
            </form>
          </GridItem>
          {this.state.alert}
        </GridContainer>
      </div>
    );
  }
}
const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
    career_path: state.authReducer.career_path,
    cities: state.authReducer.cities
  };
};

const mapDispatchToProps = { getAllcities, fetchCareerPath, logoutUser }
const combinedStyles = combineStyles(styles, useCustomSpace1, checkBoxStyle, modalStyles, customSelect, customStyle, styles1);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(AddWatchList));