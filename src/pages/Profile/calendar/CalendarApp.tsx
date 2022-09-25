import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import { unixTimeToString } from "../../../utils/helpers";
import { firebase } from "../../../utils/firebase";
import { PlantCard } from "../../../store/types/plantCardType";
import CalenderContainer from "./CalendarContainer";
let defaultState = {
  watering: [],
  fertilizing: [],
};
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0px 18px 0px;
`;
const StyledFontAwesome = styled(FontAwesomeIcon)`
  width: 36px;
  height: 36px;
  margin-right: 16px;
  color: #5c836f;
`;
const Description = styled.p`
  font-size: 16px;
  letter-spacing: 1px;
`;
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
    <CalenderContainer>
      <Calendar onChange={onChange} value={value} locale="en-us" />
      {events.watering.length !== 0 && (
        <FlexWrapper>
          <StyledFontAwesome icon={faDroplet} />
          <Description>
            You have watered {events.watering.join()} on this day !
          </Description>
        </FlexWrapper>
      )}
      {events.fertilizing.length !== 0 && (
        <FlexWrapper>
          <StyledFontAwesome icon={faPersonDigging} />
          <Description>
            You have fertilized {events.fertilizing.join()} on this day !
          </Description>
        </FlexWrapper>
      )}
    </CalenderContainer>
  );
};

export default CalendarApp;
