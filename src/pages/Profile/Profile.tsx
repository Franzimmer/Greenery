import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { AuthorityActions } from "../../store/actions/authorityActions";
import UserInfoSection from "./UserInfoSection";
import ProfileMenu from "./ProfileMenu";
import Cards from "./cards/Cards";
import CalendarApp from "./calendar/CalendarApp";
import Gallery from "./gallery/Gallery";
import Favorites from "./favorites/Favorites";
import PageLoader from "../../components/GlobalStyles/PageLoader";
interface MainWrapperProps {
  $isLoading: boolean;
}
const MainWrapper = styled.div<MainWrapperProps>`
  display: ${(props) => (props.$isLoading ? "none" : "flex")};
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

  useEffect(() => {
    setIsLoading(true);
    setTabDisplay(defaultState);
    dispatch({
      type: AuthorityActions.JUDGE_IS_SELF,
      payload: {
        targetId: id,
        selfId: userInfo.userId,
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [dispatch, id, userInfo.userId]);

  return (
    <>
      {isLoading && <PageLoader />}
      <MainWrapper $isLoading={isLoading}>
        <UserInfoSection id={id} />
        <ProfileMenu tabDisplay={tabDisplay} setTabDisplay={setTabDisplay} />

        <Cards id={id} isLoading={isLoading} cardsDisplay={tabDisplay.Cards} />

        {tabDisplay.Calendar && (
          <CalendarApp id={id!} $show={tabDisplay.Calendar} />
        )}
        {tabDisplay.Gallery && <Gallery id={id} />}
        {tabDisplay.Favorites && <Favorites id={id} />}
      </MainWrapper>
    </>
  );
};

export default Profile;
