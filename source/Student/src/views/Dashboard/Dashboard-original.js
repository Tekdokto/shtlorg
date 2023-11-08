import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from 'react-redux';



import Icon from "@material-ui/core/Icon";



// import InfoOutline from "@material-ui/icons/InfoOutline";


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";

import CardFooter from "components/Card/CardFooter.js";


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { resetNotification,dashboard } from '../../redux/action'



class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totaluser:'',
      notification: false
    }
  }
  setNotify(val=true){
    console.log('in set notification',val);
    
    this.setState({notification:val})
    let ths = this;
    setTimeout(()=>{
      ths.setState({notification:false})
    },2000)
    this.props.resetNotification();
  }
  componentDidMount(){  
    let admin_id = this.props.user.user_id
    this.props.dashboard({
      admin_id:admin_id
    },this.props.history);  
    
  }
  componentWillReceiveProps(props) {
   
    if(props.dashboard_count && props.dashboard_count.data){
      this.setState({totaluser:props.dashboard_count.data.totaluser})
    }
  }


  render() {
    const { classes } = this.props;
    const { totaluser } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Total Users</p>
                <h3 className={classes.cardTitle}>
                  {totaluser}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                 
                  <NavLink to="/admin/user-management/list">
                    View Users
                  </NavLink>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          
        </GridContainer>
        
     
       </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object
};



 const mapStateToProps = state => {
  // console.log('in maptoprops:',state);
  
  return {
    user: state.authReducer.user,
    dashboard_count  : state.authReducer.dashboard_count,
      shownotification: state.authReducer.shownotification,
      loginerror : state.authReducer.loginerror,    
      notification_message:state.authReducer.notification_message
  };
};
const mapDispatchToProps = { dashboard,resetNotification };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));