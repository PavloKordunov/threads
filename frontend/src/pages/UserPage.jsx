import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader.jsx";
import UserPost from "../components/UserPost.jsx";
import { useParams } from "react-router-dom";
import useShowToast from '../hooks/useShowToast.jsx'
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {

    const [user, setUser] = useState(null)
    const {username} = useParams()
    const showToast = useShowToast()
    const [loading, setLoading] = useState(true)
    useEffect(()=> {
        const getUser = async() => {
            try{
                const res = await fetch(`/api/users/profile/${username}`)
                const data = await res.json()
                if(data.error){
                    showToast('Error', data.error, 'error')
                    return 
                }
                setUser(data)
            } catch(err) {
                showToast('Error', err, 'error')
            } finally{
                setLoading(false)
            }
        }

        getUser()
    }, [username, showToast])

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
            <UserPost likes={1200} replies={481} postImage='/post1.png' postTitle='Let`s talk about threads'/>
            <UserPost likes={251} replies={131} postImage='/post2.png' postTitle='Nice tutorial'/>
            <UserPost likes={653} replies={231} postImage='/post3.png' postTitle='I love this guy'/>
            <UserPost likes={986} replies={210}  postTitle='This is my first thread'/>
        </>
    )
}

export default UserPage;