import React from "react";
import styled, { keyframes } from "styled-components";
const Wave = keyframes`
  0% {
		transform: rotateZ(3deg) translateZ(-1px);
	}
	25%{
		transform: rotateZ(-4deg) translateZ(-1px);
	}
	50% {
		transform: rotateZ(2deg) translateZ(-1px);
	}
	75% {
		transform: rotateZ(-6deg) translateZ(-1px);
	}
	100% {
		transform: rotateZ(3deg) translateZ(-1px);
	}
`;
const Wave2 = keyframes`
  0% {
		transform: rotateZ(0deg) translateZ(-1px);
	}
	25%{
		transform: rotateZ(-3deg) translateZ(-1px);
	}
	50% {
		transform: rotateZ(3deg) translateZ(-1px);
	}
	75% {
		transform: rotateZ(-1deg) translateZ(-1px);
	}
	100% {
		transform: rotateZ(0deg) translateZ(-1px);
	}
`;
const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;
const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Base = styled.div`
  position: relative;
  display: block;
  width: 110px;
`;
const FlowerPot = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  overflow: hidden;
  background-image: linear-gradient(
      50deg,
      #f5f0ec 20px,
      #f5f0ec 21px,
      transparent 20px
    ),
    linear-gradient(310deg, #f5f0ec 20px, #d1bb94 21px, #d1bb94 100%);
  &::after {
    content: " ";
    position: absolute;
    display: block;
    left: 30px;
    top: -5px;
    width: 60px;
    height: 90px;
    background: linear-gradient(
      285deg,
      #d1bb94 20px,
      #d6c8a5 21px,
      #d6c8a5 100%
    );
    transform: rotate(50deg);
  }
`;
const Blade = styled.div`
  position: absolute;
  bottom: 40px;
  overflow: hidden;
  transform-origin: 50% 100%;
  z-index: -1;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    border-top: 0;
    border-radius: 50%;
  }
`;
const BladeLeftSmall = styled(Blade)`
  height: 60px;
  width: 50px;
  left: -15px;
  animation: ${Wave} 3s infinite ease-in-out;
  &::before {
    right: 0;
    height: 120px;
    width: 90px;
    border-right: 20px solid #5c836f;
  }
  &::after {
    top: 1px;
    right: 6px;
    height: 120px;
    width: 90px;
    transform: rotateZ(15deg);
    border-right: 18px solid #5c836f;
  }
`;
const BladeLeftLarge = styled(Blade)`
  height: 100px;
  width: 80px;
  left: -30px;
  animation: ${Wave2} 4s infinite ease-in-out;
  &::before {
    right: 2px;
    height: 190px;
    width: 160px;
    border-right: 20px solid #5c836f;
    transform: rotateZ(10deg);
  }

  &::after {
    right: 7px;
    height: 190px;
    width: 160px;
    border-right: 18px solid #5c836f;
    transform: rotateZ(20deg);
  }
`;
const BladeRightSmall = styled(Blade)`
  height: 50px;
  width: 80px;
  right: -35px;
  animation: ${Wave2} 3.2s -0.5s infinite ease-in-out;
  &::before {
    left: 0;
    height: 190px;
    width: 100px;
    border-left: 22px solid #5c836f;
  }

  &::after {
    left: 15px;
    height: 190px;
    width: 100px;
    border-left: 13px solid #5c836f;
    transform: rotateZ(-10deg);
  }
`;
const BladeRightLarge = styled(Blade)`
  height: 75px;
  width: 80px;
  right: -22px;
  animation: ${Wave} 3.2s -1s infinite ease-in-out;
  &::before {
    left: 0;
    height: 190px;
    width: 160px;
    border-left: 26px solid #5c836f;
  }

  &::after {
    left: 6px;
    height: 190px;
    width: 160px;
    border-left: 20px solid #5c836f;
    transform: rotateZ(-10deg);
  }
`;
const BladeCenter = styled(Blade)`
  height: 120px;
  width: 90px;
  left: -15px;
  animation: ${Wave} 3s -1.2s infinite ease-in-out;
  &:before {
    right: 10px;
    height: 240px;
    width: 140px;
    border-right: 28px solid #5c836f;
    transform: rotateZ(15deg);
  }

  &:after {
    right: 15px;
    height: 240px;
    width: 140px;
    border-right: 17px solid #5c836f;
    transform: rotateZ(15deg);
  }
`;
const Jump = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
   transform: translateY(8px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const Text = styled.div`
  color: #224229;
  letter-spacing: 3px;
  font-size: 20px;
  margin-bottom: 12px;
  animation: ${Jump} 2s ease-in-out infinite;
`;

const PageLoader = () => {
  return (
    <FlexWrapper>
      <LoaderWrapper>
        <Base>
          <FlowerPot></FlowerPot>
          <BladeCenter></BladeCenter>
          <BladeLeftSmall></BladeLeftSmall>
          <BladeRightSmall></BladeRightSmall>
          <BladeLeftLarge></BladeLeftLarge>
          <BladeRightLarge></BladeRightLarge>
        </Base>
      </LoaderWrapper>
      <Text>LOADING</Text>
    </FlexWrapper>
  );
};

export default PageLoader;
