import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import UserInfoSection from "./UserInfoSection";
import ProfileMenu from "./ProfileMenu";
import CardsGrid from "./cards/CardsGrid";
import CalendarApp from "./calendar/CalendarApp";
import Gallery from "./gallery/Gallery";

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
    Gallery: false,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSelf, setIsSelf] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (!id) {
        alert("此頁面不存在");
        navigate("/");
      }
      if (user) {
        const userId = user.uid;
        if (id === userId) setIsSelf(true);
      }
    });
  }, []);
  return (
    <Wrapper>
      <MainWrapper>
        <UserInfoSection id={id} isSelf={isSelf} />
        <ProfileMenu setTabDisplay={setTabDisplay} />
        {tabDisplay.Cards && <CardsGrid id={id} isSelf={isSelf} />}
        {tabDisplay.Calendar && <CalendarApp />}
        {tabDisplay.Gallery && <Gallery id={id} isSelf={isSelf} />}
      </MainWrapper>
      <SideBar>
        <h3>SideBar Here</h3>
      </SideBar>
    </Wrapper>
  );
};

export default Profile;
