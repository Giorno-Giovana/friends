import { Room } from "~/models/room"

export default defineEventHandler(async () => {
    return new Room().save()
})
