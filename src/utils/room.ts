export const isRoomMember = (room: any, user: any) => {
    let isMember: boolean
    for(const member of room.users) {
        if(member.id === user.id) {
            return isMember = true
        }
    }
}