import { IRoom, Room } from "~/models/room"

export default defineEventHandler<IRoom>(async () => {
    return new Room().save()
})
