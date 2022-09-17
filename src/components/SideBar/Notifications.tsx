import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { Note } from "../../types/notificationType";
import { UserInfo } from "../../types/userInfoType";
import { NotificationActions } from "../../actions/notificationActions";
import { useNavigate } from "react-router-dom";
import { firebase } from "../../utils/firebase";
import { CloseBtn } from "../../components/GlobalStyles/button";
const NoticeWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
`;
interface NoticeProps {
  show: boolean;
}
const StyleWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const hoverEffect = keyframes`
  0% {
    margin-left: margin-left;
  }
  100% {
    margin-left: 20px;
  }
`;
const Notice = styled.div<NoticeProps>`
  padding: 5px;
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 14px;
  transition: 0.25s;
  &:hover {
    margin-left: 20px;
    transition: 0.25s;
  }
`;
const UnreadMark = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #5c836f;
`;
const NoticeText = styled.div`
  font-size: 16px;
  background-color: none;
  margin: 0px 8px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: block;
  color: #5c836f;
  height: 16px;
`;
interface NotificationsProps {
  notices: Note[];
  followInfos: UserInfo[];
}
const Notifications = ({ notices, followInfos }: NotificationsProps) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const noticeMsg1 = " got a new Plant!";
  const noticeMsg2 = " release a new Post, go check it！";

  function findUserName(userId: string) {
    let target = followInfos.find((info) => info.userId === userId);
    if (target) return target.userName;
  }
  async function deleteNotice(noticeId: string) {
    const userId = userInfo.userId;
    dispatch({
      type: NotificationActions.DELETE_NOTIFICATION,
      payload: { noticeId },
    });
    await firebase.deleteNotice(userId, noticeId);
  }
  async function changeReadStatus(noticeId: string) {
    const userId = userInfo.userId;
    dispatch({
      type: NotificationActions.UPDATE_READ_STATUS,
      payload: { noticeId },
    });
    await firebase.updateReadStatus(userId, noticeId);
  }
  return (
    <NoticeWrapper>
      {notices.length !== 0 &&
        notices.map((note) => {
          return (
            <Notice
              key={note.noticeId}
              show={note.read}
              onClick={() => {
                if (!note.read) {
                  changeReadStatus(note.noticeId);
                }
              }}
            >
              <StyleWrapper>
                {!note.read && <UnreadMark />}
                {note.type === "1" && (
                  <NoticeText
                    onClick={() => navigate(`/profile/${note.userId}`)}
                  >{`${findUserName(note.userId)}${noticeMsg1}`}</NoticeText>
                )}
                {note.type === "2" && (
                  <NoticeText
                    onClick={() => navigate(`/forum/${note.postId}`)}
                  >{`${findUserName(note.userId)}${noticeMsg2}`}</NoticeText>
                )}
                <StyledFontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </StyleWrapper>
              <CloseBtn onClick={() => deleteNotice(note.noticeId)}>X</CloseBtn>
            </Notice>
          );
        })}
    </NoticeWrapper>
  );
};

export default Notifications;
