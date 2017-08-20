import { DEFAULT_KEY } from "redux-cache";

const FETCH_POSTS_REQUEST = "Posts.FETCH_POSTS_REQUEST";
const FETCH_POSTS_SUCCESS = "Posts.FETCH_POSTS_SUCCESS";
const FETCH_POSTS_FAILURE = "Posts.FETCH_POSTS_FAILURE";

const getPosts = () => (dispatch) => {
	dispatch({
		type: FETCH_POSTS_REQUEST
	});

	// TODO: Fetch from endpoint here

	dispatch({
		type: FETCH_POSTS_SUCCESS
	});

	// dispatch({
	// 	type: FETCH_POSTS_FAILURE
	// })
};

// Reducer 
const initialState = {
	[DEFAULT_KEY]: null,
	posts: []
}

const postReducer = (state, action) => {
	switch (action.type) {
		case FETCH_POSTS_SUCCESS: {
			console.log("lit");
			return state;
		}

		default: {
			return state;
		}
	}
}

export default postReducer;