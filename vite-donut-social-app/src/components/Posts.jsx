import { useEffect, useState } from "react";
import Post from './Post.jsx'
import usePosts from "./usePosts.jsx";
import { useParams } from "react-router-dom/dist/umd/react-router-dom.development.js";

function Posts({postType}) {

    const [posts, setPosts] = useState([]);
    const {userId} = useParams();
    
    const { getPost, deletePost } = usePosts(userId, posts, setPosts);

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