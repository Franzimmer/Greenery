import React from "react";
import styled from "styled-components";
import { RootState } from "../../reducer/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { OperationBtn } from "../../components/GlobalStyles/button";
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  padding: 10px;
  margin: 20px 0px 50px 0px;
`;
const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderLink = styled(Link)`
  margin: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
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
const Header = ({
  isLoggedIn,
  setSideBarDisplay,
  sideBarDisplay,
}: {
  isLoggedIn: boolean;
  setSideBarDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarDisplay: boolean;
}) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);

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
        {isLoggedIn && (
          <OperationBtn onClick={sideBarToggle}>Sidebar</OperationBtn>
        )}
      </LinkWrapper>
    </HeaderWrapper>
  );
};

export default Header;
