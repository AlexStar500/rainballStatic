# rainballStatic

Статическая оболочка для Rainball (`https://rainball-psi.vercel.app/`).

Одна страница — полноэкранный `<iframe>` с целевым сайтом. Никакого своего
интерфейса: пользователь видит только сам Rainball. Сервера здесь нет, запросы
уходят из браузера пользователя напрямую на Vercel, прокси-сайт их не видит.

## Файлы

- `index.html` — вся страница: разметка, стили и загрузка цели в одном файле
- `logo.png` — иконка вкладки

## Параметр `url`

- без параметров — открывается главная Rainball
- `?url=/search?q=привет` — открывает внутренний путь цели
- `?url=https://любой.хост/путь` — открывает произвольный адрес

## Публикация

```powershell
cd Q:\JavaScript\rainballStatic
git add -A
git commit -m "обновление оболочки"
git push
```

Pages: репо публичный, Source — `Deploy from a branch`, ветка `main`, папка `/ (root)`.
Адрес: `https://alexstar500.github.io/rainballStatic/`

## Свой домен

Settings → Pages → Custom domain → вписать домен. В Cloudflare: CNAME на
`alexstar500.github.io`, Proxy status — **DNS only**.

## Смена цели

`const TARGET` в `<script>` в конце `index.html`.