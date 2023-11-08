import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import EditIcon from '../../assets/img/close-icon.svg';

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


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(styles);
const useCheckStyles = makeStyles(checkBoxStyle);
const useModalStyles = makeStyles(modalStyles);
const useSelectStyles = makeStyles(customSelect);
const useButtonStyles = makeStyles(buttonStyles);
const useCustomSpace = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const useCustomStyle = makeStyles(customStyle);

export default function Dashboard() {
  const classes = useStyles();
  const classesCustom = useCustomSpace();
  const customStyle = useCustomStyle();
  const checkBoxStyle = useCheckStyles();
  const selectStyle = useSelectStyles();
  const modalStyle = useModalStyles();

  const [modal, setModal] = React.useState(false);
  const [checked, setChecked] = React.useState([24, 22]);
  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const [simpleSelect, setSimpleSelect] = React.useState("");
  const handleSimple = (event) => {
    setSimpleSelect(event.target.value);
  };

  function showFilter() {
    let element = document.getElementById("filterBar");
    element.classList.add("show-filter");
  }

  function hideFilter() {
    let element = document.getElementById("filterBar");
    element.classList.remove("show-filter");
  }

  return (
    <div className="main-right-panel">
      <GridContainer>
        <GridItem xs={12} sm={8}>
          <h1>Company User Management</h1>
          <h5>Manage Company User</h5>
        </GridItem>
        <GridItem sm={4} className={customStyle.rightLeftResponsive}>
          <Button
            color="info"
            size="md"
            className={`${customStyle.newButton} ${customStyle.mt30}`}
          >
            + Company
          </Button>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card className="paddingTopBottom cardCustom">
            <CardHeader className="cardTitle1 cardCustomHeader position-relative">
              Search Engineers
              <Link className="showFilter" onClick={showFilter}>
                <img src={filterIcon} alt="" className={customStyle.filterIcon}></img>
              </Link>
            </CardHeader>
            <CardBody className="cardCustomBody">
              <Table
                striped
                tableHead={[
                  "#",
                  "Company User",
                  "Role",
                  "Company Name",
                  "Created date",
                  "Action",
                ]}
                tableData={[
                  ["1", "Company User 1", "Project Manager", "IBM", "15-07-2019", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["2", "Company User 2", "HR", "Amazon", "06-08-2019", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["3", "Company User 3", "Project Manager", "Apple", "23-10-2019", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["4", "Company User 4", "CTO", "Microsoft", "20-11-2019", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["5", "Company User 5", "CEO", "Facebook", "04-12-2019", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["6", "Company User 6", "HR", "Google", "21-02-2020", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                  ["7", "Company User 7", "Project Manager", "Samsung", "30-03-2020", [<VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" onClick={() => setModal(true)} style={{ 'width': '24px' }} />, <img src={EditIcon} className={`${customStyle.ml15} ${customStyle.mr15}`} style={{ 'width': '18px' }}></img>, <PowerSettingsNewIcon className="vertical-middle" fontSize="large" style={{ 'width': '24px' }} />]],
                ]}
                customCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customClassesForCells={[0, 5, 6]}
                customHeadCellClasses={[
                  classes.center,
                  classes.right,
                  classes.right,
                ]}
                // 0 is for classes.center, 5 is for classes.right, 6 is for classes.right
                customHeadClassesForCells={[0, 5, 6]}
              />
            </CardBody>
          </Card>
          <div className={`${customStyle.textCenter} ${customStyle.dBlock}`}>
            <Paginations
              pages={[
                { text: <ChevronLeftRoundedIcon /> },
                { active: true, text: 1 },
                { text: 2 },
                { text: <ChevronRightRoundedIcon /> }
              ]}
              color="info"
            />

            {/* Modal Start */}
            <Dialog
              modalStyle={{
                root: modalStyle.center,
                paper: modalStyle.modal
              }}
              open={modal}
              transition={Transition}
              keepMounted
              onClose={() => setModal(false)}
              aria-labelledby="modal-slide-title"
              aria-describedby="modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={modalStyle.modalHeader + " modal-header modal-title-border"}
              >
                <Button
                  justIcon
                  className={modalStyle.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="transparent"
                  onClick={() => setModal(false)}
                >
                  <Close className={modalStyle.modalClose} />
                </Button>
                <h4 className={modalStyle.modalTitle}>User Create Form</h4>
              </DialogTitle>
              <DialogContent
                id="modal-slide-description"
                className={modalStyle.modalBody}
              >
                <GridContainer>
                  <GridItem xs={6}>
                    <CustomInput
                      labelText="User Full Name"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                      labelText="Title/Role"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      labelText="User Email Address"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="emailLog"
                      type="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <h4 className="block-title mt30">Company Details</h4>
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                      labelText="User Full Name"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6}>
                    <CustomInput
                      labelText="Title/Role"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <CustomInput
                      labelText="User Email Address"
                      id="emailLog"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end"></InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>

              </DialogContent>
              <DialogActions
                className={modalStyle.modalFooter + " " + modalStyle.modalFooterCenter}
              >
                <Button onClick={() => setModal(false)} className={`${customStyle.outlineButton} ${customStyle.mr15} ${customStyle.mt30} ${customStyle.mb30}`}>Cancel</Button>
                <Button
                  onClick={() => setModal(false)}
                  color="info"
                  size="lg"
                  className={`${customStyle.blockButton} ${customStyle.mt30} ${customStyle.mb30}`}
                >
                  + New Skill
                </Button>
              </DialogActions>
            </Dialog>
            {/* Modal Ends */}

          </div>
        </GridItem>
      </GridContainer>
      <div className={customStyle.filterBar + " filterbar"} id="filterBar">
        <h3>Filter
          <Link onClick={hideFilter} className="pointer">
            <img src={CloseIcon} alt='' className={customStyle.filterCloseIcon}></img>
          </Link>
        </h3>
        <Accordion
          active={0}
          collapses={[
            {
              title: "Skills",
              content:
                <div className={`${customStyle.filterOptions} ${customStyle.px30}`}>
                  <ul className={customStyle.simpleList}>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="Front-End"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="Backend"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="React"
                      />
                    </li>
                  </ul>
                </div>
            },
            {
              title: "Location ",
              content:
                <div className={`${customStyle.filterOptions} ${customStyle.px30}`}>
                  <ul className={customStyle.simpleList}>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="MO"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="NY"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="BOS"
                      />
                    </li>
                  </ul>
                </div>
            },
            {
              title: "Career Path ",
              content:
                <div className={`${customStyle.filterOptions} ${customStyle.px30}`}>
                  <ul className={customStyle.simpleList}>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="Front-End"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="Backend"
                      />
                    </li>
                    <li>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(21)}
                            checkedIcon={<Check className={checkBoxStyle.checkedIcon} />}
                            icon={<Check className={checkBoxStyle.uncheckedIcon} />}
                            classes={{
                              checked: checkBoxStyle.checked,
                              root: checkBoxStyle.checkRoot
                            }}
                          />
                        }
                        classes={{ label: checkBoxStyle.label }}
                        label="React"
                      />
                    </li>
                  </ul>
                </div>
            }
          ]}
        />
        <Button
          color="info"
          size="lg"
          className={`${customStyle.blockButton} ${customStyle.m30}`}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
