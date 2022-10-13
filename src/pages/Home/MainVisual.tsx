import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import rubber from "./rubber.png";
import eucari from "./eucari.png";
import main from "./main.webp";
import taquila from "./taquila.png";
import coconut from "./coconut.png";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
const Banner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 140px);
  padding: 0 100px 10px 100px;
  margin-top: 140px;
  @media (max-width: 800px) {
    margin-top: 130px;
    height: auto;
  }
  @media (max-width: 700px) {
    margin-top: 120px;
  }
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
  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;
// const MainStyle = styled.img`
//   width: 30%;
//   height: max-content;
//   transform: translateX(-20px) translateY(-30px);
//   box-shadow: 30px 40px 0 ${(props) => props.theme.colors.main};
//   border: 1px solid ${(props) => props.theme.colors.main};
//   @media (max-width: 1200px) {
//     min-width: 300px;
//     box-shadow: 15px 20px 0 ${(props) => props.theme.colors.main};
//   }
//   @media (max-width: 800px) {
//     min-width: auto;
//     margin: 0 auto;
//     width: 80%;
//   }
//   @media (max-width: 700px) {
//     margin: 0 auto;
//     width: 60vw;
//     transform: none;
//   }
//   @media (max-width: 600px) {
//     width: 70vw;
//   }
// `;
const DecorationEucari = styled.img`
  position: absolute;
  z-index: -1;
  top: 15vh;
  left: 8vw;
  width: 10vw;
  background: #bedce6;
  box-shadow: 5vw 80px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1s forwards;
  @media (max-width: 1200px) {
    box-shadow: 4vw 60px #f5f0ec inset;
    min-width: 120px;
  }
  @media (max-width: 1100px) {
    min-width: 100px;
    left: 5vw;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
const DecorationRubber = styled.img`
  position: absolute;
  z-index: -2;
  bottom: 5vh;
  right: 10vw;
  width: 15vw;
  background: #bedce6;
  box-shadow: 0px 80px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear forwards;
  @media (max-width: 1200px) {
    bottom: 10vh;
    box-shadow: 0px 40px #f5f0ec inset;
    min-width: 150px;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
const DecorationCoco = styled.img`
  position: absolute;
  z-index: -1;
  top: 50px;
  right: 80px;
  width: 20vw;
  background: ${(props) => props.theme.colors.second};
  box-shadow: -10vw 90px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1.25s forwards;
  @media (max-width: 1300px) {
    top: 30px;
    right: 20px;
    min-width: 180px;
  }
  @media (max-width: 1100px) {
    top: 20px;
    right: 0px;
    min-width: 160px;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
const DecorationTaquila = styled.img`
  position: absolute;
  z-index: -2;
  bottom: 11vh;
  left: 12vw;
  width: 22vw;
  background: ${(props) => props.theme.colors.second};
  box-shadow: 0px 30px #f5f0ec inset;
  opacity: 0;
  animation: ${showOpacity} 1s linear 1.25s forwards;
  @media (max-width: 1200px) {
    box-shadow: 0px;
    min-width: 230px;
    bottom: 15vh;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
const jump = keyframes`
  0% {
    transform:  translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
`;
const ExploreWrapper = styled.div`
  grid-column: 5 / span 1;
  grid-row: 6 / span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  color: #224229;
  animation: 1s ease ${jump} infinite;
  @media (max-width: 800px) {
    margin-top: 24px;
  }
`;
const ArrowIcon = styled(FontAwesomeIcon)`
  color: #224229;
  width: 20px;
  height: 20px;
  margin: 0 12px 0 0;
`;
const GridWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 100px);
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(6, 1fr);
`;
const GridItem = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${showOpacity} 1s linear forwards;
`;
const Eucari = styled(GridItem)`
  background-image: url(${eucari});
  background-color: #bedce6;
  grid-column: 1 / span 1;
  grid-row: 2 / span 3;
  position: relative;
  @media (max-width: 1100px) {
    display: none;
  }
`;
const Rubber = styled(GridItem)`
  background-image: url(${rubber});
  background-color: #bedce6;
  grid-column: 7 / span 2;
  grid-row: 4 / span 2;
  @media (max-width: 1100px) {
    display: none;
  }
`;
const Taquila = styled(GridItem)`
  background-image: url(${taquila});
  background-color: ${(props) => props.theme.colors.second};
  grid-column: 2 / span 2;
  grid-row: 5 / span 2;
  @media (max-width: 1100px) {
    display: none;
  }
`;
const Coconut = styled(GridItem)`
  background-image: url(${coconut});
  background-color: ${(props) => props.theme.colors.second};
  grid-column: 8 / span 1;
  grid-row: 2 / span 2;
  @media (max-width: 1100px) {
    display: none;
  }
`;
const Main = styled(GridItem)`
  grid-column: 2 / span 5;
  grid-row: 1 / span 5;
  display: flex;
  @media (max-width: 1000px) {
    grid-column: 2 / span 4;
  }
  @media (max-width: 650px) {
    flex-direction: column;
    grid-column: 3 / span 4;
    grid-row: 1 / span 5;
    margin: auto;
  }
`;
const MainStyle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: right;
  filter: drop-shadow(30px 20px 0 ${(props) => props.theme.colors.main});
  @media (max-width: 1000px) {
    filter: unset;
    object-position: center;
  }
  @media (max-width: 930px) {
    filter: drop-shadow(30px 20px 0 ${(props) => props.theme.colors.main});
  }
`;
const MainDescriptionWrapper = styled.div`
  width: 180px;
  color: #224229;
  margin-left: 36px;
  @media (max-width: 930px) {
    margin-top: auto;
  }
  @media (max-width: 650px) {
    width: auto;
    margin-left: 0px;
    margin-top: 24px;
  }
`;
const MainDescriptionTitle = styled.p`
  font-size: 36px;
  letter-spacing: 2px;
  margin: 0 0 24px 0;
  filter: drop-shadow(2px 4px 6px);
  @media (max-width: 900px) {
    font-size: 30px;
  }
  @media (max-width: 800px) {
    font-size: 26px;
  }
  @media (max-width: 600px) {
    font-size: 20px;
    letter-spacing: 1px;
  }
`;
export const MainDescription = styled.p`
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 22px;
  display: flex;
  align-items: center;
`;
const MainVisual = () => {
  return (
    // <Banner>
    //   <MainStyleWrapper>
    //     <MainStyle src={main} />
    //     <MainDescriptionWrapper>
    //       <MainDescriptionTitle>
    //         To be human is to experience biophilia.
    //       </MainDescriptionTitle>
    //       <MainDescription>[bio-feelya] —</MainDescription>
    //       <MainDescription>
    //         Our innate desire to connect with nature.
    //       </MainDescription>
    //       <MainDescription>It’s in our DNA.</MainDescription>
    //     </MainDescriptionWrapper>
    //   </MainStyleWrapper>
    //   <DecorationEucari src={eucari}></DecorationEucari>
    //   <DecorationTaquila src={taquila}></DecorationTaquila>
    //   <DecorationCoco src={coconut}></DecorationCoco>
    //   <DecorationRubber src={rubber}></DecorationRubber>
    //   <ExploreWrapper>
    //     <ArrowIcon icon={faAnglesDown} />
    //     <MainDescription>Explore</MainDescription>
    //   </ExploreWrapper>
    // </Banner>
    <GridWrapper>
      <Eucari />
      <Rubber />
      <Taquila />
      <Coconut />
      <Main>
        <MainStyle src={main} />
        <MainDescriptionWrapper>
          <MainDescriptionTitle>
            To be human is to experience biophilia.
          </MainDescriptionTitle>
          <MainDescription>[bio-feelya] —</MainDescription>
          <MainDescription>
            Our innate desire to connect with nature.
          </MainDescription>
          <MainDescription>It’s in our DNA.</MainDescription>
        </MainDescriptionWrapper>
      </Main>
      <ExploreWrapper>
        <ArrowIcon icon={faAnglesDown} />
        <MainDescription>Explore</MainDescription>
      </ExploreWrapper>
    </GridWrapper>
  );
};

export default MainVisual;
