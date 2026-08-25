# Figma → React pixel-perfect contact page

Цей проєкт перезібраний за реальним Figma node `2:919` (Desktop), а не за screenshot.

## Точні Figma параметри

- Frame: 1440 × 902
- Основний контент: x=165, width=1110
- Hero title: Roboto Medium, 36px / 52px
- Small labels: Red Hat Display Regular
- Form placeholders: Red Hat Display Regular, 20px
- CTA: Red Hat Display Medium, 18px
- CTA: 200 × 60
- Main purple: #8643DC
- Main dark: #21232D
- Form line: #DAD2E3
- Friends title: Red Hat Display Medium, 36px

## Запуск у Cursor

```bash
npm install
cp .env.example .env
npm run dev
```

Відкрити http://localhost:5173

## SMTP

Заповни `.env` реальними SMTP-даними. `ADMIN_EMAIL` вже встановлений як:

```env
ADMIN_EMAIL=infoname@mail.com
```

Форма відправляє:
- ім'я
- email
- опис проєкту
- вкладення до 8 MB

Відповідь на лист автоматично піде на email клієнта через `Reply-To`.

## Важливо про Figma assets

Іконки/графіка підключені з Figma MCP asset URLs, які Figma робить тимчасово доступними. Для production краще експортувати ці assets у `public/` та замінити URLs на локальні файли.

Соціальні URL у Figma не задані, тому зараз вони `#`.
