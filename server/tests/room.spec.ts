import {  describe, expect, test } from "vitest";
import { $fetch } from './fetch'

describe('Room', () => {    
    test('Crud', async () => {
        // Создание комнаты
        const createdRoom = await $fetch('/room', { method: 'POST' })        
        expect(createdRoom).toHaveProperty('_id')
        expect(createdRoom).toHaveProperty('users')
        expect(createdRoom).toHaveProperty('title')
        expect(createdRoom).toHaveProperty('events')

        // Получение комнаты
        const fetchedRoom = await $fetch('/room', { query: { id: createdRoom._id } })
        expect(fetchedRoom).toEqual(createdRoom)

        // Редактирование комнаты
        const NEW_TITLE  = 'Новый татйл'
        const editedRoom = await $fetch('/room', { method: 'PUT', body: { ...fetchedRoom, title: NEW_TITLE } })
        expect(editedRoom).not.toEqual(fetchedRoom)
        expect(editedRoom.title).toBe(NEW_TITLE)
    })
})