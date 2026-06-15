# Backend (Nest.js)

Запуск локально:

1. Установите зависимости:

```bash
cd backend
npm ci
```

2. Запустите в режиме разработки:

```bash
npm run start:dev
```

3. Сохранение БД: файл `database.sqlite` создаётся в корне `backend`.

API:
- `POST /auth/register` { email, password }
- `POST /auth/login` { email, password } => { access_token }
- `POST /resumes` (Bearer token) body: { data: { ... } } — создать резюме
- `GET /users/:id/resumes` (Bearer token) — получить резюме пользователя

Где добавлять поля резюме:
- Файл `backend/src/resumes/dto/create-resume.dto.ts` содержит комментарий, где можно явно перечислить поля резюме.
- В текущей реализации `data` — произвольный JSON. Для явных полей добавьте их в DTO и валидацию.
