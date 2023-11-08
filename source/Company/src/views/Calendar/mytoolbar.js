import React, { Component } from 'react'
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
            <div>
                {/* <div>
                    <button onClick={()=>{this.props.onNavigate("PREV",null)}}>Prev</button>
                    <button disabled><h4>{this.props.label}</h4></button>
                    <button onClick={()=>{this.props.onNavigate("NEXT",null)}}>Next</button>
                </div> */}
                <div className={combineClass.bigCalendarTop}>
                    <div>
                        <button
                            color="info"
                            size="sm"
                            className={classes.blockButton}
                            onClick={() => { this.props.onNavigate("PREV", null) }}>
                            Prev
                        </button>
                    </div>
                    <div className={classes.calendarMonth}>
                        {this.props.label}
                    </div>
                    <div>
                        <button
                            color="info"
                            size="sm"
                            className={classes.blockButton}
                            onClick={() => { this.props.onNavigate("NEXT", null) }}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
export default withStyles(customStyle)(MyToolbar);