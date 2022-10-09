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
  height: 95vh;
  padding: 100px 10vh 10px 10vw;
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
export const MainDescription = styled.p`
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 22px;
  display: flex;
  align-items: center;
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
const MainVisual = () => {
  return (
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
  );
};

export default MainVisual;
