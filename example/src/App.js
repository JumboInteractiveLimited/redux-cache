import React, { Component } from 'react';
import { connect } from 'react-redux';
import { invalidateCache } from 'redux-cache';

import { getPosts } from "./redux/posts";

import logo from './logo.svg';
import './App.css';

class App extends Component {
	handleInvalidateClick = () => {
		const { invalidateCache } = this.props;
		invalidateCache("posts");
	}

	handleGetPosts = () => {
		const { getPosts } = this.props;
		getPosts();
	}

	render() {
		const { posts, callCount } = this.props;

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>redux-cache</h2>
				</div>
				<div className="App-container container">
					<div className="row justify-content-center">
						<div className="col-sm-12">
							<div className="App-buttons">
								<button type="button" className="btn btn-primary" onClick={this.handleGetPosts}>
									Get Posts
								</button>
								&nbsp;
								<button type="button" className="btn btn-primary" onClick={this.handleInvalidateClick}>
									Invalidate Posts Cache
								</button>
							</div>
							<div>
								<br/>
								<p><strong>Number of calls:</strong> {callCount}</p>
							</div>
						</div>
					</div>

					<div className="row justify-content-center" style={{ marginTop: "20px" }}>
						<div className="col-sm-12">
							<div className="App-posts">
								<ul>
									{posts.map(post => {
										return (
											<li key={post.id} style={{ textAlign: "left" }}>
												{post.title}
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	posts: state.posts.results,
	callCount: state.posts.callCount
});

const mapDispatchToProps = {
	getPosts: () => getPosts(),
	invalidateCache: (cacheKeys) => invalidateCache(cacheKeys)
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
