import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faFaceSurprise,
} from "@fortawesome/free-regular-svg-icons";
import { RootState } from "../../reducer";
interface AlertWrapperProps {
  show: boolean;
}
const AlertWrapper = styled.div<AlertWrapperProps>`
  position: fixed;
  z-index: 102;
  top: ${(props) => (props.show ? "30px" : "-100px")};
  left: 50vw;
  transform: translateX(-50%);
  display: flex;
  width: 250px;
  height: 80px;
  transition: 1s top ease-out;
`;
interface AlertType {
  type: "success" | "fail";
}
const AlertHeader = styled.div<AlertType>`
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.type === "success" ? "#224229" : "#b12929")};
  color: #fff;
  border-radius: 10px 0 0 10px;
  border: ${(props) =>
    props.type === "success" ? "1px solid #224229" : "1px solid #b12929"};
`;
const AlertMsg = styled(AlertHeader)<AlertType>`
  width: 170px;
  background: #fff;
  color: ${(props) => (props.type === "success" ? "#224229" : "#b12929")};
  font-size: 14px;
  letter-spacing: 1px;
  border-radius: 0 10px 10px 0;
  border: ${(props) =>
    props.type === "success" ? "1px solid #224229" : "1px solid #b12929"};
  padding: 8px;
`;
const AlertIcon = styled(FontAwesomeIcon)`
  color: #fff;
  width: 50px;
  height: 50px;
`;

const Alert = () => {
  const popUp = useSelector((state: RootState) => state.popUp);
  return (
    <AlertWrapper show={popUp.alert}>
      <AlertHeader type={popUp.alertInfo.type}>
        {popUp.alertInfo.type === "success" && <AlertIcon icon={faFaceSmile} />}
        {popUp.alertInfo.type === "fail" && <AlertIcon icon={faFaceSurprise} />}
      </AlertHeader>
      <AlertMsg type={popUp.alertInfo.type}>{popUp.alertInfo.msg}</AlertMsg>
    </AlertWrapper>
  );
};

export default Alert;
