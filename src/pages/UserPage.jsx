import UserHeader from "../components/UserHeader.jsx";
import UserPost from "../components/UserPost.jsx";

const UserPage = () => (
    <>
        <UserHeader />
        <UserPost likes={1200} replies={481} postImage='/post1.png' postTitle='Let`s talk about threads'/>
        <UserPost likes={251} replies={131} postImage='/post2.png' postTitle='Nice tutorial'/>
        <UserPost likes={653} replies={231} postImage='/post3.png' postTitle='I love this guy'/>
        <UserPost likes={986} replies={210}  postTitle='This is my first thread'/>
    </>
)

export default UserPage;