import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {

    const {user, loading} = useGetUserProfile()
    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const currentUser = useRecoilValue(userAtom)
    const {pid: pId} = useParams()
    const navigate = useNavigate()
    const currentPost = posts[0]

    useEffect(() => {
        const getPost =async() => {
            try {
                const res = await fetch(`/api/posts/${pId}`)
                const data = await res.json()

                if(data.error){
                    showToast('Error', data.error, 'error')
                    return 
                }

                console.log(data)
                setPosts([data])
            } catch (error) {
                showToast('Error', error, 'error')
            }
        }
        getPost()
    }, [showToast, pId, setPosts])

    const handleDeletePost = async (e) => {
        e.preventDefault()
        try {
            if(!window.confirm("Are you sure you want to delete this post")) return
            const res = await fetch(`/api/posts/${currentPost._id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if(data.error){
                showToast('Error', error, 'error')
                return
            }
            showToast('Success', "post deleted", 'success')
            navigate(`/${user.username}`)
        } catch (error) {
            showToast('Error', error, 'error')
        }
    }

    if(!user && loading){
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={'xl'}/>
            </Flex>
        )
    }

    if(!currentPost) return null
    return (
        <>
            <Flex>
                <Flex w={'full'} alignItems={'center'} gap={3}>
                    <Avatar src={user.profilePic} size={'md'} name={user.name}/>
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
                        <Image src='/verified.svg' w={4} h={4} ml={4}/>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'sm'} w={"36"} textAlign={'right'} color={'gray.light'}>
                                {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                                </Text>

                                {currentUser?._id === user?._id && <DeleteIcon cursor={'pointer'} onClick={handleDeletePost}/>}
                        </Flex>
                </Flex>
            </Flex>

            <Text my={3}>{currentPost.text}</Text>

            {currentPost.img && (
                <Box borderRadius={6} border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'}>
                    <Image src={currentPost.img} w={'full'}/>
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost}/>
            </Flex>

            <Divider my={4}/>

            <Flex justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={'gray.light'}>Get the app to like, reply and post</Text>
                </Flex>
                <Button>
                    Get
                </Button>
            </Flex>

            <Divider my={4}/>

            {currentPost.replies.map((reply, id) => (
                <Comment 
                    key={id}
                    reply={reply}
                    lastReply = {reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                />
            ))}
        </>
    )
}

export default PostPage;