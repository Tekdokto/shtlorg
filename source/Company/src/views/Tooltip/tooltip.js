import React from "react";
import './tooltip.css';
class CustomTooltip extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            position : (this.props.position)?this.props.position:"left",
            customClass : (this.props.customClass)?this.props.customClass:""
        }
    }

    render(){
        return(
        <div class="tooltip">{this.props.children}
        <span class={`tooltiptext ${this.state.position} ${this.state.customClass}`}>{this.props.title}</span>
        </div> 
        )
    }
}

export default CustomTooltip;