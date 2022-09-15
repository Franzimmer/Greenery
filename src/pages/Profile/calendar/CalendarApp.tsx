import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { unixTimeToString } from "../../../utils/helpers";
import { firebase } from "../../../utils/firebase";
import { PlantCard } from "../../../types/plantCardType";

let defaultState = {
  watering: [],
  fertilizing: [],
};
const CalendarApp = ({ id }: { id: string }) => {
  const [events, setEvents] = useState<Record<string, string[]>>(defaultState);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function getEventData() {
      let eventRef;
      let docName = unixTimeToString(value.getTime());
      const docSnapshot = await firebase.getEvent(docName, id);
      if (docSnapshot.exists()) {
        eventRef = docSnapshot.data();
        let cardList: PlantCard[] = [];
        let waterEvents = docSnapshot.data().watering;
        let fertilizeEvents = docSnapshot.data().fertilizing;
        let eventIds = waterEvents.concat(
          fertilizeEvents.filter(
            (item: string) => waterEvents.indexOf(item) < 0
          )
        );
        const querySnapshot = await firebase.getCards(eventIds);
        if (querySnapshot?.empty) return;
        querySnapshot!.forEach((doc) => {
          cardList.push(doc.data());
        });
        let waterRef = eventRef.watering.map((id: string) => {
          return cardList.find((card) => card.cardId === id)?.plantName;
        });
        let fertilizeRef = eventRef.fertilizing.map((id: string) => {
          return cardList.find((card) => card.cardId === id)?.plantName;
        });
        setEvents({
          watering: waterRef,
          fertilizing: fertilizeRef,
        });
      } else setEvents(defaultState);
    }
    getEventData();
  }, [id, value]);
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
