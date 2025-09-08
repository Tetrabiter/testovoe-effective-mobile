# Документация по запуску проекта

## 📋 Требования к системе

- **Node.js** версии 16 или выше
- **PostgreSQL** версии 12 или выше
- **npm** или **yarn** для управления зависимостями

## 🚀 Быстрый старт

### 1. Клонирование и установка зависимостей

```bash
# Клонируйте репозиторий (замените на ваш репозиторий)
git clone https://github.com/Tetrabiter/testovoe-effective-mobile.git
cd testovoe-effective-mobile

# Установите зависимости
npm install
```

### 2. Настройка базы данных PostgreSQL

Убедитесь, что PostgreSQL запущен и работает. Затем создайте базу данных:

```sql
CREATE DATABASE ваша_бд;
CREATE USER ваш_юзер WITH PASSWORD 'пароль';
GRANT ALL PRIVILEGES ON DATABASE ваша_бд TO admin;
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database
DATABASE_URL="postgresql://admin:password@localhost:5432/user_service_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3000
NODE_ENV=development
```

### 4. Запуск миграций и генерация клиента Prisma

```bash
# Генерация Prisma клиента
npx prisma generate

# Запуск миграций БД
npx prisma migrate dev --name init

# (Опционально) Заполнение тестовыми данными
npx prisma db seed
```

### 5. Запуск сервера

```bash
# Режим разработки
npm run dev

# Или production-сборка
npm run build
npm start
```

Сервер будет доступен по адресу: http://localhost:3000

## 📡 API Endpoints

### 1. Регистрация пользователя
**POST** `/api/auth/register`
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "birthDate": "1990-01-01",
  "email": "ivan@example.com",
  "password": "password123"
}
```

### 2. Авторизация пользователя
**POST** `/api/auth/login`
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```
В ответе получите JWT токен для авторизации.

### 3. Получение пользователя по ID
**GET** `/api/users/:id`
Требуется заголовок: `Authorization: Bearer <ваш-jwt-токен>`

### 4. Получение списка пользователей
**GET** `/api/users`
Только для администраторов. Заголовок: `Authorization: Bearer <ваш-jwt-токен>`

### 5. Блокировка/разблокировка пользователя
**PATCH** `/api/users/:id/status`
```json
{
  "status": "BLOCKED" // или "ACTIVE"
}
```
Заголовок: `Authorization: Bearer <ваш-jwt-токен>`

## 🧪 Тестирование API

### Создание тестового администратора

После запуска миграций выполните:

```bash
npx prisma db seed
```

Будет создан пользователь:
- Email: `admin@example.com`
- Пароль: `admin123`
- Роль: `ADMIN`

### Примеры запросов с curl

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Test", "lastName": "User", "birthDate": "1990-01-01", "email": "test@example.com", "password": "test123"}'

# Авторизация
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Сохраните токен из ответа и используйте в следующих запросах
TOKEN="ваш-jwt-токен"

# Получение списка пользователей
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Блокировка пользователя
curl -X PATCH http://localhost:3000/api/users/2/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "BLOCKED"}'
```

## 🔧 Дополнительные команды

```bash
# Просмотр данных в БД через веб-интерфейс
npx prisma studio

# Сброс базы данных (осторожно!)
npx prisma migrate reset

# Создание новой миграции при изменении схемы
npx prisma migrate dev --name <имя-миграции>
```

## 📁 Структура проекта

```
src/
├── config/          # Конфигурация приложения
├── controllers/     # Обработчики запросов
├── middleware/      # Промежуточное ПО
├── models/          # Модели данных
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── utils/           # Вспомогательные функции
└── app.ts           # Точка входа
```

## 🛠️ Технологии

- **Express.js** - веб-фреймворк
- **TypeScript** - язык программирования
- **PostgreSQL** - база данных
- **Prisma** - ORM для работы с БД
- **JWT** - аутентификация
- **Zod** - валидация данных
- **bcryptjs** - хеширование паролей

Проект готов к работе! Для вопросов или проблем с запуском, проверьте логи сервера и убедитесь, что все переменные окружения установлены correctly.