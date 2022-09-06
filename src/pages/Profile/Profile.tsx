import React, { useState } from "react";
import styled from "styled-components";
import UserInfoSection from "./UserInfoSection";
import ProfileMenu from "./ProfileMenu";
import CardsGrid from "./cards/CardsGrid";
import CalendarApp from "./calendar/CalendarApp";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 20px;
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const SideBar = styled.div`
  border-left: 1px solid black;
  margin-left: 10px;
  padding-left: 5px;
  height: 400px;
`;

const Profile = () => {
  const [tabDisplay, setTabDisplay] = useState<Record<string, boolean>>({
    Cards: true,
    Calendar: false,
  });
  return (
    <Wrapper>
      <MainWrapper>
        <UserInfoSection />
        <ProfileMenu setTabDisplay={setTabDisplay} />
        {tabDisplay.Cards && <CardsGrid />}
        {tabDisplay.Calendar && <CalendarApp />}
      </MainWrapper>
      <SideBar>
        <h3>SideBar Here</h3>
      </SideBar>
    </Wrapper>
  );
};

export default Profile;
