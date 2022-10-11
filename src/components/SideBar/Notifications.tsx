import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer";
import { Note } from "../../store/types/notificationType";
import { UserInfo } from "../../store/types/userInfoType";
import { NotificationActions } from "../../store/actions/notificationActions";
import { firebase } from "../../utils/firebase";
import { NoSidebarDataText } from "./FollowList";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
const NoticeWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 20px;
  background-color: #fff;
`;
interface NoticeProps {
  $read: boolean;
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
  background-color: ${(props) =>
    props.$read ? "#fff" : "rgba(92, 131, 111, 0.2)"};
  margin-left: 8px;
  transition: 0.25s;
  &:hover {
    text-decoration: underline;
    transition: 0.25s;
  }
`;
const NoticeText = styled.div`
  font-size: 14px;
  background-color: none;
  margin: 0 0 0 8px;
  width: 200px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: block;
  color: ${(props) => props.theme.colors.main};
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
    const target = followInfos.find((info) => info.userId === userId);
    if (target) return target.userName;
  }
  function deleteNotice(noticeId: string) {
    const userId = userInfo.userId;
    dispatch({
      type: NotificationActions.DELETE_NOTIFICATION,
      payload: { noticeId },
    });
    firebase.deleteNotice(userId, noticeId);
  }
  function changeReadStatus(noticeId: string) {
    const userId = userInfo.userId;
    dispatch({
      type: NotificationActions.UPDATE_READ_STATUS,
      payload: { noticeId },
    });
    firebase.updateNoticeReadStatus(userId, noticeId);
  }
  return (
    <NoticeWrapper>
      {notices.length !== 0 &&
        notices.map((note) => {
          return (
            <Notice
              key={note.noticeId}
              $read={note.read}
              onClick={() => {
                if (!note.read) changeReadStatus(note.noticeId);
              }}
            >
              <StyleWrapper>
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
