import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import rubber from "./assets/rubber.png";
import eucari from "./assets/eucari.png";
import main from "./assets/main.webp";
import taquila from "./assets/taquila.png";
import coconut from "./assets/coconut.png";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
const showOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
  @media (max-width: 500px) {
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
    object-position: center;
  }
`;
const MainDescriptionWrapper = styled.div`
  width: 180px;
  color: #224229;
  margin-left: 36px;
  @media (max-width: 930px) {
    margin-top: auto;
  }
  @media (max-width: 500px) {
    width: auto;
    margin-left: 0px;
    margin-top: 24px;
  }
`;
const MainDescriptionTitle = styled.p`
  font-size: 36px;
  letter-spacing: 2px;
  margin: 0 0 30px 0;
  @media (max-width: 900px) {
    font-size: 30px;
  }
  @media (max-width: 800px) {
    font-size: 26px;
  }
  @media (max-width: 600px) {
    font-size: 20px;
    letter-spacing: 1px;
    margin: 0 0 8px 0;
  }
`;
export const MainDescription = styled.p`
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 22px;
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    font-size: 10px;
    letter-spacing: 0px;
  }
`;
const MainVisual = () => {
  return (
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
