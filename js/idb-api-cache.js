// js/idb-api-cache.js

const DB_NAME = 'api-cache';
const DB_STORE = 'users';
const DB_VER = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VER);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(DB_STORE, { keyPath: 'id' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// Сохраняем всех пользователей в IndexedDB
export async function saveUsersToIDB(users) {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    users.forEach(user => store.put(user));
    return new Promise(r => tx.oncomplete = r);
}

// Получаем всех пользователей из IndexedDB
export async function getUsersFromIDB() {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readonly');
    const store = tx.objectStore(DB_STORE);
    return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// Получаем пользователей: сперва сеть, иначе — IndexedDB
export async function getUsersSmart() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error('Network error');
        const users = await res.json();
        await saveUsersToIDB(users);
        return users;
    } catch (e) {
        return await getUsersFromIDB();
    }
}
