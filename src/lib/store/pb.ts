import { browser } from '$app/environment';
import PocketBase from 'pocketbase';

const url = browser ? 'http://127.0.0.1:8090' : 'http://127.0.0.1:8090';
export const pb = new PocketBase(url);
