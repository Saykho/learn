### ⚙️ Кэширование GET-запросов с помощью Service Worker

Service Worker может кэшировать **ответы на GET-запросы**. Это позволяет ускорить загрузку и обеспечить офлайн-доступ.

#### 🔁 Как это работает:

1. При каждом GET-запросе Service Worker **сначала проверяет кэш**.
2. Если ответ **найден в кэше** — он немедленно возвращается.
3. Если ответа **нет в кэше** — выполняется сетевой запрос, и полученный ответ **сохраняется в кэш** для будущего использования.

#### 📦 Преимущества:
- Работа приложения в офлайне.
- Более быстрая загрузка данных.
- Снижение нагрузки на сеть и сервер.

### 🧩 Пример кэширования GET-запросов

```js
// service-worker.js

const CACHE_NAME = 'app-cache-v1';

// Функция: кэшировать GET-запрос и использовать его при повторных запросах
self.addEventListener('fetch', event => {
  // Только GET-запросы
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Если в кэше есть ответ — вернуть его
      if (cachedResponse) {
        return cachedResponse;
      }

      // Иначе — сделать запрос в сеть и сохранить ответ в кэш
      return fetch(event.request).then(networkResponse => {
        // Проверка: успешный ответ и статус 200
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Клонируем ответ, так как его можно прочитать только один раз
        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(() => {
        // (опционально) вернуть fallback, если сеть недоступна
        // return caches.match('/offline.html');
      });
    })
  );
});
