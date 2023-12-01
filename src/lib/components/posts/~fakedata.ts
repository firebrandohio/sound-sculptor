import type { PostData, CommentData } from './helpers';
import { faker } from '@faker-js/faker';

export const createFakeComment = (id: string, depth: number): CommentData => ({
    username: faker.internet.displayName(),
    userId: faker.string.uuid(),
    avatarURL: faker.internet.avatar(),
    text: faker.lorem.paragraph(),
    date: faker.date.past(),
    children: depth > 0 ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => createFakeComment(faker.string.uuid(), depth - 1)) : [],
    id: faker.string.uuid()
});

export const createFakePost = (): PostData => ({
    playlistData: {
        playlistID: faker.string.uuid(),
        playlistURL: faker.internet.url(),
        playlistRank: faker.number.int({ min: 0, max: 5 }),
        playlistTitle: faker.lorem.words(),
        userRank: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5]), // faker.number.int({ min: 1, max: 5
        isSubscribed: false
    },
    username: faker.internet.userName(),
    avatarURL: faker.internet.avatar(),
    text: faker.lorem.paragraph(20),
    date: faker.date.past(),
    votes: faker.number.int({ min: -99, max: 999 }),
    totalComments: faker.number.int({ min: 0, max: 999 }),
    comments: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => createFakeComment(faker.string.uuid(), faker.number.int({ min: 1, max: 3 }))),
    id: faker.string.uuid(),
    rank: faker.number.int({ min: 1, max: 100 }),
    status: faker.helpers.arrayElement(["friend", "following", "follower", "none"]),
    userVote: faker.helpers.arrayElement([-1, 0, 1])
});