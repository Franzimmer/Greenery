import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer";
import { Note } from "../../types/notificationType";
import { UserInfo } from "../../types/userInfoType";
import { NotificationActions } from "../../actions/notificationActions";
import { firebase } from "../../utils/firebase";
import { NoSidebarDataText } from "./FollowList";
import { CloseBtn } from "../../components/GlobalStyles/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
const NoticeWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
  background-color: #fff;
  & :not(button) {
    background-color: #fff;
  }
`;
interface NoticeProps {
  show: boolean;
}
const StyleWrapper = styled.div`
  display: flex;
  align-items: center;
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
  background: none;
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
      {notices.length === 0 && (
        <NoSidebarDataText>No notification now.</NoSidebarDataText>
      )}
    </NoticeWrapper>
  );
};

export default Notifications;
