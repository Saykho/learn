## Принцип GRASP (General Responsibility Assignment Software Patterns)

**GRASP** — набор из девяти основных принципов проектирования для эффективного распределения ответственности между классами и объектами.

---

### 1. Information Expert (Эксперт по информации)

*Ответственность назначается тому классу, который обладает необходимыми данными.*

**UML:**

```plaintext
+----------------+        +-------------------+
|    Order       |<>------|    OrderItem      |
+----------------+        +-------------------+
| - items: List  |        | - price           |
| + getTotal()   |        +-------------------+
+----------------+
```

**C# пример:**

```csharp
public class Order
{
    private List<OrderItem> items = new List<OrderItem>();

    public decimal GetTotal()
    {
        decimal total = 0;
        foreach (var item in items)
        {
            total += item.Price;
        }
        return total;
    }
}
```

### 2. Creator (Создатель)

*Класс, который содержит или использует объекты другого класса, должен создавать эти объекты.*

**UML:**

```plaintext
+---------+           +-------------+
|  Order  | --------> | OrderItem   |
+---------+           +-------------+
| + CreateItem()      |             |
+---------------------+-------------+

```
**C# пример:**
```csharp
public class Order
{
    private List<OrderItem> items = new List<OrderItem>();

    public void CreateItem(Product product, int quantity)
    {
        var item = new OrderItem(product, quantity);
        items.Add(item);
    }
}
```

### 3. Controller (Контроллер)

*Отвечает за обработку системных событий — посредник между UI и бизнес-логикой.*

**UML:**

```plaintext
+----------------+      +---------+
| OrderController| ---> |  Order  |
+----------------+      +---------+
| + PlaceOrder() |
+----------------+

```

**C# пример:**
```csharp
public class OrderController
{
    private OrderService orderService = new OrderService();

    public void PlaceOrder(OrderData data)
    {
        orderService.ProcessOrder(data);
    }
}
```

### 4. Low Coupling (Низкая связанность)

*Стремиться к минимальной зависимости между классами, чтобы повысить гибкость и уменьшить сложность.*

**UML:**

```plaintext
+-------------+      +------------+
| Payment     |<>----| PaymentMethod|
+-------------+      +------------+
```

**C# пример:**
```csharp
public interface IPaymentMethod
{
    void Pay(decimal amount);
}

public class CreditCardPayment : IPaymentMethod
{
    public void Pay(decimal amount)
    {
        // Реализация оплаты картой
    }
}
```

### 5. High Cohesion (Высокая связность)

*Каждый класс должен иметь единую, хорошо определённую ответственность.*

**C# пример:**
```csharp
public class PaymentProcessor
{
    public void ProcessPayment(IPaymentMethod method, decimal amount)
    {
        method.Pay(amount);
    }
}
```

### 6. Polymorphism (Полиморфизм)

*Использовать полиморфизм для выбора поведения в зависимости от типа объекта.*

**C# пример:**
```csharp
public interface IPaymentMethod
{
    void Pay(decimal amount);
}

public class PayPalPayment : IPaymentMethod
{
    public void Pay(decimal amount)
    {
        // Оплата через PayPal
    }
}

public class CreditCardPayment : IPaymentMethod
{
    public void Pay(decimal amount)
    {
        // Оплата картой
    }
}
```

### 7. Pure Fabrication (Чистая фабрикация)

*Вводить вспомогательные классы для снижения связанности и поддержания высокой связности.*

**C# пример:**
```csharp
public class DatabaseAccess
{
    public void Save(object entity)
    {
        // Сохранение в базу данных
    }
}
```

### 8. Indirection (Опосредование)

*Использовать посредников для снижения прямых связей между объектами.*

**C# пример:**
```csharp
public class Mediator
{
    public void Notify(object sender, string ev)
    {
        // Логика взаимодействия компонентов
    }
}
```

### 9. Protected Variations (Защищённые вариации)

*Защищать части системы от изменений, вводя интерфейсы и абстракции.*

**C# пример:**
```csharp
public interface ILogger
{
    void Log(string message);
}

public class FileLogger : ILogger
{
    public void Log(string message)
    {
        // Логирование в файл
    }
}
```

### Зачем использовать GRASP?

- Помогает делать дизайн кода более устойчивым к изменениям.
- Упрощает распределение обязанностей и улучшает читаемость.
- Снижает связанность и повышает повторное использование.