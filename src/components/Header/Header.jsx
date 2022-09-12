import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100vw;
`;
const HeaderLink = styled(Link)`
  margin: 10px;
`;
const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/forum">Forum</HeaderLink>
      {/* <HeaderLink>Profile</HeaderLink> */}
      <HeaderLink to="/login">LogIn</HeaderLink>
    </HeaderWrapper>
  );
};

export default Header;
