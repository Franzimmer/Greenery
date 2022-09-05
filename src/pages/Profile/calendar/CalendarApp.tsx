import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarAppProps {
  $display: boolean;
}
const CalendarApp = ({ $display }: CalendarAppProps) => {
  const [value, onChange] = useState(new Date());

  let displayProp = $display ? "block" : "none";
  return (
    <div style={{ display: displayProp }}>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default CalendarApp;
