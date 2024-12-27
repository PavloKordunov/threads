import {Link} from "react-router-dom";
import {Avatar, Box, Flex, Text, Image} from "@chakra-ui/react";
import {BsThreeDots} from "react-icons/bs";
import Actions from "./Actions.jsx";
import {useState} from "react";

const UserPage = ({postImage, postTitle, likes, replies}) => {

    const [liked, setLiked] = useState(false);

    return (
        <Link to='/markzuckerberg/post/1'>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={'md'} name='Marck Zuckerberg' src='/zuck-avatar.png' />
                    <Box w='1px' h={'full'} bg='gray.light' my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                         <Avatar
                         size={'xs'}
                         name='John Doe'
                         src='https://bit.ly/dan-abramov'
                         position={'absolute'}
                         top={'0px'}
                         left={'15px'}
                         padding={'2px'}
                         />
                        <Avatar
                            size={'xs'}
                            name='John Doe'
                            src='https://bit.ly/sage-adebayo'
                            position={'absolute'}
                            bottom={'0px'}
                            right={'-5px'}
                            padding={'2px'}
                        />
                        <Avatar
                            size={'xs'}
                            name='John Doe'
                            src='https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
                            position={'absolute'}
                            bottom={'0px'}
                            left={'4px'}
                            padding={'2px'}
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'}>murckzuckerberg</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1}/>
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
                            <BsThreeDots/>
                        </Flex>
                    </Flex>

                    <Text fontSize={'sm'}>{postTitle}</Text>
                    {postImage && (
                        <Box borderRadius={6} border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'}>
                            <Image src={postImage} w={'full'}/>
                        </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} fontSize={'sm'}>{replies} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                        <Text color={'gray.light'} fontSize={'sm'}>{likes} likes</Text>
                    </Flex>

                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPage;