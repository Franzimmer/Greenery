import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer/index";
import { useAlertDispatcher } from "../../utils/useAlertDispatcher";
interface HeaderWrapperProps {
  $bgState: boolean;
}
const HeaderWrapper = styled.div<HeaderWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  width: 100vw;
  height: 100px;
  position: fixed;
  top: 0;
  z-index: 99;
  background-color: ${(props) => !props.$bgState && "#F5F0EC"};
  mix-blend-mode: ${(props) => props.$bgState && "plus-lighter"};
`;
const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderLink = styled(Link)`
  margin: 10px 16px 10px 10px;
  text-decoration: none;
  font-size: 26px;
  letter-spacing: 4px;
  color: ${(props) => props.theme.colors.button};
  position: relative;
  &:hover {
    color: ${(props) => props.theme.colors.main};
    &::after {
      width: 100%;
    }
  }
  &::after {
    content: "";
    height: 3px;
    background: ${(props) => props.theme.colors.main};
    position: absolute;
    bottom: -4px;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 0%;
    transition: 0.5s;
  }
`;
const LogoLink = styled(HeaderLink)`
  letter-spacing: 8px;
`;
const SideBarBtnWrapper = styled.div`
  background: ${(props) => props.theme.colors.main};
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const SideBarBtnHint = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  color: #fff;
  font-size: 10px;
`;
const SideBarBtn = styled.div`
  cursor: pointer;
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
  $sideBarDisplay: boolean;
}
const SideBarBtnDiv = styled.div<SideBarBtnDivProps>`
  width: ${(props) => (props.$sideBarDisplay ? "0px" : "70px")};
  height: 1px;
  background: #fff;
  transform: ${(props) =>
    props.$sideBarDisplay ? "rotate(45deg)" : "rotate(315deg)"};
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
    width: ${(props) => (props.$sideBarDisplay ? "60px" : "40px")};
    height: 1px;
    background: #fff;
    position: absolute;
    bottom: ${(props) => (props.$sideBarDisplay ? "0px" : "10px")};
    ${SideBarBtn}:hover & {
      animation: 1s ${hoverEffect} ease-out;
    }
  }
  &::after {
    bottom: ${(props) => (props.$sideBarDisplay ? "0px" : "-10px")};
    transform: ${(props) =>
      props.$sideBarDisplay ? "rotate(90deg)" : "rotate(0deg)"};
  }
`;

interface HeaderProps {
  setSideBarDisplay: Dispatch<SetStateAction<boolean>>;
  sideBarDisplay: boolean;
}
const Header = ({ setSideBarDisplay, sideBarDisplay }: HeaderProps) => {
  const location = useLocation();
  const alertDispatcher = useAlertDispatcher();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [bgState, setBgState] = useState<boolean>(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  function sideBarToggle() {
    if (!isLoggedIn) {
      alertDispatcher("success", "Please Log In First");
      return;
    } else if (sideBarDisplay) setSideBarDisplay(false);
    else if (!sideBarDisplay) setSideBarDisplay(true);
  }
  useEffect(() => {
    if (location.pathname === "/login") setBgState(true);
    else setBgState(false);
  }, [location]);
  return (
    <HeaderWrapper $bgState={bgState}>
      <LinkWrapper>
        <LogoLink to="/">GREENERY</LogoLink>
      </LinkWrapper>
      <LinkWrapper>
        <HeaderLink to="/forum">FORUM</HeaderLink>
        {!isLoggedIn && <HeaderLink to="/login">LOGIN</HeaderLink>}
        {isLoggedIn && (
          <HeaderLink to={`/profile/${userInfo.userId}`}>PROFILE</HeaderLink>
        )}
        <SideBarBtnWrapper>
          {!sideBarDisplay ? (
            <SideBarBtnHint>menu</SideBarBtnHint>
          ) : (
            <SideBarBtnHint>close</SideBarBtnHint>
          )}
          <SideBarBtn onClick={sideBarToggle}>
            <SideBarBtnDiv
              $sideBarDisplay={isLoggedIn && sideBarDisplay}
            ></SideBarBtnDiv>
          </SideBarBtn>
        </SideBarBtnWrapper>
      </LinkWrapper>
    </HeaderWrapper>
  );
};

export default Header;
