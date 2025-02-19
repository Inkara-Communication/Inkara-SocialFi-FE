import { Models } from '@rematch/core'

import { room } from './room'
import { conversation } from './conversation'

export interface RootModel extends Models<RootModel> {
    room: typeof room,
    conversation: typeof conversation
}

export const models: RootModel = { room, conversation }