import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { firebase } from "../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { UserInfoActions } from "../../actions/userInfoActions";
import { PlantCard } from "../../types/plantCardType";
import { PlantImg, Tag, TagsWrapper } from "../Profile/cards/Cards";
import { Card, NameText, SpeciesText } from "../Profile/cards/CardsGrid";
import {
  FavIconButton,
  DiaryIconBtn,
  StyledFontAwesomeIcon,
} from "../Profile/favorites/FavGrids";
import DiaryEditor from "../../components/Diary/DiaryEditor";
import DetailedCard from "../../components/DetailCard/DetailedCard";
import defaultImg from "../../assets/default.jpg";
import rubber from "./rubber.png";
import left from "./left.png";
import main from "./main.jpeg";
import feature from "./feature.jpeg";
import taquila from "./taquila.png";
import coconut from "./coconut.png";
const Wrapper = styled.div`
  width: 80vw;
  margin: 150px auto 50px;
`;
const Banner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 10vh 10vw;
`;
const MainStyleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const MainStyle = styled.img`
  width: 30%;
  transform: translateX(-20px) translateY(-30px);
  box-shadow: 30px 40px 0 #5c836f;
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
const FeatureWrapper = styled.div`
  width: 100%;
  margin: 110vh 0 60px 0;
  display: flex;
  justify-content: space-between;
`;
const FeatureTextWrapper = styled(FeatureWrapper)`
  margin: 0 0 0 72px;
  flex-direction: column;
  justify-content: space-evenly;
`;
const FeatureSecondTitle = styled(MainDescription)`
  font-size: 16px;
`;
const CheckIcon = styled(FontAwesomeIcon)`
  color: #6a5125;
  width: 22px;
  height: 22px;
  margin: 0 16px 0 0;
`;
const FeatureImg = styled.img`
  width: 40%;
`;
const QuoteSection = styled.div`
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #224229;
  border-bottom: 1px solid #224229;
  margin: 0 0 48px 0;
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
const Container = styled.div`
  width: 400px;
  height: 200px;
  position: relative;
  background-color: #bedce6;
  box-shadow: 20px 100px #f5f0ec inset;
  background-clip: content-box;
  padding: 1px;
  align-self: start;
`;
const DecorationEucari = styled.img`
  position: absolute;
  top: 15vh;
  left: 8vw;
  width: 10vw;
  background: #bedce6;
  box-shadow: 5vw 80px #f5f0ec inset;
`;
const DecorationRubber = styled.img`
  position: absolute;
  bottom: 5vh;
  right: 10vw;
  width: 15vw;
  background: #bedce6;
  box-shadow: 0px 80px #f5f0ec inset;
`;
const DecorationCoco = styled.img`
  position: absolute;
  top: 8vh;
  right: 5vw;
  width: 17vw;
  background: #fddba9;
  box-shadow: -10vw 90px #f5f0ec inset;
`;
const DecorationTaquila = styled.img`
  position: absolute;
  bottom: 11vh;
  left: 12vw;
  width: 22vw;
  background: #fddba9;
  box-shadow: 0px 30px #f5f0ec inset;
`;
const CardsWrapper = styled.div``;
const CardsFlexWrpper = styled.div`
  width: 80vw;
  padding: 24px 48px;
  overflow-x: auto;
  display: flex;
  border-radius: 10px;
  box-shadow: inset 25px 0px 30px -25px rgba(0, 0, 0, 0.45),
    inset -25px 0px 30px -25px rgba(0, 0, 0, 0.45);
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
`;
const Home = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [favCards, setFavCards] = useState<PlantCard[]>([]);
  const [detailDisplay, setDetailDisplay] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<PlantCard>();
  const [diaryDisplay, setDiaryDisplay] = useState<boolean>(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);

  async function favoriteToggle(cardId: string) {
    let userId = userInfo.userId;
    if (userInfo.favoriteCards.includes(cardId)) {
      dispatch({
        type: UserInfoActions.DELETE_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.removeFavCard(userId, cardId);
      alert("已取消收藏！");
    } else {
      dispatch({
        type: UserInfoActions.ADD_FAVORITE_PLANT,
        payload: { cardId },
      });
      await firebase.addFavCard(userId, cardId);
      alert("已加入收藏！");
    }
  }
  useEffect(() => {
    async function getHomePageData() {
      let queryData = await firebase.getFavCards();
      if (!queryData.empty) {
        let favCards: PlantCard[] = [];
        queryData.forEach((doc) => {
          favCards.push(doc.data());
        });
        setFavCards(favCards);
      }
    }
    getHomePageData();
  }, []);
  return (
    <Wrapper>
      <Banner>
        <DecorationEucari src={left}></DecorationEucari>
        <DecorationTaquila src={taquila}></DecorationTaquila>
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
        <DecorationCoco src={coconut}></DecorationCoco>
        <DecorationRubber src={rubber}></DecorationRubber>
      </Banner>
      <FeatureWrapper>
        <FeatureImg src={feature} />
        <FeatureTextWrapper>
          <SectionTitle>A space for plants, A space for Yourself</SectionTitle>
          <FeatureSecondTitle>
            Greenery is a social space destined for plant people, here you can:
          </FeatureSecondTitle>
          <MainDescription>
            <CheckIcon icon={faCircleCheck} />
            Record Your Plant Care Info
          </MainDescription>
          <MainDescription>
            <CheckIcon icon={faCircleCheck} />
            Write Your Plant Growth Diary
          </MainDescription>
          <MainDescription>
            <CheckIcon icon={faCircleCheck} />
            Explore People's Amazing Plants
          </MainDescription>
          <MainDescription>
            <CheckIcon icon={faCircleCheck} />
            Learn Plants Care Tips
          </MainDescription>
          <MainDescription>
            <CheckIcon icon={faCircleCheck} />
            Exchange Plant With Others
          </MainDescription>
        </FeatureTextWrapper>
      </FeatureWrapper>
      <QuoteSection>
        <QuoteText>To plant a garden is to believe in tomorrow.</QuoteText>
        <QuoteAutorText>- Audrey Hepburn</QuoteAutorText>
      </QuoteSection>
      <CardsWrapper>
        <SectionTitle>Our Most Beloved Ones</SectionTitle>
        <CardsFlexWrpper>
          {favCards.length !== 0 &&
            favCards.map((card) => {
              return (
                <Card
                  key={card.cardId}
                  id={card.cardId!}
                  mode={"grid"}
                  show={true}
                  onClick={(e) => {
                    setDetailDisplay(true);
                    setDetailData(card);
                  }}
                >
                  <PlantImg path={card.plantPhoto || defaultImg} />
                  <NameText>{card.plantName}</NameText>
                  <SpeciesText>{card.species}</SpeciesText>
                  <TagsWrapper>
                    {card?.tags?.length !== 0 &&
                      card.tags?.map((tag) => {
                        return <Tag key={`${card.cardId}-${tag}`}>{tag}</Tag>;
                      })}
                  </TagsWrapper>
                  <DiaryIconBtn
                    onClick={(e) => {
                      setDiaryDisplay(true);
                      setDiaryId(card.cardId);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBook} />
                  </DiaryIconBtn>
                  <FavIconButton
                    show={
                      userInfo?.favoriteCards.includes(card.cardId!) || false
                    }
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      favoriteToggle(card.cardId!);
                      e.stopPropagation();
                    }}
                  >
                    <StyledFontAwesomeIcon icon={faBookmark} />
                  </FavIconButton>
                </Card>
              );
            })}
        </CardsFlexWrpper>
      </CardsWrapper>
      <DetailedCard
        isSelf={false}
        detailDisplay={detailDisplay}
        setDetailDisplay={setDetailDisplay}
        detailData={detailData!}
      />
      <DiaryEditor
        isSelf={false}
        diaryDisplay={diaryDisplay}
        setDiaryDisplay={setDiaryDisplay}
        diaryId={diaryId!}
        setDiaryId={setDiaryId}
      />
    </Wrapper>
  );
};

export default Home;
