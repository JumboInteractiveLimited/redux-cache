import axios from "axios";
import { DEFAULT_KEY, generateCacheTTL, checkCacheValid } from "redux-cache";

const FETCH_POSTS_REQUEST = "Posts.FETCH_POSTS_REQUEST";
const FETCH_POSTS_SUCCESS = "Posts.FETCH_POSTS_SUCCESS";
const FETCH_POSTS_FAILURE = "Posts.FETCH_POSTS_FAILURE";

export const getPosts = () => (dispatch, getState) => {
	const isCacheValid = checkCacheValid(getState, "posts");
	if (isCacheValid) { return null; }

	dispatch({
		type: FETCH_POSTS_REQUEST
	});

	axios.get("https://jsonplaceholder.typicode.com/posts")
		.then((response) => {
				dispatch({
				type: FETCH_POSTS_SUCCESS,
				payload: response.data,
			});
		})
		.catch((error) => {
			console.log('error: ', error);
			dispatch({
				type: FETCH_POSTS_FAILURE,
				payload: error,
			});
		});
};

// Reducer 
const initialState = {
	[DEFAULT_KEY]: null,
	results: [],
	callCount: 0
}

const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_POSTS_SUCCESS: {
			return {
				...state,
				[DEFAULT_KEY]: generateCacheTTL(),
				callCount: state.callCount + 1,
				results: action.payload
			};
		}

		default: {
			return state;
		}
	}
}

export default postReducer;