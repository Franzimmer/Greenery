import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { CardsActions } from "../../actions/cardsActions";
import { auth } from "../../utils/firebase";
import PageLoader from "../../components/GlobalStyles/PageLoader";
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
  const { id } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [tabDisplay, setTabDisplay] = useState<TabDisplayType>(defaultState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSelf, setIsSelf] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: CardsActions.CLEAR_CARDS_DATA,
    });
    if (id === userInfo.userId) setIsSelf(true);
    else setIsSelf(false);
    setTimeout(() => setIsLoading(false), 3000);
  }, [id, userInfo]);

  return (
    <>
      {isLoading && <PageLoader />}
      {!isLoading && (
        <MainWrapper>
          <UserInfoSection id={id} isSelf={isSelf} />
          <ProfileMenu tabDisplay={tabDisplay} setTabDisplay={setTabDisplay} />
          {tabDisplay.Cards && (
            <Cards id={id} isSelf={isSelf} setIsLoading={setIsLoading} />
          )}
          {tabDisplay.Calendar && <CalendarApp id={id!} />}
          {tabDisplay.Gallery && <Gallery id={id} isSelf={isSelf} />}
          {tabDisplay.Favorites && (
            <Favorites id={id} isSelf={isSelf} setTabDisplay={setTabDisplay} />
          )}
        </MainWrapper>
      )}
    </>
  );
};

export default Profile;
