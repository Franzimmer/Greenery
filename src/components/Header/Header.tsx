import React from "react";
import styled from "styled-components";
import { RootState } from "../../reducer/index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { OperationBtn } from "../../pages/Profile/cards/Cards";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: flex-end;
`;
const HeaderLink = styled(Link)`
  margin: 10px;
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
    <HeaderWrapper>
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/forum">Forum</HeaderLink>
      <HeaderLink to="/login">LogIn</HeaderLink>
      <HeaderLink to={`/profile/${userInfo.userId}`}>Profile</HeaderLink>
      <OperationBtn onClick={sideBarToggle}>Sidebar</OperationBtn>
    </HeaderWrapper>
  );
};

export default Header;
