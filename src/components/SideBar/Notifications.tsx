import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { Note } from "../../store/types/notificationType";
import { UserInfo } from "../../store/types/userInfoType";
import { NotificationActions } from "../../store/actions/notificationActions";
import { firebase } from "../../utils/firebase";
import { NoSidebarDataText } from "./FollowList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
const NoticeWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
  background-color: #fff;
`;
interface NoticeProps {
  show: boolean;
}
const StyleWrapper = styled.div`
  width: 230px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Notice = styled.div<NoticeProps>`
  padding: 5px;
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 8px;
  transition: 0.25s;
  &:hover {
    text-decoration: underline;
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
  font-size: 14px;
  background-color: none;
  margin: 0 0 0 8px;
  width: 200px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: block;
  color: #5c836f;
  height: 14px;
  background: none;
`;
const CloseFontAwesomeIcon = styled(StyledFontAwesomeIcon)`
  width: 24px;
  height: 24px;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
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
              <CloseFontAwesomeIcon
                icon={faCircleXmark}
                onClick={() => deleteNotice(note.noticeId)}
              />
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
