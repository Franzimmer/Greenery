import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlantCard } from "../../../store/types/plantCardType";
import { firebase } from "../../../utils/firebase";
import { unixTimeToString } from "../../../utils/helpers";
import CalenderContainer from "./CalendarContainer";
import { faDroplet, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import "react-calendar/dist/Calendar.css";
let defaultState = {
  watering: [],
  fertilizing: [],
};
interface SectionWrapperProps {
  $show: boolean;
}
const SectionWrapper = styled.div<SectionWrapperProps>`
  opacity: ${(props) => (props.$show ? "1" : "0")};
  transition: 1s;
`;
const FlexWrapper = styled.div`
  width: 70vw;
  display: flex;
  align-items: center;
  margin: 12px auto 18px auto;
`;
const StyledFontAwesome = styled(FontAwesomeIcon)`
  width: 36px;
  height: 36px;
  margin-right: 16px;
  color: ${(props) => props.theme.colors.main};
  @media (max-width: 1000px) {
    width: 26px;
    height: 26px;
  }
  @media (max-width: 800px) {
    width: 20px;
    height: 20px;
  }
`;
const Description = styled.p`
  font-size: 16px;
  letter-spacing: 1px;
  @media (max-width: 800px) {
    font-size: 14px;
    letter-spacing: 0.5px;
  }
`;
interface CalendarAppProps {
  id: string;
  $show: boolean;
}
const CalendarApp = ({ id, $show }: CalendarAppProps) => {
  const [events, setEvents] = useState<Record<string, string[]>>(defaultState);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function getEventData() {
      let eventRef;
      const docName = unixTimeToString(value.getTime());
      const docSnapshot = await firebase.getEvent(docName, id);
      if (docSnapshot.exists()) {
        eventRef = docSnapshot.data();
        const cardList: PlantCard[] = [];
        const waterEvents = docSnapshot.data().watering;
        const fertilizeEvents = docSnapshot.data().fertilizing;
        const eventIds = waterEvents.concat(
          fertilizeEvents.filter(
            (item: string) => waterEvents.indexOf(item) < 0
          )
        );
        const querySnapshot = await firebase.getCardsByIds(eventIds);
        if (querySnapshot?.empty) return;
        querySnapshot!.forEach((doc) => {
          cardList.push(doc.data());
        });
        const waterRef = eventRef.watering.map((id: string) => {
          return cardList.find((card) => card.cardId === id)?.plantName;
        });
        const fertilizeRef = eventRef.fertilizing.map((id: string) => {
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
    <SectionWrapper $show={$show}>
      <CalenderContainer>
        <Calendar onChange={onChange} value={value} locale="en-us" />
        {events.watering.length !== 0 && (
          <FlexWrapper>
            <StyledFontAwesome icon={faDroplet} />
            <Description>
              You have watered <strong>{events.watering.join()}</strong> on this
              day !
            </Description>
          </FlexWrapper>
        )}
        {events.fertilizing.length !== 0 && (
          <FlexWrapper>
            <StyledFontAwesome icon={faPersonDigging} />
            <Description>
              You have fertilized <strong>{events.fertilizing.join()}</strong>{" "}
              on this day !
            </Description>
          </FlexWrapper>
        )}
      </CalenderContainer>
    </SectionWrapper>
  );
};

export default CalendarApp;
