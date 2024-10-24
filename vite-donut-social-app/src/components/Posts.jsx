import { useEffect, useState } from "react";
import Post from './Post.jsx'
import usePosts from "./usePosts.jsx";

function Posts({postType}) {
    //console.log('fetching posts');
    const [posts, setPosts] = useState([]);
    let loggedInUserId = sessionStorage.getItem('userId');
    const { getPost } = usePosts(loggedInUserId);

    const fetchPosts = async() => {
        try {
            const allPosts = await getPost(postType);
            if(JSON.stringify(posts) !== JSON.stringify(allPosts)){
                setPosts(allPosts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [postType])

    return (
        <div className="posts">
                {posts.length === 0 ?
                    <h1>No {postType} posts</h1> :
                    posts.map((post) => <Post key={post.post_id} userIdPoster={post.user_id} initialPost={post} />)}
            </div>
    )
}

export default Posts;