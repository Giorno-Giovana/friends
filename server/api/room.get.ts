import { Room } from "../../models/room"

export default defineEventHandler(event => {
    const query = getQuery(event)
    const roomId = query.id

    if (roomId) return Room.findById(roomId).exec()

    throw createError({
        status: 400,
        message: 'Не передан room.id'
    })
})