import {
  GET_REVIEWS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_REVIEW,
  ADD_REVIEW,
  GET_REVIEW,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "../actions/types";

const initialState = {
  reviews: [],
  review: null,
  loading: true,
  error: {},
};

function reviewReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REVIEWS:
      return {
        ...state,
        reviews: payload,
        loading: false,
      };
    case GET_REVIEW:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_REVIEW:
      return {
        ...state,
        reviews: [payload, ...state.reviews],
        loading: false,
      };
    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review._id !== payload),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review._id === payload.id
            ? { ...review, likes: payload.likes }
            : review
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        review: { ...state.review, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        review: {
          ...state.review,
          comments: state.review.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        loading: false,
      };
    default:
      return state;
  }
}

export default reviewReducer;
