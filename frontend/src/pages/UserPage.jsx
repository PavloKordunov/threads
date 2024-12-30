import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader.jsx";
import UserPost from "../components/UserPost.jsx";
import { useParams } from "react-router-dom";
import useShowToast from '../hooks/useShowToast.jsx'
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";

const UserPage = () => {

    const {username} = useParams()
    const showToast = useShowToast()
    const {user, loading} = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [fetchingPosts, setFetchingPosts] = useState(true)

    useEffect(()=> {


        const getPost = async() => {
            setFetchingPosts(true)
            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json()
                console.log(data)
                setPosts(data)
            } catch (error) {
                showToast('Error', err, 'error')
                setPosts([])
            } finally{
                setFetchingPosts(false)
            }
        }

        getPost()
    }, [username, showToast, setPosts])

    if(!user && loading){
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={'xl'}/>
            </Flex>
        )
    }
    if(!user && !loading) return <h1>User not found</h1>
return(
        <>
            <UserHeader user={user}/>

            {!fetchingPosts && posts.length === 0 &&<h1>User has no posts</h1>}
            {fetchingPosts && (
                <Flex justify={'center'} my={12}>
                    <Spinner size={'xl'}/>
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    )
}

export default UserPage;