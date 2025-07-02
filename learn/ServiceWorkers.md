## Service Worker

**Service Worker** — это фоновый JavaScript-файл, который работает независимо от основной страницы. Он используется в PWA (Progressive Web Apps) и предоставляет следующие возможности:

- **Работа офлайн** — кэширует ресурсы и позволяет приложению функционировать без подключения к сети.
- **Push-уведомления** — позволяет получать уведомления даже при закрытом браузере.
- **Фоновая синхронизация** — выполняет обмен данными с сервером, когда подключение к сети восстановлено.

Service Worker перехватывает сетевые запросы и может отдавать закэшированные данные, тем самым повышая производительность и доступность приложения.

### 🧪 Минимальный пример подключения Service Worker:

```js
// index.js или main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker зарегистрирован:', registration);
      })
      .catch(error => {
        console.error('❌ Ошибка регистрации Service Worker:', error);
      });
  });
}
