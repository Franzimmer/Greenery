import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { unixTimeToString } from "../cards/CardEditor";
import { db, cards } from "../../../utils/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
  DocumentData,
} from "firebase/firestore";
import { PlantCard } from "../../../types/plantCardType";

const CalendarApp = ({ id }: { id: string }) => {
  let defaultState = {
    watering: [],
    fertilizing: [],
  };
  const [events, setEvents] = useState<Record<string, string[]>>(defaultState);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function getEventData() {
      let eventRef;
      let docName = unixTimeToString(value.getTime());
      const activitiesRef = collection(db, "users", id, "activities");
      let docRef = doc(activitiesRef, docName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        eventRef = docSnap.data();
        let cardList: DocumentData[] = [];
        let waterEvents = docSnap.data().watering;
        let fertilizeEvents = docSnap.data().fertilizing;
        let eventIds = waterEvents.concat(
          fertilizeEvents.filter(
            (item: string) => waterEvents.indexOf(item) < 0
          )
        );
        const q = query(cards, where("cardId", "in", eventIds));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
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
