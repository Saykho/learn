# GraphQL — краткое руководство

## Что такое GraphQL

**GraphQL** — это язык запросов (query language) и среда выполнения для API, разработанная Facebook.  
Он позволяет клиентам **точно указывать, какие данные им нужны**, и получать **ровно эти данные** — не больше и не меньше.

В отличие от REST, где данные приходят через разные эндпоинты (`/users`, `/posts`, `/comments`), в GraphQL есть **одна точка входа** — обычно `/graphql`.

---

## Основные концепции

### 1. Schema (Схема)
Сердце GraphQL — **схема**, которая описывает типы данных и связи между ними.

```graphql
type User {
  id: ID!
  name: String!
  age: Int
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  users: [User!]!
  post(id: ID!): Post
}
```

### 2. Query (Запросы)
Клиент сам указывает, какие поля ему нужны:
```
query {
  users {
    id
    name
    posts {
      title
    }
  }
}
```

Ответ будет точно в такой же структуре:
```
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Alice",
        "posts": [
          { "title": "Hello GraphQL" }
        ]
      }
    ]
  }
}
```

### 3. Mutation (Мутации)
Используются для изменения данных — добавления, обновления, удаления и т.д.
```
mutation {
  createPost(title: "New Post", content: "GraphQL is awesome!") {
    id
    title
  }
}
```

### 4. Subscription (Подписки)
Позволяют получать обновления в реальном времени, например через WebSocket:
```
subscription {
  newPost {
    id
    title
  }
}
```

## Архитектура
```
[Client] ⇄ [GraphQL Server] ⇄ [Database / REST / Services]
```

Сервер GraphQL может получать данные из:

базы данных (PostgreSQL, MongoDB);

REST API;

микросервисов;

или любых других источников.

## Преимущества GraphQL

Один эндпоинт для всех запросов

Клиент получает только нужные данные

Гибкость и самодокументируемость (через GraphiQL / Apollo Sandbox)

Упрощает версионирование API

## Недостатки

Сложнее кэшировать запросы

Повышенная нагрузка на сервер при сложных запросах

Требует строгой типизации и продуманной схемы

## Пример полного запроса
```
query GetUser($id: ID!) {
  user(id: $id) {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}
```



