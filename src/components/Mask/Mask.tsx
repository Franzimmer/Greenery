import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../reducer";

interface WindowMaskProps {
  show: boolean;
}
const WindowMask = styled.div<WindowMaskProps>`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Mask = () => {
  const maskDisplay = useSelector((state: RootState) => state.popUp.mask);
  return <WindowMask show={maskDisplay}></WindowMask>;
};

export default Mask;
