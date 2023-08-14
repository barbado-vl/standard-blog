# standart-blog
[Лабораторный проект по видео Archakov Blog: Полный Full Stack курс Node.js + React.js для начинающих за 4 часа (MongoDB, Express)](https://www.youtube.com/watch?v=GQ_pTmcXNrQ).

Задача – сайт-блог.

Модель: а) статьи, б) пользователи, г) дополнительные данные для статьи: комментарии пользователей, тэги.

Backend и Frontend разделены на отдельные приложения.

Развертывания на Heroku и Versel не делал, т.к. на Heroku не срабатывает MFA, введение кода через Google Authenticate, а Versel требуется аутентификацию через SMS, российский номер не проходит, а платить за Onlinesim не хочется.

Содержание:
- [Backend](#backend-section)
  - [Платформа и зависимости](#backend-section-1)
  - [Структура](#backend-section-2)
  - [Корневой файл](#backend-section-3)
  - [Контроллеры](#backend-section-4)
  - [Модель](#backend-section-5)
  - [Авторизация](#backend-section-6)
  - [Валидация данных](#backend-section-7)
- [Frontend](#frontend-section)
  - [Платформа и зависимости](#frontend-section-1)
  - [Структура и Архитектура](#frontend-section-2)
  - [Конструкционные объекты, пример /pages/AddPost](#frontend-section-3)
  - [Axios (ф.о – запросы к backend)](#frontend-section-4)
  - [Redux (ф.о – хранилище компонентов)](#frontend-section-5)
- [Домашнее задание](#home-work)

## Backend <a name="backend-section"></a>
### Платформа и зависимости <a name="backend-section-1"></a>
- Среда исполнения – node.js
- Хостинг и обработка HTTP сообщений – express
- БД –mongoose (MongoDB)
- Аутентификация и Авторизация – jsonwebtoken.

- express validator – валидация модели, читать ниже
- bcrypt – для кэширования пароля
- cors – для CORS валидации сайта
- multer – создание хранилища для ресурсов (картинок)
- nodemon – dev режим под node.js, для автоматического перезапуска

### Структура <a name="backend-section-2"></a>
- Базовые папки и файлы:
  - папка node_modules
  - файл package.json – зависимости, параметры, команды/скрипты
  - файл package-lock.json – зависимости
  - файл index.js – основной файл проекта
- Добавляем папки: model – модель
  - controllers – для обработки HTTP
  - PostController.js
  - UserController.js
  - CommentController.js - домашнее задание от автора видео.
  - index.js – объединяет экспорт файлов выше
- Добавляем папку utils – дополнительный функционал
  - checkAuth.js – авторизация, проверка JWT ключа
  - handleValidationErrors.js – код пакета express-validator
  - index.js – объединяет экспорт файлов выше
- Добавляем папку uploads – ресурсы, типа картинок
- Добавляем файл: validations.js

Работа начиналась с базового файла index.js и папки и файлов модели.
Остальные папки и файлы подключались по мере подключения функционала и рефакторинга кода (файлы экспорта модулей index.js появились последними). 

### Корневой файл [index.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_backend/index.js) и Основной функционал <a name="backend-section-3"></a>
const app = express(); -- подключение модуля express, который будет внедрять в себя все остальное.
Далее по зонам. Порядок зон важен. Зоны:
  - подключение хранилища (подключаем multer)
  - подключение дополнительных объектов (express.json(), папки хранилища uploads, cors)
  - подключение MongoDB (используем mongoose, которой передаем строку подключения, сама БД создается отдельно, читать ниже)
  - обработчики действий (CRUD запросы)
    > app.post('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
  - сервер (задаем порт для localhost)

В обработчик действия передаем параметры:
  - (обязательно) адрес 
  - функция проверки авторизации (checkAuth из модуля checkAuth.js)
  - функция валидации (одна из функций модуля validation.js)
  - (обязательно) функция контроллера (можно стрелочной, можно отдельно, можно из модуля)

### [Контроллеры](https://github.com/barbado-vl/standart-blog/tree/master/standart_website_backend/controllers) (функции CRUD) <a name="backend-section-4"></a>
Их вынесли в отдельный файл, модуль, и отдельную папку.
Функция задается с 2 параметрами req (запрос) и res (ответ), app передаст в них нужные объекты.
Внутри try catch.
Внутри обращение к модели с целью получить, добавить или изменить данные. Важно, функционал работы с моделью определяется внутри файла модели, где подключаем библиотеку mongoose, которая дает методы работы с схемами БД. Эти методы тут вызываются.
Запрос дает данные по которым обращаемся к модели.
Ответ возвращает ответ в виде json.

В контроллере User, в методах register и login генерируем JWT token, который добавляем к Ответу.

### [Модель](https://github.com/barbado-vl/standart-blog/tree/master/standart_website_backend/models) <a name="backend-section-5"></a>
Создание модели с помощью Схемы из библиотеки mongoose, которая прикрутит схему к БД.
Так же mongoose даст методы работы со схемой, которые потребуются для обращения к данным из Контроллера.

### Авторизация ([checkAuth.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_backend/utils/checkAuth.js)) <a name="backend-section-6"></a>
Метод импортируется в базовый файл index.js и вызывается в обработчиках действия CRUD модели.

Сам метод checkAut реализован в модуле checkAuth.js, папка /utils.

В метод, как и в метод контролера, передаются параметры res (запрос) и req (ответ), плюс 3-ий параметр, функция callback next().

Из запроса достается JWT token.

Если проверка проходит, то вызывается функция next().

Если проверка не проходится обработка блокируется, т.к. next() не вызывается, идем в catch где пишем Нет доступа.

### Валидация данных. <a name="backend-section-7"></a>
Для реализация валидации используем библиотеку express validator.
- Создаем требования валидации, файл [validation.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_backend/validations.js) в корневой папке. Импортируем функцию body из express-validator. Прописываем массивы из функций, в которых указываем параметры модели и требования к ним. Массив для каждой модели объекта, по функции для каждого параметра объекта модели.
- Создаем обработчик валидации, файл [handleValidationErors.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_backend/utils/handleValidationErrors.js) в папке utils с помощью функции validationResult, которую импортируем из express-validator. 

## Frontend <a name="frontend-section"></a>
### Платформа и зависимости <a name="frontend-section-1"></a>
React.js проект.

Полу готовый, от автора, с зависимостями, которые он сам выбрал
Базовые от самого react (есть в других проектах тоже):
  - react
  - react-dom
  - react-scripts
Менее базовые (нет в простых проектах):
  - react-router-dom – (React Router V6) навигация по сайту
  - react-hook-form – формы аутентификации

Далее зависимости делятся на Стилизация интерфейса и Подключение дополнительного функционала.

Подключение дополнительного функционала:
  - axios – создание обращений к backend проекту.
  - redux и @reduxjs/toolkit – менеджер компонентов с хранилищем
  - react-simplemde-editor – редактор текста встроенный

  - @testing-library/… 3 штуки

Стилизация:
  - react-markdown – разметка под блог из статей (вызывается в pages/FullPost.jsx)
  - sass
  - @emotion/react
  - @emotion/styled
  - @mui/icons-material
  - @mui/material
Еще 3-4 штуки назначение которых я не могу определить
  - react-simplemde-editor – редактор текста встраиваемый

### Структура и Архитектура <a name="frontend-section-2"></a>
Стандартный React набор
  - папка .idea
  - папка node_modules
  - папка public
  - папка src
    - файл app.js
    - файл index.js
    - остальное поменялось
  - файл package.json
  - файл package-lock.json
Основная рабочая папка, где проходят все изменения, это папка src:
  - /components
  - /pages
  - /redux
  - App.js - функция App, которая рендерит Компоненты и Страницы
  - axios.js
  - index.js - передача App в document; импортируем стилизацию, библиотека mui, файлы index.scss и theme.js
  - index.scss 
  - theme.js - стилизация, импорт библиотеки mui.

#### Архитектура.
Автор проект находит сходство с MVC, оно тут есть. Модель это backend, Представление это папки pages и components. Слой Контроллеров представляют Redux со своей папочкой и библиотека axios, плюс стилизация.

Но я бы сказал, что тут угадывается Модульная архитектура, т.к. есть функциональное разделение – есть конструкционные объекты , использующие абстракции, в которых реализован функционал.

Конструкционные объекты:
  - папка /pages -- страницы
  - папка /components – компоненты для страниц
  - 
Функциональные объекты, используемые в конструкционных объектах:
  - менеджер компонентов – папка /redux, где идет реализация функционала менеджера компонентов Redux (само собой часть функционала спрятана в модулях библиотек redux и @redux/toolkit)
  - разметка – вызов библиотеки @mui
  - стилизация – файлы .scss раскиданные там где есть файлы с разметкой, файл theme.js.

Но… Фильтрация статей по тэгам реализована через <a/> тэг и свойство href. О том что есть маршруты по тегам узнаешь, когда начинаешь делать домашнее задание от автора – реализовать фильтрацию по тегам.

### Конструкционные объекты, пример /pages/AddPost  <a name="frontend-section-3"></a>
- папка /pages -- страницы
- папка /components – компоненты для страниц

Устройство каждого конструкционного объекта сходное. Файл-модуль возвращающий метод рендеринга, в котором задается JSX разметка. В этот же файл внедряется код Функциональных объектов. Файл стилей.

#### Пример [/pages/AddPost](https://github.com/barbado-vl/standart-blog/tree/master/standart_website_frontend_master/src/pages/AddPost)
Файл стилизации: [AddPost.module.scss](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/AddPost/AddPost.module.scss)

Файл с скриптом и разметкой: [index.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/AddPost/index.jsx)

!!! Внимание - за вопросами логики к автору канала. Ему спасибо за урок и side-проект, все бесплатно.

«Страница» выполняет 2 функции: создание статьи и редактирование статьи. Создание стать это адрес -- /add-posts. Редактирование статьи это адрес -- /posts/{id}/edit.

Интерфейс, по порядку сверху вниз:
  - Превью (кнопки «Загрузить превью» и «Удалить»)
  - Заголовок
  - Тэги
  - Область редактора с областью для ввода текста.
  - Сохранить / Опубликовать в зависимости от текущей функции страницы.
  - Кнопка Отмены.
  
Разметка – библиотека @mui/material. Откуда берем компоненты: Paper, TextField, Button.
Обращение за данным к redux и backend через axios.

**Базовый функционал**

useState - используем хук, чтобы задать параметры и методы обновления для всех параметров статьи:
  - title
  - tags
  - text
  - imageUrl
  - isLoading

useEffect - если параметр id определен (читать Создание и редактирование), то будет отправлен через axios get запрос на сервер с использованием данного id, чтобы получить данные по статье, которую будут редактировать. Это реализация Редактирования.

Проверка аутентификации (проверка подлинности) - импорт хука useSelector из react-redux и метод selectIsAuth из слайса auth.js, которая даст ответ на вопрос о аутентификации.

Перенаправления:
 - Переход на Стать (страница pages/FullPost) после выполнения onSubmit.
 - Переход на главную страницу, если на страницу редактирование пытается попасть не прошедший аутентификацию пользователь (например, нагло вбив адрес …/add-post)

**Создание или Редактирование**

Импорт хука useParam из react-router-dom, который достанет id из параметров текущей страницы по ключу:
  > const { id } = useParams();

Параметр id используется в useEffect, где идет запрос за данными по текущему id.

Далее, если Создание статьи, то параметра не будет, переменная id будет undefined. Используем это для создания флага проверки ситуации на Создание / Редактирование.
 > const isEditing = Boolean(id);

Флаг используется в разметке для определения надписи на кнопке Сохранить / Опубликовать.

Флаг вызывается в обработчике нажатия на кнопку, функции onSubmit, где определяет какой запрос на backend отправить,post или patch. Во вторых, далее флаг определяет какой id брать для перенаправления на страницу.

**Редактор**

Импорт компонента SimpleMDE из react-simplemde-editor, который вставляем как тэг разметки. Задаем свойства и их реализацию в коде скрипта:
  - value = {text} – параметр text, куда будет записан вводимый пользователем текст, переменная text и метод setText() создаются через хук React.useState().
  - onChange = {onChange} – вызываем хук React.useCallback(), внутри которого вызываем метод setText() для обновления text(по инструкции). 
  - options = {options} – задаются хуком React.useMemo() (по инструкции).


**Загрузка картинок**

2 кнопки:
1. «Загрузить превью». Событие onClick. Обработчик стрелочная функция, внутри которой обращаемся к параметру, точнее к его внутренней функции inputFileRef.current.click(). 
2. «Удалить». В событие onClick передаем функцию onClickRemoveImage.

inputFileRef. Параметр inputFileRef задается через хук React.useRef(null). Передаем его в элемент управления <input /> как ссылку, в свойство, ref. И назначаем обработчик на событие onChange – handleChangeFile.

handleChangeFile (Загрузить превью). Асинхронная функция, которая получает параметр event. Внутри блок try catch. Вызываем объект класса FormData и его метод append(‘image’, file) – это вызовет открытия окна в браузере, где надо будет найти в папках и файлах картинку, затем запомнит выбранный файл. Далее с помощью axios и метод post отправим файл на backend, адрес ‘/uploads’. Вернувшийся url назначим в переменную imageUrl используя метод setImageUrl.

onClickRemoveImage (Удалить) – функция с setImageUrl(‘’), т.е. убираем ссылку на картинку.

### Axios (ф.о – запросы к backend) <a name="frontend-section-4"></a>
Файл [axios.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/axios.js) в корневом каталоге.

Импорт библиотеки import axios from ‘axios’; . Внутри указывается Хост. В данном проекте это http://localhost:4444. Для автоматической авторизации, добавляем в параметр конфигураций axios строчку Authorization для Header, записываем туда token из localStorage.

Т.к. используется менеджер компонентов Redux, то обращение к backend из файлов его реализации, а pages и компонент обращаются к redux папке.

Импорт модуля axios.js из корневой папки. Создание запроса:
  > await axios.get(‘/posts’);
CRUD модель.  Указываем адрес, который автоматом добавится к хосту. При методе Post, через params отправляем данные на сервер.

### Redux (ф.о – хранилище компонента) <a name="frontend-section-5"></a>
Библиотеки redux и @reduxjs/toolkit.

Структура: папка [/redux](https://github.com/barbado-vl/standart-blog/tree/master/standart_website_frontend_master/src/redux), внутри файл store.js и папка /slice, внутри которой создаем файлы «слайсы». Функционал слайсов импортируется в файлы страницы и компонентов.

Есть расширение для браузера, Redux, визуализирующее работу с хранилищем (как swagger для crud).

**Файл store.js.**

Настройка хранилища. Импортируем @reduxjs/toolkit и Слайсы. Вызываем configureStore, внутри создаем свойство-объект reducer, передаем слайсы.

**Слайсы.**

«Часть хранилища». Разделение по нашему усмотрению. Задачи: 1) задать хранилище, 2) получить данные из backend, 3) заполнить хранилище. Большая часть кода это следование инструкции redux. Наша задача передать нужный параметр, задать нужный объект, выбрать и заполнить нужное состояние ответа, т.к. функции асинхронные.

Импортируем @reduxjs/toolkit, из которого берем 2 метода createSlice (задача 3) и createAsyncThunk (задача 2). Импортируем модуль axios.

Код файла делится на 3 раздела, кроме импорта модулей. В начале определение функций обращение к backend () – вызов функции createAsyncThunk, которой задается адрес и стрелочная функция, где вызывается axios запрос (смотреть параграф об axios). Средний раздел – это определение содержания хранилища (его части). Переменная initialState, это объект. Внутри задаем объекты категорий данных. Внутри items: [] и status: месседж.
Последний раздел – определение функции заполнения хранилища (const postSlice = createSlice(…)). Ключевой момент – прописать, в зависимости от состояния получения данных (пусто, отклонено, получено), заполнение хранилища.

Экспорт export  postsReducer = postSlice.reducer.

**Использование.**

Инициализация обращения к backend, что заполнит хранилище и даст данные для заполнения элементов на странице или в компоненте.

Импорт функции (Hook) useDispatch и useSelector из react-redux.
Импорт функций запроса к серверу из созданных слайсов.

Вызываем useSelector, чтобы получить данные из хранилища:
  > const userData = useSelector(state => state.auth.data);
  > 
В useEffect вызываем useDispatch, которой передаем функции запроса к серверу.

Используем данные полученные с помощью useSelector.


## Домашнее задание <a name="home-work"></a>
**Tab-панель, кнопки Новые и Популярные**

[/page/Home.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/Home.jsx)

Автор проекта использовал React компоненты из библиотеки mui, это Tabs и Tab, но без TabPanel. Разметка под данные статьи создана как отдельный компонент [Post](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/components/Post/index.jsx), который вызывается внутри Grid для каждой статьи отдельно. Статьи выводятся без сортировки.

Задача 1 – связать Tabs и Grid. Это делается через параметр tabValue и метод обработчик события onChange компонента Tabs handleTabsChange(), который передает в tabValue значение свойства value из текущей «нажатой» вкладки. Далее tabValue служит флагом для сортировки статей.

Задача 2 – сортировка статей.

Переменная sortedPosts, куда буду заносится Post компоненты с данными статьи.

Метод sortPosts, где в зависимости от значения параметра tabValue идет сортировка самих статей.

Метод renderPosts служит для заполнения sortedPosts и возврате его при вызове.

В разметке вызывается метод renderPosts.

**Вывод статей по тэгам**

[/page/Home.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/Home.jsx)

В backend есть метод [getLastTags](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_backend/controllers/PostController.js), который достает теги. На стороне frontend к нему идет обращение через redux, slice [posts.js](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/redux/slices/posts.js), метод fetchTags. Вызов реализован на странице [Home.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/Home.jsx). Вывод данных идет в созданный компонент [TagsBlock](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/components/CommentsBlock.jsx). Внутри компонента используется React Mui компоненты SideBlock и List. В List используем тег href, чтобы создавать маршрут для будущей страницы, куда будут выведены статьи с данным тэгом. Задача – вывод статей, в которых присутствует данный тэг.

Вопрос, что требуется? А – конкретная задача: вывод статей по тегу в отдельной пустой странице? Б -- фильтр статей по тегу вообще, вопрос реализации на усмотрение учеников.

По «А» требуется: 
1. новый rout: файл App.js добавляем импорт страницы и строчку в маршруты:
  > <Route path=”/tags/:name” element={<Имя страницы/>}
2. новая страница, куда перекопировать половину кода из Home.jsx,
3. внутри отобрать статьи по нужному тэгу, как это делается для ДЗ по Tab панели.
4. кастомизация страницы

Проблема – не функционально, много дублирования кода, много дополнительной кастомизации.

По «Б»:
1. на странице Home.jsx использовать функцию sortedPosts, которая была создана для ДЗ «Tab панель…»; 
  - нужно создать еще один useState с переменной, которая будет получать имя #Тэга;
  - создать функцию обработчик события в компоненте TagsBlock;
  - в функцию sortedPosts добавить новое условие.
2. в компоненте TagsBloc:
  - передаем функцию обработчик из Home;
  - в ListItemButton вызываем событие onClick, вставляем обработчик.
3. кастомизация:
  - сброс фильтра, чтобы вывелись все статьи – для это в компоненте TagsBloc, перед <List/> вставляем отдельный элемент ListItemButton, с названием «Все», так же задаем событие onClick;
  - подсвечивание текущего выделенного #Тэга -- в компоненте TagsBlock для всех ListItemButton реализуем свойство selected (подробнее смотреть в коде).

**Комментарии**

Что есть? На frontend компонент [CommentsBlock.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/components/CommentsBlock.jsx), где реализован React компонент List, куда передается список комментариев. Сам список – его нет. Компонент CommentsBlock.jsx вызывается на странице [Home.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/Home.jsx) и [FullPost.jsx](https://github.com/barbado-vl/standart-blog/blob/master/standart_website_frontend_master/src/pages/FullPost.jsx), на обоих страницах прямо в разметке создается 2 комментария, которые отправляются в CommentsBlock.jsx.
Задача – 1) реализовать модель комментариев, 2) в Home.jsx выводить новые комментарии (все или первые 10), 3) в FullPost.jsx выводить комментарии только по данной статье.

1. Модель комментариев.
  - На backend:
    - Модель
    - Валидация – текст, не забыть внедрить
    - Контроллер с методами: create, update, delete, 2 метода get: getAllNew и getPostComments.
  - На frontend:
    - redux как для posts

2. в Home.jsx выводить новые комментарии.
3. в FullPost.jsx выводить комментарии только по данной статье.





