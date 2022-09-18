import React, { useState } from "react";
import styled from "styled-components";
import {
  IconButton,
  OperationBtn,
} from "../../../components/GlobalStyles/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFilter,
  faTableCells,
  faCheck,
  faList,
  faDroplet,
  faPersonDigging,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const OperationMenuWrapper = styled.div`
  display: flex;
`;
const MenuBtn = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin-right: 20px;
  border-radius: 5px;
  border: 2px solid #5c836f;
  background: #fff;
  transition: 0.25s;
  &:hover {
    transform: scale(1.2);
    transition: 0.25s;
  }
`;
const MenuBtnActive = styled(MenuBtn)`
  background: #5c836f;
  & * {
    color: #fff;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  background-color: rgba(0, 0, 0, 0);
  color: #5c836f;
  width: 26px;
  height: 26px;
`;
const SmallFontAwesomeIcon = styled(StyledFontAwesomeIcon)`
  width: 20px;
  height: 20px;
`;
interface OperationMenuProps {
  isSelf: boolean;
  setEditCardId: React.Dispatch<React.SetStateAction<string | null>>;
  editorToggle: () => void;
  filterToggle: () => void;
  allCheck: () => void;
  clearAllCheck: () => void;
  addEvents: (type: "water" | "fertilize") => Promise<void>;
  deleteCards: () => Promise<void>;
}
const OperationMenu = ({
  isSelf,
  setEditCardId,
  editorToggle,
  filterToggle,
  allCheck,
  clearAllCheck,
  addEvents,
  deleteCards,
}: OperationMenuProps) => {
  const [allCheckStatus, setAllCheckStatus] = useState<boolean>(false);

  return (
    <OperationMenuWrapper>
      {isSelf && (
        <MenuBtn
          onClick={() => {
            setEditCardId(null);
            editorToggle();
          }}
        >
          <StyledFontAwesomeIcon icon={faPlus}></StyledFontAwesomeIcon>
        </MenuBtn>
      )}
      <MenuBtn onClick={filterToggle}>
        <SmallFontAwesomeIcon icon={faFilter}></SmallFontAwesomeIcon>
      </MenuBtn>
      <MenuBtn>
        <SmallFontAwesomeIcon icon={faList}></SmallFontAwesomeIcon>
      </MenuBtn>
      {isSelf && (
        <>
          {allCheckStatus && (
            <MenuBtnActive
              onClick={() => {
                setAllCheckStatus(false);
                clearAllCheck();
              }}
            >
              <SmallFontAwesomeIcon icon={faCheck}></SmallFontAwesomeIcon>
            </MenuBtnActive>
          )}
          {!allCheckStatus && (
            <MenuBtn
              onClick={() => {
                setAllCheckStatus(true);
                allCheck();
              }}
            >
              <SmallFontAwesomeIcon icon={faCheck}></SmallFontAwesomeIcon>
            </MenuBtn>
          )}
          <MenuBtn onClick={() => addEvents("water")}>
            <SmallFontAwesomeIcon icon={faDroplet}></SmallFontAwesomeIcon>
          </MenuBtn>
          <MenuBtn onClick={() => addEvents("fertilize")}>
            <SmallFontAwesomeIcon icon={faPersonDigging}></SmallFontAwesomeIcon>
          </MenuBtn>
          <MenuBtn onClick={deleteCards}>
            <SmallFontAwesomeIcon icon={faTrashCan}></SmallFontAwesomeIcon>
          </MenuBtn>
        </>
      )}
    </OperationMenuWrapper>
  );
};

export default OperationMenu;
