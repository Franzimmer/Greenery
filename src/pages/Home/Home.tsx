import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { UserInfoActions } from "../../store/actions/userInfoActions";
import { popUpActions } from "../../store/reducer/popUpReducer";
import { PlantCard } from "../../store/types/plantCardType";
import { UserInfo } from "../../store/types/userInfoType";
import { firebase } from "../../utils/firebase";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
import { PlantImg, Tag, TagsWrapper } from "../Profile/cards/Cards";
import { Card, NameText, SpeciesText } from "../Profile/cards/CardsGrid";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import {
  faBook,
  faBookmark,
  faAnglesDown,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  FavIconButton,
  DiaryIconBtn,
  StyledFontAwesomeIcon,
} from "../Profile/favorites/FavGrids";
import DiaryEditor from "../../components/Diary/DiaryEditor";
import DetailedCard from "../../components/DetailCard/DetailedCard";
import PageLoader from "../../components/GlobalStyles/PageLoader";
import defaultImg from "../../assets/default.jpg";
import rubber from "./rubber.png";
import eucari from "./eucari.png";
import main from "./main.webp";
import feature from "./feature.jpeg";
import taquila from "./taquila.png";
import coconut from "./coconut.png";

interface WrapperProps {
  isLoading: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  width: 80vw;
  margin: 150px auto 50px;
  opacity: ${(props) => (props.isLoading ? "0" : "1")};
`;
const Banner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 95vh;
  padding: 10vh 10vw;
`;
const jump = keyframes`
  0% {
    transform: translateX(-45vw) translateY(0);
  }
  50% {
    transform: translateX(-45vw) translateY(-8px);
  }
  100% {
    transform: translateX(-45vw) translateY(0);
  }
`;
const ExploreWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  width: 100px;
  color: #224229;
  position: absolute;
  right: 0;
  bottom: 0;
  animation: 1s ease ${jump} infinite;
`;
const ArrowIcon = styled(FontAwesomeIcon)`
  color: #224229;
  width: 20px;
  height: 20px;
  margin: 0 12px 0 0;
`;
const showOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const MainStyleWrapper = styled.div`
  display: flex;
  justify-content: center;
  opacity: 0;
  animation: ${showOpacity} 0.5s linear forwards;
`;
const MainStyle = styled.img`
  width: 30%;
  transform: translateX(-20px) translateY(-30px);
  box-shadow: 30px 40px 0 #5c836f;
  border: 1px solid #5c836f;
`;
const MainDescriptionWrapper = styled.div`
  width: 180px;
  margin: 0 0 0 24px;
  color: #224229;
`;
const MainDescriptionTitle = styled.p`
  font-size: 36px;
  letter-spacing: 2px;
  margin: 0 0 24px 0;
`;
const MainDescription = styled.p`
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 22px;
  display: flex;
  align-items: center;
`;
const Feature = styled(MainDescription)`
  margin-top: 8px;
`;
const FeatureWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0 0 120px 0;
  position: relative;
`;
const FeatureTextWrapper = styled(FeatureWrapper)`
  margin: 0 0 0 72px;
  flex-direction: column;
  justify-content: space-evenly;
`;
const FeatureSecondTitle = styled(MainDescription)`
  font-size: 16px;
  margin-bottom: 12px;
`;
const FeatureIcon = styled(FontAwesomeIcon)`
  color: #6a5125;
  width: 22px;
  height: 22px;
  margin: 0 16px 0 0;
`;
const RedirectIcon = styled(FeatureIcon)`
  width: 16px;
  height: 16px;
  margin: 0 0 0 8px;
`;
const FeatureImg = styled.img`
  width: 40%;
  box-shadow: -20px 20px 0 10px #fddba9;
`;
const QuoteSection = styled.div`
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #224229;
  border-bottom: 1px solid #224229;
  margin: 110vh 0 60px 0;
`;
const QuoteText = styled.div`
  font-size: 26px;
  letter-spacing: 2px;
  color: #224229;
  padding: 8px;
  font-style: italic;
`;
const QuoteAutorText = styled(QuoteText)`
  font-size: 20px;
  align-self: flex-end;
  padding: 8px 72px 0 0;
`;
const DecorationEucari = styled.img`
  position: absolute;
  top: 15vh;
  left: 8vw;
  width: 10vw;
  background: #bedce6;
  box-shadow: 5vw 80px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1s forwards;
`;
const DecorationRubber = styled.img`
  position: absolute;
  bottom: 5vh;
  right: 10vw;
  width: 15vw;
  background: #bedce6;
  box-shadow: 0px 80px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1s forwards;
`;
const DecorationCoco = styled.img`
  position: absolute;
  top: 8vh;
  right: 5vw;
  width: 17vw;
  background: #fddba9;
  box-shadow: -10vw 90px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1.25s forwards;
`;
const DecorationTaquila = styled.img`
  position: absolute;
  z-index: -1;
  bottom: 11vh;
  left: 12vw;
  width: 22vw;
  background: #fddba9;
  box-shadow: 0px 30px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1.25s forwards;
`;
const CardsWrapper = styled.div``;
const CardsFlexWrpper = styled.div`
  width: 80vw;
  padding: 24px;
  overflow-x: auto;
  display: flex;
  border-radius: 8px;
  box-shadow: inset 25px 0px 20px -30px rgba(0, 0, 0, 0.45),
    inset -25px 0px 20px -30px rgba(0, 0, 0, 0.45);
  & ${Card} {
    margin-right: 24px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const SectionTitle = styled.p`
  margin-bottom: 16px;
  color: #6a5125;
  font-size: 26px;
  letter-spacing: 2px;
  line-height: 30px;
  font-weight: 500;
`;
const SectionTitleAlign = styled(SectionTitle)`
  align-self: end;
  line-height: 26px;
  transform: translateY(-16px;);
`;
const LogInRedirect = styled.div`
  background: #fff;
  color: #6a5125;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 1px;
  padding: 12px 18px;
  position: absolute;
  right: 0;
  bottom: 0;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  cursor: pointer;
  box-shadow: 0px 0px 8px 8px rgba(150, 150, 150, 0.1);
`;
const UserLink = styled(Link)`
  text-decoration: none;
  color: #5c836f;
  &:hover {
    text-decoration: underline;
  }
`;
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertDispatcher = useAlertDispatcher();
  const quoteRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [diariesExist, setDiariesExist] = useState<boolean[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [ownerInfos, setOwnerInfos] = useState<UserInfo[]>([]);
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string>("");
  async function favoriteToggle(cardId: string) {
    const userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      alertDispatcher("success", "Remove from your Favorites.");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      alertDispatcher("success", "Add to Favorites!");
    }
  }
  function findOwnerName(ownerId: string) {
    const target = ownerInfos.find((owner) => owner.userId === ownerId);
    return target?.userName;
  }
  useEffect(() => {
    async function getHomePageData() {
      const queryData = await firebase.getFavCards();
      if (!queryData.empty) {
        const favCards: PlantCard[] = [];
        const favCardsIds: string[] = [];
        const ownerIds: string[] = [];
        const ownerInfo: UserInfo[] = [];
        queryData.forEach((doc) => {
          favCards.push(doc.data());
          favCardsIds.push(doc.data().cardId!);
          if (!ownerIds.includes(doc.data().ownerId))
            ownerIds.push(doc.data().ownerId);
        });
        const diariesCheck = firebase.checkDiariesExistence(favCardsIds);
        const ownerData = firebase.getUsers(ownerIds);
        const renderData = await Promise.all([diariesCheck, ownerData]);
        setDiariesExist(renderData[0]);
        renderData[1]?.forEach((doc) => {
          ownerInfo.push(doc.data());
        });
        setOwnerInfos(ownerInfo);
        setFavCards(favCards);
      }
      setTimeout(() => setIsLoading(false), 1000);
    }
    getHomePageData();
  }, []);
  return (
    <>
      {isLoading && <PageLoader />}
      <Wrapper isLoading={isLoading}>
        <Banner>
          <MainStyleWrapper>
            <MainStyle src={main} />
            <MainDescriptionWrapper>
              <MainDescriptionTitle>
                To be human is to experience biophilia.
              </MainDescriptionTitle>
              <MainDescription>[bio-feelya] —</MainDescription>
              <MainDescription>
                Our innate desire to connect with nature.
              </MainDescription>
              <br></br>
              <MainDescription>It’s in our DNA.</MainDescription>
            </MainDescriptionWrapper>
          </MainStyleWrapper>
          <DecorationEucari src={eucari}></DecorationEucari>
          <DecorationTaquila src={taquila}></DecorationTaquila>
          <DecorationCoco src={coconut}></DecorationCoco>
          <DecorationRubber src={rubber}></DecorationRubber>
          <ExploreWrapper>
            <ArrowIcon icon={faAnglesDown} />
            <MainDescription>Explore</MainDescription>
          </ExploreWrapper>
        </Banner>
        <QuoteSection ref={quoteRef}>
          <QuoteText>To plant a garden is to believe in tomorrow.</QuoteText>
          <QuoteAutorText>~ Audrey Hepburn</QuoteAutorText>
        </QuoteSection>
        <FeatureWrapper>
          <FeatureImg src={feature} />
          <FeatureTextWrapper>
            <SectionTitle>A space for plants,</SectionTitle>
            <SectionTitleAlign>a space for Yourself</SectionTitleAlign>
            <FeatureSecondTitle>
              Greenery is a social space designed for plant people,
              <br /> here you can:
            </FeatureSecondTitle>
            <Feature>
              <FeatureIcon icon={faCircleCheck} />
              Record Your Plant Care Info
            </Feature>
            <Feature>
              <FeatureIcon icon={faCircleCheck} />
              Write Your Plant Growth Diary
            </Feature>
            <Feature>
              <FeatureIcon icon={faCircleCheck} />
              Explore People's Amazing Plants
            </Feature>
            <Feature>
              <FeatureIcon icon={faCircleCheck} />
              Learn Plants Care Tips
            </Feature>
            <Feature>
              <FeatureIcon icon={faCircleCheck} />
              Exchange Plant With Others
            </Feature>
          </FeatureTextWrapper>
          <LogInRedirect
            onClick={() => {
              if (isLoggedIn) navigate(`/profile/${userInfo.userId}`);
              else navigate(`/login`);
            }}
          >
            Build Your Oasis
            <RedirectIcon icon={faArrowUpRightFromSquare} />
          </LogInRedirect>
        </FeatureWrapper>
        <CardsWrapper>
          <SectionTitle>Our Most Beloved Plants</SectionTitle>
          <CardsFlexWrpper>
            {favCards.length !== 0 &&
              favCards.map((card, index) => {
                return (
                  <Card
                    key={card.cardId}
                    id={card.cardId!}
                    $mode={"grid"}
                    $show={true}
                    onClick={(e) => {
                      setDetailDisplay(true);
                      setDetailData(card);
                      dispatch({
                        type: popUpActions.SHOW_MASK,
                      });
                    }}
                  >
                    <PlantImg path={card.plantPhoto || defaultImg} />
                    <NameText>
                      <UserLink
                        to={`/profile/${card.ownerId}`}
                        onClick={(e) => {
                          dispatch({
                            type: popUpActions.HIDE_ALL,
                          });
                          e.stopPropagation();
                        }}
                      >
                        {findOwnerName(card.ownerId)}
                      </UserLink>
                      's {card.plantName}
                    </NameText>
                    <SpeciesText>{card.species}</SpeciesText>
                    <TagsWrapper>
                      {card?.tags?.length !== 0 &&
                        card.tags?.map((tag) => {
                          return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                        })}
                    </TagsWrapper>

                    <DiaryIconBtn
                      $show={diariesExist[index]}
                      onClick={(e) => {
                        setDiaryDisplay(true);
                        setDiaryId(card.cardId);
                        setOwnerId(card.ownerId);
                        dispatch({
                          type: popUpActions.SHOW_MASK,
                        });
                        e.stopPropagation();
                      }}
                    >
                      <StyledFontAwesomeIcon icon={faBook} />
                    </DiaryIconBtn>
                    {isLoggedIn && (
                      <FavIconButton
                        $show={
                          userInfo?.favoriteCards.includes(card.cardId!) ||
                          false
                        }
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          favoriteToggle(card.cardId!);
                          e.stopPropagation();
                        }}
                      >
                        <StyledFontAwesomeIcon icon={faBookmark} />
                      </FavIconButton>
                    )}
                  </Card>
                );
              })}
          </CardsFlexWrpper>
        </CardsWrapper>
        <DetailedCard
          detailDisplay={detailDisplay}
          setDetailDisplay={setDetailDisplay}
          detailData={detailData!}
        />
        <DiaryEditor
          ownerId={ownerId}
          diaryDisplay={diaryDisplay}
          setDiaryDisplay={setDiaryDisplay}
          diaryId={diaryId!}
          setDiaryId={setDiaryId}
        />
      </Wrapper>
    </>
  );
};

export default Home;
