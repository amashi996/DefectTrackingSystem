import api from "../utils/api";
import { setAlert } from "./alert";
import {
  GET_REVIEWS,
  REVIEW_ERROR,
  UPDATE_LIKES,
  DELETE_REVIEW,
  ADD_REVIEW,
  GET_REVIEW,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";

// Get reviews
export const getReviews = () => async (dispatch) => {
  try {
    const res = await api.get("/reviews");

    dispatch({
      type: GET_REVIEWS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/reviews/like/${reviewId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/reviews/unlike/${reviewId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete review
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.delete(`/reviews/${id}`);

    dispatch({
      type: DELETE_REVIEW,
      payload: id,
    });

    dispatch(setAlert("Review Removed", "success"));
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add review
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post(`/reviews//addRev/${userId}`, formData);

    dispatch({
      type: ADD_REVIEW,
      payload: res.data,
    });

    dispatch(setAlert("Review Created", "success"));
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get review by id
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/reviews/${reviewId}`);

    dispatch({
      type: GET_REVIEW,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/reviews/comment/${reviewId}`, formData);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await api.delete(`/reviews/deleteComment/${reviewId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
