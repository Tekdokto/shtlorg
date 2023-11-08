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
import { listCategory,addCategory,editCategory,deleteCategory,resetCategoryNotifcation } from '../../redux/action'
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
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import circleEditOutline from "@iconify/icons-mdi/circle-edit-outline";
import { Icon as IconF, InlineIcon } from "@iconify/react";
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


class CategoryList extends Component{
    constructor(props){
        super(props);
        this.setAddCategoryModal = this.setAddCategoryModal.bind(this);
        this.setEditCategoryModal = this.setEditCategoryModal.bind(this);
        this.setViewCategoryModal = this.setViewCategoryModal.bind(this);
        
        this.setCategoryname = this.setCategoryname.bind(this);
        this.setCategorynameState = this.setCategorynameState.bind(this);
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
        }
    }
    componentDidMount(){
      // this.setData(dataTable);
    }
    showLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'block';
    }
  
    hideLoader() {
      let element = document.getElementById("Loader");
      element.style.display = 'none';
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
      this.props.listCategory({
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
          categories: props.categories,
          totalcategory : props.total_category          
        };   
      // }    
      // No state update necessary   
      // return null;    
    }
    setCategoryname(val=""){
        this.setState({categoryName:val});
    }
    setCategorynameState(val=""){
        this.setState({categoryNameState:val});
    }
    setAddCategoryModal(val=false){
        this.setState({addCategoryModal:val,iseditModal:false,categoryIdModal:0,categoryName:"",categoryNameState:"",view:false})
    }
    setEditCategoryModal(val="",id=0){
      this.setState({
        addCategoryModal: true,
        iseditModal : true,
        categoryName : val,
        categoryNameState:"",
        categoryIdModal : id
      })
    }
    setViewCategoryModal(val="",id=0){
      this.setState({
        addCategoryModal: true,
        iseditModal : true,
        categoryName : val,
        categoryNameState :"",
        categoryIdModal : id,
        view:true,
      })
    }
    setAlert(val=null){
      this.setState({alert:val})
    }
    verifyCategoryname(val){
        if(val.trim().length > 0){
            return true;
        }
        return false;
    }
    addCategory(){
      let admin_id = this.props.user.user_id;
        if(this.state.categoryName.trim() === ""){
            this.setCategorynameState("error");
        }
        let cat = {admin_id,category_name:this.state.categoryName,id:this.state.categoryIdModal}
        if(this.state.iseditModal){
          this.props.editCategory(cat,this.props.history);
        }else{
          this.props.addCategory(cat,this.props.history);
        }
        this.setCategoryname();
        this.setAddCategoryModal();
        this.setState({iseditModal:false,categoryIdModal:0})
        this.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
    }  
    deleteCategory(id){
      let admin_id = this.props.user.user_id;
      this.props.deleteCategory({admin_id,id,status: 2},this.props.history);
      this.setAlert();
      this.getDataFromDb({page: this.state.page,pageSize: PAGE_SIZE,sorted:[],filtered:[]});
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
          confirmBtnCssClass={classes.button + " " + classes.info}
          cancelBtnCssClass={classes.button + " " + classes.info}
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
          career_name: prop['career_name'],
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              
              <CustomTooltip title="View" position="right"><VisibilityOutlinedIcon className="vertical-middle pointer" fontSize="large" style={{ 'width': '24px' }}  onClick={() => {
              ths.setViewCategoryModal(prop['career_name'],prop['id'])
            }} /> </CustomTooltip>
                
             {" "}
             <CustomTooltip title="Edit" position="left"><IconF
                  icon={circleEditOutline}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                  onClick={(e) => ths.setEditCategoryModal(prop['career_name'],prop['id'])}
                /></CustomTooltip>{" "}
            {" "}
            <CustomTooltip title="Delete" position="left"><DeleteOutlineIcon
                  style={{ cursor: "pointer", title: "Delete" }}
                  onClick={(e) => this.warningWithConfirmAndCancelMessage(prop['id'])}
                /></CustomTooltip>
              {" "}
  
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
                <h1>Career Path Management</h1>
                <h5>Manage Career Path</h5>
              </GridItem>
              <GridItem sm={4} className={classes.rightLeftResponsive}>
              <Button
                color="info"
                size="md"
                className={`${classes.newButton} ${classes.mt30}`}
                onClick={() => this.setAddCategoryModal(true)}
              >
                + Career Path
              </Button>
              </GridItem>
            </GridContainer>
    
        
            <GridContainer>
            <GridItem xs={12}>
              <Card className="paddingTopBottom cardCustom">
                <CardHeader className="cardTitle1 cardCustomHeader position-relative">
                Career Path Detail
                  
                </CardHeader>
                  <CardBody className="cardCustomBody">
                    <ReactTableFixedColumns
                      noDataText={"No data found"}
                      data={this.createTablecontent(this.state.categories)}
                      filterable
                      PaginationComponent={UpdatedPagination}
                      columns={[
                        {
                          Header: "#",
                          accessor: "sr_no",
                          width: 80,
                          sortable: false,
                          filterable: false
                        },
                        {
                          Header: "Career Path",
                          accessor: "career_name",
                          width: 300,
                          sortable: true,
                          filterable: true
                        },
                        
                        {
                          Header: "Actions",
                          accessor: "actions",
                          width: 150,
                          fixed: "right",
                          sortable: false,
                          filterable: false
                        }
                      ]}
                      defaultPageSize={PAGE_SIZE}
                      pages={Math.ceil(this.state.totalcategory / PAGE_SIZE)}
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
                    <h4 className={classes.modalTitle}>{(this.state.view)?'View Career Path':(this.state.iseditModal)?'Edit Career Path':'Add Career Path'}</h4>
                  </DialogTitle>
                  <DialogContent
                    id="modal-slide-description"
                    className={classes.modalBody}
                  >
                    <GridContainer>
                      <GridItem xs={12}>
                      <CustomInput
                     // helperText={this.state.categoryNameState}
                                        success={this.state.categoryNameState === "success"}
                                        error={this.state.categoryNameState === "error"}
                                        labelText="Career Path Name"
                                        id="category"
                                        formControlProps={{
                                        fullWidth: true
                                        }}
                                        inputProps={{
                                        value : this.state.categoryName,
                                        onChange: event => {
                                            if (this.verifyCategoryname(event.target.value)) {
                                                this.setCategorynameState("success");
                                            } else {
                                                this.setCategorynameState("error");
                                            }
                                            this.setCategoryname(event.target.value);
                                        },
                                        type: "text",
                                        disabled:(this.state.view)?true:false,
                                        }}
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
                color={(this.props.user_error) ? "danger" : "info"}
                icon={AddAlert}
                message={`${this.props.notification_message}`}
                open={this.props.shownotification}
                closeNotification={() => {
                  this.props.resetVideoNotifcation();
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
    shownotification: state.categoryReducer.shownotification,
    category_error : state.categoryReducer.category_error,    
    categories : state.categoryReducer.categories,
    total_category : state.categoryReducer.total_category,
    notification_message:state.categoryReducer.notification_message
  };
};
const combinedStyles = combineStyles(customStyle,modalStyles, styles);
const mapDispatchToProps = { listCategory,addCategory,editCategory,deleteCategory,resetCategoryNotifcation };
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(combinedStyles)(CategoryList))