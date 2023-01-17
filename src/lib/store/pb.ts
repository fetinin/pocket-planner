import { browser } from '$app/environment';
import PocketBase from 'pocketbase';

const url = browser ? 'https://pocker-pocket-db.fly.dev' : 'https://pocker-pocket-db.fly.dev/';
export const pb = new PocketBase(url);
