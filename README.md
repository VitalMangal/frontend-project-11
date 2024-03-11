### Hexlet tests and linter status, maintainability:
[![Actions Status](https://github.com/VitalMangal/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/VitalMangal/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/407ac07fa9966c13090c/maintainability)](https://codeclimate.com/github/VitalMangal/frontend-project-11/maintainability)

# RSS Reader
> Учебный проект от hexlet.io

# Обзор
[RSS Reader](https://frontend-project-11-six-khaki.vercel.app/) — сервис для агрегирования RSS-каналов. Он позволяет добавлять неограниченное количество RSS-каналов, обновлять их и добавлять новые записи в общий поток.

## Используемые технологии
JavaScript: [yup](https://github.com/jquense/yup), [axios](https://github.com/axios/axios), [onChange](https://github.com/sindresorhus/on-change), [i18next](https://www.i18next.com/), promises (native)

CI/CD: [vercel](https://vercel.com/), [github actions](https://github.com/VitalMangal/frontend-project-11/actions)

Сборщик: [webpack](https://webpack.js.org/)

Компоновка: [bootstrap 5](https://getbootstrap.com/)

## Функции

- [x] Форма
- используется [yup](https://github.com/jquense/yup) для анализа и проверки входного значения
- [x] UX - дизайн
  - форма заблокирована во время отправки
  - обработка ошибок (возможные ошибки):
    - 'Поле не должно быть пустым'
    - 'Ссылка должна быть валидным URL'
    - 'RSS уже существует'
    - 'Ошибка сети'
    - 'Ресурс не содержит валидный RSS'
  - успешный сценарий (возможные сообщения):
    - 'RSS успешно загружен'
- [x] Предварительный просмотр публикации
  - нажатие на кнопку «Просмотреть» открывает модальное окно с описанием поста
  - ссылка поста помечается как посещенная
  - использован [bootstrap modal component](https://getbootstrap.com/docs/5.0/components/modal/)

- [x] Подписка на ленту новостей
  - AJAX ([axios](https://github.com/axios/axios)) используется для периодического (раз в 5 секунд) опроса добавленных каналов на наличие новых сообщений.

# Установка и использование
### Системные требования:
```
node.js >= 20
npm >= 6
make >= 4
```

### Online:
[RSS Reader (demo)](https://frontend-project-11-six-khaki.vercel.app/)

Пример RSS-канала:

`http://lorem-rss.herokuapp.com/feed?unit=second&interval=5`

### Локальная установка
```
$ git clone git@github.com:VitalMangal/frontend-project-11.git
$ make install
$ make develop
```
