/*eslint-disable*/
import React from "react";
// react components used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// react component used to create alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Done from "@material-ui/icons/Done";

// core components
import Heading from "components/Heading/Heading.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import MyToolbar from "./mytoolbar.js";
import Select from 'react-select';

import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";

import { events as calendarEvents } from "variables/general.js";
import CardHeader from "components/Card/CardHeader.js";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(styles);
const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
  { value: 'four', label: 'Four' },
  { value: 'five', label: 'Five' },
  { value: 'six', label: 'Six' },
  { value: 'seven', label: 'Seven' },
  { value: 'eight', label: 'Eight' }
];

export default function Calendar() {
  const classes = useStyles();
  const [events, setEvents] = React.useState(calendarEvents);
  const [alert, setAlert] = React.useState(null);
  const [selectedDate, setselectedDate] = React.useState(moment().format("Do MMMM, YYYY"));
  const selectedEvent = event => {
    window.alert(event.title);
  };
  const addNewEventAlert = slotInfo => {
    dateSelected(slotInfo);
    // setAlert(
    //   <SweetAlert
    //     input
    //     showCancel
    //     style={{ display: "block", marginTop: "-100px" }}
    //     title="Input something"
    //     onConfirm={e => addNewEvent(e, slotInfo)}
    //     onCancel={() => hideAlert()}
    //     confirmBtnCssClass={classes.button + " " + classes.success}
    //     cancelBtnCssClass={classes.button + " " + classes.danger}
    //   />
    // );
  };
  const addNewEvent = (e, slotInfo) => {
    var newEvents = events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end
    });
    setAlert(null);
    setEvents(newEvents);
  };
  const dateSelected = (slotInfo) => {
    let eve = [];
    eve.push({
      title: <Done/>,
      start: slotInfo.end,
      end: slotInfo.end
    })
    setEvents(eve);
  }
  const hideAlert = () => {
    setAlert(null);
  };
  const eventColors = event => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };  
       
  function logChange(val) {
      // console.log("Selected: " + JSON.stringify(val));
  }
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={4} lg={4}>
        <Card>
            <CardHeader>
              <h4 textAlign="center">Multiselect Dropdown</h4>
            </CardHeader>
            <CardBody>
              <Select
                name="form-field-name"
                defaultValue={options}
                isMulti
                options={options}   
                onChange={logChange}                     
              />
            </CardBody>
        </Card>
        </GridItem>
      </GridContainer>
      <Heading
        textAlign="center"
        title="React Big Calendar"
        category={
          <span>
            A beautiful react component made by{" "}
            <a
              href="https://github.com/intljusticemission?ref=creativetim"
              target="_blank"
            >
              International Justice Mission
            </a>
            . Please checkout their{" "}
            <a
              href="https://github.com/intljusticemission/react-big-calendar?ref=creativetim"
              target="_blank"
            >
              full documentation.
            </a>
          </span>
        }
      />
      {alert}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardBody calendar>
              <BigCalendar
                selectable
                localizer={localizer}
                events={events}
                components ={ {toolbar: MyToolbar}}                
                defaultView={'month'}
                views={['month']}
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                onSelectEvent={event => selectedEvent(event)}
                onSelectSlot={slotInfo => addNewEventAlert(slotInfo)}
                eventPropGetter={eventColors}
              />
            </CardBody>
          </Card>
        </GridItem>        
      </GridContainer>      
    </div>
  );
}
