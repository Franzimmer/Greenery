import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
const ContainerRubber = styled(Container)`
  height: 100px;
  box-shadow: 20px 50px #f5f0ec inset;
  background-color: #bedce6;
  align-self: flex-end;
  transform: scale(1.6);
`;
const Decoration = styled.img`
  position: absolute;
  bottom: 1px;
  right: 0;
  width: 100%;
`;
const CardsWrapper = styled.div`
  margin: 100vh 0 0 0;
`;
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
        <Container>
          <Decoration src={left}></Decoration>
        </Container>
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
        <ContainerRubber>
          <Decoration src={rubber}></Decoration>
        </ContainerRubber>
      </Banner>
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
