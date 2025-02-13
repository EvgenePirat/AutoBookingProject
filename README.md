# Проект NestJS + Sequelize ORM

## Запуск проекта локально

### 1. Установка зависимостей
```sh
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` в корневой директории проекта и добавьте следующие переменные:
```sh
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_DIALECT=postgres
```
Замените `your_username`, `your_password` и `your_database` на реальные значения.

### 3. Запуск миграций
```sh
npm run migration:run
```

### 4. Запуск сервера

#### В режиме разработки:
```sh
npm run start:dev
```

#### В production-режиме:
```sh
npm run build
npm run start:prod
```

## Управление миграциями

### Генерация новой миграции
```sh
npm run migration:generate название_миграции
```

### Создание пустой миграции
```sh
npm run migration:create название_миграции
```

### Проверка статуса миграций
```sh
npm run migration:status
```

### Откат последней миграции
```sh
npm run migration:revert
```

### Откат всех миграций
```sh
npm run migration:revert:all
```

