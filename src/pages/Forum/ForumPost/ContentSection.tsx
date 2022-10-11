import React, { Dispatch, SetStateAction } from "react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PlantCard } from "../../../store/types/plantCardType";
import { UserInfo } from "../../../store/types/userInfoType";
import { PopUpActions } from "../../../store/actions/popUpActions";
import TradeCardSection from "./TradeCardSection";
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
} from "./ForumPost";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
interface ConetentSectionProps {
  post: Post | undefined;
  cards: PlantCard[];
  isLoggedIn: boolean;
  authorInfo: UserInfo;
  userInfo: UserInfo;
  openChatroom: (targetId: string) => void;
  setEditorMode: Dispatch<
    SetStateAction<"EditPost" | "AddPost" | "AddComment" | "EditComment">
  >;
  setTextEditorDisplay: Dispatch<SetStateAction<boolean>>;
  deletePost: (postId: string) => Promise<void>;
  setDetailData: Dispatch<SetStateAction<PlantCard | undefined>>;
  setDiaryId: Dispatch<SetStateAction<string | null>>;
  setOwnerId: Dispatch<SetStateAction<string>>;
}
const ConetentSection = ({
  post,
  cards,
  isLoggedIn,
  authorInfo,
  userInfo,
  openChatroom,
  setEditorMode,
  setTextEditorDisplay,
  deletePost,
  setDetailData,
  setDiaryId,
  setOwnerId,
}: ConetentSectionProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleTextEditorClick() {
    setEditorMode("EditPost");
    setTextEditorDisplay(true);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  return (
    <PostWrapper>
      <AuthorInfo>
        <AuthorPhoto
          $path={authorInfo?.photoUrl}
          onClick={() => navigate(`/profile/${authorInfo?.userId}`)}
        />
        <AuthorName onClick={() => navigate(`/profile/${authorInfo?.userId}`)}>
          {authorInfo?.userName}
        </AuthorName>
        {userInfo.userId !== authorInfo?.userId && isLoggedIn && (
          <OpenChatRoomBtn onClick={() => openChatroom(authorInfo!.userId)}>
            Open Chatroom
          </OpenChatRoomBtn>
        )}
      </AuthorInfo>
      <Content>{post?.content && parse(post.content)}</Content>
      {cards.length !== 0 && (
        <TradeCardSection
          cards={cards}
          setDetailData={setDetailData}
          setDiaryId={setDiaryId}
          setOwnerId={setOwnerId}
        />
      )}
      {userInfo.userId === post?.authorId && (
        <BtnWrapper>
          <EditIconBtn onClick={handleTextEditorClick}>
            <StyledFontAwesomeIcon icon={faPenToSquare} />
          </EditIconBtn>
          <EditIconBtn onClick={() => deletePost(post.postId)}>
            <StyledFontAwesomeIcon icon={faTrashCan} />
          </EditIconBtn>
        </BtnWrapper>
      )}
    </PostWrapper>
  );
};

export default ConetentSection;
