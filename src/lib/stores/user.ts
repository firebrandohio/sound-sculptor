import { writable } from 'svelte/store';

export const user = writable<any>(null);

export const userBio = writable<string>("");
export const userProfileBio = writable<string>("");