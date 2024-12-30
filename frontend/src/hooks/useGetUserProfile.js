import { useEffect, useState } from "react"
import useShowToast from "./useShowToast"
import { useParams } from "react-router-dom"

const useGetUserProfile = () => {

    const [user, setUser] = useState(null)
    const showToast = useShowToast()
    const {username} = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
    }, [showToast, username])

    return {loading, user}
}

export default useGetUserProfile