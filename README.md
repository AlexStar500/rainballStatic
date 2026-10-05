# rainballStatic

Статическая оболочка-браузер для Rainball (`https://rainball-psi.vercel.app/`).
Никакого сервера здесь нет: страница отдаёт только HTML/CSS/JS, а целевой сайт
грузится напрямую в `<iframe>` из браузера пользователя.

## Почему трафик идёт мимо этого сайта

`<iframe src="https://rainball-psi.vercel.app/">` — запрос уходит из браузера
пользователя напрямую на Vercel. Прокси-сайт не видит ни запросов, ни ответов,
ни cookie, ни данных форм. Логировать нечего, утекать нечему. Нужен интернет
только до `rainball-psi.vercel.app`.

## Файлы

- `index.html` — разметка оболочки (адресная строка, навигация, стартовый экран)
- `style.css` — оформление
- `app.js` — логика: нормализация адреса, история, переходы, горячие клавиши
- `logo.png` — иконка

## Публикация

```powershell
cd Q:\JavaScript\rainballStatic
git init
git branch -M main
git add .
git commit -m "Rainball proxy: статическая оболочка-браузер"
git remote add origin https://github.com/AlexStar500/rainballStatic.git
git push -u origin main
```

Включение статики:

- **GitVerse Pages** — настройки репозитория → Pages → ветка `main`, корень `/`.
- **GitHub Pages** (запасной вариант) — Settings → Pages → Source: Deploy from a
  branch → `main` / `/ (root)`. Адрес будет `https://alexstar500.github.io/rainballStatic/`.

## Управление

- Адресная строка: полный URL, либо `example.com`, либо просто поисковый запрос —
  тогда откроется `rainball-psi.vercel.app/search?q=запрос`.
- Внутренние переходы внутри Rainball в адресную строку не попадают: iframe
  другого origin, читать `location` из него нельзя. Кнопки «назад/вперёд»
  работают по истории оболочки, а не по истории сайта.
- `Alt+←` / `Alt+→` — назад/вперёд, `Ctrl+R` — обновить, `Ctrl+L` — фокус на строку,
  свайп влево/вправо — назад/вперёд на телефоне.
- Смена цели: `const TARGET` в начале `app.js`.