import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/reducer";
import {
  disableWindowScrolling,
  enableWindowScrolling,
} from "../../utils/helpers";

interface WindowMaskProps {
  $show: boolean;
}
const WindowMask = styled.div<WindowMaskProps>`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  display: ${(props) => (props.$show ? "block" : "none")};
  transition: 0.25s;
  overflow: hidden;
`;

const Mask = () => {
  const maskDisplay = useSelector((state: RootState) => state.popUp.mask);
  useEffect(() => {
    if (maskDisplay) disableWindowScrolling();
    else enableWindowScrolling();
  }, [maskDisplay]);
  return <WindowMask $show={maskDisplay}></WindowMask>;
};

export default Mask;
