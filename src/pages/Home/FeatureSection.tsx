import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import feature from "./feature.jpeg";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { MainDescription } from "./MainVisual";
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
  color: ${(props) => props.theme.colors.button};
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
  box-shadow: -20px 20px 0 10px ${(props) => props.theme.colors.second};
`;
export const SectionTitle = styled.p`
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.button};
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
  color: ${(props) => props.theme.colors.button};
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
const FeatureSection = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
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
  );
};
export default FeatureSection;
