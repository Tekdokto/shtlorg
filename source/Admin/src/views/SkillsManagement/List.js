import React, { Component } from "react";
import { connect } from 'react-redux';
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Edit from "@material-ui/icons/Edit";
import Remove from "@material-ui/icons/Remove";
import Dvr from "@material-ui/icons/Dvr";
import Slide from "@material-ui/core/Slide";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Contacts from "@material-ui/icons/Contacts";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import { Icon as IconF, InlineIcon } from "@iconify/react";
import CategoryIcon from '@material-ui/icons/Category';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// checkbox
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// Select dropdown
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { addCategory,editCategory,resetCategoryNotifcation
        ,listSubCategory,addSubCategory,editSubCategory,changeSubCategoryStatus,fetchCareerPath } from '../../redux/action'
import modalStyles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import customStyle from "assets/jss/customStyle";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import modalStlye from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import styles1 from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import UpdatedPagination from "../paginationupdated.js";
import combineStyles from "../../combineStyles.js"
import customSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { PAGE_SIZE } from "../../constants/defaultValues.js";
import CustomTooltip  from "../Tooltip/tooltip"
// Import React Table HOC Fixed columns
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
    
  },
  ...sweetAlertStyle
};


class SkillsList extends Component{
    constructor(props){
        super(props);
        this.setAddCategoryModal = this.setAddCategoryModal.bind(this);
        this.setEditCategoryModal = this.setEditCategoryModal.bind(this);
        this.setViewCategoryModal = this.setViewCategoryModal.bind(this); 
        this.handleCareerPath = this.handleCareerPath.bind(this);
        this.handleIsDefault = this.handleIsDefault.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.state = { 
            data : [],
            categories : [],
            totalcategory : 0,
            page : 0,
            pagesize : 5,
            addCategoryModal: false,
            iseditModal : false,
            categoryIdModal: 0,
            categoryName: "",
            categoryNameState : "",
            alert: null,
            view:false,
            career_path : [], //Master data
            skills : props.skills,
            total_sub_category : props.total_sub_category,
            id : 0,
            skill_name : "",
            skill_nameState : "",
            skill_key : "",
            skill_keyState : "",
            skill_url : "",
            skill_urlState : "",
            career_path_id : "",
            is_default  : false
        }
    }
    componentDidMount(){
      // this.setData(dataTable);
      this.props.fetchCareerPath()
    }
    getDataFromDb(state){
      let ths = this;
    ths.showLoader();
      let sorted,order;
      let filtered = {}
      if(state.sorted.length > 0){
        sorted = state.sorted[0].id
      }
      if(state.sorted.length > 0){
        if(state.sorted[0].desc == false){
          order = 1
        }else{
          order = -1
        }
      }
      if(state.filtered.length > 0){
        state.filtered.forEach(element => {
          filtered[element.id] = element.value;
        });
      }

      let admin_id = this.props.user.user_id
      console.log('admin_id',this.props.user);
      this.props.listSubCategory({
        admin_id:admin_id,
        page: state.page,
        page_size: state.pageSize,
        sort_param: sorted,
        order: order,
        filtred : filtered
      },this.props.history);  
      setTimeout(()=>{
        ths.hideLoader()
      },1500)    
    }
    static getDerivedStateFromProps(props, state) {
      // ...
      // console.log("props cattt",props);
      // console.log("props state cattt",state);
      // if (props.id !== state.prevId) {        
        return {   
          career_path : props.career_path,
          skills : props.skills,
          total_sub_category : props.total_sub_category,     
          categories: props.categories,
          totalcategory : props.total_category          
        };   
      // }    
      // No state update necessary   
      // return null;    
    }
    setSkillname(val=""){
        this.setState({skill_name:val});
    }
    setSkillnameState(val=""){
        this.setState({skill_nameState:val});
    }
    setSkillKey(val=""){
        this.setState({skill_key:val});
    }
    setSkillKeyState(val=""){
        this.setState({skill_keyState:val});
    }
    setSkillUrl(val=""){
        this.setState({skill_url:val});
    }
    setSkillUrlState(val=""){
        this.setState({skill_urlState:val});
    }
    handleIsDefault(e){
        this.setState({is_default:e.target.checked});
    }
    handleCareerPath(e){
        this.setState({career_path_id:e.target.value});
    }
    setAddCategoryModal(val=false){
        this.setState({addCategoryModal:val,iseditModal:false,id : 0,skill_name :"",skill_nameState:"", skill_url : "",skill_urlState:"",skill_key : "",skill_keyState:"", career_path_id : 0 ,is_default : false,view:false})
    }
    setEditCategoryModal(id,skill_name,career_name,skill_url,skill_key,career_path_id,is_default_skill){
      console.log("is_default",is_default_skill)
      this.setState({
        id:id,
        skill_name:skill_name,
        skill_nameState :"",
        career_name:career_name,        
        skill_url:skill_url,
        skill_urlState : "",
        skill_key:skill_key,
        skill_keyState : "",
        career_path_id : career_path_id,
        is_default : is_default_skill,
        addCategoryModal: true,
        iseditModal : true        
      })
    }
    setViewCategoryModal(id,skill_name,career_name,skill_url,skill_key,career_path_id,is_default_skill){
      console.log("is_default",is_default_skill)
      this.setState({
        id:id,
        skill_name:skill_name,
        skill_nameState : "",
        career_name:career_name,        
        skill_url:skill_url,
        skill_urlState : "",
        skill_key:skill_key,
        skill_keyState : "",
        career_path_id : career_path_id,
        is_default : is_default_skill,
        addCategoryModal: true,
        iseditModal : true,        
        view:true,
      })
    }
    setAlert(val=null){
      this.setState({alert:val})
    }
    verifyLength(val){
      if(val.trim().length > 0){
        return true;
      }
      return false;
    }

    verifyURL(val){
      if(val.trim().length > 0){
        var urlcheck =/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if (urlcheck.test(val)) {
            return true;
          }else{
            return false;
          }
            
      }else{
        return true;
      }
     
        
    }
    verifyCategoryname(val){
        if(val.trim().length > 0){
            return true;
        }
        return false;
    }
    addCategory(){
      let admin_id = this.props.user.user_id;
      let { skill_name, id , skill_url ,skill_key , career_path_id , is_default } = this.state;
      console.log("this.state",this.state)
        if(!this.verifyLength(skill_name)){
            this.setSkillnameState("error");
            return false;
        }
        if(is_default){
          if(!this.verifyLength(skill_key)){
            console.log("this.state erro",skill_key)
              this.setSkillKeyState("error");
              return false;
          }
          if((!this.verifyLength(skill_url)) || (!this.verifyURL(skill_url))){
              this.setSkillUrlState("error");
              return false;
          }
        }
        if((this.verifyLength(skill_url)) && (!this.verifyURL(skill_url))){
            this.setSkillUrlState("error");
            return false;
        }
       
        if(!(career_path_id != "" && career_path_id != 0)){
            // this.setSkillnameState("error");
            return false
        }

        let add_update_object = {admin_id,id,skill_name , skill_url ,skill_key , career_path_id , is_default_skill : (is_default)?'1':'0'}
        console.log("add_update_object",add_update_object)
        if(this.state.iseditModal){
          this.props.editSubCategory(add_update_object,this.props.history);
        }else{
          this.props.addSubCategory(add_update_object,this.props.history);
        }
        this.setSkillname();
        this.setSkillKey();
        this.setSkillUrl();        
        this.setAddCategoryModal();        
        let ths = this;
        setTimeout(()=>{
          ths.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
        },1500)
    }  
    deleteCategory(id){
      let admin_id = this.props.user.user_id;
      this.props.changeSubCategoryStatus({admin_id,id,status: 2},this.props.history);
      this.setAlert();
      this.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
    }
    showLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'block';
    }
  
    hideLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'none';
    }
    warningWithConfirmAndCancelMessage(id){
      let ths = this;
      const { classes } = this.props;
      this.setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-200px" }}
          title="Do you want to delete it, Sure?"
          onConfirm={() => ths.deleteCategory(id)}
          onCancel={() => ths.setAlert()}
          confirmBtnCssClass={classes.button + " " + classes.success}
          cancelBtnCssClass={classes.button + " " + classes.danger}
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >          
        </SweetAlert>
      );
    };
    createTablecontent(data){
      const { classes } = this.props;
      let ths = this;
      return (data.length > 0) ? data.map((prop, key) => {
        return {
          sr_no: (PAGE_SIZE * this.state.page) + key + 1,
          skill_name: prop['skill_name'],
          career_name: prop['career_name'],
          skill_url: (prop['skill_url'])?(<a href={prop['skill_url']} target="_blank">Link</a>):'',
          skill_key: prop['skill_key'],          
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
                <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" style={{ 'width': '24px' }}  onClick={() => {
                      ths.setViewCategoryModal(prop['id'],prop['skill_name'],prop['career_name'],prop['skill_url'],prop['skill_key'],prop['career_path_id'],prop['is_default_skill'])
                    }} /> </CustomTooltip>
                
             {" "}
             <CustomTooltip title="Edit" position="left"><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={(e) => this.setEditCategoryModal(prop['id'],prop['skill_name'],prop['career_name'],prop['skill_url'],prop['skill_key'],prop['career_path_id'],prop['is_default_skill'])}
                /></CustomTooltip>{" "}
             {/* <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      ths.setEditCategoryModal(prop['career_name'],prop['id'])
                    }}
                    color="info"
                    className="like"
                  >
                    Edit
                  </Button>{" "} */}
              {/* use this button to remove the data row */}
              <CustomTooltip title="Delete" position="left"><DeleteOutlineIcon
                  style={{ cursor: "pointer", title: "Delete" }}
                  onClick={(e) => this.warningWithConfirmAndCancelMessage(prop['id'])}
                /></CustomTooltip>
              {/* <Button
                justIcon
                round
                simple
                onClick={() => {
                  this.warningWithConfirmAndCancelMessage(prop['id']);
                }}
                color="danger"
                className="remove"
              >
                <Close />
              </Button>{" "} */}
  
            </div>
          )
        };
      }) : []
    }
    render(){
      console.log("lete",this.state)      
        // let { data } = this.state;
        const { classes } = this.props;
        return (
            <div className="main-right-panel">
            <GridContainer>
              <GridItem xs={12} sm={8}>
                <h1>Skills Management</h1>
                <h5>Manage Skills</h5>
              </GridItem>
              <GridItem sm={4} className={classes.rightLeftResponsive}>
              <Button
                color="info"
                size="md"
                className={`${classes.newButton} ${classes.mt30}`}
                onClick={() => this.setAddCategoryModal(true)}
              >
                + Skills
              </Button>
              </GridItem>
            </GridContainer>
    
        
            <GridContainer>
            <GridItem xs={12}>
              <Card className="paddingTopBottom cardCustom">
                <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Skills Detail
                  
                </CardHeader>
                  <CardBody className="cardCustomBody">
                    <ReactTableFixedColumns
                     noDataText={"No data found"}
                      data={this.createTablecontent(this.state.skills)}
                      filterable
                      PaginationComponent={UpdatedPagination}
                      columns={[
                        {
                          Header: "#",
                          accessor: "sr_no",
                          width: 50,
                          sortable: false,
                          filterable: false
                        },
                        {
                          Header: "Skills",
                          accessor: "skill_name",
                          width: 150,
                          sortable: true,
                          filterable: true
                        },                        
                        {
                          Header: "Career Path",
                          accessor: "career_name",
                          width: 150,
                          sortable: true,
                          filterable: true
                        },
                        {
                          Header: "Exam URL",
                          accessor: "skill_url",
                          width: 120,
                          sortable: false,
                          filterable: false
                        },
                        {
                          Header: "Exam ID",
                          accessor: "skill_key",
                          width: 160,
                          sortable: true,
                          filterable: true
                        },
                        {
                          Header: "Action",
                          accessor: "actions",
                          width: 130,
                          fixed: "right",
                          sortable: false,
                          filterable: false
                        }
                      ]}
                      defaultPageSize={PAGE_SIZE}
                      pages={Math.ceil(this.state.total_sub_category / PAGE_SIZE)}
                      showPaginationBottom={true}
                      className="-striped -highlight"
                      manual
                      onFetchData={(state, instance) => {
                        // show the loading overlay                        
                        // fetch your data   
                        console.log("STATEL:", state)
                        this.setState({ page: state.page, pagesize: state.pageSize })
                        this.getDataFromDb(state);
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>
              {/* Modal Start */}
              <Dialog
                  modalStyle={{
                    root: classes.center,
                    paper: classes.modal
                  }}
                  open={this.state.addCategoryModal}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => this.setAddCategoryModal(false)}
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
                      onClick={() => this.setAddCategoryModal(false)}
                    >
                      <Close className={classes.modalClose} />
                    </Button>
                    <h4 className={classes.modalTitle}>{(this.state.view)?'View Skill':(this.state.iseditModal)?'Edit Skill':'Add Skill'}</h4>
                  </DialogTitle>
                  <DialogContent
                    id="modal-slide-description"
                    className={classes.modalBody}
                  >
                    <GridContainer>
                      <GridItem md={6} xs={12}>
                      <CustomInput
                     // helperText={this.state.categoryNameState}
                        success={this.state.skill_nameState === "success"}
                        error={this.state.skill_nameState === "error"}
                        labelText="Skill Name"
                        id="skill_name"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                        value : this.state.skill_name,
                        onChange: event => {
                            if (this.verifyLength(event.target.value)) {
                                this.setSkillnameState("success");
                            } else {
                                this.setSkillnameState("error");
                            }
                            this.setSkillname(event.target.value);
                        },
                        type: "text",
                        disabled:(this.state.view)?true:false,
                        }}
                      /> 
                      </GridItem>

                      <GridItem md={6} xs={12} className={classes.mt10}>
                        <FormControl fullWidth className={classes.selectFormControl}>
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
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
                            value={this.state.career_path_id}
                            onChange={this.handleCareerPath}
                            inputProps={{
                              name: "simpleSelect",
                              id: "simple-select",
                            }}
                            disabled={(this.state.view)?true:false}
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
                            {(this.state.career_path)?this.state.career_path.map((career)=>{
                              
                                return <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={career.id}
                                >
                                  {career.career_name}
                                </MenuItem>
                              
                            }):null}                      
                          </Select>
                        </FormControl>
                      </GridItem>

                      <GridItem xs={12}>
                      <CustomInput
                     // helperText={this.state.categoryNameState}
                        success={this.state.skill_keyState === "success"}
                        error={this.state.skill_keyState === "error"}
                        labelText="Exam ID"
                        id="careerpath"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value : this.state.skill_key,
                          onChange: event => {
                              
                              this.setSkillKey(event.target.value);
                          },
                          type: "text",
                          disabled:(this.state.view)?true:false,
                        }}
                      />                      
                      </GridItem>
                      <GridItem xs={12}>
                      <CustomInput
                     // helperText={this.state.categoryNameState}
                        success={this.state.skill_urlState === "success"}
                        error={this.state.skill_urlState === "error"}
                        labelText="Exam URL"
                        id="skill_key"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value : this.state.skill_url,
                          onChange: event => {
                              if(this.verifyURL(event.target.value)) {
                                  this.setSkillUrlState("success");
                              }else{
                                  this.setSkillUrlState("error");
                              }
                              this.setSkillUrl(event.target.value);
                          },
                          type: "text",
                          disabled:(this.state.view)?true:false,
                        }}
                      />
                      </GridItem>
                      <GridItem xs={12}>
                        <FormControlLabel
                          className={classes.rememberOne}
                          id="rememberOne"
                          control={
                            <Checkbox
                              disabled={(this.state.view)?true:false}
                              checked={this.state.is_default}
                              onChange={this.handleIsDefault}
                              name="checkedA"
                              color="primary"
                            />
                          }
                          label="Default Exam for this Career Path"
                        />
                      </GridItem>
                    </GridContainer>
    
                  </DialogContent>
                  <DialogActions
                    className={classes.modalFooter + " " + classes.modalFooterCenter}
                  >
                  {(!this.state.view)? 
                  <Button
                      onClick={this.addCategory}
                      color="info"
                      size="lg"
                      className={`${classes.blockButton} ${classes.mt30} ${classes.mb30}`}
                    >
                      Submit
                    </Button>
                    :
                    ''
                  }
                  </DialogActions>
                </Dialog>
                {/* Modal Ends */}
              {this.state.alert}
              {/* <Snackbar
                place="tr"
                color={(this.props.subcategory_error) ? "danger" : "info"}
                icon={AddAlert}
                message={`${this.props.notification_message}`}
                open={this.props.shownotification}
                closeNotification={() => {
                  // this.props.resetVideoNotifcation();
                }}
                close
              /> */}
            </GridContainer>
          </div>
  
          )
    }
}
const mapStateToProps = state => {
  console.log('in maptoprops:',state);
  
  return {
    user: state.authReducer.user,
    career_path : state.authReducer.career_path,
    // shownotification: state.categoryReducer.shownotification,
    category_error : state.categoryReducer.category_error,    
    categories : state.categoryReducer.categories,
    total_category : state.categoryReducer.total_category,
    // notification_message:state.categoryReducer.notification_message,
    skills : state.subcategory.subcategories,
    total_sub_category : state.subcategory.total_sub_category,
    subcategory_error: state.subcategory.subcategory_error,
    shownotification: state.subcategory.shownotification,
    notification_message: state.subcategory.notification_message,
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles,customSelect, styles);
const mapDispatchToProps = { addCategory,editCategory,resetCategoryNotifcation
  ,listSubCategory,addSubCategory,editSubCategory,changeSubCategoryStatus,fetchCareerPath };
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(SkillsList))