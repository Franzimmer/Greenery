import React, { MouseEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { LabelText } from "../../components/GlobalStyles/text";
import { TabDisplayType } from "./Profile";
const MenuWrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding-bottom: 20px;
  margin-bottom: 10px;
  @media (max-width: 400px) {
    margin: 0 auto 10px;
  }
`;
interface MenuItemProps {
  $show: boolean;
}
const MenuItem = styled(LabelText)<MenuItemProps>`
  font-size: 16px;
  margin-right: 20px;
  padding: 5px;
  cursor: pointer;
  color: ${(props) =>
    props.$show ? props.theme.colors.main : props.theme.colors.button};
  transition: 0.5s;
  &:hover {
    color: ${(props) => props.theme.colors.main};
    transform: scale(1.1);
    transition: 0.5s;
  }
  @media (max-width: 500px) {
    font-size: 14px;
    margin-right: 8px;
    font-weight: 500;
    padding-left: 0px;
  }
`;
interface ProfileMenuProps {
  tabDisplay: TabDisplayType;
  setTabDisplay: Dispatch<SetStateAction<TabDisplayType>>;
}
const ProfileMenu = ({ tabDisplay, setTabDisplay }: ProfileMenuProps) => {
  function tabSwitcher(event: MouseEvent<HTMLElement>) {
    const resetState = {
      Cards: false,
      Calendar: false,
      Gallery: false,
      Favorites: false,
    };
    const target = event.target as HTMLButtonElement;
    const key = target.textContent as
      | "Cards"
      | "Calendar"
      | "Gallery"
      | "Favorites";
    resetState[key] = true;
    setTabDisplay(resetState);
  }
  return (
    <MenuWrapper>
      <MenuItem $show={tabDisplay.Cards} onClick={(e) => tabSwitcher(e)}>
        Cards
      </MenuItem>
      <MenuItem $show={tabDisplay.Calendar} onClick={(e) => tabSwitcher(e)}>
        Calendar
      </MenuItem>
      <MenuItem $show={tabDisplay.Gallery} onClick={(e) => tabSwitcher(e)}>
        Gallery
      </MenuItem>
      <MenuItem $show={tabDisplay.Favorites} onClick={(e) => tabSwitcher(e)}>
        Favorites
      </MenuItem>
    </MenuWrapper>
  );
};

export default ProfileMenu;
