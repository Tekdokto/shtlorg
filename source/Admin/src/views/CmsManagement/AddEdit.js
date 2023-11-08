import React, { Component } from "react";
import { connect } from 'react-redux';
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// material ui icons
import Contacts from "@material-ui/icons/Contacts";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import { editCms } from '../../redux/action'
// style for this view
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
const quillModules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
         {'indent': '-1'}, {'indent': '+1'}],
        ['link'],
        ['clean']
    ],
};

const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
];

class UserAddEdit extends Component {
    constructor(props) {
        super(props);
        this.addUser = this.addUser.bind(this);
        this.handleChangeQuillStandard = this.handleChangeQuillStandard.bind(this);
        this.state = {
            isEditPage: false,
            title: "",
            titleState: "",
            content: "",
            contentState: "",
            user_id: 0,
            alert: null
        }
    }
    handleChangeQuillStandard = content => {
        this.setState({ content });
    };
    componentDidMount() {
        console.log("IN MOUNT:", this.props)
        this.setState({
            users: (this.props.edit_user_obj) ? this.props.users : [],
            isEditPage: (this.props.edit_user_obj) ? true : false,
            title: (this.props.edit_user_obj) ? (this.props.edit_user_obj['title'] ? this.props.edit_user_obj['title'] : "") : "",
            content: (this.props.edit_user_obj) ? (this.props.edit_user_obj['content'] ? this.props.edit_user_obj['content'] : "") : "",
            cms_id: (this.props.edit_user_obj) ? (this.props.edit_user_obj['id'] ? this.props.edit_user_obj['id'] : 0) : 0,

        })
    }

    setAlert(val = null) {
        this.setState({ alert: val })
    }
    verifyString(val, len = 1) {
        console.log('val', val, len);

        if (val.trim().length >= len) {
            return true
        }
        return false;
    }

    settitle(val = "") {
        this.setState({ title: val })
    }
    settitleState(val = "") {
        this.setState({ titleState: val })
    }

    setcontent(val = "") {
        this.setState({ content: val })
    }
    setcontentState(val = "") {
        this.setState({ contentState: val })
    }



    addUser() {

        console.log(this.state.content)
        var editorcontent = this.state.content.replace(/<(.|\n)*?>/g, '');
       
        if (!this.verifyString(this.state.title, 2)) {
            this.settitleState("error");
        }else if (!this.verifyString(editorcontent, 2)) {
            this.setcontentState("error");
        }
        else if (this.verifyString(this.state.title, 2) && editorcontent) {
            let admin_id = this.props.user.user_id
            let user = {
                admin_id,
                'id': this.state.cms_id,
                'title': this.state.title,
                'content': this.state.content,

            }
            console.log("USER OBJECT:", user);

            this.props.editCms(user, this.props.history);

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="main-right-panel">
                <GridContainer>
                    <GridItem xs={12}>
                        <h1>{(this.state.isEditPage === false) ? "Add Content" : "Edit Content"}</h1>
                        <h5>Edit page content</h5>
                    </GridItem>

                </GridContainer>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardBody>
                                <form>
                                    <CustomInput
                                        success={this.state.titleState === "success"}
                                        error={this.state.titleState === "error"}

                                        labelText="Title*"
                                        id="title"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => {
                                                if (this.verifyString(event.target.value, 3)) {
                                                    this.settitleState("success");
                                                } else {
                                                    this.settitleState("error");
                                                }
                                                this.settitle(event.target.value);
                                            },
                                            value: this.state.title,
                                            type: "text"
                                        }}
                                    />
                                    {/* <CustomInput
                            success={this.state.contentState === "success"}
                            error={this.state.contentState === "error"}
                            labelText="Content*"
                            id="content"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            onChange: event => {
                                if (this.verifyString(event.target.value,3)) {
                                    this.setcontentState("success");
                                } else {
                                    this.setcontentState("error");
                                }
                                this.setcontent(event.target.value);
                            },
                            value: this.state.content,
                            type: "text"
                            }}
                        /> */}
                                    <ReactQuill
                                        className="mt30"
                                        theme="snow"
                                        value={this.state.content}
                                        onChange={
                                            this
                                                .handleChangeQuillStandard
                                        }
                                        modules={quillModules}
                                        formats={quillFormats}
                                    />


                                    <div className={classes.formCategory}>
                                        <small>*</small> Required fields
                        </div>
                                    <div className={classes.center + " mb30"}>
                                        <Button color="info"
                                            round className="mr15" round onClick={this.addUser}>
                                            {(this.state.isEditPage === false) ? "Add Content" : "Edit Content"}
                                        </Button>
                                        <Button color="info"
                                            round onClick={() => { this.props.history.push('/admin/content/list') }}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <Snackbar
                        place="tr"
                        color={(this.props.user_error) ? "danger" : "info"}
                        icon={AddAlert}
                        message={`${this.props.notification_message}`}
                        open={this.props.shownotification}
                        closeNotification={() => {

                        }}
                        close
                    />
                </GridContainer>

            </div>
        )
    }
}

const mapStateToProps = state => {
    // console.log('in maptoprops:',state);

    return {
        user: state.authReducer.user,
        shownotification: state.userReducer.shownotification,
        user_error: state.userReducer.user_error,
        edit_user_id: state.cmsReducer.edit_user_id,
        edit_user_obj: state.cmsReducer.edit_user_obj,
        total_user: state.cmsReducer.total_user,
        notification_message: state.cmsReducer.notification_message
    };
};
const mapDispatchToProps = { editCms };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserAddEdit))