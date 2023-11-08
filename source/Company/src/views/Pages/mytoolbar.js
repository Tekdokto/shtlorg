import React,{ Component } from 'react'
import Button from "components/CustomButtons/Button.js";
import { withStyles } from "@material-ui/core/styles";

const customStyle = theme => ({
    bigCalendarTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    calendarMonth: {
        fontSize: "26px",
        textAlign: 'center',
        [theme.breakpoints.down("sm")]: {
            fontSize: "16px",
        }
    },
    mb30: {
        marginBottom: '30px'
    }
})
class MyToolbar extends Component{
    constructor(props){
        super(props);        
        this.props = props;
    }
    render(){
        const { classes } = this.props;
        return(
            // <div>
            //     <div>
            //         <button onClick={()=>{this.props.onNavigate("PREV",null)}}>Prev</button>
            //         <button disabled><h4>{this.props.label}</h4></button>
            //         <button onClick={()=>{this.props.onNavigate("NEXT",null)}}>Next</button>
            //     </div>
            // </div>
            <div className={classes.bigCalendarTop+' '+classes.mb30}>
                    <div>
                        <Button
                            color="info"
                            size="sm"
                            className={classes.blockButton}
                            onClick={() => { this.props.onNavigate("PREV", null) }}>
                            Prev
                        </Button>
                    </div>
                    <div className={classes.calendarMonth}>
                        {this.props.label}
                    </div>
                    <div>
                        <Button
                            color="info"
                            size="sm"
                            className={classes.blockButton}
                            onClick={() => { this.props.onNavigate("NEXT", null) }}>
                            Next
                        </Button>
                    </div>
                </div>
        )
    }
} 
export default withStyles(customStyle)(MyToolbar);