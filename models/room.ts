import { defineMongooseModel } from "#nuxt/mongoose";
import type { Model } from 'mongoose'

export interface IRoom {
    title: string,
    users: string[],
    events: Array<{ title: string, start: Date, end: Date }>
}

export const Room = defineMongooseModel('Room', {
    title: String,
    users: [String],
    events: [{ title: String, start: Date, end: Date }]  
}) as Model<IRoom>
