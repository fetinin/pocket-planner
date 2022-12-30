import { browser } from '$app/environment';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

const url = browser ? 'http://127.0.0.1:8090' : 'http://127.0.0.1:8090';
export const pb = new PocketBase(url);

export type User = {
	id: string;
	nickname: string;
};

export type Room = {
	id: string;
	creator_id: string;
	public_id: string;
};

export const currentUser = writable<User | null>();
