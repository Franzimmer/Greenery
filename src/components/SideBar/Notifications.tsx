import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Note } from "../../types/notificationType";
import { UserInfo } from "../../types/userInfoType";
import { useNavigate } from "react-router-dom";

const NoticeWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 8px;
`;
const Notice = styled.div`
  position: relative;
  padding: 5px;
  cursor: pointer;
  height: 60px;
`;
const NoticeCloseBtn = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  right: 0;
`;
interface NotificationsProps {
  notices: Note[];
  followInfos: UserInfo[];
}
const Notifications = ({ notices, followInfos }: NotificationsProps) => {
  const navigate = useNavigate();
  const noticeMsg1 = "有新植物了！";
  const noticeMsg2 = "在論壇區發表新文章了，去看看吧！";

  function findUserName(userId: string) {
    let target = followInfos.find((info) => info.userId === userId);
    if (target) return target.userName;
  }
  return (
    <NoticeWrapper>
      {notices.length !== 0 &&
        notices.map((note) => {
          return (
            <Notice key={note.noticeId}>
              <NoticeCloseBtn>X</NoticeCloseBtn>
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
