import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Note } from "../../types/notificationType";
import { UserInfo } from "../../types/userInfoType";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { useDispatch } from "react-redux";
import { NotificationActions } from "../../actions/notificationActions";
import { firebase } from "../../utils/firebase";
import { read } from "fs";

const NoticeWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
`;
interface NoticeProps {
  show: boolean;
}
const Notice = styled.div<NoticeProps>`
  position: relative;
  padding: 5px;
  cursor: pointer;
  height: 100px;
  background: ${(props) => (props.show ? "#e1f0dc" : "#f2dcd9")};
`;
const NoticeCloseBtn = styled.div`
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  background: #eee;
  font-weight: 700;
  &:hover {
    background: #000;
    color: #fff;
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
  const noticeMsg1 = "有新植物了！";
  const noticeMsg2 = "在論壇區發表新文章了，去看看吧！";

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
              <NoticeCloseBtn onClick={() => deleteNotice(note.noticeId)}>
                X
              </NoticeCloseBtn>
              {note.type === "1" && (
                <p
                  onClick={() => navigate(`/profile/${note.userId}`)}
                >{`${findUserName(note.userId)}${noticeMsg1}`}</p>
              )}
              {note.type === "2" && (
                <p
                  onClick={() => navigate(`/forum/${note.postId}`)}
                >{`${findUserName(note.userId)}${noticeMsg2}`}</p>
              )}
            </Notice>
          );
        })}
    </NoticeWrapper>
  );
};

export default Notifications;
