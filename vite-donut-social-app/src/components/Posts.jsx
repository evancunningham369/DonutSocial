import { useEffect, useState } from "react";
import Post from './Post.jsx'
import usePosts from "./usePosts.jsx";

function Posts({postType}) {

    const [posts, setPosts] = useState([]);
    let loggedInUserId = sessionStorage.getItem('userId');
    const { getPost, deletePost } = usePosts(loggedInUserId, posts, setPosts);

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
                    posts.map((post) => <Post key={post.post_id} post={post} deletePost={deletePost} />)}
            </div>
    )
}

export default Posts;