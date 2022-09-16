import React from "react";
import styled from "styled-components";
import { RootState } from "../../reducer/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { OperationBtn } from "../../pages/Profile/cards/Cards";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  padding: 10px;
  margin-bottom: 50px;
`;
const LinkWrapper = styled.div``;
const HeaderLink = styled(Link)`
  margin: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 2px;
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
    height: 4px;
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
  setSideBarDisplay,
  sideBarDisplay,
}: {
  setSideBarDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarDisplay: boolean;
}) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  function sideBarToggle() {
    if (sideBarDisplay) setSideBarDisplay(false);
    if (!sideBarDisplay) setSideBarDisplay(true);
  }
  return (
    <>
      <HeaderWrapper>
        <LinkWrapper>
          <HeaderLink to="/">Home Logo</HeaderLink>
        </LinkWrapper>
        <LinkWrapper>
          <HeaderLink to="/forum">Forum</HeaderLink>
          <HeaderLink to="/login">LogIn</HeaderLink>
          <HeaderLink to={`/profile/${userInfo.userId}`}>Profile</HeaderLink>
          <OperationBtn onClick={sideBarToggle}>Sidebar</OperationBtn>
        </LinkWrapper>
      </HeaderWrapper>
    </>
  );
};

export default Header;
