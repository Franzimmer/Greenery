import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { auth } from "../../utils/firebase";
import UserInfoSection from "./UserInfoSection";
import ProfileMenu from "./ProfileMenu";
import Cards from "./cards/Cards";
import CalendarApp from "./calendar/CalendarApp";
import Gallery from "./gallery/Gallery";
import Favorites from "./favorites/Favorites";

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 100px auto 50px;
  width: 80vw;
  height: 100%;
`;
export interface TabDisplayType {
  Cards: boolean;
  Calendar: boolean;
  Gallery: boolean;
  Favorites: boolean;
}
export const defaultState = {
  Cards: true,
  Calendar: false,
  Gallery: false,
  Favorites: false,
};
const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [tabDisplay, setTabDisplay] = useState<TabDisplayType>(defaultState);
  const { id } = useParams();
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (id === userInfo.userId) setIsSelf(true);
    else setIsSelf(false);
  }, [id, userInfo]);

  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  console.log(isSelf);
  return (
    <MainWrapper>
      <UserInfoSection id={id} isSelf={isSelf} isLoggedIn={isLoggedIn} />
      <ProfileMenu tabDisplay={tabDisplay} setTabDisplay={setTabDisplay} />
      {tabDisplay.Cards && (
        <Cards id={id} isSelf={isSelf} isLoggedIn={isLoggedIn} />
      )}
      {tabDisplay.Calendar && <CalendarApp id={id!} />}
      {tabDisplay.Gallery && <Gallery id={id} isSelf={isSelf} />}
      {tabDisplay.Favorites && (
        <Favorites id={id} isSelf={isSelf} setTabDisplay={setTabDisplay} />
      )}
    </MainWrapper>
  );
};

export default Profile;
