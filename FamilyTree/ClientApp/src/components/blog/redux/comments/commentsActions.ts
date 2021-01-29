import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import commentsAPI from "../../../comments/commentsAPI/commentsAPI";
import {
  CreateCommentRequestData,
  CreateCommentResponse,
} from "../../../comments/commentsAPI/createComment/requestCreateComment";
import {
  DeleteCommentRequestData,
  DeleteCommentResponse,
} from "../../../comments/commentsAPI/deleteComment/requestDeleteComment";
import {
  EditCommentRequestData,
  EditCommentResponse,
} from "../../../comments/commentsAPI/editComment/requestEditComment";
import {
  GetCommentRequestData,
  GetCommentResponse,
} from "../../../comments/commentsAPI/getComments/getComments";

export const COMMENTS_ACTION_PREFIX = "comments";
export const getComments = createAsyncThunk<
  AxiosResponse<GetCommentResponse>,
  GetCommentRequestData
>(`${COMMENTS_ACTION_PREFIX}/getComments`, async (data) => {
  return await commentsAPI.requestGetComments(data);
});

export const createComment = createAsyncThunk<
  AxiosResponse<CreateCommentResponse>,
  CreateCommentRequestData
>(`${COMMENTS_ACTION_PREFIX}/addComment`, async (data) => {
  return await commentsAPI.requestCreateComment(data);
});

export const editComment = createAsyncThunk<
  AxiosResponse<EditCommentResponse>,
  EditCommentRequestData
>(`${COMMENTS_ACTION_PREFIX}/editedComment`, async (data) => {
  return await commentsAPI.requestEditComment(data);
});
export const deleteComment = createAsyncThunk<
  AxiosResponse<DeleteCommentResponse>,
  DeleteCommentRequestData
>(`${COMMENTS_ACTION_PREFIX}/deletedComment`, async (data) => {
  return commentsAPI.requestDeleteComment(data);
});
