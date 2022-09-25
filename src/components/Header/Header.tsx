import React from "react";
import styled, { keyframes } from "styled-components";
import { RootState } from "../../store/reducer/index";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { popUpActions } from "../../store/reducer/popUpReducer";
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(245, 240, 236, 0.5);
  width: 100vw;
  height: 100px;
  position: fixed;
  top: 0;
  z-index: 99;
`;
const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderLink = styled(Link)`
  margin: 10px;
  text-decoration: none;
  font-size: 26px;
  letter-spacing: 1px;
  color: #6a5125;
  position: relative;
  &:hover {
    color: #5c836f;
    &::after {
      width: 100%;
    }
  }
  &::after {
    content: "";
    height: 3px;
    background: #5c836f;
    position: absolute;
    bottom: -4px;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 0%;
    transition: 0.5s;
  }
`;
const SideBarBtnWrapper = styled.div`
  // background: linear-gradient(90deg, #7bc09a, #e4e783);
  background: #5c836f;
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
  sideBarDisplay: boolean;
}
const SideBarBtnDiv = styled.div<SideBarBtnDivProps>`
  width: ${(props) => (props.sideBarDisplay ? "0px" : "70px")};
  height: 1px;
  background: #fff;
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
    width: ${(props) => (props.sideBarDisplay ? "60px" : "40px")};
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
  setSideBarDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarDisplay: boolean;
}
const Header = ({ setSideBarDisplay, sideBarDisplay }: HeaderProps) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  function emitAlert(type: string, msg: string) {
    dispatch({
      type: popUpActions.SHOW_ALERT,
      payload: {
        type,
        msg,
      },
    });
    setTimeout(() => {
      dispatch({
        type: popUpActions.CLOSE_ALERT,
      });
    }, 2000);
  }
  function sideBarToggle() {
    if (!isLoggedIn) {
      emitAlert("success", "Please Log In First");
      return;
    }
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
        <SideBarBtnWrapper>
          {!sideBarDisplay ? (
            <SideBarBtnHint>menu</SideBarBtnHint>
          ) : (
            <SideBarBtnHint>close</SideBarBtnHint>
          )}
          <SideBarBtn onClick={sideBarToggle}>
            <SideBarBtnDiv
              sideBarDisplay={isLoggedIn && sideBarDisplay}
            ></SideBarBtnDiv>
          </SideBarBtn>
        </SideBarBtnWrapper>
      </LinkWrapper>
    </HeaderWrapper>
  );
};

export default Header;
