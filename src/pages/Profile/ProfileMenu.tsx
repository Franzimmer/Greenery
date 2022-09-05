import React, { useState } from "react";
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
interface ProfileMenuProps {
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const ProfileMenu = ({ setTabDisplay }: ProfileMenuProps) => {
  function tabSwitcher(event: React.MouseEvent<HTMLElement>) {
    let defaultState = {
      Cards: false,
      Calendar: false,
    };
    let target = event.target as HTMLButtonElement;
    let key = target.textContent as "Cards" | "Calendar";
    defaultState[key] = true;
    setTabDisplay(defaultState);
  }
  return (
    <MenuWrapper>
      <MenuItem onClick={(e) => tabSwitcher(e)}>Cards</MenuItem>
      <MenuItem onClick={(e) => tabSwitcher(e)}>Calendar</MenuItem>
      <MenuItem>Gallery</MenuItem>
      <MenuItem>Favorites</MenuItem>
    </MenuWrapper>
  );
};

export default ProfileMenu;
