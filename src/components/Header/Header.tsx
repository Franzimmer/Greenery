import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../reducer/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100px;
  position: fixed;
  z-index: 99;
`;
const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderLink = styled(Link)`
  margin: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 1px;
  color: #6a5125;
  position: relative;
  &:hover {
    color: #7bc09a;
    &::after {
      width: 100%;
    }
  }
  &::after {
    content: "";
    height: 3px;
    background: #7bc09a;

    position: absolute;
    bottom: -4px;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 0%;
    transition: 0.5s;
  }
`;
const SideBarBtn = styled.div`
  cursor: pointer;
  background: linear-gradient(45deg, #7bc09a, #e4e783);
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
`;
const hoverEffect = keyframes`
  0% {
     width: 20px;
  }
  100% {
     width: width;
  }
`;
interface SideBarBtnDivProps {
  sideBarDisplay: boolean;
}
const SideBarBtnDiv = styled.div<SideBarBtnDivProps>`
  width: ${(props) => (props.sideBarDisplay ? "0px" : "70px")};
  height: 1px;
  transform: ${(props) =>
    props.sideBarDisplay ? "rotate(45deg)" : "rotate(315deg)"};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  ${SideBarBtn}:hover & {
    animation: 0.5s ${hoverEffect} ease-out;
  }
  &::before,
  ::after {
    content: "";
    width: ${(props) => (props.sideBarDisplay ? "70px" : "50px")};
    height: 1px;
    background: #fff;
    position: absolute;
    bottom: ${(props) => (props.sideBarDisplay ? "0px" : "10px")};
    ${SideBarBtn}:hover & {
      animation: 1s ${hoverEffect} ease-out;
    }
  }
  &::after {
    bottom: ${(props) => (props.sideBarDisplay ? "0px" : "-10px")};
    transform: ${(props) =>
      props.sideBarDisplay ? "rotate(90deg)" : "rotate(0deg)"};
  }
`;

interface HeaderProps {
  isLoggedIn: boolean;
  setSideBarDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarDisplay: boolean;
}
const Header = ({
  isLoggedIn,
  setSideBarDisplay,
  sideBarDisplay,
}: HeaderProps) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  // const [isClicked, setIsClicked] = useState<boolean>(false);
  function sideBarToggle() {
    if (sideBarDisplay) setSideBarDisplay(false);
    if (!sideBarDisplay) setSideBarDisplay(true);
  }
  return (
    <HeaderWrapper>
      <LinkWrapper>
        <HeaderLink to="/">GREENERY</HeaderLink>
      </LinkWrapper>
      <LinkWrapper>
        <HeaderLink to="/forum">Forum</HeaderLink>
        {!isLoggedIn && <HeaderLink to="/login">LogIn</HeaderLink>}
        {isLoggedIn && (
          <HeaderLink to={`/profile/${userInfo.userId}`}>Profile</HeaderLink>
        )}
        {/* {isLoggedIn && (
          <OperationBtn onClick={sideBarToggle}>Sidebar</OperationBtn>
        )} */}
        <SideBarBtn onClick={sideBarToggle}>
          <SideBarBtnDiv sideBarDisplay={sideBarDisplay}></SideBarBtnDiv>
        </SideBarBtn>
      </LinkWrapper>
    </HeaderWrapper>
  );
};

export default Header;
