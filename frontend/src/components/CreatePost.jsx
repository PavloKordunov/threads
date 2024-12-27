import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import { BsFillImageFill } from "react-icons/bs"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast"

const MAX_CHAR = 500

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imgRef = useRef(null)
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR)
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [loading, setLoading] = useState(false)

    const handleTextChange =(e) => {
        const inputText = e.target.value

        if(inputText.length > MAX_CHAR){
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemainingChar(0)
        } else{
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async() => {
        setLoading(true)
        try{
            const res = await fetch('api/posts/create',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
            } )
    
            const data = await res.json()
            if(data.error){
                showToast('Error', data.error, 'error')
                return 
            }
            showToast('Success', "Post created successfully", 'success')
            onClose()
            setPostText('')
            setImgUrl('')
        } catch(err) {
            showToast('Error', err, 'error')
        } finally{
            setLoading(false)
        }
    }
    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={10}
                leftIcon={<AddIcon/>}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={onOpen}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <Textarea placeholder="Post content goes here.."
                            onChange={handleTextChange}
                            value={postText}
                        />
                        <Text fontSize='xs'
                            fontWeight="bold"
                            textAlign={"right"}
                            m={"1"}
                        >
                            {remainingChar}/500
                        </Text>
                        <Input 
                            type="file"
                            hidden
                            ref={imgRef}
                            onChange={handleImageChange}
                        />

                        <BsFillImageFill
                            style={{marginLeft: "5px", cursor: "pointer"}}
                            size={16}
                            onClick={() => imgRef.current.click()}
                        />
                    </FormControl>

                    {imgUrl && (
                        <Flex mt={5} width={"full"} position={"relative"}>
                            <Image src={imgUrl} alt="Selected img"/>
                            <CloseButton onClick={() => setImgUrl('')} bg={"gray.800"} position={"absolute"} top={2} right={2}/>
                        </Flex>
                    )}

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleCreatePost} onLoad={loading}>
                    Post
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost