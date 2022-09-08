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
interface ProfileMenuProps {
  setTabDisplay: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
const ProfileMenu = ({ setTabDisplay }: ProfileMenuProps) => {
  function tabSwitcher(event: React.MouseEvent<HTMLElement>) {
    let defaultState = {
      Cards: false,
      Calendar: false,
      Gallery: false,
    };
    let target = event.target as HTMLButtonElement;
    let key = target.textContent as "Cards" | "Calendar" | "Gallery";
    defaultState[key] = true;
    setTabDisplay(defaultState);
  }
  return (
    <MenuWrapper>
      <MenuItem onClick={(e) => tabSwitcher(e)}>Cards</MenuItem>
      <MenuItem onClick={(e) => tabSwitcher(e)}>Calendar</MenuItem>
      <MenuItem onClick={(e) => tabSwitcher(e)}>Gallery</MenuItem>
      <MenuItem>Favorites</MenuItem>
      <input type="string" placeholder="搜尋使用者id開啟聊天室"></input>
    </MenuWrapper>
  );
};

export default ProfileMenu;
