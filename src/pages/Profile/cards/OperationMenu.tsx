import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../../store/reducer/index";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { IconButton } from "../../../components/GlobalStyles/button";
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
  @media (max-width: 530px) {
    flex-wrap: wrap;
  }
`;
const MenuBtn = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin: 8px;
  border-radius: 5px;
  border: 2px solid ${(props) => props.theme.colors.main};
  background: #fff;
  transition: 0.25s;
  &:hover {
    transform: scale(1.2);
    transition: 0.25s;
  }
  @media (max-width: 530px) {
    width: 26px;
    height: 26px;
  }
`;
const MenuBtnActive = styled(MenuBtn)`
  background: ${(props) => props.theme.colors.main};
  & * {
    color: #fff;
  }
`;
const MenuBtnDisabled = styled(MenuBtn)`
  border-color: #ddd;
  cursor: not-allowed;
  & * {
    color: #ddd;
  }
  &:hover {
    transform: scale(1);
  }
  align-self: center;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  background-color: rgba(0, 0, 0, 0);
  color: ${(props) => props.theme.colors.main};
  width: 26px;
  height: 26px;
`;
const SmallFontAwesomeIcon = styled(StyledFontAwesomeIcon)`
  width: 20px;
  height: 20px;
`;
const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
  @media (max-width: 960px) {
    flex-direction: column;
    margin: 8px;
  }
`;
const IconLabel = styled.span`
  font-size: 14px;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.colors.main};
  @media (max-width: 960px) {
    font-size: 12px;
    letter-spacing: 0px;
    text-align: center;
  }
`;
interface OperationMenuProps {
  isSelf: boolean;
  viewMode: "grid" | "list";
  checkList: Record<string, boolean>;
  setViewMode: Dispatch<SetStateAction<"grid" | "list">>;
  setEditCardId: Dispatch<SetStateAction<string | null>>;
  setEditorDisplay: Dispatch<SetStateAction<boolean>>;
  filterToggle: () => void;
  allCheck: () => void;
  clearAllCheck: () => void;
  addEvents: (type: "water" | "fertilize") => Promise<void>;
  setConfirmMessage: () => void;
}
const OperationMenu = ({
  isSelf,
  viewMode,
  checkList,
  setViewMode,
  setEditCardId,
  setEditorDisplay,
  filterToggle,
  allCheck,
  clearAllCheck,
  addEvents,
  setConfirmMessage,
}: OperationMenuProps) => {
  const dispatch = useDispatch();
  const cardList = useSelector((state: RootState) => state.cards);
  const [allCheckStatus, setAllCheckStatus] = useState<boolean>(false);
  const [checkStatus, setCheckStatus] = useState<boolean>(
    Object.values(checkList).some((check) => check === true)
  );
  useEffect(() => {
    setCheckStatus(Object.values(checkList).some((check) => check === true));
  }, [checkList]);
  return cardList.length > 0 ? (
    <OperationMenuWrapper>
      {isSelf && (
        <BtnWrapper
          onClick={() => {
            setEditorDisplay(true);
            dispatch({
              type: PopUpActions.SHOW_MASK,
            });
          }}
        >
          <MenuBtn>
            <StyledFontAwesomeIcon icon={faPlus}></StyledFontAwesomeIcon>
          </MenuBtn>
          <IconLabel>Add Card</IconLabel>
        </BtnWrapper>
      )}
      <BtnWrapper onClick={filterToggle}>
        <MenuBtn>
          <SmallFontAwesomeIcon icon={faFilter}></SmallFontAwesomeIcon>
        </MenuBtn>
        <IconLabel>Filter</IconLabel>
      </BtnWrapper>
      {viewMode === "grid" && (
        <BtnWrapper onClick={() => setViewMode("list")}>
          <MenuBtn>
            <SmallFontAwesomeIcon icon={faList}></SmallFontAwesomeIcon>
          </MenuBtn>
          <IconLabel>List Mode</IconLabel>
        </BtnWrapper>
      )}
      {viewMode === "list" && (
        <BtnWrapper onClick={() => setViewMode("grid")}>
          <MenuBtn>
            <SmallFontAwesomeIcon icon={faTableCells}></SmallFontAwesomeIcon>
          </MenuBtn>
          <IconLabel>Grid Mode</IconLabel>
        </BtnWrapper>
      )}
      {isSelf && (
        <>
          {allCheckStatus && (
            <BtnWrapper
              onClick={() => {
                setAllCheckStatus(false);
                clearAllCheck();
              }}
            >
              <MenuBtnActive>
                <SmallFontAwesomeIcon icon={faCheck}></SmallFontAwesomeIcon>
              </MenuBtnActive>
              <IconLabel>Uncheck All</IconLabel>
            </BtnWrapper>
          )}
          {!allCheckStatus && (
            <BtnWrapper
              onClick={() => {
                setAllCheckStatus(true);
                allCheck();
              }}
            >
              <MenuBtn>
                <SmallFontAwesomeIcon icon={faCheck}></SmallFontAwesomeIcon>
              </MenuBtn>
              <IconLabel>Check All</IconLabel>
            </BtnWrapper>
          )}
          {checkStatus && (
            <>
              <BtnWrapper onClick={() => addEvents("water")}>
                <MenuBtn>
                  <SmallFontAwesomeIcon icon={faDroplet}></SmallFontAwesomeIcon>
                </MenuBtn>
                <IconLabel>Watering</IconLabel>
              </BtnWrapper>
              <BtnWrapper onClick={() => addEvents("fertilize")}>
                <MenuBtn>
                  <SmallFontAwesomeIcon
                    icon={faPersonDigging}
                  ></SmallFontAwesomeIcon>
                </MenuBtn>
                <IconLabel>Fertilizing</IconLabel>
              </BtnWrapper>
              <BtnWrapper
                onClick={() => {
                  dispatch({
                    type: PopUpActions.SHOW_MASK,
                  });
                  setConfirmMessage();
                }}
              >
                <MenuBtn>
                  <SmallFontAwesomeIcon
                    icon={faTrashCan}
                  ></SmallFontAwesomeIcon>
                </MenuBtn>
                <IconLabel>Delete Card</IconLabel>
              </BtnWrapper>
            </>
          )}
          {!checkStatus && (
            <>
              <MenuBtnDisabled>
                <SmallFontAwesomeIcon icon={faDroplet}></SmallFontAwesomeIcon>
              </MenuBtnDisabled>
              <MenuBtnDisabled>
                <SmallFontAwesomeIcon
                  icon={faPersonDigging}
                ></SmallFontAwesomeIcon>
              </MenuBtnDisabled>
              <MenuBtnDisabled>
                <SmallFontAwesomeIcon icon={faTrashCan}></SmallFontAwesomeIcon>
              </MenuBtnDisabled>
            </>
          )}
        </>
      )}
    </OperationMenuWrapper>
  ) : null;
};

export default OperationMenu;
