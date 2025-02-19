import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { IConversation } from '@/interfaces/conversation'
import { getUserConversations } from '@/apis/conversation'

interface ConversationState {
    conversations: IConversation[]
    activeConversation: IConversation | null
}

const initialState: ConversationState = {
    conversations: [],
    activeConversation: null,
}

export const conversation = createModel<RootModel>()({
    name: 'conversation',
    state: initialState,
    reducers: {
        setConversations(state, payload: IConversation[]) {
            state.conversations = payload
        },
        setActiveConversation(state, payload: IConversation | null) {
            state.activeConversation = payload
        },
    },
    effects: (dispatch) => ({
        async fetchConversations(_, rootState) {
            try {
                const { conversations } = rootState.conversation
    
                const { data } = await getUserConversations()
                
                if (JSON.stringify(data) !== JSON.stringify(conversations)) {
                    dispatch.conversation.setConversations(data)
                }
            } catch (error) {
                console.error('Failed to fetch conversations:', error)
                dispatch.conversation.setConversations([])
            }
        }
    })
    
})
