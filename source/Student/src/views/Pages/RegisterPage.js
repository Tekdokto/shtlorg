import React from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import { toast } from 'react-toastify';
import { APP_URL } from "constants/defaultValues.js"
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Hidden from "@material-ui/core/Hidden";

// Select Box
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import customStyles from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import combineStyles from '../../combineStyles';

// Images
import LogArrow from "../../assets/img/logpage-arrow.svg";
import MailIcon from "../../assets/img/mail-icon.svg";
import EyeIcon from "../../assets/img/eye-slash.svg";
import EyeSlash from "../../assets/img/eye-slash.svg";
import { fetchCareerPath, registerUser } from '../../redux/action'

const useStyles = makeStyles(styles);
const useCustomStyles = makeStyles(customStyles);
const termspage = APP_URL + "/auth/content/terms"
// const classes = useStyles();
//   const classesCustom = useCustomStyles();

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this)
    this.props = props;
    this.state = {
      cardAnimaton: "cardHidden",
      simpleSelect: "",
      racialIdentitySelect: "",
      career_path: [],
      full_name: "",
      full_nameState: "",
      full_nameerrortext: "",
      email: "",
      emailState: "",
      emailerrortext: "",
      password: "",
      passwordState: "",
      passworderrortext: "",
      passwordShow: false,
      isdisable: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props cattt", props);
    // console.log("props state cattt",state);  
    if (props.career_path && state.career_path.length == 0) {
      return {
        career_path: (props.career_path) ? props.career_path : []
      };
    }
  }

  componentDidMount() {
    let ths = this;
    this.props.fetchCareerPath();
    setTimeout(function () {
      ths.setCardAnimation("");
    }, 700);
  }
  setSimpleSelect(val) {
    this.setState({
      simpleSelect: val
    })
  }

  setCardAnimation(val) {
    this.setState({
      cardAnimaton: val
    })
  }

  verifyPassword(value) {
    var paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    // console.log("value.match(paswd)", value.match(paswd))
    if (value.match(paswd)) {
      return true;
    }
    return false
  }

  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  };
  verifyEmail(val) {
    var val = val.trim();
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(val)) {
      return true;
    }
    return false;
  }

  setfull_name(val = "") {
    this.setState({ full_name: val })
  }
  setfull_nameState(val = "") {
    this.setState({ full_nameState: val, full_nameerrortext: (val === "error") ? "Name shoudn't be empty." : "" })
  }

  setpassword(val = "") {
    this.setState({ password: val })
  }
  setpasswordState(val = "") {
    this.setState({ passwordState: val, passworderrortext: (val === "error") ? "Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" : "" })
  }

  setemail(val = "") {
    this.setState({ email: val })
  }
  setemailState(val = "") {
    this.setState({ emailState: val, emailerrortext: (val === "error") ? "Please enter valid email." : "" })
  }
  passwordShowHide() {
    this.setState({ passwordShow: !this.state.passwordShow })
  }

  notify() {
    // console.log("RWRETSW")
    toast.success("Hello World")
  }
  handleSimple = (event) => {
    this.setSimpleSelect(event.target.value);
  };
  
  handleRacialIdentity = (event) => {
    this.setRacialIdentitySelect(event.target.value);
  };

  setRacialIdentitySelect(val) {
    this.setState({
      racialIdentitySelect: val
    })
  }

  onSubmit(e, val = {}) {
    // console.log("testest", val.full_name, val.email, val.password, this.state.simpleSelect, this.state.racialIdentitySelect)
    if (this.state.emailState === "") {
      this.setemailState("error");
    }
    if (this.state.passwordState === "") {
      this.setpasswordState("error");
    }
    if (this.state.full_nameState === "") {
      this.setfull_nameState("error");
    }
    this.setState({ isdisable: true })
    if (this.state.simpleSelect != 0 && this.state.racialIdentitySelect != 0 && this.verifyLength(val.full_name, 1) && this.verifyEmail(val.email) && this.verifyPassword(val.password)) {
      // console.log("intheblock")
      val.email = val.email.trim()
      val.strategy = "normal";
      val.career_path_id = this.state.simpleSelect;
      val.racial_identity = this.state.racialIdentitySelect;
      this.props.registerUser(val, this.props.history);
      setTimeout(() => {
        this.setState({ isdisable: false })
      }, 2500)
    } else {
      if (!(this.verifyLength(val.full_name, 1))) {
        toast.error('Please enter Name.')
      } else if (!(this.verifyEmail(val.email))) {
        toast.error('Please enter valid email.')
      } else if (this.state.simpleSelect == 0) {
        toast.error('Please select career path.')
      } else if (this.state.racialIdentitySelect == 0) {
        toast.error('Please select racial identity.')
      } else if (!(this.verifyPassword(val.password))) {
        toast.error('Password should have 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
      }
      this.setState({ isdisable: false })
    }
    e.preventDefault();
  }

  // preventDefault = (event) => event.preventDefault();
  render() {
    const { classes } = this.props;
    const { full_name, email, password, full_nameState, emailState, passwordState } = this.state;
    let { cardAnimaton, simpleSelect, racialIdentitySelect } = this.state;
    return (
      <div className={classes.containerFluid}>
        <GridContainer justify="center" alignItems="center" spacing={10}>
          <GridItem lg={7} md={6} sm={6} className={classes.textCenter}>
            <h2 className={classes.logLeftContentH22}>
              Get Matched With Your Dream Job
            </h2>
            <p className={`${classes.logLeftContentP} ${classes.logLeftContentP1}`}>
              Shtudy connects top Black, Latinx, and Native
              <Hidden mdDown>
                <br />
              </Hidden>
              American tech talent with career opportunities&nbsp;
              <Hidden mdDown>
                <br />
              </Hidden>
              at America’s leading companies.
            </p>
            <p className={`${classes.logLeftContentP} ${classes.logLeftContentP1}`}>
              Start your profile today to begin
            </p>
            <h3 className={classes.logLeftContentH3}>A Simple, Easy Process</h3>
            <div className="logProccessStep">
            Get Screened{" "}
              <img
                src={LogArrow}
                alt=""
                title=""
                className={classes.logArrows}
              ></img>{" "}
              Start Interviewing{" "}
              <img
                src={LogArrow}
                alt=""
                title=""
                className={classes.logArrows}
              ></img>{" "}
              Get Hired
            </div>
          </GridItem>
          <GridItem xs={12} sm={6} lg={5} xl={4} md={6}>
            <form onSubmit={(e) => this.onSubmit(e, { full_name, email, password })}>
              <Card login className={classes[cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.logCardHeader}`}
                >
                  <h4 className={classes.logCardHeaderTitle}>
                    Welcome to Shtudy!
                  </h4>
                  <small className={classes.logSubTitle}>
                    To Begin finding your right career fill out the form below
                  </small>
                </CardHeader>
                <CardBody className={classes.bodyPadding + " logInputs"}>
                  <CustomInput
                    // helperText={(full_nameState === "error")?this.state.full_nameerrortext:""}
                    // success={full_nameState === "success"}
                    error={full_nameState === "error"}
                    labelText="Name"
                    id="full_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                      type: "text",
                      autoComplete: "off",
                      onChange: ((e) => {
                        if (this.verifyLength(e.target.value, 1)) {
                          this.setfull_nameState("success");
                        } else {
                          this.setfull_nameState("error");
                        }
                        this.setfull_name(e.target.value)
                      })
                    }}
                  />
                  <CustomInput
                    // helperText={(emailState === "error")?this.state.emailerrortext:""}
                    // success={emailState === "success"}
                    error={emailState === "error"}
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end"></InputAdornment>
                      ),
                      onChange: ((e) => {
                        if (this.verifyEmail(e.target.value)) {
                          this.setemailState("success");
                        } else {
                          this.setemailState("error");
                        }
                        this.setemail(e.target.value)
                      })
                    }}
                  />

                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="simple-select"
                      className={classes.selectLabel + " logDdLabel"}
                    >
                      Career Path
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={simpleSelect}
                      onChange={this.handleSimple}
                      inputProps={{
                        name: "simpleSelect",
                        id: "simple-select",
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

                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="racial-identity-select"
                      className={classes.selectLabel + " logDdLabel"}
                    >
                      Racial Identity
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={racialIdentitySelect}
                      onChange={this.handleRacialIdentity}
                      inputProps={{
                        name: "racial-identity",
                        id: "racial-identity-select",
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                        value={0}
                      >
                        Racial Identity
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={1}
                      >
                        Hispanic or Latino
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={2}
                      >
                        Black or African American (Not Hispanic or Latino)
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={3}
                      >
                        Native American or Alaska Native (Not Hispanic or Latino)
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={4}
                      >
                        Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={5}
                      >
                        Asian (Not Hispanic or Latino)
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={6}
                      >
                        White (Not Hispanic or Latino)
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={7}
                      >
                        Multi-Racial (Two or more races)
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <CustomInput
                    // helperText={(passwordState === "error")?this.state.passworderrortext:""}
                    // success={passwordState === "success"}
                    error={passwordState === "error"}
                    labelText="Password"
                    id="passwordLog"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end" style={{ 'cursor': 'pointer' }} onClick={(e) => { this.passwordShowHide() }}>
                          {(this.state.passwordShow)
                            ? <img
                              className={classes.inputAdornmentIcon}
                              src={EyeSlash}
                            ></img>
                            : <img
                              className={classes.inputAdornmentIcon}
                              src={EyeSlash}
                            ></img>
                          }
                        </InputAdornment>
                      ),
                      type: (this.state.passwordShow) ? "text" : "password",
                      autoComplete: "off",
                      onChange: ((e) => {
                        if (this.verifyPassword(e.target.value, 6)) {
                          this.setpasswordState("success");
                        } else {
                          this.setpasswordState("error");
                        }
                        this.setpassword(e.target.value)
                      })
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.bodyPadding}>
                  <GridContainer>
                    <GridItem sm={12} className={`${classes.singUpBlock} ${classes.singUpBlock1}`}>
                      By signing up you agree to our{" "}
                      <Link
                        href={termspage}
                        className={classes.signUpLink}
                        target={"_blank"}
                      >
                        Terms and Conditions.
                      </Link>
                    </GridItem>
                    <GridItem sm={12} className={classes.textCenter}>
                      <Button
                        color="info"
                        size="lg"
                        className={classes.logButton}
                        type="submit"
                        disabled={this.state.isdisable}
                      >
                        Sign Up
                      </Button>
                    </GridItem>
                    <GridItem
                      sm={12}
                      className={`${classes.textCenter} ${classes.singUpBlock}`}
                    >
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className={classes.signUpLink}
                      >
                        Sign In
                      </Link>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}


const mapStateToProps = state => {
  // console.log('in maptoprops:', state);

  return {
    user: state.authReducer.user,
    career_path: state.authReducer.career_path
  };
};


const mapDispatchToProps = { fetchCareerPath, registerUser };
const combinedStyles = combineStyles(styles, customSelect);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(RegisterPage));