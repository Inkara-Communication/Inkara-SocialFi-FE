import { createModel } from '@rematch/core'
import axios from 'axios'

import { RootModel } from '.'
import { IRoom } from '@/interfaces/room'

interface RoomState {
    rooms: IRoom[]
    activeRoom: IRoom | null
}

const initialState: RoomState = {
    rooms: [],
    activeRoom: null
}

export const room = createModel<RootModel>()({
    name: 'room',
    state: initialState,
    reducers: {
        setRooms(state, payload: IRoom[]) {
            state.rooms = payload
        },
        setActiveRoom(state, payload: IRoom | null) {
            state.activeRoom = payload
        }
    },
    effects: (dispatch) => ({
        async fetchRooms(_, rootState) {
            try {
                const { rooms } = rootState.room

                const { data } = await axios.get('/room/my/rooms')

                if (JSON.stringify(data) !== JSON.stringify(rooms)) {
                    dispatch.room.setRooms(data)
                }
            } catch (error) {
                console.error('Failed to fetch rooms:', error)
                dispatch.room.setRooms([])
            }
        },
        setActiveRoom(room: IRoom | null) {
            dispatch.room.setActiveRoom(room)
        }
    })
})
