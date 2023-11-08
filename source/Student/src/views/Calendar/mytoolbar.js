import React, { Component } from 'react'
import Button from "components/CustomButtons/Button.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import customStyle from "assets/jss/customStyle";
const useCustomStyle = makeStyles(customStyle);
class MyToolbar extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { classes } = this.props;
        const combineClass = { ...classes.bigCalendarTop, ...classes.mb30 }
        return (
            <div className={`${classes.bigCalendarTop} ${classes.mb30}`}>
                      <div>
                        <Button
                          color="info"
                          size="sm"
                          className={`${classes.blockButton}`}
                          onClick={() => { this.props.onNavigate("PREV", null) }}
                        >
                          Prev
                    </Button>
                      </div>
                      <div className={classes.calendarMonth}>{this.props.label}</div>
                      <div>
                        <Button
                          color="info"
                          size="sm"
                          className={`${classes.blockButton}`}
                          onClick={() => { this.props.onNavigate("NEXT", null) }}
                        >
                          Next
                    </Button>
                      </div>
                    </div>            
        )
    }
}
export default withStyles(customStyle)(MyToolbar);