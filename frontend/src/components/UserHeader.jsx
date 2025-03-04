import {
    Avatar,
    Box,
    Flex,
    VStack,
    Text,
    Link,
    Menu,
    MenuButton,
    Portal,
    MenuList,
    MenuItem,
    useToast,
    Button
} from "@chakra-ui/react";
import {BsInstagram} from "react-icons/bs";
import {CgMoreO} from "react-icons/cg";
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";


const UserHeader = ({user}) => {

    const toast = useToast()
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
    const showToast = useShowToast()
    const [updating, setUpdating] = useState(false)
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "Copied",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
        })
    }

    const handleFollow = async() => {
        if(!currentUser){
            showToast('Error', data.error, 'error')
            return
        }

        if(updating) return

        setUpdating(true)
        try{
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await res.json()
            if(data.error){
                showToast('Error', data.error, 'error')
                return
            }
            if(following){
                showToast("Success", `Unfollowed ${user.name}`, "success")
                user.followers.pop()
            } else{
                showToast("Success", `Followed ${user.name}`, "success")
                user.followers.push(currentUser?._id)
            }

            setFollowing(!following)

        }catch(err){
            showToast('Error', err, 'error')
        } finally{
            setUpdating(false)
        }
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text size={'2xl'} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>{user.username}</Text>
                        <Text fontSize={'sm'}
                        bg={'gray.dark'} color={'grey.light'} p={1} borderRadius={'full'}
                        >threads.net</Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                    <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size={{
                            base:'lg',
                            md: 'xl',
                        }}
                    />
                    )}
                    {!user.profilePic && (
                    <Avatar
                        name={user.name}
                        src='https"//bit.ly/broken-link'
                        size={{
                            base:'lg',
                            md: 'xl',
                        }}
                    />
                    )}
                </Box>
            </Flex>

            <Text >{user.bio}</Text>

            {currentUser?._id === user._id && (
                <Link as={RouterLink} to='/update'>
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )}
            {currentUser?._id !== user._id && (
                    <Button size={"sm"} onClick={handleFollow} isLoading={updating}>
                        {following ? "Unfollow" : "Follow"}
                    </Button>
            )}

            <Flex justifyContent={"space-between"} w={"full"}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} >{user.followers.length} followers</Text>
                    <Box w={1} h={1} borderRadius={"full"} bg={'gray.light'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                    <MenuItem bg={'gray.dark'} onClick={copyURL}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={"full"}>
                <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={"center"} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={'1px solid gray'} justifyContent={"center"} color={'gray.light'} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader;