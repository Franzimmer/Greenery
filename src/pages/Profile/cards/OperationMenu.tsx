import React from "react";
import styled from "styled-components";
import { OperationBtn } from "./Cards";

const OperationMenuWrapper = styled.div`
  display: flex;
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
  return (
    <OperationMenuWrapper>
      {isSelf && (
        <OperationBtn
          onClick={() => {
            setEditCardId(null);
            editorToggle();
          }}
        >
          新增卡片
        </OperationBtn>
      )}
      <OperationBtn onClick={filterToggle}>Filter</OperationBtn>
      <OperationBtn>切換檢視</OperationBtn>
      {isSelf && (
        <>
          <OperationBtn onClick={allCheck}>全選</OperationBtn>
          <OperationBtn onClick={clearAllCheck}>全選清除</OperationBtn>
          <OperationBtn onClick={() => addEvents("water")}>澆水</OperationBtn>
          <OperationBtn onClick={() => addEvents("fertilize")}>
            施肥
          </OperationBtn>
          <OperationBtn onClick={deleteCards}>刪除卡片</OperationBtn>
        </>
      )}
    </OperationMenuWrapper>
  );
};

export default OperationMenu;
