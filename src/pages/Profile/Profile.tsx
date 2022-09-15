import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import UserInfoSection from "./UserInfoSection";
import ProfileMenu from "./ProfileMenu";
import Cards from "./cards/Cards";
import CalendarApp from "./calendar/CalendarApp";
import Gallery from "./gallery/Gallery";
import Favorites from "./favorites/Favorites";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";

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
export const defaultState = {
  Cards: true,
  Calendar: false,
  Gallery: false,
  Favorites: false,
};
const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [tabDisplay, setTabDisplay] = useState<Record<string, boolean>>(
    defaultState
  );
  const { id } = useParams();
  const [isSelf, setIsSelf] = useState<boolean>(false);

  useEffect(() => {
    if (id === userInfo.userId) setIsSelf(true);
    else setIsSelf(false);
  }, [id]);
  return (
    <Wrapper>
      <MainWrapper>
        <UserInfoSection id={id} isSelf={isSelf} />
        <ProfileMenu setTabDisplay={setTabDisplay} />
        {tabDisplay.Cards && <Cards id={id} isSelf={isSelf} />}
        {tabDisplay.Calendar && <CalendarApp id={id!} />}
        {tabDisplay.Gallery && <Gallery id={id} isSelf={isSelf} />}
        {tabDisplay.Favorites && (
          <Favorites id={id} isSelf={isSelf} setTabDisplay={setTabDisplay} />
        )}
      </MainWrapper>
    </Wrapper>
  );
};

export default Profile;
