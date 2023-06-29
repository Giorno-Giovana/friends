import { IRoom, Room } from "~/models/room"

export default defineEventHandler<IRoom>(async () => {
    return new Room({ title: await getRandomTitle() }).save()
})

async function getRandomTitle() {
    const { nouns, adjectives } = await getWords()
    const noun = getRandomArrayElement(nouns)
    const adjective = getRandomArrayElement(adjectives)

    return [noun, adjective].join(' ')
}

async function getWords(): Promise<{ nouns: string[], adjectives: string[] }> {
    // Чтобы не было коллизий имнё, создаём дополнительное пространство имён
    {
        const words = useStorage<string[]>('words')
        const nouns =  await words.getItem('nouns')
        const adjectives = await words.getItem('adjectives')
        
        if (nouns && adjectives) return { nouns, adjectives }
    }

    // Считываем слова из ассетов
    const wordsStorage = useStorage<string>('assets:server:words')

    const [nouns, adjectives] = (await Promise.all([
        wordsStorage.getItem('adjectives.txt'),
        wordsStorage.getItem('nouns.txt')
    ])).map((w) => w?.split('\n'))

    if (nouns && adjectives) return { nouns, adjectives }

    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось получить список слов',
    })
}

function getRandomArrayElement(array: string[]) {
  return array[Math.floor((Math.random()*array.length))];
}
