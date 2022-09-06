import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { unixTimeToString } from "../cards/CardEditor";
import { db } from "../../../utils/firebase";
import { doc, getDoc, collection } from "firebase/firestore";

const CalendarApp = () => {
  let defaultState = {
    watering: [],
    fertilizing: [],
  };
  const [events, setEvents] = useState<Record<string, string[]>>(defaultState);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function getEventData() {
      let docName = unixTimeToString(value.getTime());
      const activitiesRef = collection(db, "users", "test", "activities");
      let docRef = doc(activitiesRef, docName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvents(docSnap.data());
      } else setEvents(defaultState);
    }
    getEventData();
  }, [value]);
  return (
    <div>
      <Calendar onChange={onChange} value={value} />
      {events.watering.length !== 0 && (
        <>
          <span>澆水紀錄</span>
          <p>爲 {events.watering.join()} 澆過水了！</p>
        </>
      )}
      {events.fertilizing.length !== 0 && (
        <>
          <span>施肥紀錄</span>
          <p>為 {events.fertilizing.join()} 施肥了！</p>
        </>
      )}
    </div>
  );
};

export default CalendarApp;
