import React from "react";
import styled from "styled-components";

const MenuWrapper = styled.div`
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
  margin-bottom 10px;
`;
const MenuItem = styled.button`
  margin-right: 5px;
  padding: 5px;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const ProfileMenu = () => {
  return (
    <MenuWrapper>
      <MenuItem>Cards</MenuItem>
      <MenuItem>Calendar</MenuItem>
      <MenuItem>Gallery</MenuItem>
      <MenuItem>Favorites</MenuItem>
    </MenuWrapper>
  );
};

export default ProfileMenu;
