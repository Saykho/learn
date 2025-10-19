# OWASP, XSS, CSRF и Clickjacking — шпаргалка по безопасности фронтенда

---

## Что такое OWASP

**OWASP (Open Web Application Security Project)** — это открытая организация,  
которая публикует рекомендации по безопасности веб-приложений.

Самое известное — **OWASP Top 10**:  
список 10 самых критичных уязвимостей (обновляется каждые несколько лет).

Примеры из OWASP Top 10:
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection (в т.ч. XSS, SQL Injection)
- A05: Security Misconfiguration
- A08: Software and Data Integrity Failures

---

## XSS — Cross-Site Scripting

**Что это:**  
Уязвимость, когда злоумышленник внедряет свой JavaScript-код в страницу,  
и этот код выполняется у других пользователей.

### Пример
```html
<!-- Комментарий пользователя -->
<div>
  <p>Отзыв: <%= userComment %></p>
</div>
```
Если userComment = ```<script>alert('XSS!')</script>```, то браузер выполнит этот код → XSS-атака.

### Типы XSS

| Тип | Где выполняется | Пример |
|-----|------------------|---------|
| **Stored XSS** | Код сохранён на сервере (например, комментарии, сообщения) | Пользователь сохраняет в БД `<script>alert('XSS')</script>`, и этот код потом отображается другим пользователям |
| **Reflected XSS** | Код приходит в URL или параметры запроса | `https://example.com?q=<script>alert('XSS')</script>` |
| **DOM XSS** | Атака происходит на клиенте через манипуляции с DOM | `element.innerHTML = location.hash` или использование `document.write()` |
### Как защититься

- **Экранировать (escape)** HTML-ввод перед вставкой:

```js
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
```
Использовать безопасные шаблонизаторы (React, Vue, Angular — экранируют по умолчанию)

Не вставлять данные напрямую в innerHTML

В HTTP-заголовках:
```text
Content-Security-Policy: default-src 'self'
```

## CSRF — Cross-Site Request Forgery
**Что это**:
Пользователь авторизован на сайте, а злоумышленник заставляет его браузер
выполнить нежелательный запрос от его имени.
### Пример
Пользователь вошёл на bank.com

На другом сайте `<img src="https://bank.com/transfer?to=hacker&amount=1000">`

Браузер автоматически отправляет куки сессии → запрос выполнен 😱

### Как защититься от CSRF

- **CSRF-токены**
    - Сервер выдаёт уникальный токен при загрузке страницы
    - Клиент отправляет его в каждом POST-запросе
    - Сервер проверяет совпадение токена

- **SameSite cookies**

```http
Set-Cookie: session=abc123; SameSite=Lax; Secure
```
- **Проверять Origin / Referer заголовки**
- **Использовать CORS с белым списком доменов**

## Clickjacking
**Что это**:
Атака, при которой сайт злоумышленника встраивает ваш сайт в `<iframe>`
и заставляет пользователя кликать по скрытым элементам (например, “Удалить аккаунт”).
### Пример
```
<iframe src="https://bank.com/delete-account" style="opacity:0; position:absolute; top:0; left:0;"></iframe>
```
### Как защититься
- **Запретить встраивание через HTTP-заголовки:** `X-Frame-Options: DENYX-Frame-Options: DENY` или  `Content-Security-Policy: frame-ancestors 'none';`
## Итого

| Уязвимость     | Что делает                     | Защита                                 |
|----------------|--------------------------------|----------------------------------------|
| **XSS**        | внедрение JS-кода              | экранирование, CSP                     |
| **CSRF**       | запрос от имени пользователя   | CSRF-токен, SameSite cookie           |
| **Clickjacking** | обманный клик через iframe   | X-Frame-Options, CSP                   |
| **OWASP**      | организация, которая описывает эти уязвимости | использовать OWASP Top 10 как чеклист |

## Как проверять защиту на фронте

### 1. XSS (Cross-Site Scripting)

- Открой DevTools → Console
- Попробуй вставить в форму данные вроде `<script>alert('XSS')</script>`
- Если при отправке и отображении данные не выполняются, значит **данные экранируются правильно**
- Также можно проверить заголовок **Content-Security-Policy (CSP)** в Network → Response Headers

Пример заголовка CSP:
```http
Content-Security-Policy: default-src 'self';
```
### 2. CSRF (Cross-Site Request Forgery)

- Проверяем наличие **CSRF-токенов**:
    - В DevTools → Network → Request Headers ищем токен (`X-CSRF-Token`) в POST-запросах

- Проверяем cookie флаг **SameSite**:
    - DevTools → Application → Cookies → проверяем, что `SameSite=Lax` или `Strict`

- Можно попытаться отправить POST-запрос с другого домена и убедиться, что сервер его отклоняет
### 3. Clickjacking

- Проверяем заголовки, запрещающие встраивание:
    - DevTools → Network → Response Headers
    - Заголовки:

```http
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';
```
- Если они присутствуют, сайт не может быть внедрён в iframe на стороннем сайте

