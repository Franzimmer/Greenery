import React, { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { useDispatch } from "react-redux";
import { PopUpActions } from "../../../store/actions/popUpActions";
import { firebase } from "../../../utils/firebase";
import { useAlertDispatcher } from "../../../utils/useAlertDispatcher";
import { UserInfo } from "../../../store/types/userInfoType";
import {
  PostWrapper,
  AuthorInfo,
  AuthorPhoto,
  AuthorName,
  Content,
  BtnWrapper,
  EditIconBtn,
  StyledFontAwesomeIcon,
  OpenChatRoomBtn,
  Post,
  Comment,
} from "./ForumPost";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
interface CommentSectionProps {
  post: Post | undefined;
  userInfo: UserInfo;
  comment: Comment;
  comments: Comment[];
  commentAuthorInfos: Record<string, UserInfo>;
  openChatroom: (targetId: string) => void;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  setEditTargetComment: Dispatch<SetStateAction<Comment | undefined>>;
  setInitContent: Dispatch<SetStateAction<string>>;
  setEditorMode: Dispatch<
    SetStateAction<"AddPost" | "EditPost" | "AddComment" | "EditComment">
  >;
  setTextEditorDisplay: Dispatch<SetStateAction<boolean>>;
}
const CommentSection = ({
  post,
  userInfo,
  comment,
  comments,
  commentAuthorInfos,
  openChatroom,
  setComments,
  setEditTargetComment,
  setInitContent,
  setEditorMode,
  setTextEditorDisplay,
}: CommentSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alertDispatcher = useAlertDispatcher();
  async function deleteComment(deleteTarget: Comment) {
    const postId = post!.postId;
    const newComments = comments!.filter((comment) => comment !== deleteTarget);
    await firebase.saveEditComment(postId, newComments);
    setComments(newComments);
    alertDispatcher("success", "Delete Comment Success !");
  }
  function editComment(comment: Comment) {
    setEditTargetComment(comment);
    setInitContent(comment.content);
    setEditorMode("EditComment");
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
    setTextEditorDisplay(true);
  }
  return (
    <PostWrapper key={`${comment.authorId}_${comment.createdTime}`}>
      <AuthorInfo>
        <AuthorPhoto
          $path={commentAuthorInfos[comment.authorId]?.photoUrl}
          onClick={() => navigate(`/profile/${comment.authorId}`)}
        />
        <AuthorName>
          {commentAuthorInfos[comment.authorId]?.userName}
        </AuthorName>
        {userInfo.userId !== comment.authorId && (
          <OpenChatRoomBtn onClick={() => openChatroom(comment.authorId)}>
            Open Chatroom
          </OpenChatRoomBtn>
        )}
      </AuthorInfo>
      <Content>{post?.content && parse(comment.content)}</Content>
      {userInfo.userId === comment.authorId && (
        <BtnWrapper>
          <EditIconBtn onClick={() => editComment(comment)}>
            <StyledFontAwesomeIcon icon={faPenToSquare} />
          </EditIconBtn>
          <EditIconBtn onClick={() => deleteComment(comment)}>
            <StyledFontAwesomeIcon icon={faTrashCan} />
          </EditIconBtn>
        </BtnWrapper>
      )}
    </PostWrapper>
  );
};

export default CommentSection;
