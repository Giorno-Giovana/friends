import { Room } from "../../models/room"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await Room.findByIdAndUpdate(body._id, body, { new: true })
})