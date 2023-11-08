import React from "react";
import { connect } from "react-redux";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";

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
import IBMLOGO from "../../assets/img/IBM-Logo.png";
import NoImg from "../../assets/img/no-image.jpg";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Table from "components/Table/Table.js";
import Link from "@material-ui/core/Link";

import CloseIcon from "../../assets/img/close-icon.svg"
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "constants/defaultValues.js";
import combineStyles from "../../combineStyles";



import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import checkBoxStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import customStyle from "assets/jss/customStyle";

import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";

import buttonStyles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import { logoutUser } from "../../redux/action";
import Avatar from 'react-avatar-edit';
import AvatarEditor from 'react-avatar-editor'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(styles);
const useButtonStyles = makeStyles(buttonStyles);
const useCustomSpace1 = {
  root: {
    flexGrow: 1,
  }
}
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomStyle = makeStyles(customStyle);

class EditCompanySpecSheet extends React.Component {
  // const classes = useStyles();
  // const classesCustom = useCustomSpace();
  // const customStyle = useCustomStyle();

  // const [state, setState] = React.useState({
  //   checkedA: true
  // });

  constructor(props) {
    super(props);
    this.props = props;
    this.setHandleCompanySize = this.setHandleCompanySize.bind(this);
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFileLoad = this.onFileLoad.bind(this);
    this.loadImageFail = this.loadImageFail.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.state = {
      company_id: 0,
      logo: "",
      company_selected_logo: null,
      company_final_selected_logo: null,
      primary_company_address: "",
      primary_company_addressState: "",
      size_of_company: 0,
      size_of_companyState: "",
      company_culture: "",
      company_cultureState: "",
      offer_any: "",
      offer_any_other_text: "",
      what_does_company_do: "",
      what_does_company_doState: "",
      why_join: "",
      offer_any: "",
      offer_any_other_text: "",
      modal: false,
      perks: [
        {
          "id": 1,
          "key": "Generous_Vacation",
          "name": "Generous Vacation",
          "value": false
        },
        {
          "id": 2,
          "key": "Free_Food",
          "name": "Free Food",
          "value": false
        },
        {
          "id": 3,
          "key": "Gym_Fitness",
          "name": "Gym/Fitness",
          "value": false
        },
        {
          "id": 4,
          "key": "Travel",
          "name": "Travel",
          "value": false
        },
        {
          "id": 5,
          "key": "Company_retreats",
          "name": "Company retreats",
          "value": false
        },
        {
          "id": 6,
          "key": "Happy Hours",
          "name": "Happy_Hours",
          "value": false
        },
        {
          "id": 7,
          "key": "401k contribution",
          "name": "401k_contribution",
          "value": false
        },
        {
          "id": 8,
          "key": "Philanthropic contributions",
          "name": "Philanthropic_contributions",
          "value": false
        },
        {
          "id": 9,
          "key": "Team activities",
          "name": "Team_activities",
          "value": false
        },
        {
          "id": 10,
          "key": "Health insurance",
          "name": "Health_insurance",
          "value": false
        },
        {
          "id": 11,
          "key": "Flexible hours",
          "name": "Flexible_hours",
          "value": false
        }
      ]
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
    let ths = this;
    this.fetchSpecSheetList(this.props.user_id)
    ths.showLoader();
    setTimeout(() => {
      ths.hideLoader()
    }, 500)
  }

  handleChange = event => {
    // console.log("EVEMNT:",event.target.name,event.target.checked,event.target.value);
    let perks = this.state.perks;
    let temp_perks = perks;
    let filtered = temp_perks[event.target.name]
    filtered.value = event.target.checked;
    temp_perks[event.target.name] = filtered;
    // let temp_perks = [...perks,{"key":event.target.name,"name":event.target.value,"value":event.target.name}]
    this.setState({ perks: temp_perks });
  };


  verifyLength(val, length) {
    if (val.length >= length) {
      return true;
    }
    return false;
  }

  setModal(val = false, callSave = false) {
    if (callSave) {
      this.onClickSave()
    }
    this.setState({
      modal: val
    })
  }

  setPrimaryAddress(val = "") {
    this.setState({
      primary_company_address: val
    })
  }

  setPrimaryAddressState(val = "") {
    this.setState({
      primary_company_addressState: val
    })
  }


  setHandleCompanySize(e) {
    this.setState({
      size_of_company: e.target.value
    })
  }


  setWhatDoesCompanyDo(val = "") {
    this.setState({
      what_does_company_do: val
    })
  }

  setWhyJoin(val = "") {
    this.setState({
      why_join: val
    })
  }

  setWhatDoesCompanyDoState(val = "") {
    this.setState({
      what_does_company_doState: val
    })
  }

  setCompanyCulture(val = "") {
    this.setState({
      company_culture: val
    })
  }

  setCompanyCultureState(val = "") {
    this.setState({
      company_cultureState: val
    })
  }

  setPrimaryAddress(val = "") {
    this.setState({
      primary_company_address: val
    })
  }

  onClose() {
    this.setState({ company_selected_logo: null, company_final_selected_logo: null, modal: false })
  }

  onCrop(company_selected_logo) {
    this.setState({ company_selected_logo })
  }
  onFileLoad(file) {
    // console.log("File:",file)
    this.setState({
      company_selected_logo: file
    })
  }

  setEditorRef = (editor) => this.editor = editor

  onClickSave = () => {
    let ths = this;
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage().toDataURL();
      // console.log("sdfSD:",canvas)
      let imageURL;
      fetch(canvas)
        .then(res => res.blob())
        .then(blob => (ths.setState({ company_final_selected_logo: window.URL.createObjectURL(blob) })));

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }

  onImageChange(img) {
    // console.log("img;");

  }

  loadImageFail() {
    this.setState({
      company_selected_logo: null
    })
  }

  setDefaultPerks(val) {
    let temp_perks = this.state.perks;
    temp_perks = temp_perks.map((perk) => {
      if (val.includes(perk.id)) {
        perk.value = true;
        // console.log("PERKS",perk)
        return perk
      } else {
        return perk;
      }
    })
    this.setState({ perks: temp_perks })
  }


  setofferAnyOther(val) {
    this.setState({
      offer_any_other_text: val
    })
  }

  async fetchSpecSheetList(id) {
    let params = {}
    params.watchlist_id = id;
    params.user_id = this.props.user.user_id;
    let response = await this.fetchSpecSheetCall(params);
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
        this.props.history.push('/company/dashboard')
      } else {
        if (response.data) {
          // console.log("SPECSHEET DATTA:",response)
          this.setState({
            company_id: response.data.company_id,
            logo: response.data.logo,
            primary_company_address: (response.data.primary_company_address) ? response.data.primary_company_address : "",
            size_of_company: (response.data.size_of_company) ? +(response.data.size_of_company) : "",
            company_culture: (response.data.company_culture) ? response.data.company_culture : "",
            offer_any: (response.data.offer_any) ? this.setDefaultPerks(response.data.offer_any) : "",
            offer_any_other_text: (response.data.offer_any_other_text) ? response.data.offer_any_other_text : "",
            what_does_company_do: (response.data.what_does_company_do) ? response.data.what_does_company_do : "",
            why_join: (response.data.why_join) ? response.data.why_join : ""
          })
        }
      }
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async fetchSpecSheetCall(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }

    const res = await axios.post(`${API_URL}/company/user/getspecsheet`, params, headers);
    return await res.data;
  }

  onEditSpecSheet(e, val = {}) {
    let ths = this;
    // console.log("val1",val)
    val.company_id = this.state.company_id;
    if (!(this.verifyLength(val.primary_company_address, 1))) {
      toast.error("Please write primary address of company.")
      this.setPrimaryAddressState("error")
    } else if (!(val.size_of_company && val.size_of_company !== "")) {
      toast.error("Please select size of company.")
    } else if (!(this.verifyLength(val.what_does_company_do, 1))) {
      toast.error("Please write what company do.")
      this.setWhatDoesCompanyDoState("error")
    } else if (!(this.verifyLength(val.company_culture, 1))) {
      toast.error("Please write about company culture.")
      this.setCompanyCultureState("error")
    }
    let temp_arr = this.state.perks.filter((perk) => { if (perk.value === true) { return perk } })
    let get_id = temp_arr.map((prk) => prk.id)
    let offer_any = get_id.join(",")
    // console.log("conditions",this.state,get_id,temp_arr,offer_any,this.verifyLength(val.primary_company_address,1),this.verifyLength(val.what_does_company_do,1))
    if (this.verifyLength(val.primary_company_address, 1) && this.verifyLength(val.company_culture, 1)
      && this.verifyLength(val.what_does_company_do, 1) && val.size_of_company && val.size_of_company !== "") {
      // console.log("val",val)
      let formdata = new FormData()
      formdata.append('user_id', ths.props.user.user_id)
      formdata.append('company_id', val.company_id)
      formdata.append('primary_company_address', val.primary_company_address)
      formdata.append('what_does_company_do', val.what_does_company_do)
      formdata.append('size_of_company', val.size_of_company)
      formdata.append('company_culture', val.company_culture)
      formdata.append('why_join', val.why_join)
      formdata.append('offer_any', offer_any)
      formdata.append('offer_any_other_text', val.offer_any_other_text)
      if (this.state.company_selected_logo) {
        formdata.append('profile_pic', this.state.company_selected_logo)
      }
      this.editSpecsheetReqest(formdata)
    }


    e.preventDefault();
  }


  async editSpecsheetReqest(params) {
    let ths = this;
    let response = await this.editSpecSheetRequest(params);
    //   console.log("DATTA:",response)
    if (response.status !== -2) {
      if (response.status === false) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }
      setTimeout(function () {
        ths.fetchSpecSheetList(ths.props.user_id)
      }, 500)
    } else {
      this.props.logoutUser(this.props.history)
    }
  }

  async editSpecSheetRequest(params) {
    let User = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
    let token = (User) ? ((User.token) ? User.token : '') : '';
    let headers = { headers: { token: `${token}` } }
    // get_watchlist.filtred = this.state.filter;
    const res = await axios.post(`${API_URL}/company/user/updatespecsheet`, params, headers);
    return await res.data;
  }



  preventDefault = event => event.preventDefault();


  render() {
    // console.log("STATE:",this.state)
    const { classes } = this.props;
    let { primary_company_address, size_of_company, company_culture, what_does_company_do, why_join, offer_any, offer_any_other_text } = this.state;
    return (
      <div className="main-right-panel">
        <GridContainer>
          <GridItem>
            <h1>Company Profile</h1>
            <h5>Enter your company information</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12}>
            <Card className="paddingTopBottom cardCustom">
              <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Edit company profile
            </CardHeader>
              <CardBody className="cardCustomBody">
                <GridContainer spacing={6}>
                  <GridItem xs={12}>
                    <div className="indicationMessage">Candidates will see this information so make it meaningful</div>
                  </GridItem>                  
                  <GridItem xs={12} md={5}>
                    <label className={classes.dBlock + " label"}>Company Logo</label>
                    <Button
                      color="info"
                      size="xs"
                      className={classes.imgEditIcnButton}
                      onClick={e => { this.setModal(true) }}
                    >
                      <BorderColorIcon />
                    </Button>
                    <img src={(this.state.company_final_selected_logo) ? this.state.company_final_selected_logo : ((this.state.logo !== "") ? this.state.logo : NoImg)}></img>
                  </GridItem>
                  <GridItem xs={12} md={7}>
                    <CustomInput
                      // success = {this.state.primary_company_addressState === "success"}
                      error={this.state.primary_company_addressState === "error"}
                      labelText="Primary Company Address"
                      id="float"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.primary_company_address,
                        multiline: true,
                        rows: 2,
                        onChange: ((e) => {
                          if (this.verifyLength(e.target.value, 1)) {
                            this.setPrimaryAddressState("success")
                          } else {
                            this.setPrimaryAddressState("error")
                          }
                          this.setPrimaryAddress(e.target.value)
                        })
                      }}
                    />
                    <FormControl fullWidth className={classes.selectFormControl} >
                      <InputLabel htmlFor="experience-level-select" className={classes.selectLabel} >
                        What is the size of your company?*
                    </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={this.state.size_of_company}
                        onChange={this.setHandleCompanySize}
                        inputProps={{
                          name: "experience",
                          id: "experience-level",
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={0}
                        >
                          Select Company Size
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={1}
                        >
                          {"<10"}
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={2}
                        >
                          11-50
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={3}
                        >
                          51-100
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={4}
                        >
                          101-500
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={5}
                        >
                          500-1000
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                          value={6}
                        >
                          1000+
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {/* <CustomInput
                    labelText="What is the size of your company?*"
                    id="float"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 2
                    }}
                  /> */}
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      // success = {this.state.what_does_company_doState === "success"}
                      error={this.state.what_does_company_doState === "error"}
                      labelText=" What does your company do?*"
                      id="whatdo"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.what_does_company_do,
                        multiline: true,
                        rows: 3,
                        onChange: ((e) => {
                          if (this.verifyLength(e.target.value, 1)) {
                            this.setWhatDoesCompanyDoState("success");
                          } else {
                            this.setWhatDoesCompanyDoState("error");
                          }
                          this.setWhatDoesCompanyDo(e.target.value)
                        })
                      }}
                    />
                    <CustomInput
                      // success = {this.state.company_cultureState === "success"}
                      error={this.state.company_cultureState === "error"}
                      labelText="What is your company culture?*"
                      id="culture"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.company_culture,
                        multiline: true,
                        rows: 3,
                        onChange: ((e) => {
                          if (this.verifyLength(e.target.value, 1)) {
                            this.setCompanyCultureState("success");
                          } else {
                            this.setCompanyCultureState("error");
                          }
                          this.setCompanyCulture(e.target.value);
                        })
                      }}
                    />
                    <CustomInput
                      labelText="Why join? Write 3 quick sentences on what makes your company awesome."
                      id="whyjoin"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.why_join,
                        multiline: true,
                        rows: 3,
                        onChange: ((e) => {
                          this.setWhyJoin(e.target.value)
                        })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <label className={`${classes.dBlock} ${classes.mt30}` + " label"}> Do you offer any of the following perks?</label>
                  </GridItem>
                  {this.state.perks.map((perk, index) => <GridItem xs={12} md={6} lg={3}>
                    <FormControlLabel
                      className={classes.rememberOne}
                      id={`${perk.key}`}
                      control={
                        <Checkbox
                          checked={perk.value}
                          onChange={this.handleChange}
                          name={`${index}`}
                          color="primary"
                        />
                      }
                      label={`${perk.name}`}
                    />
                  </GridItem>)}
                  {/* <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Free Food"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Gym/Fitness"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Travel"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Philanthropic contribution"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Team activities"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Health insurance"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="Flexible hours"
                  />
                </GridItem>
                <GridItem xs={12} md={3}>
                  <FormControlLabel
                    className={classes.rememberOne}
                    id="rememberOne"
                    control={
                      <Checkbox
                        checked={this.state.checkedA}
                        onChange={this.handleChange}
                        name="checkedA"
                        color="primary"
                      />
                    }
                    label="401k contribution"
                  />
                </GridItem> */}
                  <GridItem xs={12} md={3}>
                    <CustomInput
                      labelText="Others (if any)"
                      id="float"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.offer_any_other_text,
                        multiline: false,
                        onChange: ((e) => {
                          this.setofferAnyOther(e.target.value)
                        })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} className={classes.textCenter}>
                    <Button
                      color="info"
                      size="lg"
                      className={`${classes.newButton} ${classes.mt30}`}
                      onClick={(e) => this.onEditSpecSheet(e, { primary_company_address, company_culture, size_of_company, why_join, what_does_company_do, offer_any, offer_any_other_text })}
                    >
                      Submit
                  </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            <Dialog
              modalStyle={{
                root: classes.center,
                paper: classes.modal
              }}
              open={this.state.modal}
              transition={Transition}
              keepMounted
              onClose={() => this.onClose()}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader + " modal-header modal-title-border"}
              >
                <Button
                  justIcon
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => this.onClose()}
                >
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Select Profile Picture</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer justify="center">
                  <GridItem xs={5}>
                    {!(this.state.company_selected_logo) ? <Avatar
                      width={'100%'}
                      height={295}
                      imageHeight={200}
                      minCropRadius={100}
                      onFileLoad={this.onFileLoad}
                      src={this.state.company_selected_logo}
                    /> :
                      <AvatarEditor
                        ref={this.setEditorRef}
                        image={this.state.company_selected_logo}
                        width={300}
                        height={200}
                        onLoadFailure={this.loadImageFail}
                        onImageChange={this.onImageChange}
                        border={50}
                        rotate={0}
                      />}
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter + " " + classes.root}
              >
                {/* <Button color="gray" size="lg" onClick={() => this.setModal(false)} className={`${customStyle.outlineButton} ${customStyle.mt30} ${customStyle.mb30}`}>Cancel</Button> */}
                <Button
                  onClick={(e) => this.setModal(false, true)}
                  color="info"
                  size="lg"
                  className={`${customStyle.blockButton} ${customStyle.mt30} ${customStyle.mb30}`}
                >
                  Done
                </Button>
              </DialogActions>
            </Dialog>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('in maptoprops:',state);
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = { logoutUser };
const combinedStyles = combineStyles(
  styles,
  useCustomSpace1,
  customStyle,
  customSelectStyle
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(combinedStyles)(EditCompanySpecSheet));

