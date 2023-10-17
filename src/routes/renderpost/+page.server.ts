import { createFakePost } from '$lib/components/posts/~fakedata';

export const load = async () => {
    return {
        posts: Array.from({ length: 10 }, () => createFakePost())
    }
}