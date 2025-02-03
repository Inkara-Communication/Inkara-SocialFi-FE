import { createContext, useEffect  } from 'react'
import { useDispatch } from 'react-redux'

import { Dispatch } from './store'

const DispatchContext = createContext<Dispatch | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const dispatch = useDispatch<Dispatch>()
    useEffect(() => {
        async function loadUser() {
            try {
                await dispatch.user.getUserProfileAsync()
                await dispatch.room.setRooms()
                await dispatch.conversation.setConversations()
            } catch (err) {
                console.error(err)
            }
        }
        loadUser()
    }, [dispatch.conversation, dispatch.room, dispatch.user])

    return (
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    )
}
  