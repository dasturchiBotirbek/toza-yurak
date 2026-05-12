// JavaScript for Toza Yurak Sahiy Qollar Web App
(function () {
    "use strict";

    const DEFAULT_PAGE = "home";
    const DEFAULT_LANGUAGE = "ru";
    const LANGUAGE_STORAGE_KEY = "app_language";
    let toastTimer = null;
    let currentLanguage = DEFAULT_LANGUAGE;
    let lastPage = DEFAULT_PAGE;
    const SESSION_STORAGE_KEY = "ty_session";
    let sessionToken = null;
    let lastTelegramInitDataExchanged = "";
    let dashboardData = null;

    const I18N = {
        ru: {
            "navruz.title": "С Праздником Навруз! 🎉",
            "navruz.subtitle": "Весны, тепла и вдохновения!",
            "nav.home": "Главная",
            "nav.finances": "Финансы",
            "nav.partners": "Партнёры",
            "nav.structure": "Структура",
            "nav.marketing": "Маркетинг",
            "nav.tools": "Наши Инструменты",
            "nav.presentations": "Презентации",
            "nav.documents": "Документы",
            "nav.groups": "Группы и каналы",
            "nav.receipt": "Генератор чеков",
            "nav.bizcard": "Моя визитка",
            "settings.title": "Настройки",
            "settings.changeAccount": "Сменить аккаунт",
            "settings.changeAccountSub": "Выйти и войти под другим пользователем",
            "settings.language": "Язык",
            "language.name.ru": "Русский",
            "language.name.uz": "O'zbekcha",
            "language.name.uz-cyrl": "Ўзбекча",
            "settings.notifications": "Уведомления",
            "settings.notificationsOn": "Включены",
            "settings.about": "О программе",
            "settings.version": "Версия 1.0.0",
            "actions.copy": "📋 Копировать",
            "actions.refresh": "↻ Обновить",
            "actions.cancel": "Cancel",
            "actions.ok": "OK",
            "aria.openMenu": "Открыть меню",
            "aria.closeApp": "Закрыть приложение",
            "structure.error": "Ошибка загрузки структуры:<br>Пользователь не участвует в маркетинговой структуре",
            "structure.ok": "Вы участвуете в маркетинговой структуре. Данные синхронизированы с сервером.",
            "marketing.hint": "Нажмите на изображение для увеличения",
            "modal.title": "Toza Yurak Sahiy Qollar",
            "modal.logoutConfirm": "Вы уверены, что хотите выйти из аккаунта? Потребуется повторная авторизация.",
            "toast.copySuccess": "Ссылка скопирована!",
            "toast.copyError": "Ошибка копирования",
            "toast.updated": "Обновлено",
            "toast.opening": "Открываем ссылку…",
            "toast.materialSoon": "Материал скоро будет в боте",
            "toast.noLink": "Ссылка не настроена — укажите в __APP_LINKS__",
            "sync.offline": "Нет связи с сервером. Проверьте интернет или запустите backend.",
            "sync.dataFail": "Сервер ответил с ошибкой. Попробуйте ещё раз.",
            "sync.authFail":
                "Сервер доступен, но вход не выполнен. Откройте приложение из Telegram или задайте TELEGRAM_BOT_TOKEN на backend.",
            "sync.bootstrapDisabled":
                "Вход через тестовый режим отключён на сервере. Откройте Mini App из Telegram. Для локальной отладки с ботом задайте ALLOW_AUTH_BOOTSTRAP=1.",
            "sync.retry": "Повторить",
            "settings.notificationsOff": "Выключены",
            "tools.tapOpen": "Нажмите, чтобы открыть",
            "presentations.downloadHint": "Добавьте файл: window.__APP_LINKS__.presentationFile = «https://…»",
            "about.toast": "Toza Yurak Sahiy Qollar · v1.0.0",
            "toast.generating": "Генерация...",
            "toast.generatingReceipt": "Чек готов",
            "toast.receiptCopyOk": "Текст чека скопирован",
            "toast.receiptCopyFail": "Не удалось скопировать",
            "home.hero.badge": "⚡ SAHIY QO'LLAR",
            "home.hero.title": "Добро пожаловать<br><span class=\"hero-brand\">Toza Yurak</span><br>Щедрые руки!",
            "home.hero.description": "Программа доброты и щедрости — вместе творим добро от чистого сердца!",
            "home.overallEarnings.title": "Общий доход",
            "home.overallEarnings.subtitle": "Все вознаграждения",
            "home.overallEarnings.meta": "За всё время участия в проекте",
            "partners.badge": "👥 ПАРТНЁРЫ",
            "partners.title": "Партнёры",
            "partners.directCount": "0 прямых партнёров",
            "partners.myTeam": "🏠 Моя команда",
            "partners.direct": "Прямые партнёры",
            "partners.active": "Активные",
            "partners.teams": "Команды партнёров",
            "partners.inMarketing": "В маркетинге",
            "partners.structure": "Структура партнёров",
            "partners.structureDesc": "Нажмите для просмотра полной структуры",
            "home.teamSize.directRefs": "Прямых рефералов: 0",
            "home.teamSize.activeMarketing": "Активных в маркетинге: 0",
            "partners.totalMembers": "Всего партнёров",
            "home.teamSize.title": "Численность команды",
            "home.teamSize.subtitle": "Общая",
            "home.teamSize.meta": "Всего партнёров в команде",
            "home.level.title": "Ваш уровень",
            "home.level.subtitle": "Не участвует в программе",
            "home.level.value": "Уровень 0",
            "home.level.meta": "Обратитесь к администратору для добавления в маркетинговую программу",
            "home.inProject.title": "В проекте",
            "home.inProject.subtitle": "Дата регистрации",
            "home.inProject.meta": "Дата вступления в команду",
            "home.profile.title": "Профиль",
            "home.profile.subtitle": "Личная информация",
            "home.invitedBy": "Пригласитель: {{name}}",
            "home.referral.title": "Ваша реферальная<br>ссылка",
            "home.referral.loading": "Загрузка ссылки…",
            "finances.title": "Финансы",
            "finances.overallLabel": "Общий доход",
            "finances.overallSub": "За всё время участия",
            "finances.today": "Сегодня",
            "finances.thisMonth": "Этот месяц",
            "finances.operations": "Операций",
            "finances.average": "Средний",
            "finances.filters.title": "Фильтры",
            "finances.filters.type": "Тип операции",
            "finances.filters.typeOptions.all": "Все типы",
            "finances.filters.typeOptions.referral": "Реферальные",
            "finances.filters.typeOptions.team": "Командные",
            "finances.filters.typeOptions.bonuses": "Бонусы",
            "finances.filters.status": "Статус",
            "finances.filters.statusOptions.all": "Все статусы",
            "finances.filters.statusOptions.completed": "Выполнен",
            "finances.filters.statusOptions.pending": "Ожидание",
            "finances.filters.statusOptions.declined": "Отклонён",
            "finances.filters.dateFrom": "Дата с",
            "finances.filters.dateTo": "Дата до",
            "finances.filters.apply": "👁 Применить фильтр",
            "finances.filters.reset": "↻ Сбросить",
            "finances.export": "⬇ Экспорт",
            "finances.loadError": "Не удалось загрузить операции. Проверьте сеть.",
            "finances.exportEmpty": "Нет данных для экспорта",
            "finances.history.title": "История операций",
            "finances.history.empty": "История операций пока пуста",
            "marketing.title": "Маркетинг",
            "marketing.hero.line1": "Тоза юракли",
            "marketing.hero.line2": "Сахий куллар",
            "marketing.hero.slogan": "БИРЛИКДА – ИШОНЧ БИЛАН, САХИЙЛИК БИЛАН, КЕЛАЖАК САРИ!",
            "marketing.table.levels": "УРОВНИ",
            "marketing.table.level": "УРОВЕНЬ",
            "marketing.table.price": "ЦЕНА",
            "marketing.table.priceSum": "ЦЕНА (СУМ)",
            "marketing.table.participants": "УЧАСТНИКИ",
            "marketing.table.income": "ПРИХОД",
            "marketing.table.incomeSum": "ПРИХОД (СУМ)",
            "marketing.table.profit": "ПРИБЫЛЬ",
            "marketing.table.profitSum": "ПРИБЫЛЬ (СУМ)",
            "marketing.table.total": "ИТОГО",
            "marketing.summary.participantsLabel": "ВСЕГО УЧАСТНИКОВ:",
            "marketing.summary.participantsVal": "30",
            "marketing.summary.people": "ЧЕЛОВЕК",
            "marketing.summary.incomeLabel": "ОБЩИЙ ПРИХОД:",
            "marketing.summary.profitLabel": "ОБЩАЯ ПРИБЫЛЬ:",
            "marketing.summary.currency": "СУМ",
            "marketing.footer.line": "ТОЗА ЮРАК – САХИЙ ҚУЛ, КЕЛАЖАК УЧУН ЁРУҒ ЙЎЛ!",
            "marketing.expandAria": "Открыть изображение крупным планом",
            "marketing.modalAria": "Увеличенное изображение маркетинг-плана",
            "marketing.modalHint": "Нажмите на затемнённый фон, чтобы закрыть",
            "marketing.posterAlt":
                "Маркетинговый план «Тоза юракли — Сахий куллар»: уровни, суммы в сумах, участники, приход, прибыль и итоги.",
            "tools.title": "🔧 инструменты в разработке",
            "tools.subtitle": "Команда активно работает над созданием уникальных инструментов для автоматизации вашего бизнеса. Следите за обновлениями!",
            "tools.card.visit.title": "Визитка",
            "tools.card.visit.desc": "Персональная визитка для привлечения клиентов",
            "tools.card.landing.title": "Продающий лендинг",
            "tools.card.landing.desc": "Продающий лендинг с видео презентацией",
            "tools.card.minilanding.title": "Мини-лендинг",
            "tools.card.minilanding.desc": "Компактный лендинг для быстрой конверсии",
            "tools.card.bot.title": "Телеграм-бот",
            "tools.card.bot.desc": "Автоматизированный бот для работы с клиентами",
            "tools.lock": "🔒 Требуется участие в программе",
            "tools.badgeDev": "🔧 В разработке",
            "tools.badgeLvl1": "👑 Ур.1",
            "tools.badgeLvl2": "👑 Ур.2",
            "tools.badgeLvl3": "👑 Ур.3",
            "tools.badgeLvl4": "👑 Ур.4",
            "finance.date.placeholder": "дд.мм.гггг",
            "presentations.program": "ПРОГРАММА",
            "presentations.programTitle": "Теперь у Вас есть<br>высокодоходная программа!",
            "presentations.programNote": "В программе участвуйте с личного аккаунта телеграм! Установите своё реальное фото/аватар и ник пользователя!",
            "presentations.programFooter": "Вместе мы преодолеваем любые финансовые трудности!<br><span style=\"color:rgba(255,255,255,.5);font-size:11px\">Всё на благо нашего семейного бюджета!</span>",
            "presentations.hint": "Нажмите для увеличения",
            "presentations.download": "⬇ Скачать презентацию",
            "presentations.advantages": "Преимущества",
            "presentations.advantagesSummary": "Шесть причин присоединиться:",
            "presentations.advantage1": "Всего 10$ за место в бизнесе!",
            "presentations.advantage2": "Мгновенная прибыль!",
            "presentations.advantage3": "Гарантированные выплаты!",
            "presentations.advantage4": "Потенциальный доход до 2 000 000$!",
            "presentations.advantage5": "Без опыта, без квалификации, без навыков!",
            "presentations.advantage6": "Зарабатывайте как активно, так и пассивно после построения команды 3-9-27!",
            "presentations.materials": "Материалы для партнёров",
            "presentations.material1": "Инструкция для новичков",
            "presentations.material2": "Маркетинг план",
            "presentations.material3": "Скрипты продаж",
            "presentations.material4": "Обучение",
            "documents.title": "Документы",
            "documents.agreement.title": "Соглашение",
            "documents.agreement.desc": "Пользовательское соглашение",
            "documents.ethics.title": "Этика и правила",
            "documents.ethics.desc": "Правила поведения в сообществе",
            "documents.open": "↗ Открыть документ",
            "documents.important.title": "Важная информация",
            "documents.important.point1": "Прозрачность операций",
            "documents.important.point1desc": "Все транзакции проходят напрямую между участниками",
            "documents.important.point2": "Соблюдение правил",
            "documents.important.point2desc": "Обязательно ознакомьтесь с этикой и правилами",
            "documents.important.point3": "Поддержка",
            "documents.important.point3desc": "При вопросах обращайтесь к администрации",
            "groups.title": "Группы и каналы",
            "groups.channel.title": "Официальный канал",
            "groups.channel.desc": "Новости и обновления",
            "groups.chat.title": "Общий чат",
            "groups.chat.desc": "Общение участников",
            "groups.training.title": "Обучение",
            "groups.training.desc": "Учебные материалы",
            "groups.top.title": "ТОП партнёры",
            "groups.top.desc": "Лидеры команды",
            "receipt.title": "Генератор чеков",
            "receipt.badge.telegram": "Автоотправка в Telegram",
            "receipt.howto.title": "Как это работает",
            "receipt.howto.step1": "Заполните форму или используйте быструю генерацию",
            "receipt.howto.step2": "Чек автоматически сгенерируется",
            "receipt.howto.step3": "Вы получите его в Telegram-боте",
            "receipt.howto.step4": "Также сможете скачать или поделиться им здесь",
            "receipt.create.title": "Создать чек",
            "receipt.field.id": "ID (необязательно)",
            "receipt.field.idPlaceholder": "Оставьте пустым для «CONCORD»",
            "receipt.field.idHint": "Будет отображаться как «ID: ваш текст»",
            "receipt.amount": "Сумма",
            "receipt.recipient": "Получатель",
            "receipt.description": "Описание",
            "receipt.amountPlaceholder": "0.00",
            "receipt.recipientPlaceholder": "Имя получателя",
            "receipt.imageLabel": "Изображение (макс. 5МБ, JPG/PNG/GIF)",
            "receipt.imageHint": "Максимальный размер: 5МБ. Форматы: JPG, PNG, GIF",
            "receipt.generate": "✦ Сгенерировать и отправить",
            "receipt.quick.title": "Быстрая генерация",
            "receipt.quick.desc": "Мой чек с текущим балансом<br>Использует ваши данные и текущий баланс",
            "receipt.quick.line1": "Чек с текущим балансом",
            "receipt.quick.line2": "Подставит сумму из «Общий доход» и ваше имя",
            "receipt.descriptionPlaceholder": "Описание платежа...",
            "receipt.error.amount": "Укажите сумму больше 0",
            "receipt.error.recipient": "Укажите получателя",
            "receipt.error.fileType": "Нужен файл изображения (JPG, PNG, GIF или WebP)",
            "receipt.error.fileSize": "Файл больше 5 МБ",
            "receipt.error.zeroBalance": "В «Общий доход» сейчас $0 — сначала укажите сумму вручную",
            "receipt.success": "Чек сформирован",
            "receipt.copyBtn": "📋 Копировать текст",
            "receipt.shareBtn": "📤 Поделиться",
            "receipt.footerNote": "Сохраните или отправьте текст получателю. Вложение видно только в этом превью.",
            "receipt.preview.title": "TOZA YURAK — чек",
            "receipt.preview.idDt": "ID",
            "receipt.preview.from": "Отправитель",
            "receipt.preview.date": "Дата",
            "receipt.preview.amount": "Сумма",
            "receipt.preview.recipient": "Получатель",
            "receipt.preview.desc": "Описание",
            "receipt.preview.attach": "Вложение",
            "receipt.preview.attachYes": "да",
            "receipt.preview.serverId": "ID на сервере",
            "receipt.serverOk": "Чек отправлен и сохранён на сервере",
            "receipt.serverOkTelegram": "Чек сохранён и отправлен вам в Telegram",
            "receipt.serverOkNoTelegram": "Чек сохранён на сервере. Копию в Telegram получите, если входите через бота (Mini App) и написали боту /start.",
            "receipt.error.server": "Сервер недоступен. Откройте сайт через сервер (npm start в папке server) или проверьте адрес API.",
            "receipt.sending": "Отправка на сервер…",
            "receipt.quick.note": "Быстрый чек по текущему балансу в кабинете",
            "receipt.quick.recipientDefault": "Toza Yurak — кабинет программы",
            "receipt.result.title": "Результат",
            "receipt.result.emptyLead": "Заполните форму и нажмите кнопку генерации",
            "receipt.result.emptyTelegram": "Чек будет автоматически отправлен вам в Telegram",
            "receipt.examples.title": "Примеры использования",
            "receipt.examples.partners.title": "Для партнеров",
            "receipt.examples.partners.desc": "Делитесь чеками с достижениями для мотивации команды",
            "receipt.examples.social.title": "В социальных сетях",
            "receipt.examples.social.desc": "Публикуйте успехи для привлечения новых партнеров",
            "receipt.examples.archive.title": "Личный архив",
            "receipt.examples.archive.desc": "Сохраняйте чеки как подтверждение результатов",
            "bizcard.title": "Моя визитка",
            "bizcard.preview": "Предпросмотр",
            "bizcard.previewTitle": "Предпросмотр визитки",
            "bizcard.save": "Сохранить визитку",
            "bizcard.livePreview": "Текущая визитка",
            "bizcard.tab.basic": "Основное",
            "bizcard.tab.about": "О себе",
            "bizcard.tab.messengers": "Мессенджеры",
            "bizcard.tab.social": "Соцсети",
            "bizcard.tab.media": "Медиа",
            "bizcard.tab.design": "Оформление",
            "bizcard.section.personal": "Личные данные",
            "bizcard.section.about": "О себе и слоган",
            "bizcard.section.messengers": "Мессенджеры",
            "bizcard.section.social": "Социальные сети",
            "bizcard.section.mediaPhoto": "Фото и фон",
            "bizcard.section.design": "Оформление",
            "bizcard.field.cardTitle": "Название визитки",
            "bizcard.field.cardTitleHint": "Для удобства в списке",
            "bizcard.field.fullName": "ФИО *",
            "bizcard.field.position": "Должность",
            "bizcard.field.phone": "Телефон",
            "bizcard.field.slogan": "Слоган (отображается на 1 слайде)",
            "bizcard.field.about": "Описание о себе (отображается на 2 слайде)",
            "bizcard.field.regText": "Текст для регистрации",
            "bizcard.ph.cardTitle": "Моя основная визитка",
            "bizcard.ph.fullName": "Иванов Иван",
            "bizcard.ph.position": "Независимый партнёр",
            "bizcard.ph.slogan": "Ваш мотивирующий слоган в 2 строки",
            "bizcard.ph.about": "Расскажите о себе...",
            "bizcard.ph.regText": "Слоган для регистрации",
            "bizcard.media.photoUrl": "URL фотографии",
            "bizcard.media.bgUrl": "URL фона",
            "bizcard.media.musicUrl": "URL музыки (MP3)",
            "bizcard.media.musicHint": "Будет отображаться индикатор музыки",
            "bizcard.media.gallery": "Галерея фото",
            "bizcard.media.addPhoto": "+ Добавить фото",
            "bizcard.media.videos": "Видео ссылки",
            "bizcard.media.addVideo": "+ Добавить видео",
            "bizcard.design.theme": "Тема",
            "bizcard.design.primaryColor": "Основной цвет",
            "bizcard.theme.light": "Светлая",
            "bizcard.theme.dark": "Тёмная",
            "bizcard.theme.gradient": "Градиент",
            "bizcard.theme.corporate": "Корпоративная",
            "bizcard.toast.saved": "Визитка сохранена",
            "bizcard.toast.savedSync": "Визитка сохранена и синхронизирована",
            "bizcard.toast.savedLocal": "Сохранено на устройстве. Сервер недоступен — данные только локально.",
            "bizcard.toast.fullName": "Укажите ФИО",
            "bizcard.levelBadge": "Уровень {{n}}",
            "bizcard.income": "Доход",
            "bizcard.team": "Команда",
            "bizcard.level": "Уровень",
            "bizcard.ref": "Ссылка: ",
            "bizcard.share": "Поделиться визиткой",
            "smuser.income": "Доход",
            "smuser.team": "Команда"
        },
        uz: {
            "navruz.title": "Navro'z bayrami muborak! 🎉",
            "navruz.subtitle": "Bahor, iliqlik va ilhom tilaymiz!",
            "nav.home": "Bosh sahifa",
            "nav.finances": "Moliya",
            "nav.partners": "Hamkorlar",
            "nav.structure": "Struktura",
            "nav.marketing": "Marketing",
            "nav.tools": "Bizning vositalar",
            "nav.presentations": "Prezentatsiyalar",
            "nav.documents": "Hujjatlar",
            "nav.groups": "Guruhlar va kanallar",
            "nav.receipt": "Chek generatori",
            "nav.bizcard": "Mening vizitkam",
            "settings.title": "Sozlamalar",
            "settings.changeAccount": "Akkountni almashtirish",
            "settings.changeAccountSub": "Boshqa foydalanuvchi bilan qayta kiring",
            "settings.language": "Til",
            "language.name.ru": "Русский",
            "language.name.uz": "O'zbekcha",
            "language.name.uz-cyrl": "Ўзбекча",
            "settings.notifications": "Bildirishnomalar",
            "settings.notificationsOn": "Yoqilgan",
            "settings.about": "Dastur haqida",
            "settings.version": "Versiya 1.0.0",
            "actions.copy": "📋 Nusxalash",
            "actions.refresh": "↻ Yangilash",
            "actions.cancel": "Bekor qilish",
            "actions.ok": "OK",
            "aria.openMenu": "Menyuni ochish",
            "aria.closeApp": "Ilovani yopish",
            "structure.error": "Strukturani yuklashda xato:<br>Foydalanuvchi marketing strukturada ishtirok etmaydi",
            "structure.ok": "Siz marketing strukturasida ishtirok etasiz. Ma'lumotlar server bilan sinxron.",
            "marketing.hint": "Kattalashtirish uchun rasmni bosing",
            "modal.title": "Toza Yurak Sahiy Qollar",
            "modal.logoutConfirm": "Haqiqatan ham akkountdan chiqmoqchimisiz? Qayta avtorizatsiya kerak bo'ladi.",
            "toast.copySuccess": "Havola nusxalandi!",
            "toast.copyError": "Nusxalashda xatolik",
            "toast.updated": "Yangilandi",
            "toast.opening": "Havola ochilmoqda…",
            "toast.materialSoon": "Materiallar tez orada botda",
            "toast.noLink": "Havola sozlanmagan — __APP_LINKS__ da kiriting",
            "sync.offline":
                "Serverga ulanib bo'lmadi. server papkada npm start, brauzerda 127.0.0.1:3847. Telefonda sinash: head ichidagi meta ty-api-base ga kompyuter IP yozing.",
            "sync.dataFail": "Server xato qaytardi. Qayta urinib ko'ring.",
            "sync.authFail":
                "Server ishlayapti, lekin kirish bajarilmadi. Ilovani Telegram ichidan oching yoki backendda TELEGRAM_BOT_TOKEN ni tekshiring.",
            "sync.bootstrapDisabled":
                "Test rejimidagi kirish serverda o‘chirilgan. Mini Appni Telegram orqali oching. Mahalliy sinov: ALLOW_AUTH_BOOTSTRAP=1.",
            "sync.retry": "Qayta",
            "settings.notificationsOff": "O'chirilgan",
            "tools.tapOpen": "Ochish uchun bosing",
            "presentations.downloadHint": "Fayl qo'shing: window.__APP_LINKS__.presentationFile = «https://…»",
            "about.toast": "Toza Yurak Sahiy Qollar · v1.0.0",
            "toast.generating": "Yaratilmoqda...",
            "toast.generatingReceipt": "Chek tayyor",
            "toast.receiptCopyOk": "Chek matni nusxalandi",
            "toast.receiptCopyFail": "Nusxalab bo'lmadi",
            "home.hero.badge": "⚡ SAHIY QO'LLAR",
            "home.hero.title": "Xush kelibsiz<br><span class=\"hero-brand\">Toza Yurak</span><br>Sahiy Qo'llar!",
            "home.hero.description": "Ezgulik va sahiylik dasturi — birga yaxshilik qilaylik, yurakdan!",
            "home.overallEarnings.title": "Umumiy daromad",
            "home.overallEarnings.subtitle": "Barcha mukofotlar",
            "home.overallEarnings.meta": "Loyihada ishtirok etgan vaqtdan beri",
            "partners.badge": "👥 HAMKORLAR",
            "partners.title": "Hamkorlar",
            "partners.directCount": "0 ta to'g'ridan hamkorlar",
            "partners.myTeam": "🏠 Mening jamoam",
            "partners.direct": "To'g'ridan hamkorlar",
            "partners.active": "Faollar",
            "partners.teams": "Jamoa hamkorlari",
            "partners.inMarketing": "Marketingda",
            "partners.structure": "Hamkorlar strukturasi",
            "partners.structureDesc": "To'liq strukturani ko'rish uchun bosing",
            "home.teamSize.directRefs": "To'g'ridan referallar: 0",
            "home.teamSize.activeMarketing": "Marketingda faollar: 0",
            "partners.totalMembers": "Jami hamkorlar",
            "home.teamSize.title": "Jamoa a'zolari soni",
            "home.teamSize.subtitle": "Umumiy",
            "home.teamSize.meta": "Jamoadagi jami hamkorlar",
            "home.level.title": "Sizning darajangiz",
            "home.level.subtitle": "Dasturda ishtirok etmaydi",
            "home.level.value": "Daraja 0",
            "home.level.meta": "Marketing strukturaga qo'shilish uchun administrator bilan bog'laning",
            "home.inProject.title": "Loyihada",
            "home.inProject.subtitle": "Ro'yxatdan o'tish sanasi",
            "home.inProject.meta": "Jamoaga qo'shilgan sana",
            "home.profile.title": "Profil",
            "home.profile.subtitle": "Shaxsiy ma'lumot",
            "home.invitedBy": "Taklif qilgan: {{name}}",
            "home.referral.title": "Sizning referal havolangiz<br>",
            "home.referral.loading": "Havola yuklanmoqda…",
            "finances.title": "Moliya",
            "finances.overallLabel": "Umumiy daromad",
            "finances.overallSub": "Loyihada ishtirok etgan vaqtdan beri",
            "finances.today": "Bugun",
            "finances.thisMonth": "Ushbu oy",
            "finances.operations": "Operatsiyalar",
            "finances.average": "O'rtacha",
            "finances.filters.title": "Filtrlar",
            "finances.filters.type": "Operatsiya turi",
            "finances.filters.typeOptions.all": "Barcha turlar",
            "finances.filters.typeOptions.referral": "Referal",
            "finances.filters.typeOptions.team": "Jamoa",
            "finances.filters.typeOptions.bonuses": "Bonuslar",
            "finances.filters.status": "Holat",
            "finances.filters.statusOptions.all": "Barcha holatlar",
            "finances.filters.statusOptions.completed": "Bajarilgan",
            "finances.filters.statusOptions.pending": "Kutish",
            "finances.filters.statusOptions.declined": "Rad etilgan",
            "finances.filters.dateFrom": "Sana dan",
            "finances.filters.dateTo": "Sana gacha",
            "finances.filters.apply": "👁 Filtrni qo'llash",
            "finances.filters.reset": "↻ Tozalash",
            "finances.export": "<span>↓</span> Eksport",
            "finances.loadError": "Operatsiyalarni yuklab bo'lmadi. Tarmoqni tekshiring.",
            "finances.exportEmpty": "Eksport uchun ma'lumot yo'q",
            "finances.history.title": "Operatsiyalar tarixi",
            "finances.history.empty": "Operatsiyalar tarixi hozircha bo'sh",
            "marketing.title": "Marketing",
            "marketing.hero.line1": "Toza yurakli",
            "marketing.hero.line2": "Saxiy qo'llar",
            "marketing.hero.slogan": "BIRLIKDA – ISHONCH BILAN, SAXIYLIK BILAN, KELAJAK SARI!",
            "marketing.table.levels": "DARAJALAR",
            "marketing.table.level": "DARAJA",
            "marketing.table.price": "NARX",
            "marketing.table.priceSum": "NARX (SO'M)",
            "marketing.table.participants": "ISHTIROKCHILAR",
            "marketing.table.income": "DAROMAD",
            "marketing.table.incomeSum": "DAROMAD (SO'M)",
            "marketing.table.profit": "FOYDA",
            "marketing.table.profitSum": "FOYDA (SO'M)",
            "marketing.table.total": "JAMI",
            "marketing.summary.participantsLabel": "JAMI ISHTIROKCHILAR:",
            "marketing.summary.participantsVal": "30",
            "marketing.summary.people": "KISHI",
            "marketing.summary.incomeLabel": "UMUMIY DAROMAD:",
            "marketing.summary.profitLabel": "UMUMIY FOYDA:",
            "marketing.summary.currency": "SO'M",
            "marketing.footer.line": "TOZA YURAK – SAXIY QO'L, KELAJAK UCHUN YORUG' YO'L!",
            "marketing.expandAria": "Rasmni kattaroq ochish",
            "marketing.modalAria": "Marketing rejasi kattalashtirilgan ko‘rinishi",
            "marketing.modalHint": "Yopish uchun qorong‘i fon ustiga bosing",
            "marketing.posterAlt":
                "«Toza yurakli — Saxiy qo'llar» marketing rejasi: darajalar, so‘mdagi summalar, ishtirokchilar, daromad va foyda.",
            "tools.title": "🔧 ishlab chiqilayotgan vositalar",
            "tools.subtitle": "Jamoa biznesingizni avtomatlashtirish uchun noyob vositalar yaratmoqda. Yangiliklarni kuzatib boring!",
            "tools.card.visit.title": "Vizitka",
            "tools.card.visit.desc": "Mijozlarni jalb qilish uchun shaxsiy vizitka",
            "tools.card.landing.title": "Sotuvga mo'ljallangan landing",
            "tools.card.landing.desc": "Video prezentatsiyali sotuv landing",
            "tools.card.minilanding.title": "Mini-landing",
            "tools.card.minilanding.desc": "Tez konversiya uchun ixcham landing",
            "tools.card.bot.title": "Telegram-bot",
            "tools.card.bot.desc": "Mijozlar bilan ishlash uchun avtomatlashtirilgan bot",
            "tools.lock": "🔒 Dasturda ishtirok etish talab etiladi",
            "tools.badgeDev": "🔧 Ishlab chiqilmoqda",
            "tools.badgeLvl1": "👑 Dar.1",
            "tools.badgeLvl2": "👑 Dar.2",
            "tools.badgeLvl3": "👑 Dar.3",
            "tools.badgeLvl4": "👑 Dar.4",
            "finance.date.placeholder": "дд.мм.гггг",
            "presentations.program": "DASTUR",
            "presentations.programTitle": "Endi sizda<br>yuqori daromadli dastur bor!",
            "presentations.programNote": "Dasturga Telegramdagi shaxsiy akkauntingizdan ishtirok eting! Haqiqiy fotosurat/avataringiz va foydalanuvchi nomingizni o'rnating!",
            "presentations.programFooter": "Biz birgalikda har qanday moliyaviy qiyinchilikni yengamiz!<br><span style=\"color:rgba(255,255,255,.5);font-size:11px\">Hammasi oilaviy byudjetimiz uchun!</span>",
            "presentations.hint": "Kattalashtirish uchun bosing",
            "presentations.download": "⬇ Ta'rifnomani yuklab olish",
            "presentations.advantages": "Afzalliklar",
            "presentations.advantagesSummary": "Qo'shilish uchun oltita sabab:",
            "presentations.advantage1": "Biznes joyi uchun atigi 10$!",
            "presentations.advantage2": "Darhol daromad!",
            "presentations.advantage3": "Kafolatlangan to'lovlar!",
            "presentations.advantage4": "Potensial daromad 2 000 000$ gacha!",
            "presentations.advantage5": "Tajriba yo'q, malaka yo'q, ko'nikma yo'q!",
            "presentations.advantage6": "3-9-27 jamoani tuzganingizdan so'ng faol ham, passiv ham daromad oling!",
            "presentations.materials": "Hamkorlar uchun materiallar",
            "presentations.material1": "Yangi boshlovchilar uchun ko'rsatma",
            "presentations.material2": "Marketing rejasi",
            "presentations.material3": "Sotuv skriptlari",
            "presentations.material4": "Ta'lim",
            "documents.title": "Hujjatlar",
            "documents.agreement.title": "Kelishuv",
            "documents.agreement.desc": "Foydalanuvchi kelishuvi",
            "documents.ethics.title": "Etika va qoidalar",
            "documents.ethics.desc": "Jamoa odob-axloqi qoidalari",
            "documents.open": "↗ Hujjatni ochish",
            "documents.important.title": "Muhim ma'lumot",
            "documents.important.point1": "Operatsiyalar shaffofligi",
            "documents.important.point1desc": "Barcha tranzaksiyalar ishtirokchilar o'rtasida to'g'ridan-to'g'ri amalga oshadi",
            "documents.important.point2": "Qoidalarga rioya qilish",
            "documents.important.point2desc": "Etika va qoidalarni albatta o'rganing",
            "documents.important.point3": "Qo'llab-quvvatlash",
            "documents.important.point3desc": "Savollar bo'lsa, ma'muriyatga murojaat qiling",
            "groups.title": "Guruhlar va kanallar",
            "groups.channel.title": "Rasmiy kanal",
            "groups.channel.desc": "Yangiliklar va yangilanishlar",
            "groups.chat.title": "Umumiy chat",
            "groups.chat.desc": "Ishtirokchilar muloqoti",
            "groups.training.title": "Ta'lim",
            "groups.training.desc": "O'quv materiallari",
            "groups.top.title": "TOP hamkorlar",
            "groups.top.desc": "Jamoa yetakchilari",
            "receipt.title": "Chek generatori",
            "receipt.badge.telegram": "Telegramga avtoyuborish",
            "receipt.howto.title": "Qanday ishlaydi",
            "receipt.howto.step1": "Formani to'ldiring yoki tezkor yaratishdan foydalaning",
            "receipt.howto.step2": "Chek avtomatik tarzda shakllanadi",
            "receipt.howto.step3": "Uni Telegram-botda olasiz",
            "receipt.howto.step4": "Bu yerda yuklab olish yoki ulashish ham mumkin",
            "receipt.create.title": "Chek yaratish",
            "receipt.field.id": "ID (ixtiyoriy)",
            "receipt.field.idPlaceholder": "«CONCORD» uchun bo'sh qoldiring",
            "receipt.field.idHint": "«ID: sizning matningiz» ko'rinishida chiqadi",
            "receipt.amount": "Summa",
            "receipt.recipient": "Olingan shaxs",
            "receipt.description": "Tavsif",
            "receipt.amountPlaceholder": "0.00",
            "receipt.recipientPlaceholder": "Qabul qiluvchi ismi",
            "receipt.imageLabel": "Rasm (maks. 5MB, JPG/PNG/GIF)",
            "receipt.imageHint": "Maksimal hajm: 5MB. Formatlar: JPG, PNG, GIF",
            "receipt.generate": "✦ Yaratish va yuborish",
            "receipt.quick.title": "Tezkor yaratish",
            "receipt.quick.desc": "Joriy balans bilan mening chekim",
            "receipt.quick.line1": "Joriy balans bo'yicha chek",
            "receipt.quick.line2": "«Umumiy daromad»dagi summa va ismingizni qo'yadi",
            "receipt.descriptionPlaceholder": "To'lov tavsifi...",
            "receipt.error.amount": "0 dan katta summa kiriting",
            "receipt.error.recipient": "Qabul qiluvchini kiriting",
            "receipt.error.fileType": "Rasm fayli kerak (JPG, PNG, GIF yoki WebP)",
            "receipt.error.fileSize": "Fayl 5 MB dan katta",
            "receipt.error.zeroBalance": "«Umumiy daromad» hozir $0 — avvalo qo'lda summa kiriting",
            "receipt.success": "Chek tayyorlandi",
            "receipt.copyBtn": "📋 Matnni nusxalash",
            "receipt.shareBtn": "📤 Ulashish",
            "receipt.footerNote": "Matnni saqlang yoki qabul qiluvchiga yuboring. Ilova ichidagi rasm faqat bu yerda ko'rinadi.",
            "receipt.preview.title": "TOZA YURAK — chek",
            "receipt.preview.idDt": "ID",
            "receipt.preview.from": "Yuboruvchi",
            "receipt.preview.date": "Sana",
            "receipt.preview.amount": "Summa",
            "receipt.preview.recipient": "Qabul qiluvchi",
            "receipt.preview.desc": "Tavsif",
            "receipt.preview.attach": "Ilova",
            "receipt.preview.attachYes": "ha",
            "receipt.preview.serverId": "Server ID",
            "receipt.serverOk": "Chek serverga yuborildi va saqlandi",
            "receipt.serverOkTelegram": "Chek saqlandi va Telegramingizga yuborildi",
            "receipt.serverOkNoTelegram": "Chek serverda saqlandi. Telegram nusxasi uchun bot orqali kiriting va botga /start yozing.",
            "receipt.error.server": "Server javob bermayapti. `server` papkasida `npm install` va `npm start` ni ishga tushiring yoki API manzilini tekshiring.",
            "receipt.sending": "Serverga yuborilmoqda…",
            "receipt.quick.note": "Kabinetdagi joriy balans bo'yicha tezkor chek",
            "receipt.quick.recipientDefault": "Toza Yurak — dastur kabineti",
            "receipt.result.title": "Natija",
            "receipt.result.emptyLead": "Formani to'ldiring va generatsiya tugmasini bosing",
            "receipt.result.emptyTelegram": "Chek sizga Telegram orqali avtomatik yuboriladi",
            "receipt.examples.title": "Foydalanish misollari",
            "receipt.examples.partners.title": "Hamkorlar uchun",
            "receipt.examples.partners.desc": "Jamoada motivatsiya uchun yutuqlar bilan cheklarni ulashing",
            "receipt.examples.social.title": "Ijtimoiy tarmoqlarda",
            "receipt.examples.social.desc": "Yangi hamkorlarni jalb qilish uchun muvaffaqiyatlarni e'lon qiling",
            "receipt.examples.archive.title": "Shaxsiy arxiv",
            "receipt.examples.archive.desc": "Natijalarni tasdiq sifatida cheklarni saqlang",
            "bizcard.title": "Mening vizitkam",
            "bizcard.preview": "Ko‘rib chiqish",
            "bizcard.previewTitle": "Vizitka ko‘rinishi",
            "bizcard.save": "Vizitkani saqlash",
            "bizcard.livePreview": "Joriy vizitka",
            "bizcard.tab.basic": "Asosiy",
            "bizcard.tab.about": "O‘zim haqimda",
            "bizcard.tab.messengers": "Messendjerlar",
            "bizcard.tab.social": "Ijtimoiy tarmoqlar",
            "bizcard.tab.media": "Media",
            "bizcard.tab.design": "Tashqi ko‘rinish",
            "bizcard.section.personal": "Shaxsiy ma’lumot",
            "bizcard.section.about": "O‘zingiz va shior",
            "bizcard.section.messengers": "Messendjerlar",
            "bizcard.section.social": "Ijtimoiy tarmoqlar",
            "bizcard.section.mediaPhoto": "Foto va fon",
            "bizcard.section.design": "Tashqi ko‘rinish",
            "bizcard.field.cardTitle": "Vizitka nomi",
            "bizcard.field.cardTitleHint": "Ro‘yxatda qulaylik uchun",
            "bizcard.field.fullName": "F.I.Sh *",
            "bizcard.field.position": "Lavozim",
            "bizcard.field.phone": "Telefon",
            "bizcard.field.slogan": "Shior (1-slaydda)",
            "bizcard.field.about": "O‘zingiz haqingizda (2-slaydda)",
            "bizcard.field.regText": "Ro‘yxatdan o‘tish matni",
            "bizcard.ph.cardTitle": "Mening asosiy vizitkam",
            "bizcard.ph.fullName": "Familiya Ism",
            "bizcard.ph.position": "Mustaqil hamkor",
            "bizcard.ph.slogan": "2 qatorlik motivatsion shior",
            "bizcard.ph.about": "O‘zingiz haqingizda…",
            "bizcard.ph.regText": "Ro‘yxatdan o‘tish shiori",
            "bizcard.media.photoUrl": "Fotosurat URL",
            "bizcard.media.bgUrl": "Fon URL",
            "bizcard.media.musicUrl": "Musiqa URL (MP3)",
            "bizcard.media.musicHint": "Musiqa indikatori ko‘rsatiladi",
            "bizcard.media.gallery": "Foto galereyasi",
            "bizcard.media.addPhoto": "+ Foto qo‘shish",
            "bizcard.media.videos": "Video havolalar",
            "bizcard.media.addVideo": "+ Video qo‘shish",
            "bizcard.design.theme": "Mavzu",
            "bizcard.design.primaryColor": "Asosiy rang",
            "bizcard.theme.light": "Yorug‘",
            "bizcard.theme.dark": "Qorong‘u",
            "bizcard.theme.gradient": "Gradient",
            "bizcard.theme.corporate": "Korporativ",
            "bizcard.toast.saved": "Vizitka saqlandi",
            "bizcard.toast.savedSync": "Vizitka saqlandi va server bilan sinxronlashtirildi",
            "bizcard.toast.savedLocal": "Faqat qurilmada saqlandi. Serverga ulanib bo‘lmadi.",
            "bizcard.toast.fullName": "F.I.Sh ni kiriting",
            "bizcard.levelBadge": "{{n}}-daraja",
            "bizcard.income": "Daromad",
            "bizcard.team": "Jamoa",
            "bizcard.level": "Daraja",
            "bizcard.ref": "Havola: ",
            "bizcard.share": "Vizitkani ulashish",
            "smuser.income": "Daromad",
            "smuser.team": "Jamoa"
        },
        "uz-cyrl": {
            "navruz.title": "Наврўз байрами муборак! 🎉",
            "navruz.subtitle": "Баҳор, илиқлик ва илҳом тилаймиз!",
            "nav.home": "Бош саҳифа",
            "nav.finances": "Молия",
            "nav.partners": "Ҳамкорлар",
            "nav.structure": "Структура",
            "nav.marketing": "Маркетинг",
            "nav.tools": "Бизнинг воситалар",
            "nav.presentations": "Презентациялар",
            "nav.documents": "Ҳужжатлар",
            "nav.groups": "Гуруҳлар ва каналлар",
            "nav.receipt": "Чек генератори",
            "nav.bizcard": "Менинг визиткам",
            "settings.title": "Созламалар",
            "settings.changeAccount": "Аккаунтни алмаштириш",
            "settings.changeAccountSub": "Бошқа фойдаланувчи билан қайта киринг",
            "settings.language": "Тил",
            "language.name.ru": "Русский",
            "language.name.uz": "O'zbekcha",
            "language.name.uz-cyrl": "Ўзбекча",
            "settings.notifications": "Билдиришномалар",
            "settings.notificationsOn": "Ёқилган",
            "settings.about": "Дастур ҳақида",
            "settings.version": "Версия 1.0.0",
            "actions.copy": "📋 Нусхалаш",
            "actions.refresh": "↻ Янгилаш",
            "actions.cancel": "Бекор қилиш",
            "actions.ok": "OK",
            "aria.openMenu": "Менюни очиш",
            "aria.closeApp": "Иловани ёпиш",
            "structure.error": "Структурани юклашда хато:<br>Фойдаланувчи маркетинг структурасида иштирок этмайди",
            "structure.ok": "Сиз маркетинг структурасида иштирок этасиз. Маълумотлар сервер билан синхрон.",
            "marketing.hint": "Катталаштириш учун расмни босинг",
            "modal.title": "Toza Yurak Sahiy Qollar",
            "modal.logoutConfirm": "Ҳақиқатан ҳам аккаунтдан чиқмоқчимисиз? Қайта авторизация керак бўлади.",
            "toast.copySuccess": "Ҳавола нусхаланди!",
            "toast.copyError": "Нусхалашда хатолик",
            "toast.updated": "Янгиланди",
            "toast.opening": "Ҳавола очилмоқда…",
            "toast.materialSoon": "Материаллар тез орада ботда",
            "toast.noLink": "Ҳавола созланмаган — __APP_LINKS__ да киритинг",
            "sync.offline":
                "Серверга уланиб бўлмади. server да npm start, браузерда 127.0.0.1:3847. Телефон: head мета ty-api-base га компьютер IP ёзинг.",
            "sync.dataFail": "Сервер хато қайтарди. Қайта уриниб кўринг.",
            "sync.authFail":
                "Сервер ишламоқда, лекин кириш бажарилмади. Иловани Telegram ичида очинг ёки backendда TELEGRAM_BOT_TOKEN ни текширинг.",
            "sync.bootstrapDisabled":
                "Тест режимидаги кириш серверда ўчирилган. Mini Appни Telegram орқали очинг. Маҳаллий синов: ALLOW_AUTH_BOOTSTRAP=1.",
            "sync.retry": "Қайта",
            "settings.notificationsOff": "Ўчирилган",
            "tools.tapOpen": "Очиш учун босинг",
            "presentations.downloadHint": "Файл қўшинг: window.__APP_LINKS__.presentationFile",
            "about.toast": "Toza Yurak Sahiy Qollar · v1.0.0",
            "toast.generating": "Яратилмоқда...",
            "toast.generatingReceipt": "Чек тайёр",
            "toast.receiptCopyOk": "Чек матни нусхаланди",
            "toast.receiptCopyFail": "Нусхалаб бўлмади",
            "home.hero.badge": "⚡ SAHIY QO'LLAR",
            "home.hero.title": "Хуш келибсиз<br><span class=\"hero-brand\">Toza Yurak</span><br>Саҳий Қўллар!",
            "home.hero.description": "Эзгулик ва сахийлик дастури — бирга яхшилик қилишайлик, юракдан!",
            "home.overallEarnings.title": "Умумий даромад",
            "home.overallEarnings.subtitle": "Барча мукофотлар",
            "home.overallEarnings.meta": "Лойиҳада иштирок этган вақтдан бери",
            "partners.badge": "👥 ҲАМКОРЛАР",
            "partners.title": "Ҳамкорлар",
            "partners.directCount": "0 та тўғридан ҳамкорлар",
            "partners.myTeam": "🏠 Менинг жамоам",
            "partners.direct": "Тўғридан ҳамкорлар",
            "partners.active": "Фаоллар",
            "partners.teams": "Жамоа ҳамкорлари",
            "partners.inMarketing": "Маркетингда",
            "partners.structure": "Ҳамкорлар структураси",
            "partners.structureDesc": "Тўлиқ структурани кўриш учун босинг",
            "home.teamSize.directRefs": "Тўғридан реферaллар: 0",
            "home.teamSize.activeMarketing": "Маркетингда фаоллар: 0",
            "partners.totalMembers": "Жами ҳамкорлар",
            "home.teamSize.title": "Жамоа аъзолари сони",
            "home.teamSize.subtitle": "Умумий",
            "home.teamSize.meta": "Жамоадаги жами ҳамкорлар",
            "home.level.title": "Сизнинг даражангиз",
            "home.level.subtitle": "Дастурда иштирок этмайди",
            "home.level.value": "Даража 0",
            "home.level.meta": "Маркетинг структурага қўшилиш учун администратор билан боғланинг",
            "home.inProject.title": "Лойиҳада",
            "home.inProject.subtitle": "Рўйхатдан ўтиш санаси",
            "home.inProject.meta": "Жамоага қўшилган сана",
            "home.profile.title": "Профил",
            "home.profile.subtitle": "Шахсий маълумот",
            "home.invitedBy": "Таклиф қилган: {{name}}",
            "home.referral.title": "Сизнинг реферал ҳаволангиз<br>",
            "home.referral.loading": "Ҳавола юкланмоқда…",
            "finances.title": "Молия",
            "finances.overallLabel": "Умумий даромад",
            "finances.overallSub": "Лойиҳада иштирок этган вақтдан бери",
            "finances.today": "Бугун",
            "finances.thisMonth": "Ушбу ой",
            "finances.operations": "Операциялар",
            "finances.average": "Ўртача",
            "finances.filters.title": "Фильтрлар",
            "finances.filters.type": "Операция тури",
            "finances.filters.typeOptions.all": "Барча турлар",
            "finances.filters.typeOptions.referral": "Реферал",
            "finances.filters.typeOptions.team": "Жамоа",
            "finances.filters.typeOptions.bonuses": "Бонуслар",
            "finances.filters.status": "Ҳолат",
            "finances.filters.statusOptions.all": "Барча ҳолатлар",
            "finances.filters.statusOptions.completed": "Бажарилган",
            "finances.filters.statusOptions.pending": "Кутиш",
            "finances.filters.statusOptions.declined": "Рад этилган",
            "finances.filters.dateFrom": "Сана дан",
            "finances.filters.dateTo": "Сана гача",
            "finances.filters.apply": "👁 Фильтрни қўллаш",
            "finances.filters.reset": "↻ Тозалаш",
            "finances.export": "⬇ Экспорт",
            "finances.loadError": "Операцияларни юклаб бўлмади. Тармоқни текширинг.",
            "finances.exportEmpty": "Экспорт учун маълумот йўқ",
            "finances.history.title": "Операциялар тарихи",
            "finances.history.empty": "Операциялар тарихи ҳозирча бўш",
            "marketing.title": "Маркетинг",
            "marketing.hero.line1": "Тоза юракли",
            "marketing.hero.line2": "Сахий қуллар",
            "marketing.hero.slogan": "БИРЛИКДА – ИШОНЧ БИЛАН, САХИЙЛИК БИЛАН, КЕЛАЖАК САРИ!",
            "marketing.table.levels": "ДАРАЖАЛАР",
            "marketing.table.level": "ДАРАЖА",
            "marketing.table.price": "НАРХ",
            "marketing.table.priceSum": "НАРХ (СЎМ)",
            "marketing.table.participants": "ИШТИРОКЧИЛАР",
            "marketing.table.income": "ДАРОМАД",
            "marketing.table.incomeSum": "ДАРОМАД (СЎМ)",
            "marketing.table.profit": "ФОЙДА",
            "marketing.table.profitSum": "ФОЙДА (СЎМ)",
            "marketing.table.total": "ЖАМИ",
            "marketing.summary.participantsLabel": "ЖАМИ ИШТИРОКЧИЛАР:",
            "marketing.summary.participantsVal": "30",
            "marketing.summary.people": "КИШИ",
            "marketing.summary.incomeLabel": "УМУМИЙ ДАРОМАД:",
            "marketing.summary.profitLabel": "УМУМИЙ ФОЙДА:",
            "marketing.summary.currency": "СЎМ",
            "marketing.footer.line": "ТОЗА ЮРАК – САХИЙ ҚУЛ, КЕЛАЖАК УЧУН ЁРУҒ ЙЎЛ!",
            "marketing.expandAria": "Расмни каттароқ очиш",
            "marketing.modalAria": "Маркетинг режасининг катталаштирилган кўриниши",
            "marketing.modalHint": "Ёпиш учун қоронғир фон устига босинг",
            "marketing.posterAlt":
                "«Тоза юракли — Сахий қуллар» маркетинг режаси: даражалар, сўмдаги суммалар, иштирокчилар, даромад ва фойда.",
            "tools.title": "🔧 ишлаб чиқилаётган воситалар",
            "tools.subtitle": "Жамоа бизнесингизни автоматлаштириш учун ноёб воситалар яратади. Янгиликларни кузатиб боринг!",
            "tools.card.visit.title": "Визитка",
            "tools.card.visit.desc": "Мижозларни жалб қилиш учун шахсий визитка",
            "tools.card.landing.title": "Сотувга мўлжалланган лендинг",
            "tools.card.landing.desc": "Видео презентацияли сотув лендинги",
            "tools.card.minilanding.title": "Мини-лендинг",
            "tools.card.minilanding.desc": "Тез конверсия учун икчам лендинг",
            "tools.card.bot.title": "Телеграм-бот",
            "tools.card.bot.desc": "Мижозлар билан ишлаш учун автоматлаштирилган бот",
            "tools.lock": "🔒 Дастурда иштирок этиш талаб этилади",
            "tools.badgeDev": "🔧 Ишлаб чиқилмоқда",
            "tools.badgeLvl1": "👑 Даража 1",
            "tools.badgeLvl2": "👑 Даража 2",
            "tools.badgeLvl3": "👑 Даража 3",
            "tools.badgeLvl4": "👑 Даража 4",
            "finance.date.placeholder": "дд.мм.гггг",
            "presentations.program": "ДАСТУР",
            "presentations.programTitle": "Эндиликда сизда<br>юқори даромадли дастур бор!",
            "presentations.programNote": "Дастурда Telegramдаги шахсий аккаунтингиздан иштирок этинг! Ҳақиқий сурат/аватарингиз ва фойдаланувчи номингизни ўрнатинг!",
            "presentations.programFooter": "Биз биргаликда ҳар қандай молиявий қийинчиликни енгамиз!<br><span style=\"color:rgba(255,255,255,.5);font-size:11px\">Ҳаммаси оилавий бюджетимиз учун!</span>",
            "presentations.download": "⬇ Таърифномани юклаб олиш",
            "presentations.advantages": "Афзалликлар",
            "presentations.advantagesSummary": "Қўшилиш учун олтита сабаб:",
            "presentations.advantage1": "Бизнес жойи учун жами 10$!",
            "presentations.advantage2": "Дарҳол даромад!",
            "presentations.advantage3": "Кафолатланган тўловлар!",
            "presentations.advantage4": "Потенциал даромад 2 000 000$ гача!",
            "presentations.advantage5": "Тажриба йўқ, малака йўқ, кўникма йўқ!",
            "presentations.advantage6": "3-9-27 жамоани тузганингиздан сўнг фаол ҳам, пассив ҳам даромад олинг!",
            "presentations.materials": "Ҳамкорлар учун материаллар",
            "presentations.material1": "Янги бошловчилар учун кўрсатма",
            "presentations.material2": "Маркетинг режаси",
            "presentations.material3": "Сотув скриптлари",
            "presentations.material4": "Таълим",
            "documents.title": "Ҳужжатлар",
            "documents.agreement.title": "Келишув",
            "documents.agreement.desc": "Фойдаланувчи келишуви",
            "documents.ethics.title": "Этика ва қоидалар",
            "documents.ethics.desc": "Жамоа одоб-ахлоқи қоидалари",
            "documents.open": "↗ Ҳужжатни очиш",
            "documents.important.title": "Муҳим маълумот",
            "documents.important.point1": "Операциялар шаффофлиги",
            "documents.important.point1desc": "Барча транзакциялар иштирокчилар ўртасида тўғридан-тўғри амалга оширилади",
            "documents.important.point2": "Қоидаларга риоя қилиш",
            "documents.important.point2desc": "Этика ва қоидаларни албатта ўрганинг",
            "documents.important.point3": "Қўллаб-қувватлаш",
            "documents.important.point3desc": "Саволлар бўлса, маъмуриятга мурожаат қилинг",
            "groups.title": "Гуруҳлар ва каналлар",
            "groups.channel.title": "Расмий канал",
            "groups.channel.desc": "Янгиликлар ва янгиланишлар",
            "groups.chat.title": "Умумий чат",
            "groups.chat.desc": "Иштирокчилар мулоқоти",
            "groups.training.title": "Таълим",
            "groups.training.desc": "Ўқув материаллари",
            "groups.top.title": "TOP ҳамкорлар",
            "groups.top.desc": "Жамоа етакчилари",
            "receipt.title": "Чек генератори",
            "receipt.badge.telegram": "Telegramга автоюбориш",
            "receipt.howto.title": "Қандай ишлайди",
            "receipt.howto.step1": "Формани тўлдиринг ёки тезкор яратишдан фойдаланинг",
            "receipt.howto.step2": "Чек автоматик тариқда шаклланади",
            "receipt.howto.step3": "Уни Telegram-ботда оласиз",
            "receipt.howto.step4": "Бу ерда юклаб олиш ёки улашиш ҳам мумкин",
            "receipt.create.title": "Чек яратиш",
            "receipt.field.id": "ID (ихтиёрий)",
            "receipt.field.idPlaceholder": "«CONCORD» учун бўш қолдиринг",
            "receipt.field.idHint": "«ID: сизнинг матнингиз» кўринишда чиқади",
            "receipt.amount": "Сумма",
            "receipt.recipient": "Олинган шахс",
            "receipt.description": "Тавсиф",
            "receipt.amountPlaceholder": "0.00",
            "receipt.recipientPlaceholder": "Қабул қилувчи исми",
            "receipt.imageLabel": "Расм (макс. 5MB, JPG/PNG/GIF)",
            "receipt.imageHint": "Максимал ҳажм: 5MB. Форматлар: JPG, PNG, GIF",
            "receipt.generate": "✦ Яратиш ва юбориш",
            "receipt.quick.title": "Тезкор яратиш",
            "receipt.quick.desc": "Жорий баланс билан менинг чеким",
            "receipt.quick.line1": "Жорий баланс бўйича чек",
            "receipt.quick.line2": "«Умумий дарomad» суммаси ва исмингизни қўяди",
            "receipt.descriptionPlaceholder": "Тўлов тавсифи...",
            "receipt.error.amount": "0 дан катта сумма киритинг",
            "receipt.error.recipient": "Қабул қилувчини киритинг",
            "receipt.error.fileType": "Расм файли керак (JPG, PNG, GIF ёки WebP)",
            "receipt.error.fileSize": "Файл 5 МБ дан катта",
            "receipt.error.zeroBalance": "«Умумий дарomad» ҳозир $0 — аввал қўлда сумма киритинг",
            "receipt.success": "Чек тайёрланди",
            "receipt.copyBtn": "📋 Матнни нусхалаш",
            "receipt.shareBtn": "📤 Улашиш",
            "receipt.footerNote": "Матнни сақланг ёки қабул қилувчига юборинг. Илова ичидаги расм фақат шу ерда кўринади.",
            "receipt.preview.title": "TOZA YURAK — чек",
            "receipt.preview.idDt": "ID",
            "receipt.preview.from": "Юборувчи",
            "receipt.preview.date": "Сана",
            "receipt.preview.amount": "Сумма",
            "receipt.preview.recipient": "Қабул қилувчи",
            "receipt.preview.desc": "Тавсиф",
            "receipt.preview.attach": "Илова",
            "receipt.preview.attachYes": "ҳа",
            "receipt.preview.serverId": "Сервер ID",
            "receipt.serverOk": "Чек серверга юборилди ва сақланди",
            "receipt.serverOkTelegram": "Чек сақланди ва Telegramингизга юборилди",
            "receipt.serverOkNoTelegram": "Чек сервера сақланди. Telegram нусхаси учун бот орқали киринг ва ботга /start ёзинг.",
            "receipt.error.server": "Сервер жавоб бермаяпти. `server` папкасида `npm install` ва `npm start` ни ишга туширинг ёки API манзилини текширинг.",
            "receipt.sending": "Серверга юборилмоқда…",
            "receipt.quick.note": "Кабинетдаги жорий баланс бўйича тезкор чек",
            "receipt.quick.recipientDefault": "Toza Yurak — дастур кабинети",
            "receipt.result.title": "Натижа",
            "receipt.result.emptyLead": "Формани тўлдиринг ва генерация тугмасини босинг",
            "receipt.result.emptyTelegram": "Чек сизга Telegram орқали автоматик юборилади",
            "receipt.examples.title": "Фойдаланиш мисоллари",
            "receipt.examples.partners.title": "Ҳамкорлар учун",
            "receipt.examples.partners.desc": "Жамоада мотивация учун ютуқлар билан чекларни улашинг",
            "receipt.examples.social.title": "Ижтимоий тармоқларда",
            "receipt.examples.social.desc": "Янги ҳамкорларни жалб қилиш учун муваффақиятларни эълон қилинг",
            "receipt.examples.archive.title": "Шахсий архив",
            "receipt.examples.archive.desc": "Натижаларни тасдиқ сифатида чекларни сақланг",
            "bizcard.title": "Менинг визиткам",
            "bizcard.preview": "Кўриб чиқиш",
            "bizcard.previewTitle": "Визитка кўриниши",
            "bizcard.save": "Визиткани сақлаш",
            "bizcard.livePreview": "Жорий визитка",
            "bizcard.tab.basic": "Асосий",
            "bizcard.tab.about": "Ўзим ҳақимда",
            "bizcard.tab.messengers": "Мессенджерлар",
            "bizcard.tab.social": "Ижтимоий тармоқлар",
            "bizcard.tab.media": "Медиа",
            "bizcard.tab.design": "Ташқи кўриниш",
            "bizcard.section.personal": "Шахсий маълумот",
            "bizcard.section.about": "Ўзингиз ва шиор",
            "bizcard.section.messengers": "Мессенджерлар",
            "bizcard.section.social": "Ижтимоий тармоқлар",
            "bizcard.section.mediaPhoto": "Фото ва фон",
            "bizcard.section.design": "Ташқи кўриниш",
            "bizcard.field.cardTitle": "Визитка номи",
            "bizcard.field.cardTitleHint": "Рўйхатда қулайлик учун",
            "bizcard.field.fullName": "Ф.И.Ш *",
            "bizcard.field.position": "Лавозим",
            "bizcard.field.phone": "Телефон",
            "bizcard.field.slogan": "Шиор (1-слайдда)",
            "bizcard.field.about": "Ўзингиз ҳақингизда (2-слайдда)",
            "bizcard.field.regText": "Рўйхатдан ўтиш матни",
            "bizcard.ph.cardTitle": "Менинг асосий визиткам",
            "bizcard.ph.fullName": "Фамилия Исм",
            "bizcard.ph.position": "Мустақил ҳамкор",
            "bizcard.ph.slogan": "2 қаторлик мотивацион шиор",
            "bizcard.ph.about": "Ўзингиз ҳақингизда…",
            "bizcard.ph.regText": "Рўйхатдан ўтиш шиори",
            "bizcard.media.photoUrl": "Фотосурат URL",
            "bizcard.media.bgUrl": "Фон URL",
            "bizcard.media.musicUrl": "Мусиқа URL (MP3)",
            "bizcard.media.musicHint": "Мусиқа индикатори кўрсатилади",
            "bizcard.media.gallery": "Фото галереяси",
            "bizcard.media.addPhoto": "+ Фото қўшиш",
            "bizcard.media.videos": "Видео ҳаволалар",
            "bizcard.media.addVideo": "+ Видео қўшиш",
            "bizcard.design.theme": "Мавзу",
            "bizcard.design.primaryColor": "Асосий ранг",
            "bizcard.theme.light": "Ёруғ",
            "bizcard.theme.dark": "Қоронғу",
            "bizcard.theme.gradient": "Градиент",
            "bizcard.theme.corporate": "Корпоратив",
            "bizcard.toast.saved": "Визитка сақланди",
            "bizcard.toast.savedSync": "Визитка сақланди ва сервер билан синхронлаштирилди",
            "bizcard.toast.savedLocal": "Фақат қурилмада сақланди. Серверга уланиб бўлмади.",
            "bizcard.toast.fullName": "Ф.И.Ш ни киритинг",
            "bizcard.levelBadge": "{{n}}-даража",
            "bizcard.income": "Даромад",
            "bizcard.team": "Жамоа",
            "bizcard.level": "Даража",
            "bizcard.ref": "Ҳавола: ",
            "bizcard.share": "Визиткани улашиш",
            "smuser.income": "Даромад",
            "smuser.team": "Жамоа"
        }
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function isApiRelativeMode() {
        if (window.__API_RELATIVE__ !== true) return false;
        var o = typeof location !== "undefined" ? location.origin : "";
        return Boolean(o && o !== "null" && /^https?:/i.test(o));
    }

    /** HTTPS saytda localhost API — brauzer bloklaydi yoki foydalanuvchi kompyuteriga urinadi. */
    function isPublicWebHost() {
        try {
            var h = typeof location !== "undefined" && location.hostname ? String(location.hostname) : "";
            return Boolean(h && !/^127\.0\.0\.1$/i.test(h) && !/^localhost$/i.test(h));
        } catch (eH) {
            return false;
        }
    }

    /** Render free cold start 30–60s bo‘lishi mumkin — qisqa timeout “server yo‘q” deb qoladi. */
    function apiProbeTimeoutMs() {
        try {
            var h =
                typeof location !== "undefined" && location.hostname ? String(location.hostname).toLowerCase() : "";
            if (h.indexOf("onrender.com") !== -1) return 65000;
            if (isPublicWebHost()) return 35000;
        } catch (eT) {}
        return 8000;
    }

    function isLoopbackApiUrl(url) {
        var s = String(url || "").trim();
        return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(s);
    }

    function scrubLoopbackApiBaseIfPublic(b) {
        if (!b || !isPublicWebHost() || !isLoopbackApiUrl(b)) return b;
        return "";
    }

    function getApiBase() {
        function trimBase(s) {
            if (s == null || typeof s !== "string") return "";
            return s.replace(/\/$/, "").trim();
        }
        if (isApiRelativeMode()) return "";
        var preset = scrubLoopbackApiBaseIfPublic(trimBase(typeof window.__API_BASE__ === "string" ? window.__API_BASE__ : ""));
        if (preset) return preset;
        try {
            var metaEl = document.querySelector('meta[name="ty-api-base"]');
            var metaBase = scrubLoopbackApiBaseIfPublic(trimBase(metaEl ? metaEl.getAttribute("content") : ""));
            if (metaBase) return metaBase;
        } catch (e) {}
        var o = typeof location !== "undefined" ? location.origin : "";
        if (o && o !== "null" && /^https?:/i.test(o)) {
            return trimBase(o);
        }
        return "http://127.0.0.1:3847";
    }

    function apiUrl(path) {
        var p = String(path || "");
        if (p.charAt(0) !== "/") p = "/" + p;
        var base = getApiBase();
        if (base === "") return p;
        return base + p;
    }

    async function responseJsonSafe(res) {
        try {
            var txt = await res.text();
            if (!txt || !String(txt).trim()) return {};
            return JSON.parse(txt);
        } catch (e) {
            return {};
        }
    }

    function getApiFingerprint() {
        try {
            if (isApiRelativeMode() && typeof location !== "undefined" && location.origin && location.origin !== "null") {
                return "rel:" + location.origin;
            }
        } catch (e) {}
        var b = getApiBase();
        if (b) return b;
        try {
            if (typeof location !== "undefined" && location.origin && location.origin !== "null") {
                return location.origin;
            }
        } catch (e2) {}
        return "";
    }

    function formatMoneyAmount(n) {
        var x = Number(n);
        if (!Number.isFinite(x)) x = 0;
        try {
            return new Intl.NumberFormat(getReceiptLocaleTag(), {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(x);
        } catch (e0) {
            try {
                return "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } catch (e1) {
                return "$" + x.toFixed(2);
            }
        }
    }

    /** Butun sonlar (jamoa va h.k.) — minglik ajratgichlar bilan */
    function formatIntegerGrouped(n) {
        var x = Number(n);
        if (!Number.isFinite(x)) x = 0;
        x = Math.trunc(x);
        try {
            return new Intl.NumberFormat(getReceiptLocaleTag(), {
                maximumFractionDigits: 0,
                useGrouping: true
            }).format(x);
        } catch (e0) {
            try {
                return x.toLocaleString("en-US", { maximumFractionDigits: 0 });
            } catch (e1) {
                return String(x);
            }
        }
    }

    function formatJoinedDate(isoDate) {
        var s = String(isoDate || "").trim();
        var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
        if (m) return m[3] + "." + m[2] + "." + m[1];
        return s || "—";
    }

    function splitDisplayName(full) {
        var p = String(full || "")
            .trim()
            .split(/\s+/);
        if (!p.length || !p[0]) return { first: "—", rest: "" };
        if (p.length === 1) return { first: p[0], rest: "" };
        return { first: p[0], rest: p.slice(1).join(" ") };
    }

    /** @param {{ username?: string, telegramId?: string | null }} u */
    function formatUserHandle(u) {
        if (!u) return "—";
        if (u.username) return "@" + String(u.username).replace(/^@/, "");
        if (u.telegramId != null && String(u.telegramId) !== "") return "ID: " + u.telegramId;
        return "—";
    }

    function getTelegramUnsafeUser() {
        try {
            return window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
        } catch (e) {
            return null;
        }
    }

    /** Telegram: @username → ism → ID · … */
    function pillModelFromTelegramUser(tg) {
        if (!tg || typeof tg !== "object") return null;
        var uname = tg.username ? String(tg.username).replace(/^@/, "").trim() : "";
        var full = [tg.first_name, tg.last_name]
            .filter(function (x) {
                return x && String(x).trim();
            })
            .map(function (x) {
                return String(x).trim();
            })
            .join(" ");
        var id = tg.id != null && tg.id !== "" ? String(tg.id) : "";
        var primary;
        var sub;
        if (uname) {
            primary = "@" + uname;
            sub = full || (id ? "ID · " + id : "");
        } else if (full) {
            primary = full;
            sub = id ? "ID · " + id : "";
        } else if (id) {
            primary = "ID · " + id;
            sub = "";
        } else {
            primary = "—";
            sub = "";
        }
        var letter = "U";
        if (tg.first_name && String(tg.first_name).trim()) {
            letter = String(tg.first_name).trim().charAt(0);
        } else if (uname) {
            letter = uname.charAt(0);
        } else if (id) {
            letter = String(id).replace(/\D/g, "").slice(-1) || id.charAt(0);
        }
        letter = String(letter || "U")
            .toUpperCase()
            .slice(0, 1);
        return { letter: letter, primary: primary, sub: sub };
    }

    /** Server dashboard user */
    function pillModelFromServerUser(u) {
        if (!u || typeof u !== "object") return null;
        var uname = u.username ? String(u.username).replace(/^@/, "").trim() : "";
        var full = u.fullName ? String(u.fullName).trim() : "";
        var id = u.telegramId != null && String(u.telegramId) !== "" ? String(u.telegramId) : "";
        var primary;
        var sub;
        if (uname) {
            primary = "@" + uname;
            sub = full || (id ? "ID · " + id : "");
        } else if (full) {
            primary = full;
            sub = id ? "ID · " + id : "";
        } else if (id) {
            primary = "ID · " + id;
            sub = "";
        } else {
            primary = "—";
            sub = "";
        }
        var letter = String(u.avatarLetter || "").trim().slice(0, 1);
        if (!letter) {
            if (full) letter = full.charAt(0);
            else if (uname) letter = uname.charAt(0);
            else if (id) letter = String(id).replace(/\D/g, "").slice(-1) || id.charAt(0);
        }
        letter = String(letter || "U")
            .toUpperCase()
            .slice(0, 1);
        return { letter: letter, primary: primary, sub: sub };
    }

    function setUserPillDOM(model) {
        var ava = byId("userPillAva");
        var pillName = byId("userPillName");
        if (!model) {
            if (ava) ava.textContent = "·";
            if (pillName) {
                pillName.textContent = "";
                var ph = document.createElement("span");
                ph.className = "user-pill__primary";
                ph.style.opacity = "0.45";
                ph.textContent = "…";
                pillName.appendChild(ph);
            }
            return;
        }
        if (ava) ava.textContent = model.letter;
        if (pillName) {
            pillName.textContent = "";
            var p = document.createElement("span");
            p.className = "user-pill__primary";
            p.textContent = model.primary;
            pillName.appendChild(p);
            if (model.sub) {
                var br = document.createElement("br");
                pillName.appendChild(br);
                var s = document.createElement("span");
                s.className = "user-pill__sub";
                s.textContent = model.sub;
                pillName.appendChild(s);
            }
        }
    }

    /** Telegram ochiq bo‘lsa — darhol shu ma’lumot; aks holda server profili */
    function applyUserPillDisplay(serverUser) {
        var tg = getTelegramUnsafeUser();
        var model = tg ? pillModelFromTelegramUser(tg) : serverUser ? pillModelFromServerUser(serverUser) : null;
        setUserPillDOM(model);
        var L = model && model.letter ? model.letter : "…";
        var sma = byId("smUserAva");
        if (sma) sma.textContent = L;
        var spa = byId("settingsProfileAva");
        if (spa) spa.textContent = L;
    }

    var NOTIF_STORAGE_KEY = "ty_notif_on";
    var BIZCARD_STORAGE_KEY = "ty_bizcard_v2";
    var BIZCARD_MAX_GALLERY = 10;
    var BIZCARD_MAX_VIDEOS = 5;
    var BIZCARD_COLOR_PRESETS = ["#5ff0b0", "#667eea", "#34c280", "#fca5d4", "#fcd4a8", "#8ef0e0"];

    function defaultBizcardData() {
        return {
            cardTitle: "",
            fullName: "",
            position: "",
            phone: "",
            slogan: "",
            about: "",
            regText: "",
            telegram: "",
            whatsapp: "",
            viber: "",
            imo: "",
            vk: "",
            instagram: "",
            youtube: "",
            facebook: "",
            rutube: "",
            photoUrl: "",
            bgUrl: "",
            musicUrl: "",
            gallery: [],
            videos: [],
            theme: "light",
            primaryColor: "#5ff0b0"
        };
    }

    function loadBizcardStorage() {
        try {
            var s = window.localStorage.getItem(BIZCARD_STORAGE_KEY);
            if (!s) return defaultBizcardData();
            var j = JSON.parse(s);
            return Object.assign(defaultBizcardData(), j || {});
        } catch (e) {
            return defaultBizcardData();
        }
    }

    function saveBizcardStorage(data) {
        try {
            window.localStorage.setItem(BIZCARD_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    function normalizeHexColor(s) {
        var x = String(s || "").trim();
        if (/^#[0-9A-Fa-f]{6}$/.test(x)) return x;
        if (/^[0-9A-Fa-f]{6}$/.test(x)) return "#" + x;
        return "";
    }

    function normalizeTelegramInput(s) {
        s = String(s || "").trim();
        if (!s) return "";
        if (/^https?:\/\//i.test(s)) return s;
        var u = s.replace(/^@+/, "");
        return u ? "@" + u : "";
    }

    function normalizeInstagramInput(s) {
        s = String(s || "").trim();
        if (!s) return "";
        if (/^https?:\/\//i.test(s)) return s;
        var u = s.replace(/^@+/, "");
        return u ? "@" + u : "";
    }

    function digitsOnlyPhone(s) {
        return String(s || "").replace(/\D/g, "");
    }

    function collectBizcardFromForm() {
        function val(id) {
            var el = byId(id);
            return el ? String(el.value || "").trim() : "";
        }
        var gallery = [];
        var gl = byId("bcGalleryList");
        if (gl) {
            gl.querySelectorAll("input.bc-url-input").forEach(function (inp) {
                var v = String(inp.value || "").trim();
                if (v) gallery.push(v);
            });
        }
        var videos = [];
        var vl = byId("bcVideoList");
        if (vl) {
            vl.querySelectorAll("input.bc-url-input").forEach(function (inp) {
                var v = String(inp.value || "").trim();
                if (v) videos.push(v);
            });
        }
        var themeBtn = document.querySelector(".bc-theme-btn.active");
        var theme = themeBtn ? String(themeBtn.getAttribute("data-bc-theme") || "light") : "light";
        var hex = normalizeHexColor(val("bcPrimaryColor")) || normalizeHexColor(val("bcColorPicker")) || "#5ff0b0";
        return {
            cardTitle: val("bcCardTitle"),
            fullName: val("bcFullName"),
            position: val("bcPosition"),
            phone: val("bcPhone"),
            slogan: val("bcSlogan"),
            about: val("bcAbout"),
            regText: val("bcRegText"),
            telegram: normalizeTelegramInput(val("bcTg")),
            whatsapp: val("bcWa"),
            viber: val("bcViber"),
            imo: val("bcImo"),
            vk: val("bcVk"),
            instagram: normalizeInstagramInput(val("bcInsta")),
            youtube: val("bcYt"),
            facebook: val("bcFb"),
            rutube: val("bcRutube"),
            photoUrl: val("bcPhotoUrl"),
            bgUrl: val("bcBgUrl"),
            musicUrl: val("bcMusicUrl"),
            gallery: gallery.slice(0, BIZCARD_MAX_GALLERY),
            videos: videos.slice(0, BIZCARD_MAX_VIDEOS),
            theme: theme,
            primaryColor: hex
        };
    }

    function applyBizcardToForm(data) {
        data = Object.assign(defaultBizcardData(), data || {});
        function setV(id, v) {
            var el = byId(id);
            if (el) el.value = v != null ? String(v) : "";
        }
        setV("bcCardTitle", data.cardTitle);
        setV("bcFullName", data.fullName);
        setV("bcPosition", data.position);
        setV("bcPhone", data.phone);
        setV("bcSlogan", data.slogan);
        setV("bcAbout", data.about);
        setV("bcRegText", data.regText);
        setV("bcTg", data.telegram);
        setV("bcWa", data.whatsapp);
        setV("bcViber", data.viber);
        setV("bcImo", data.imo);
        setV("bcVk", data.vk);
        setV("bcInsta", data.instagram);
        setV("bcYt", data.youtube);
        setV("bcFb", data.facebook);
        setV("bcRutube", data.rutube);
        setV("bcPhotoUrl", data.photoUrl);
        setV("bcBgUrl", data.bgUrl);
        setV("bcMusicUrl", data.musicUrl);
        var col = normalizeHexColor(data.primaryColor) || "#5ff0b0";
        setV("bcPrimaryColor", col);
        var pk = byId("bcColorPicker");
        if (pk) pk.value = col;
        document.querySelectorAll(".bc-theme-btn").forEach(function (b) {
            b.classList.toggle("active", b.getAttribute("data-bc-theme") === data.theme);
        });
        rebuildBizcardUrlList("bcGalleryList", data.gallery || [], BIZCARD_MAX_GALLERY, "https://…");
        rebuildBizcardUrlList("bcVideoList", data.videos || [], BIZCARD_MAX_VIDEOS, "https://youtube.com/…");
        updateBizcardCharCounts();
        updateBizcardGalleryVideoCounts();
        setBizcardTabProgress(document.querySelector('.bc-tab.active[data-bc-tab]'));
    }

    function rebuildBizcardUrlList(containerId, urls, max, placeholder) {
        var box = byId(containerId);
        if (!box) return;
        box.innerHTML = "";
        var list = (urls || []).slice(0, max);
        if (!list.length) list = [""];
        list.forEach(function (u) {
            bizcardAppendUrlRow(box, u, placeholder);
        });
    }

    function bizcardAppendUrlRow(box, value, placeholder) {
        var row = document.createElement("div");
        row.className = "bc-url-row";
        var inp = document.createElement("input");
        inp.type = "url";
        inp.className = "r-input bc-url-input";
        inp.placeholder = placeholder || "https://…";
        inp.value = value || "";
        var rm = document.createElement("button");
        rm.type = "button";
        rm.className = "bc-url-remove";
        rm.setAttribute("aria-label", "Remove");
        rm.textContent = "×";
        rm.addEventListener("click", function () {
            var parent = box;
            if (parent.querySelectorAll(".bc-url-row").length <= 1) {
                inp.value = "";
                updateBizcardGalleryVideoCounts();
                return;
            }
            row.remove();
            updateBizcardGalleryVideoCounts();
        });
        row.appendChild(inp);
        row.appendChild(rm);
        box.appendChild(row);
    }

    function updateBizcardCharCounts() {
        var sg = byId("bcSlogan");
        var ab = byId("bcAbout");
        var sc = byId("bcSloganCount");
        var ac = byId("bcAboutCount");
        if (sg && sc) sc.textContent = String(sg.value.length);
        if (ab && ac) ac.textContent = String(ab.value.length);
    }

    function updateBizcardGalleryVideoCounts() {
        var gl = byId("bcGalleryList");
        var vl = byId("bcVideoList");
        var gc = byId("bcGalleryCount");
        var vc = byId("bcVideoCount");
        var gn = gl ? gl.querySelectorAll(".bc-url-row").length : 0;
        var vn = vl ? vl.querySelectorAll(".bc-url-row").length : 0;
        if (gc) gc.textContent = "(" + gn + "/" + BIZCARD_MAX_GALLERY + ")";
        if (vc) vc.textContent = "(" + vn + "/" + BIZCARD_MAX_VIDEOS + ")";
    }

    function setBizcardTabProgress(activeTab) {
        var bar = byId("bcTabProgress");
        if (!bar || !activeTab) return;
        var tabs = document.querySelectorAll("#page-bizcard .bc-tab[data-bc-tab]");
        var idx = 0;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] === activeTab) {
                idx = i;
                break;
            }
        }
        bar.style.width = String((100 / Math.max(tabs.length, 1)) * (idx + 1)) + "%";
    }

    function formatBizcardLevelDisplay(u) {
        if (!u) return "—";
        var n = u.level;
        if (n != null && n !== "" && Number.isFinite(Number(n)) && Number(n) >= 0) {
            return t("bizcard.levelBadge").split("{{n}}").join(String(Number(n)));
        }
        var raw = u.levelLabel != null ? String(u.levelLabel).trim() : "";
        return raw || "—";
    }

    function paintBizcardSurface(root, data, u, refUrl, ids) {
        if (!root || !ids) return;
        var theme = data.theme || "light";
        var col = normalizeHexColor(data.primaryColor) || "#5ff0b0";
        root.classList.remove("bcard--theme-light", "bcard--theme-dark", "bcard--theme-gradient", "bcard--theme-corporate");
        root.classList.add("bcard--theme-" + theme);
        root.style.setProperty("--bc-accent", col);
        if (data.bgUrl && /^https?:\/\//i.test(data.bgUrl)) {
            var safe = data.bgUrl.replace(/"/g, "").replace(/'/g, "");
            root.style.backgroundImage =
                "linear-gradient(160deg,rgba(0,0,0,.52),rgba(0,0,0,.38)), url('" + safe + "')";
            root.style.backgroundSize = "cover";
            root.style.backgroundPosition = "center";
        } else {
            root.style.backgroundImage = "";
            root.style.backgroundSize = "";
            root.style.backgroundPosition = "";
        }

        var fn = (data.fullName || (u && u.fullName) || "").trim() || "—";
        var pos = (data.position || "").trim();
        var handle = u ? formatUserHandle(u) : "—";
        var phone = (data.phone || "").trim();
        var slogan = (data.slogan || "").trim();

        var nameEl = byId(ids.nameId);
        if (nameEl) nameEl.textContent = fn;
        var posEl = byId(ids.positionId);
        if (posEl) {
            posEl.textContent = pos;
            posEl.style.display = pos ? "block" : "none";
        }
        var userEl = byId(ids.usernameId);
        if (userEl) userEl.textContent = handle;
        var sgEl = byId(ids.sloganId);
        if (sgEl) {
            sgEl.textContent = slogan;
            sgEl.style.display = slogan ? "block" : "none";
        }
        var phEl = byId(ids.phoneId);
        if (phEl) {
            phEl.textContent = phone;
            phEl.style.display = phone ? "block" : "none";
        }

        var photoEl = byId(ids.photoId);
        var photoPh = ids.photoPhId ? byId(ids.photoPhId) : null;
        var initial = (fn && fn !== "—" ? fn : "TY").replace(/\s+/g, " ").trim();
        var letter = initial.charAt(0).toUpperCase() || "T";
        if (photoEl) {
            if (data.photoUrl && /^https?:\/\//i.test(data.photoUrl)) {
                photoEl.onload = function () {
                    if (photoPh) photoPh.hidden = true;
                };
                photoEl.src = data.photoUrl;
                photoEl.hidden = false;
                photoEl.onerror = function () {
                    photoEl.hidden = true;
                    if (photoPh) {
                        photoPh.hidden = false;
                        photoPh.textContent = letter;
                    }
                };
                if (photoPh) photoPh.hidden = true;
            } else {
                photoEl.removeAttribute("src");
                photoEl.hidden = true;
                if (photoPh) {
                    photoPh.hidden = false;
                    photoPh.textContent = letter;
                }
            }
        } else if (photoPh) {
            photoPh.hidden = false;
            photoPh.textContent = letter;
        }

        var inc = byId(ids.incomeId);
        var tm = byId(ids.teamId);
        var lv = byId(ids.levelId);
        if (u) {
            if (inc) inc.textContent = formatMoneyAmount(u.balance);
            if (tm) tm.textContent = formatIntegerGrouped(u.teamTotal != null ? u.teamTotal : 0);
            if (lv) lv.textContent = formatBizcardLevelDisplay(u);
        } else {
            if (inc) inc.textContent = formatMoneyAmount(0);
            if (tm) tm.textContent = formatIntegerGrouped(0);
            if (lv) lv.textContent = "—";
        }

        var refEl = byId(ids.refId);
        if (refEl) refEl.textContent = refUrl ? refUrl.replace(/^https?:\/\//i, "") : "—";

        var linksBox = byId(ids.linksId);
        if (linksBox) {
            linksBox.innerHTML = "";
            var links = buildBizcardLinkChips(data);
            links.forEach(function (L) {
                var a = document.createElement("a");
                a.className = "bc-chip";
                a.href = L.href;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = L.label;
                a.addEventListener("click", function (ev) {
                    try {
                        if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === "function") {
                            ev.preventDefault();
                            window.Telegram.WebApp.openLink(L.href);
                        }
                    } catch (e1) {}
                });
                linksBox.appendChild(a);
            });
            if (data.musicUrl && /^https?:\/\//i.test(data.musicUrl)) {
                var m = document.createElement("span");
                m.className = "bc-chip";
                m.textContent = "♪ MP3";
                m.title = data.musicUrl;
                linksBox.appendChild(m);
            }
        }
    }

    function buildBizcardLinkChips(data) {
        var out = [];
        var tg = String(data.telegram || "").replace(/^@+/, "").trim();
        if (tg) out.push({ label: "Telegram", href: "https://t.me/" + encodeURIComponent(tg) });
        var wa = digitsOnlyPhone(data.whatsapp);
        if (wa) out.push({ label: "WhatsApp", href: "https://wa.me/" + wa });
        var vb = digitsOnlyPhone(data.viber);
        if (vb) out.push({ label: "Viber", href: "viber://chat?number=%2B" + vb });
        var im = digitsOnlyPhone(data.imo);
        if (im) out.push({ label: "imo", href: "https://imo.im/r?phone=" + im });
        if (data.vk && /^https?:\/\//i.test(data.vk)) out.push({ label: "VK", href: data.vk });
        else if (data.vk) out.push({ label: "VK", href: "https://vk.com/" + encodeURIComponent(String(data.vk).replace(/^\//, "")) });
        var ig = String(data.instagram || "").replace(/^@/, "").trim();
        if (ig) {
            if (/^https?:\/\//i.test(ig)) out.push({ label: "Instagram", href: ig });
            else out.push({ label: "Instagram", href: "https://instagram.com/" + encodeURIComponent(ig) });
        }
        if (data.youtube && /^https?:\/\//i.test(data.youtube)) out.push({ label: "YouTube", href: data.youtube });
        if (data.facebook && /^https?:\/\//i.test(data.facebook)) out.push({ label: "Facebook", href: data.facebook });
        if (data.rutube && /^https?:\/\//i.test(data.rutube)) out.push({ label: "Rutube", href: data.rutube });
        (data.videos || []).forEach(function (v, i) {
            if (v && /^https?:\/\//i.test(v)) out.push({ label: "Video " + (i + 1), href: v });
        });
        return out;
    }

    function getBizcardMergedForPaint(u) {
        var refUrl = "";
        if (u) refUrl = (u.refUrl && String(u.refUrl).trim()) || refUrlFromRefCode(u.refCode) || "";
        var base = Object.assign(defaultBizcardData(), loadBizcardStorage());
        var fromForm = collectBizcardFromForm();
        var data = Object.assign(base, fromForm);
        if (u) {
            if (!data.fullName && u.fullName) data.fullName = u.fullName;
        }
        return { data: data, refUrl: refUrl };
    }

    function paintBizcardLive(u) {
        var M = getBizcardMergedForPaint(u);
        var live = byId("bcardLive");
        paintBizcardSurface(live, M.data, u, M.refUrl, {
            nameId: "bcName",
            positionId: "bcPositionLine",
            usernameId: "bcUsername",
            sloganId: "bcSloganLine",
            phoneId: "bcPhoneLine",
            photoId: "bcLivePhoto",
            photoPhId: "bcLivePhotoPh",
            linksId: "bcLinksRow",
            refId: "bcRefSpan",
            incomeId: "bcIncomeVal",
            teamId: "bcTeamVal",
            levelId: "bcLevelVal"
        });
    }

    function openBizcardPreviewModal(u) {
        var modal = byId("bcPreviewModal");
        if (!modal) return;
        var M = getBizcardMergedForPaint(u || (dashboardData && dashboardData.user));
        var du = u || (dashboardData && dashboardData.user);
        var root = byId("bcardPreview");
        paintBizcardSurface(root, M.data, du, M.refUrl, {
            nameId: "bcPreviewName",
            positionId: "bcPreviewPosition",
            usernameId: "bcPreviewUsername",
            sloganId: "bcPreviewSlogan",
            phoneId: "bcPreviewPhone",
            photoId: "bcPreviewPhoto",
            photoPhId: "bcPreviewPhotoPh",
            linksId: "bcPreviewLinks",
            refId: "bcPreviewRef",
            incomeId: "bcPreviewIncome",
            teamId: "bcPreviewTeam",
            levelId: "bcPreviewLevel"
        });
        modal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeBizcardPreviewModal() {
        var modal = byId("bcPreviewModal");
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    function initBizcardColorPresets() {
        var box = byId("bcColorPresets");
        if (!box || box.dataset.bound === "1") return;
        box.dataset.bound = "1";
        BIZCARD_COLOR_PRESETS.forEach(function (hex) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "bc-color-dot";
            b.style.background = hex;
            b.addEventListener("click", function () {
                var pc = byId("bcPrimaryColor");
                var pk = byId("bcColorPicker");
                if (pc) pc.value = hex;
                if (pk) pk.value = hex;
                paintBizcardLive(dashboardData && dashboardData.user);
            });
            box.appendChild(b);
        });
    }

    function applyBizcardTabSelection(tab) {
        if (!tab) return;
        var id = tab.getAttribute("data-bc-tab");
        document.querySelectorAll("#page-bizcard .bc-tab[data-bc-tab]").forEach(function (t) {
            var on = t === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
        });
        document.querySelectorAll("#page-bizcard .bc-panel[data-panel]").forEach(function (p) {
            p.classList.toggle("is-active", p.getAttribute("data-panel") === id);
        });
        setBizcardTabProgress(tab);
        var strip = document.querySelector("#page-bizcard .bc-tabs-scroll");
        if (strip && tab) {
            try {
                tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            } catch (eScroll) {
                try {
                    tab.scrollIntoView(false);
                } catch (e2) {}
            }
        }
    }

    function getBizcardTabsInOrder() {
        return Array.prototype.slice.call(document.querySelectorAll("#page-bizcard .bc-tab[data-bc-tab]"));
    }

    function getActiveBizcardTabIndex() {
        var tabs = getBizcardTabsInOrder();
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].classList.contains("active")) return i;
        }
        return 0;
    }

    function initBizcardPanelSwipe() {
        var stack = document.querySelector("#page-bizcard .bc-panel-stack");
        if (!stack || stack.dataset.swipeBound === "1") return;
        stack.dataset.swipeBound = "1";
        var x0 = 0;
        var y0 = 0;
        var t0 = 0;
        var swipeArmed = false;

        function swipeTargetOk(el) {
            if (!el || !el.closest) return false;
            return !el.closest("input, textarea, select, button, a, label, .bc-url-remove, .bc-add-dashed, .bc-theme-btn, .bc-color-dot, .bc-tool-btn");
        }

        stack.addEventListener(
            "touchstart",
            function (ev) {
                swipeArmed = false;
                if (ev.touches.length !== 1) return;
                if (!swipeTargetOk(ev.target)) return;
                swipeArmed = true;
                x0 = ev.touches[0].clientX;
                y0 = ev.touches[0].clientY;
                t0 = Date.now();
            },
            { passive: true }
        );

        stack.addEventListener(
            "touchend",
            function (ev) {
                if (!swipeArmed) return;
                swipeArmed = false;
                if (!ev.changedTouches.length) return;
                var x1 = ev.changedTouches[0].clientX;
                var y1 = ev.changedTouches[0].clientY;
                var dt = Date.now() - t0;
                var dx = x1 - x0;
                var dy = y1 - y0;
                if (dt > 850) return;
                if (Math.abs(dx) < 52) return;
                if (Math.abs(dx) < Math.abs(dy) * 1.12) return;
                var tabs = getBizcardTabsInOrder();
                if (!tabs.length) return;
                var idx = getActiveBizcardTabIndex();
                var next;
                if (dx < 0) next = Math.min(idx + 1, tabs.length - 1);
                else next = Math.max(idx - 1, 0);
                if (next !== idx) applyBizcardTabSelection(tabs[next]);
            },
            { passive: true }
        );

        var wheelAccum = 0;
        var wheelTimer = null;
        stack.addEventListener(
            "wheel",
            function (ev) {
                if (Math.abs(ev.deltaX) < Math.abs(ev.deltaY)) return;
                if (Math.abs(ev.deltaX) < 6) return;
                ev.preventDefault();
                wheelAccum += ev.deltaX;
                if (wheelTimer) window.clearTimeout(wheelTimer);
                wheelTimer = window.setTimeout(function () {
                    wheelAccum = 0;
                }, 280);
                if (Math.abs(wheelAccum) < 28) return;
                var tabs = getBizcardTabsInOrder();
                if (!tabs.length) return;
                var idx = getActiveBizcardTabIndex();
                var next = wheelAccum > 0 ? Math.min(idx + 1, tabs.length - 1) : Math.max(idx - 1, 0);
                wheelAccum = 0;
                if (next !== idx) applyBizcardTabSelection(tabs[next]);
            },
            { passive: false }
        );
    }

    function initBizcardEditor() {
        if (byId("bcPanel-basic") && byId("bcPanel-basic").dataset.inited === "1") return;
        var first = byId("bcPanel-basic");
        if (first) first.dataset.inited = "1";

        applyBizcardToForm(loadBizcardStorage());

        document.querySelectorAll("#page-bizcard .bc-tab[data-bc-tab]").forEach(function (tab) {
            tab.addEventListener("click", function () {
                applyBizcardTabSelection(tab);
            });
        });

        initBizcardPanelSwipe();

        var saveBtn = byId("bizcardSaveBtn");
        if (saveBtn) {
            saveBtn.addEventListener("click", function () {
                var d = collectBizcardFromForm();
                if (!d.fullName) {
                    showToast(t("bizcard.toast.fullName"));
                    document.querySelectorAll(".bc-tab[data-bc-tab]").forEach(function (t) {
                        if (t.getAttribute("data-bc-tab") === "basic") t.click();
                    });
                    return;
                }
                saveBizcardStorage(d);
                paintBizcardLive(dashboardData && dashboardData.user);
                saveBtn.disabled = true;
                saveBizcardToServer(d)
                    .then(function (ok) {
                        showToast(ok ? t("bizcard.toast.savedSync") : t("bizcard.toast.savedLocal"));
                        if (ok && dashboardData) dashboardData.bizcard = d;
                    })
                    .finally(function () {
                        saveBtn.disabled = false;
                    });
            });
        }

        var prevBtn = byId("bcPreviewOpenBtn");
        if (prevBtn) prevBtn.addEventListener("click", function () {
            openBizcardPreviewModal(dashboardData && dashboardData.user);
        });
        var bd = byId("bcPreviewBackdrop");
        var cls = byId("bcPreviewCloseBtn");
        if (bd) bd.addEventListener("click", closeBizcardPreviewModal);
        if (cls) cls.addEventListener("click", closeBizcardPreviewModal);

        var gAdd = byId("bcGalleryAdd");
        if (gAdd) {
            gAdd.addEventListener("click", function () {
                var gl = byId("bcGalleryList");
                if (!gl || gl.querySelectorAll(".bc-url-row").length >= BIZCARD_MAX_GALLERY) return;
                bizcardAppendUrlRow(gl, "", "https://…");
                updateBizcardGalleryVideoCounts();
            });
        }
        var vAdd = byId("bcVideoAdd");
        if (vAdd) {
            vAdd.addEventListener("click", function () {
                var vl = byId("bcVideoList");
                if (!vl || vl.querySelectorAll(".bc-url-row").length >= BIZCARD_MAX_VIDEOS) return;
                bizcardAppendUrlRow(vl, "", "https://…");
                updateBizcardGalleryVideoCounts();
            });
        }

        document.querySelectorAll(".bc-theme-btn[data-bc-theme]").forEach(function (b) {
            b.addEventListener("click", function () {
                document.querySelectorAll(".bc-theme-btn").forEach(function (x) {
                    x.classList.toggle("active", x === b);
                });
                paintBizcardLive(dashboardData && dashboardData.user);
            });
        });

        var pk = byId("bcColorPicker");
        var pc = byId("bcPrimaryColor");
        function syncColorFromPicker() {
            if (pk && pc) pc.value = pk.value;
            paintBizcardLive(dashboardData && dashboardData.user);
        }
        if (pk) pk.addEventListener("input", syncColorFromPicker);
        if (pc) {
            pc.addEventListener("input", function () {
                var h = normalizeHexColor(pc.value);
                if (h && pk) pk.value = h;
                paintBizcardLive(dashboardData && dashboardData.user);
            });
        }

        ["bcSlogan", "bcAbout"].forEach(function (id) {
            var el = byId(id);
            if (el) el.addEventListener("input", updateBizcardCharCounts);
        });

        [
            "bcCardTitle",
            "bcFullName",
            "bcPosition",
            "bcPhone",
            "bcSlogan",
            "bcAbout",
            "bcRegText",
            "bcTg",
            "bcWa",
            "bcViber",
            "bcImo",
            "bcVk",
            "bcInsta",
            "bcYt",
            "bcFb",
            "bcRutube",
            "bcPhotoUrl",
            "bcBgUrl",
            "bcMusicUrl"
        ].forEach(function (id) {
            var el = byId(id);
            if (el) {
                el.addEventListener("change", function () {
                    paintBizcardLive(dashboardData && dashboardData.user);
                });
                el.addEventListener("blur", function () {
                    paintBizcardLive(dashboardData && dashboardData.user);
                });
            }
        });

        document.addEventListener("input", function (e) {
            if (e.target && e.target.classList && e.target.classList.contains("bc-url-input")) {
                paintBizcardLive(dashboardData && dashboardData.user);
            }
        });

        initBizcardColorPresets();
        var active = document.querySelector('.bc-tab.active[data-bc-tab]');
        setBizcardTabProgress(active);
        updateBizcardCharCounts();
        updateBizcardGalleryVideoCounts();
        paintBizcardLive(dashboardData && dashboardData.user);
    }

    var APP_LINK_FALLBACK = {
        referralBot: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        channel: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        chat: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        training: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        topPartners: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        agreement: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        ethics: "https://t.me/toza_yurakli_saxiy_qollar_bot",
        presentationFile: "",
        marketingImage: "images/marketing-plan.png"
    };

    function getAppLink(key) {
        var L = typeof window.__APP_LINKS__ === "object" && window.__APP_LINKS__ ? window.__APP_LINKS__ : {};
        if (L[key] != null && String(L[key]).trim() !== "") {
            return String(L[key]).trim();
        }
        return APP_LINK_FALLBACK[key] ? String(APP_LINK_FALLBACK[key]).trim() : "";
    }

    function getReferralBotStartBase() {
        var raw = getAppLink("referralBot") || getAppLink("channel") || getAppLink("chat");
        if (!raw) return "https://t.me/toza_yurakli_saxiy_qollar_bot";
        var base = raw.split("?")[0].replace(/\/$/, "");
        if (!/^https:\/\/t\.me\//i.test(base)) return "https://t.me/toza_yurakli_saxiy_qollar_bot";
        return base;
    }

    function refUrlFromRefCode(refCode) {
        var code = refCode != null ? String(refCode).trim() : "";
        if (!code) return "";
        return getReferralBotStartBase() + "?start=" + encodeURIComponent(code);
    }

    function openExternalUrl(url) {
        var u = String(url || "").trim();
        if (!u || !/^https?:\/\//i.test(u)) {
            showToast(t("toast.noLink"));
            return;
        }
        try {
            if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === "function") {
                window.Telegram.WebApp.openLink(u);
                return;
            }
        } catch (e1) {}
        try {
            window.open(u, "_blank", "noopener,noreferrer");
        } catch (e2) {
            window.location.href = u;
        }
    }

    function setSyncBanner(visible, message) {
        var b = byId("appSyncBanner");
        var m = byId("appSyncBannerMsg");
        if (!b) return;
        b.hidden = !visible;
        if (m && message) m.textContent = message;
        document.body.classList.toggle("app-offline", Boolean(visible));
    }

    function refreshSyncBannerChrome() {
        var btn = byId("appSyncRetryBtn");
        if (btn) btn.textContent = t("sync.retry");
    }

    function applyNotifPreference() {
        var on = true;
        try {
            on = window.localStorage.getItem(NOTIF_STORAGE_KEY) !== "0";
        } catch (e) {}
        var sub = byId("notifSub");
        var row = byId("notifRow");
        if (sub) sub.textContent = on ? t("settings.notificationsOn") : t("settings.notificationsOff");
        if (row) row.setAttribute("aria-pressed", on ? "true" : "false");
    }

    function toggleNotifPreference() {
        var on = true;
        try {
            on = window.localStorage.getItem(NOTIF_STORAGE_KEY) !== "0";
        } catch (e) {}
        try {
            window.localStorage.setItem(NOTIF_STORAGE_KEY, on ? "0" : "1");
        } catch (e2) {}
        applyNotifPreference();
        showToast(t("toast.updated"));
    }

    function txTypeLabel(type) {
        var ty = String(type || "");
        var map = { referral: "referral", team: "team", bonus: "bonuses" };
        var opt = map[ty] || ty;
        return t("finances.filters.typeOptions." + opt);
    }

    function txStatusLabel(status) {
        var st = String(status || "");
        return t("finances.filters.statusOptions." + st) || st;
    }

    async function bootstrapSessionToken() {
        var r = await fetch(apiUrl("/api/auth/bootstrap"), {
            method: "POST",
            headers: { Accept: "application/json" }
        });
        var j = await responseJsonSafe(r);
        if (r.status === 403 && j.error === "bootstrap_disabled") {
            var errBd = new Error("bootstrap_disabled");
            errBd.code = "bootstrap_disabled";
            throw errBd;
        }
        if (!r.ok) throw new Error("bootstrap_http");
        if (!j.ok || !j.token) throw new Error("bootstrap_bad");
        sessionToken = j.token;
        try {
            window.localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
        } catch (e) {}
        return sessionToken;
    }

    async function exchangeTelegramInitData(initData) {
        var r = await fetch(apiUrl("/api/auth/telegram"), {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ initData: initData })
        });
        var j = await responseJsonSafe(r);
        if (r.status === 503 && j.error === "bot_not_configured") {
            console.warn("Server: TELEGRAM_BOT_TOKEN — /api/auth/telegram o‘chiq, bootstrap ishlatiladi.");
            return bootstrapSessionToken();
        }
        if (!r.ok || !j.ok || !j.token) {
            throw new Error(j.error || "telegram_auth_failed");
        }
        sessionToken = j.token;
        try {
            window.localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
        } catch (e) {}
        return sessionToken;
    }

    async function ensureSessionToken() {
        var tw = window.Telegram && window.Telegram.WebApp;
        if (tw && typeof tw.initData === "string" && tw.initData.length > 0) {
            if (tw.initData !== lastTelegramInitDataExchanged) {
                await exchangeTelegramInitData(tw.initData);
                lastTelegramInitDataExchanged = tw.initData;
            }
            return sessionToken;
        }
        if (sessionToken) return sessionToken;
        try {
            var s = window.localStorage.getItem(SESSION_STORAGE_KEY);
            if (s) {
                sessionToken = s;
                return sessionToken;
            }
        } catch (e) {}
        return bootstrapSessionToken();
    }

    function clearSessionToken() {
        sessionToken = null;
        lastTelegramInitDataExchanged = "";
        try {
            window.localStorage.removeItem(SESSION_STORAGE_KEY);
        } catch (e) {}
    }

    /**
     * Telegramda statik hostingda /api bo‘lmasa: zaxira API (query ty_api, meta, api-config.json).
     */
    function warnApiMixedContent() {
        try {
            if (typeof location === "undefined" || location.protocol !== "https:") return;
            if (isApiRelativeMode()) return;
            var b = getApiBase();
            if (!b || !/^http:\/\//i.test(b)) return;
            console.warn(
                "[Toza Yurak] Sahifa HTTPS, API esa HTTP — Telegram Mini App yoki brauzer so‘rovlarni bloklashi mumkin. API ni HTTPS ga o‘rnating (masalan Render) yoki Netlify /api proksisi."
            );
        } catch (eW) {}
    }

    async function probeAndApplyApiFallback() {
        function trimFb(s) {
            if (s == null || typeof s !== "string") return "";
            return s.replace(/\/$/, "").trim();
        }
        function normalizeApiRoot(s) {
            var b = trimFb(s);
            b = b.replace(/\/?api$/i, "").replace(/\/$/, "").trim();
            if (!b || /replace/i.test(b)) return "";
            return b;
        }
        function apiBaseFromQuery() {
            try {
                var p = new URLSearchParams(location.search || "");
                var v = p.get("ty_api") || p.get("tyApi") || p.get("api_base") || p.get("apiBase");
                if (!v) return "";
                v = String(v).trim();
                try {
                    return decodeURIComponent(v);
                } catch (eDec) {
                    return v;
                }
            } catch (eQ) {
                return "";
            }
        }
        async function loadApiConfigFromOrigin() {
            try {
                var o = typeof location !== "undefined" && location.origin ? location.origin : "";
                if (!o || o === "null" || !/^https?:/i.test(o)) return "";
                var r = await fetch(trimFb(o) + "/api-config.json", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "same-origin"
                });
                if (!r.ok) return "";
                var j = await r.json();
                return j && j.apiBase != null ? String(j.apiBase) : "";
            } catch (eJ) {
                return "";
            }
        }
        function applyAbsoluteBase(fallback) {
            var absHealth = fallback + "/api/health";
            window.__API_RELATIVE__ = false;
            window.__API_BASE__ = fallback;
            window.__RECEIPT_API__ = fallback + "/api/receipts";
            try {
                if (window.__BACKEND_API__ && typeof window.__BACKEND_API__ === "object") {
                    window.__BACKEND_API__.relative = false;
                    window.__BACKEND_API__.base = fallback;
                    window.__BACKEND_API__.health = absHealth;
                    window.__BACKEND_API__.authTelegram = fallback + "/api/auth/telegram";
                    window.__BACKEND_API__.authBootstrap = fallback + "/api/auth/bootstrap";
                    window.__BACKEND_API__.dashboard = fallback + "/api/dashboard";
                    window.__BACKEND_API__.transactions = fallback + "/api/transactions";
                    window.__BACKEND_API__.receipts = fallback + "/api/receipts";
                }
            } catch (eBk) {}
            clearSessionToken();
            try {
                var u = new URL(location.href);
                u.searchParams.delete("ty_api");
                u.searchParams.delete("tyApi");
                u.searchParams.delete("api_base");
                u.searchParams.delete("apiBase");
                u.searchParams.delete("api");
                history.replaceState({}, "", u.pathname + u.search + u.hash);
            } catch (eH) {}
            try {
                console.info("TY API: zaxira backend:", fallback);
            } catch (eL) {}
        }
        async function ping(url, signal) {
            var r = await fetch(url, { method: "GET", cache: "no-store", signal: signal });
            if (!r.ok) return false;
            var j = {};
            try {
                j = await r.json();
            } catch (eJ) {
                return false;
            }
            return j && j.ok === true;
        }

        var probeMs = apiProbeTimeoutMs();
        try {
            if (isApiRelativeMode()) {
                var ctrl1 = new AbortController();
                var t1 = setTimeout(function () {
                    try {
                        ctrl1.abort();
                    } catch (e1) {}
                }, probeMs);
                var relOk = false;
                try {
                    relOk = await ping(apiUrl("/api/health"), ctrl1.signal);
                } catch (eRel) {
                    relOk = false;
                }
                clearTimeout(t1);
                if (relOk) return;
            } else {
                var ctrl0 = new AbortController();
                var t0 = setTimeout(function () {
                    try {
                        ctrl0.abort();
                    } catch (e0) {}
                }, probeMs);
                var explicitOk = false;
                try {
                    explicitOk = await ping(apiUrl("/api/health"), ctrl0.signal);
                } catch (eEx) {
                    explicitOk = false;
                }
                clearTimeout(t0);
                if (explicitOk) return;
            }

            var fromJson = "";
            try {
                fromJson = await loadApiConfigFromOrigin();
            } catch (eCfg) {}

            var fbMeta = document.querySelector('meta[name="ty-api-fallback"]');
            var presetFb = typeof window.__API_FALLBACK_BASE__ === "string" ? window.__API_FALLBACK_BASE__ : "";
            var candidates = [
                normalizeApiRoot(apiBaseFromQuery()),
                normalizeApiRoot(presetFb),
                normalizeApiRoot(fbMeta ? fbMeta.getAttribute("content") : ""),
                normalizeApiRoot(fromJson)
            ];

            var seen = Object.create(null);
            for (var i = 0; i < candidates.length; i++) {
                var fallback = candidates[i];
                if (!fallback || seen[fallback]) continue;
                if (isPublicWebHost() && isLoopbackApiUrl(fallback)) continue;
                seen[fallback] = true;

                var ctrl2 = new AbortController();
                var t2 = setTimeout(function () {
                    try {
                        ctrl2.abort();
                    } catch (e2) {}
                }, probeMs);
                var absOk = false;
                try {
                    absOk = await ping(fallback + "/api/health", ctrl2.signal);
                } catch (eAbs) {
                    absOk = false;
                }
                clearTimeout(t2);
                if (!absOk) continue;

                applyAbsoluteBase(fallback);
                return;
            }
        } catch (eOuter) {}
    }

    async function apiFetch(path, options, retried) {
        options = options || {};
        var token = await ensureSessionToken();
        var headers = Object.assign({}, options.headers || {});
        headers.Accept = headers.Accept || "application/json";
        headers.Authorization = "Bearer " + token;
        var res = await fetch(apiUrl(path), Object.assign({}, options, { headers: headers }));
        if (res.status === 401 && !retried) {
            clearSessionToken();
            var tww = window.Telegram && window.Telegram.WebApp;
            if (tww && typeof tww.initData === "string" && tww.initData.length > 0) {
                await exchangeTelegramInitData(tww.initData);
                lastTelegramInitDataExchanged = tww.initData;
            } else {
                await bootstrapSessionToken();
            }
            return apiFetch(path, options, true);
        }
        return res;
    }

    function renderTransactionList(rows) {
        var list = byId("finHistoryList");
        var empty = byId("finHistoryEmpty");
        if (!list || !empty) return;
        if (!rows || !rows.length) {
            list.hidden = true;
            empty.hidden = false;
            list.innerHTML = "";
            return;
        }
        empty.hidden = true;
        list.hidden = false;
        list.innerHTML = "";
        rows.forEach(function (row) {
            var item = document.createElement("div");
            item.className = "fin-tx-item";
            var top = document.createElement("div");
            top.className = "fin-tx-item-top";
            var left = document.createElement("span");
            left.className = "fin-tx-type";
            left.textContent = txTypeLabel(row.type);
            var amt = document.createElement("span");
            amt.className = "fin-tx-amt";
            amt.textContent = formatMoneyAmount(row.amount);
            top.appendChild(left);
            top.appendChild(amt);
            var desc = document.createElement("div");
            desc.className = "fin-tx-desc";
            desc.textContent = row.description || "";
            var meta = document.createElement("div");
            meta.className = "fin-tx-meta";
            meta.textContent = (row.created_at || "") + " · " + txStatusLabel(row.status);
            item.appendChild(top);
            if (desc.textContent) item.appendChild(desc);
            item.appendChild(meta);
            list.appendChild(item);
        });
    }

    function applyStructurePanels(inStructure) {
        var err = byId("structurePanelErr");
        var ok = byId("structurePanelOk");
        if (!err || !ok) return;
        if (inStructure) {
            err.hidden = true;
            ok.hidden = false;
        } else {
            err.hidden = false;
            ok.hidden = true;
        }
    }

    function applyDashboard(d) {
        if (!d || !d.user) return;
        var u = d.user;
        var fs = d.financeSummary || {};
        var p = d.partners || {};

        var hb = byId("homeBalanceAmount");
        if (hb) hb.textContent = formatMoneyAmount(u.balance);
        var fo = byId("finOverallAmount");
        if (fo) fo.textContent = formatMoneyAmount(fs.total);
        var ft = byId("finToday");
        if (ft) ft.textContent = formatMoneyAmount(fs.today);
        var fm = byId("finMonth");
        if (fm) fm.textContent = formatMoneyAmount(fs.month);
        var fop = byId("finOps");
        if (fop) fop.textContent = String(fs.operationsCount != null ? fs.operationsCount : 0);
        var fav = byId("finAvg");
        if (fav) fav.textContent = formatMoneyAmount(fs.average);

        var hv = byId("homeTeamVal");
        if (hv) hv.textContent = String(u.teamTotal != null ? u.teamTotal : 0);
        var h1 = byId("homeDirectRefsSub");
        if (h1) {
            h1.textContent = t("home.teamSize.directRefs").replace(/:\s*\d+/, ": " + (u.directRefs != null ? u.directRefs : 0));
        }
        var h2 = byId("homeActiveMktSub");
        if (h2) {
            h2.textContent = t("home.teamSize.activeMarketing").replace(/:\s*\d+/, ": " + (u.activeMarketing != null ? u.activeMarketing : 0));
        }

        var hsl = byId("homeLevelSubtitle");
        if (hsl) hsl.textContent = u.levelSubtitle || "—";
        var hlv = byId("homeLevelVal");
        if (hlv) hlv.textContent = u.levelLabel || "—";
        var hlm = byId("homeLevelMeta");
        if (hlm) hlm.textContent = u.levelMeta || "—";

        var hj = byId("homeJoinedAt");
        if (hj) hj.textContent = formatJoinedDate(u.joinedAt);

        var hn = byId("homeProfileName");
        if (hn) hn.textContent = u.fullName || "—";
        var hu = byId("homeProfileUsername");
        if (hu) hu.textContent = formatUserHandle(u);

        var hr = byId("homeReferrerLine");
        if (hr) {
            if (u.referrer && (u.referrer.fullName || u.referrer.username || u.referrer.refCode)) {
                var rn = u.referrer.fullName || (u.referrer.username ? "@" + String(u.referrer.username).replace(/^@/, "") : "") || u.referrer.refCode;
                hr.textContent = t("home.invitedBy").split("{{name}}").join(rn);
                hr.style.display = "";
            } else {
                hr.textContent = "";
                hr.style.display = "none";
            }
        }

        var refUrl = (u.refUrl && String(u.refUrl).trim()) || refUrlFromRefCode(u.refCode) || "";
        var rt = byId("refText");
        if (rt) rt.textContent = refUrl || "—";
        var pr = byId("partnersRefBox");
        if (pr) pr.textContent = refUrl || "—";

        applyUserPillDisplay(u);

        var smn = byId("smUserName");
        if (smn) smn.textContent = u.fullName || "—";
        var smh = byId("smUserHandle");
        if (smh) smh.textContent = formatUserHandle(u);
        var smi = byId("smIncomeVal");
        if (smi) smi.textContent = formatMoneyAmount(u.balance);
        var smtv = byId("smTeamVal");
        if (smtv) smtv.textContent = String(u.teamTotal != null ? u.teamTotal : 0);

        var spn = byId("settingsProfileName");
        if (spn) spn.textContent = u.fullName || "—";
        var spu = byId("settingsProfileUsername");
        if (spu) spu.textContent = formatUserHandle(u);
        var psi = byId("settingsPsIncome");
        if (psi) psi.textContent = formatMoneyAmount(u.balance);
        var pst = byId("settingsPsTeam");
        if (pst) pst.textContent = String(u.teamTotal != null ? u.teamTotal : 0);

        var biz = d.bizcard;
        if (biz && typeof biz === "object" && !Array.isArray(biz) && Object.keys(biz).length > 0) {
            var mergedCard = Object.assign(defaultBizcardData(), loadBizcardStorage(), biz);
            saveBizcardStorage(mergedCard);
            if (byId("bcPanel-basic") && byId("bcPanel-basic").dataset.inited === "1") {
                applyBizcardToForm(mergedCard);
            }
        }

        paintBizcardLive(u);

        var ptt = byId("partnersTeamTitle");
        if (ptt) ptt.textContent = t("partners.myTeam") + ": " + (p.teamLeadName || u.fullName || "");

        var pdc = byId("partnersDirectCountLine");
        if (pdc) {
            var nd = p.direct != null ? p.direct : u.directRefs;
            pdc.textContent = t("partners.directCount").replace(/\d+/, String(nd != null ? nd : 0));
        }

        var psd = byId("partnersStatDirect");
        if (psd) {
            psd.textContent = String(p.direct != null ? p.direct : u.directRefs != null ? u.directRefs : 0);
        }
        var psa = byId("partnersStatActive");
        if (psa) {
            psa.textContent = String(p.active != null ? p.active : u.activeMarketing != null ? u.activeMarketing : 0);
        }
        var pst2 = byId("partnersStatTeams");
        if (pst2) pst2.textContent = String(p.teams != null ? p.teams : 0);
        var psm = byId("partnersStatMkt");
        if (psm) psm.textContent = String(p.inMarketing != null ? p.inMarketing : 0);

        applyStructurePanels(Boolean(u.inMarketingStructure));

        renderTransactionList(d.transactions || []);
    }

    async function loadDashboard() {
        try {
            var res = await apiFetch("/api/dashboard");
            if (!res.ok) throw new Error("dash_http");
            var d = await responseJsonSafe(res);
            if (!d || !d.ok) throw new Error("dash_bad");
            dashboardData = d;
            applyDashboard(d);
            setSyncBanner(false);
        } catch (e) {
            console.warn("loadDashboard", e);
            var msg = t("sync.dataFail");
            if (e && (e.message === "bootstrap_disabled" || e.code === "bootstrap_disabled")) {
                msg = t("sync.bootstrapDisabled");
                setSyncBanner(true, msg);
                return;
            }
            try {
                var h = await fetch(apiUrl("/api/health"), { method: "GET", cache: "no-store" });
                if (!h.ok) {
                    msg = t("sync.offline");
                } else {
                    var hj = {};
                    try {
                        hj = await h.json();
                    } catch (eJ) {}
                    if (hj && hj.ok) {
                        msg = t("sync.authFail");
                    } else {
                        msg = t("sync.offline");
                    }
                }
            } catch (e2) {
                msg = t("sync.offline");
            }
            setSyncBanner(true, msg);
        }
    }

    async function applyFinanceFilters() {
        var typeEl = byId("finFilterType");
        var stEl = byId("finFilterStatus");
        var fr = byId("finFilterFrom");
        var to = byId("finFilterTo");
        var q = [];
        if (typeEl && typeEl.value && typeEl.value !== "all") q.push("type=" + encodeURIComponent(typeEl.value));
        if (stEl && stEl.value && stEl.value !== "all") q.push("status=" + encodeURIComponent(stEl.value));
        if (fr && fr.value) q.push("from=" + encodeURIComponent(fr.value));
        if (to && to.value) q.push("to=" + encodeURIComponent(to.value));
        var url = "/api/transactions" + (q.length ? "?" + q.join("&") : "");
        try {
            var res = await apiFetch(url);
            if (!res.ok) throw new Error("tx");
            var j = await responseJsonSafe(res);
            if (!j || !j.ok) throw new Error("tx");
            renderTransactionList(j.transactions || []);
        } catch (e) {
            console.warn(e);
            showToast(t("finances.loadError"));
        }
    }

    function resetFinanceFilters() {
        var typeEl = byId("finFilterType");
        var stEl = byId("finFilterStatus");
        var fr = byId("finFilterFrom");
        var to = byId("finFilterTo");
        if (typeEl) typeEl.value = "all";
        if (stEl) stEl.value = "all";
        if (fr) fr.value = "";
        if (to) to.value = "";
        if (dashboardData) renderTransactionList(dashboardData.transactions || []);
    }

    function isKnownLanguage(language) {
        return Object.prototype.hasOwnProperty.call(I18N, language);
    }

    function getLanguageOrDefault(language) {
        return isKnownLanguage(language) ? language : DEFAULT_LANGUAGE;
    }

    function t(key) {
        const activeDictionary = I18N[currentLanguage] || I18N[DEFAULT_LANGUAGE];
        if (activeDictionary && Object.prototype.hasOwnProperty.call(activeDictionary, key)) {
            return activeDictionary[key];
        }

        const fallbackDictionary = I18N[DEFAULT_LANGUAGE] || {};
        return fallbackDictionary[key] || key;
    }

    function applyTranslations() {
        document.querySelectorAll("[data-i18n]").forEach(function (node) {
            const key = node.getAttribute("data-i18n");
            if (!key) return;
            node.innerHTML = t(key);
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
            const key = node.getAttribute("data-i18n-placeholder");
            if (!key) return;
            node.placeholder = t(key);
        });

        document.querySelectorAll("[data-i18n-title]").forEach(function (node) {
            const key = node.getAttribute("data-i18n-title");
            if (!key) return;
            node.title = t(key);
        });

        document.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
            const key = node.getAttribute("data-i18n-aria");
            if (!key) return;
            node.setAttribute("aria-label", t(key));
        });

        document.querySelectorAll("[data-i18n-alt]").forEach(function (node) {
            const key = node.getAttribute("data-i18n-alt");
            if (!key) return;
            node.setAttribute("alt", t(key));
        });

        applyMarketingPosterSrc();
    }

    function applyMarketingPosterSrc() {
        var url = getAppLink("marketingImage");
        if (!url) return;
        var poster = byId("marketingPosterImg");
        var modalImg = byId("marketingModalImg");
        if (poster) poster.src = url;
        if (modalImg) modalImg.src = url;
    }

    function applyLanguage(language) {
        currentLanguage = getLanguageOrDefault(language);
        document.documentElement.lang = currentLanguage === "uz-cyrl" ? "uz-Cyrl" : currentLanguage;
        applyTranslations();

        const languageSelect = byId("languageSelect");
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }

        refreshSyncBannerChrome();
        applyNotifPreference();

        if (dashboardData) {
            applyDashboard(dashboardData);
        }
    }

    function loadSavedLanguage() {
        try {
            const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
            return getLanguageOrDefault(saved || DEFAULT_LANGUAGE);
        } catch (error) {
            console.warn("Language preference read failed:", error);
            return DEFAULT_LANGUAGE;
        }
    }

    function saveLanguage(language) {
        try {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (error) {
            console.warn("Language preference save failed:", error);
        }
    }

    function sanitizePageName(pageName) {
        const value = String(pageName || "").trim();
        if (!/^[a-z0-9-]+$/i.test(value)) {
            return "";
        }
        return value;
    }

    function setMenuState(isOpen) {
        const overlay = byId("overlay");
        const menu = byId("smenu");
        if (!overlay || !menu) return;

        menu.classList.toggle("open", Boolean(isOpen));
        overlay.classList.toggle("show", Boolean(isOpen));
    }

    function setModalState(id, isOpen) {
        const modal = byId(id);
        if (!modal) return;
        modal.classList.toggle("show", Boolean(isOpen));
    }

    async function copyTextSafe(text) {
        const safeText = String(text || "");
        if (!safeText) return false;

        if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(safeText);
                return true;
            } catch (error) {
                console.warn("Clipboard API failed, using fallback:", error);
            }
        }

        const helper = document.createElement("textarea");
        helper.value = safeText;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.top = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        helper.setSelectionRange(0, helper.value.length);

        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (error) {
            console.error("Fallback copy failed:", error);
            ok = false;
        }

        document.body.removeChild(helper);
        return ok;
    }

    var RECEIPT_MAX_FILE_BYTES = 5 * 1024 * 1024;
    var lastReceiptPlain = "";

    function getReceiptApiUrl() {
        if (window.__RECEIPT_API__ === false || window.__RECEIPT_API__ === "") {
            return "";
        }
        if (typeof window.__RECEIPT_API__ === "string" && window.__RECEIPT_API__.length > 0) {
            return window.__RECEIPT_API__;
        }
        return apiUrl("/api/receipts");
    }

    async function submitReceiptToServer(payload) {
        var url = getReceiptApiUrl();
        if (!url) {
            return { ok: false, error: "no_url" };
        }
        try {
            var token = await ensureSessionToken();
            var res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(payload)
            });
            var data = await responseJsonSafe(res);
            if (!res.ok) {
                return { ok: false, error: data.error || "http_" + res.status };
            }
            if (!data.ok || !data.id) {
                return { ok: false, error: "bad_response" };
            }
            return {
                ok: true,
                id: data.id,
                telegramSent: data.telegramSent === true,
                telegramPhotoSent: data.telegramPhotoSent === true
            };
        } catch (e) {
            console.warn("submitReceiptToServer", e);
            return { ok: false, error: "network" };
        }
    }

    async function saveBizcardToServer(data) {
        try {
            var res = await apiFetch("/api/user/bizcard", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: data })
            });
            var j = await responseJsonSafe(res);
            return Boolean(res.ok && j && j.ok);
        } catch (e) {
            console.warn("saveBizcardToServer", e);
            return false;
        }
    }

    function setReceiptButtonsBusy(busy) {
        var gen = byId("generateReceiptBtn");
        var q = byId("quickGenerateBtn");
        if (gen) gen.disabled = Boolean(busy);
        if (q) q.disabled = Boolean(busy);
    }

    function receiptCreateEl(tag, className, textContent) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (textContent !== undefined && textContent !== null) el.textContent = textContent;
        return el;
    }

    function parseAmountFromPageText(text) {
        var s = String(text || "").replace(/[^\d.,\-]/g, "").replace(",", ".");
        var n = parseFloat(s);
        return Number.isFinite(n) ? n : 0;
    }

    function formatReceiptMoney(amount) {
        var n = Number(amount);
        if (!Number.isFinite(n)) n = 0;
        return "$" + n.toFixed(2);
    }

    function getHomeBalanceAmount() {
        var el = byId("homeBalanceAmount");
        return el ? parseAmountFromPageText(el.textContent) : 0;
    }

    function getFinancesTopAmount() {
        var page = byId("page-finances");
        if (!page) return 0;
        var amt = page.querySelector(".fin-top .amount");
        return amt ? parseAmountFromPageText(amt.textContent) : 0;
    }

    function getDisplayBalance() {
        if (dashboardData && dashboardData.user != null) {
            var b = Number(dashboardData.user.balance);
            if (Number.isFinite(b)) return b;
        }
        var a = getHomeBalanceAmount();
        if (a > 0) return a;
        return getFinancesTopAmount();
    }

    function getSenderDisplayName() {
        if (dashboardData && dashboardData.user) {
            var fn = String(dashboardData.user.fullName || "").trim();
            if (fn) return fn;
        }
        var tg = getTelegramUnsafeUser();
        var m = tg ? pillModelFromTelegramUser(tg) : null;
        if (m && m.primary && m.primary !== "—") {
            return m.sub ? m.primary + " · " + m.sub : m.primary;
        }
        if (tg) {
            var n = [tg.first_name, tg.last_name]
                .filter(function (x) {
                    return x;
                })
                .join(" ")
                .trim();
            if (n) return n;
            if (tg.username) return "@" + String(tg.username).replace(/^@/, "");
            if (tg.id != null) return "ID " + tg.id;
        }
        var pill = byId("userPillName");
        if (pill) {
            var txt = (pill.innerText || pill.textContent || "").replace(/\s+/g, " ").trim();
            if (txt) return txt;
        }
        return "—";
    }

    function getReceiptLocaleTag() {
        if (currentLanguage === "ru") return "ru-RU";
        if (currentLanguage === "uz-cyrl") return "uz-Cyrl-UZ";
        return "uz-Latn-UZ";
    }

    function validateReceiptFile(file) {
        if (!file || file.size === 0) return null;
        if (!/^image\//.test(file.type)) return "fileType";
        if (file.size > RECEIPT_MAX_FILE_BYTES) return "fileSize";
        return null;
    }

    function readFileAsDataURL(file) {
        return new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.onerror = function () {
                reject(new Error("read"));
            };
            fr.readAsDataURL(file);
        });
    }

    function getReceiptIdLine() {
        var el = byId("receiptIdInput");
        var raw = el ? String(el.value || "").trim() : "";
        return "ID: " + (raw || "CONCORD");
    }

    function buildReceiptPlainText(opts) {
        var lines = [
            t("receipt.preview.title"),
            getReceiptIdLine(),
            "",
            t("receipt.preview.from") + ": " + opts.from,
            t("receipt.preview.date") + ": " + opts.dateStr,
            t("receipt.preview.amount") + ": " + formatReceiptMoney(opts.amount),
            t("receipt.preview.recipient") + ": " + opts.recipient
        ];
        if (opts.description) {
            lines.push(t("receipt.preview.desc") + ": " + opts.description);
        }
        if (opts.hasAttachment) {
            lines.push(t("receipt.preview.attach") + ": " + t("receipt.preview.attachYes"));
        }
        if (opts.serverId) {
            lines.push("");
            lines.push(t("receipt.preview.serverId") + ": " + opts.serverId);
        }
        return lines.join("\n");
    }

    function setReceiptResultVisible(hasContent) {
        var empty = byId("receiptResultEmpty");
        var body = byId("receiptResultBody");
        if (!empty || !body) return;
        empty.hidden = Boolean(hasContent);
        body.hidden = !hasContent;
        if (!hasContent) {
            body.innerHTML = "";
            lastReceiptPlain = "";
        }
    }

    function receiptPreviewAddRow(dl, label, value, ddClass) {
        dl.appendChild(receiptCreateEl("dt", null, label));
        var dd = document.createElement("dd");
        if (ddClass) dd.className = ddClass;
        dd.textContent = value;
        dl.appendChild(dd);
    }

    function renderReceiptResult(opts) {
        var body = byId("receiptResultBody");
        if (!body) return;
        lastReceiptPlain = buildReceiptPlainText(opts);
        body.innerHTML = "";

        var wrap = receiptCreateEl("div", "receipt-preview");
        wrap.appendChild(receiptCreateEl("div", "receipt-preview-brand", t("receipt.preview.title")));

        var dl = receiptCreateEl("dl", "receipt-preview-dl");
        receiptPreviewAddRow(dl, t("receipt.preview.idDt"), getReceiptIdLine());
        receiptPreviewAddRow(dl, t("receipt.preview.from"), opts.from);
        receiptPreviewAddRow(dl, t("receipt.preview.date"), opts.dateStr);
        receiptPreviewAddRow(dl, t("receipt.preview.amount"), formatReceiptMoney(opts.amount), "receipt-preview-sum");
        receiptPreviewAddRow(dl, t("receipt.preview.recipient"), opts.recipient);
        if (opts.description) {
            receiptPreviewAddRow(dl, t("receipt.preview.desc"), opts.description);
        }
        if (opts.hasAttachment) {
            receiptPreviewAddRow(dl, t("receipt.preview.attach"), t("receipt.preview.attachYes"));
        }
        if (opts.serverId) {
            receiptPreviewAddRow(dl, t("receipt.preview.serverId"), opts.serverId, "receipt-preview-id");
        }
        wrap.appendChild(dl);

        if (opts.imageDataUrl) {
            var iw = receiptCreateEl("div", "receipt-preview-img-wrap");
            var img = document.createElement("img");
            img.className = "receipt-preview-img";
            img.src = opts.imageDataUrl;
            img.alt = t("receipt.preview.attach");
            iw.appendChild(img);
            wrap.appendChild(iw);
        }

        body.appendChild(wrap);
        body.appendChild(receiptCreateEl("p", "receipt-preview-note", t("receipt.footerNote")));

        var actions = receiptCreateEl("div", "receipt-actions");
        var bCopy = receiptCreateEl("button", "btn-receipt-copy");
        bCopy.type = "button";
        bCopy.textContent = t("receipt.copyBtn");
        bCopy.addEventListener("click", function () {
            copyTextSafe(lastReceiptPlain).then(function (ok) {
                showToast(ok ? t("toast.receiptCopyOk") : t("toast.receiptCopyFail"));
            });
        });

        var bShare = receiptCreateEl("button", "btn-receipt-share");
        bShare.type = "button";
        bShare.textContent = t("receipt.shareBtn");
        bShare.addEventListener("click", function () {
            if (navigator.share) {
                navigator
                    .share({ title: t("receipt.preview.title"), text: lastReceiptPlain })
                    .catch(function (err) {
                        if (err && err.name === "AbortError") return;
                        copyTextSafe(lastReceiptPlain).then(function (ok) {
                            showToast(ok ? t("toast.receiptCopyOk") : t("toast.receiptCopyFail"));
                        });
                    });
            } else {
                copyTextSafe(lastReceiptPlain).then(function (ok) {
                    showToast(ok ? t("toast.receiptCopyOk") : t("toast.receiptCopyFail"));
                });
            }
        });

        actions.appendChild(bCopy);
        actions.appendChild(bShare);
        body.appendChild(actions);

        setReceiptResultVisible(true);
    }

    async function generateReceiptFromForm() {
        var amountInput = byId("receiptAmountInput");
        var recipientInput = byId("receiptRecipientInput");
        var descInput = byId("receiptDescriptionInput");
        var fileInput = byId("receiptImageInput");
        if (!amountInput || !recipientInput) return;

        var amount = parseFloat(String(amountInput.value).replace(",", "."));
        if (!Number.isFinite(amount) || amount <= 0) {
            showToast(t("receipt.error.amount"));
            amountInput.classList.add("r-input--invalid");
            return;
        }
        amountInput.classList.remove("r-input--invalid");

        var recipient = String(recipientInput.value || "").trim();
        if (!recipient) {
            showToast(t("receipt.error.recipient"));
            recipientInput.classList.add("r-input--invalid");
            return;
        }
        recipientInput.classList.remove("r-input--invalid");

        var description = descInput ? String(descInput.value || "").trim() : "";
        var file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        var fileErr = file ? validateReceiptFile(file) : null;
        if (fileErr) {
            showToast(t("receipt.error." + fileErr));
            return;
        }

        var imageDataUrl = null;
        if (file) {
            try {
                imageDataUrl = await readFileAsDataURL(file);
            } catch (e) {
                console.warn(e);
                showToast(t("receipt.error.fileType"));
                return;
            }
        }

        var from = getSenderDisplayName();
        var dateStr = new Date().toLocaleString(getReceiptLocaleTag(), {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        var tempOpts = {
            from: from,
            dateStr: dateStr,
            amount: amount,
            recipient: recipient,
            description: description,
            hasAttachment: Boolean(file)
        };

        var payload = {
            amount: amount,
            recipient: recipient,
            description: description,
            from: from,
            dateStr: dateStr,
            hasAttachment: Boolean(file),
            plainText: buildReceiptPlainText(tempOpts),
            imageBase64: imageDataUrl,
            language: currentLanguage
        };

        setReceiptButtonsBusy(true);
        try {
            var sent = await submitReceiptToServer(payload);
            if (!sent.ok) {
                showToast(t("receipt.error.server"));
                return;
            }
            renderReceiptResult(
                Object.assign({}, tempOpts, {
                    imageDataUrl: imageDataUrl,
                    serverId: sent.id
                })
            );
            showToast(sent.telegramSent ? t("receipt.serverOkTelegram") : t("receipt.serverOkNoTelegram"));
            loadDashboard().catch(function () {});
        } finally {
            setReceiptButtonsBusy(false);
        }
    }

    async function generateQuickReceipt() {
        var amount = getDisplayBalance();
        if (amount <= 0) {
            showToast(t("receipt.error.zeroBalance"));
            return;
        }

        var from = getSenderDisplayName();
        var recipient = t("receipt.quick.recipientDefault");
        var dateStr = new Date().toLocaleString(getReceiptLocaleTag(), {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
        var note = t("receipt.quick.note");

        var tempOpts = {
            from: from,
            dateStr: dateStr,
            amount: amount,
            recipient: recipient,
            description: note,
            hasAttachment: false
        };

        var payload = {
            amount: amount,
            recipient: recipient,
            description: note,
            from: from,
            dateStr: dateStr,
            hasAttachment: false,
            plainText: buildReceiptPlainText(tempOpts),
            imageBase64: null,
            language: currentLanguage
        };

        setReceiptButtonsBusy(true);
        try {
            var sent = await submitReceiptToServer(payload);
            if (!sent.ok) {
                showToast(t("receipt.error.server"));
                return;
            }
            renderReceiptResult(
                Object.assign({}, tempOpts, {
                    imageDataUrl: null,
                    serverId: sent.id
                })
            );

            var amtInput = byId("receiptAmountInput");
            var recInput = byId("receiptRecipientInput");
            var descInput = byId("receiptDescriptionInput");
            if (amtInput) {
                amtInput.value = String(amount);
                amtInput.classList.remove("r-input--invalid");
            }
            if (recInput) {
                recInput.value = recipient;
                recInput.classList.remove("r-input--invalid");
            }
            if (descInput) descInput.value = note;

            showToast(sent.telegramSent ? t("receipt.serverOkTelegram") : t("receipt.serverOkNoTelegram"));
            loadDashboard().catch(function () {});
        } finally {
            setReceiptButtonsBusy(false);
        }
    }

    function updateNavIndicators(activePage) {
        const navItems = document.querySelectorAll(".bnav .ni");
        navItems.forEach(function (item) {
            item.classList.remove("active");
            item.removeAttribute("aria-current");
        });

        const activeNavItem = byId("ni-" + activePage);
        if (activeNavItem) {
            activeNavItem.classList.add("active");
            activeNavItem.setAttribute("aria-current", "page");
        }
    }

    function updateSideMenuIndicators(activePage) {
        const menuItems = document.querySelectorAll(".smenu .smi");
        menuItems.forEach((item) => item.classList.remove("active"));

        const safePage = sanitizePageName(activePage);
        const activeMenuItem = Array.from(menuItems).find(
            (item) => (item.dataset.page || "") === safePage
        );

        if (activeMenuItem) {
            activeMenuItem.classList.add("active");
        }
    }

    function showPage(pageName) {
        const safePage = sanitizePageName(pageName);
        if (!safePage) return;

        const pages = document.querySelectorAll(".page");
        let currentPage = DEFAULT_PAGE;
        pages.forEach((page) => {
            if (page.classList.contains("active")) {
                currentPage = page.id.replace("page-", "");
            }
            page.classList.remove("active");
        });

        if (currentPage !== "settings" && safePage !== currentPage) {
            lastPage = currentPage;
        }

        const targetPage = byId("page-" + safePage);
        if (!targetPage) {
            const fallbackPage = byId("page-" + DEFAULT_PAGE);
            if (fallbackPage) fallbackPage.classList.add("active");
            updateNavIndicators(DEFAULT_PAGE);
            updateSideMenuIndicators(DEFAULT_PAGE);
            return;
        }

        targetPage.classList.add("active");
        updateNavIndicators(safePage);
        updateSideMenuIndicators(safePage);

        if (safePage === "finances") {
            if (dashboardData) {
                resetFinanceFilters();
            } else {
                loadDashboard().catch(function () {});
            }
        }
    }

    function menuNav(pageName) {
        showPage(pageName);
        setMenuState(false);
    }

    function toggleMenu() {
        const menu = byId("smenu");
        if (!menu) return;
        setMenuState(!menu.classList.contains("open"));
    }

    function showSettings() {
        const settingsPage = byId("page-settings");
        if (settingsPage && settingsPage.classList.contains("active")) {
            showPage(lastPage || DEFAULT_PAGE);
        } else {
            showPage("settings");
        }
    }

    function getActiveRefUrlForShare() {
        if (!dashboardData || !dashboardData.user) return "";
        var u = dashboardData.user;
        return (u.refUrl && String(u.refUrl).trim()) || refUrlFromRefCode(u.refCode) || "";
    }

    function isTelegramRefUrl(s) {
        return /^https:\/\/t\.me\//i.test(String(s || "").trim());
    }

    async function copyRef() {
        var refNode = byId("refText");
        var refText = refNode ? refNode.textContent.trim() : "";
        if (!isTelegramRefUrl(refText)) {
            var pr = byId("partnersRefBox");
            refText = pr ? pr.textContent.trim() : "";
        }
        if (!isTelegramRefUrl(refText)) {
            refText = getActiveRefUrlForShare();
        }
        if (!isTelegramRefUrl(refText)) {
            try {
                await loadDashboard();
                refText = getActiveRefUrlForShare();
            } catch (e) {}
        }
        if (!isTelegramRefUrl(refText)) {
            showToast(t("toast.copyError"));
            return;
        }
        const ok = await copyTextSafe(refText);
        showToast(ok ? t("toast.copySuccess") : t("toast.copyError"));
    }

    function loadingAnim(pageName) {
        const safePage = sanitizePageName(pageName);
        if (!safePage) return;

        const page = byId("page-" + safePage);
        if (!page) return;

        page.style.opacity = "0.5";
        page.style.pointerEvents = "none";

        window.setTimeout(function () {
            page.style.opacity = "1";
            page.style.pointerEvents = "auto";
            showToast(t("toast.updated"));
        }, 1500);
    }

    function showImgModal() {
        setModalState("imgModal", true);
    }

    function hideImgModal() {
        setModalState("imgModal", false);
    }

    function showModal() {
        setModalState("modal", true);
    }

    function hideModal() {
        setModalState("modal", false);
    }

    function showToast(message) {
        const toast = byId("toast");
        if (!toast) return;

        toast.textContent = String(message || "");
        toast.classList.add("show");

        if (toastTimer) {
            window.clearTimeout(toastTimer);
        }
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("show");
            toastTimer = null;
        }, 3000);
    }

    function bindEvent(selector, eventName, handler) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.addEventListener(eventName, handler);
    }

    function bindEvents() {
        bindEvent("#topbarMenuBtn", "click", toggleMenu);
        bindEvent("#headerMenuBtn", "click", toggleMenu);
        bindEvent("#overlay", "click", function () {
            setMenuState(false);
        });

        bindEvent("#topbarCloseBtn", "click", function () {
            window.Telegram?.WebApp?.close?.();
        });

        bindEvent("#topbarMenuBtn", "keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMenu();
            }
        });

        bindEvent("#topbarCloseBtn", "keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.Telegram?.WebApp?.close?.();
            }
        });

        bindEvent("#userPillBtn", "click", showSettings);
        bindEvent("#userPillBtn", "keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            showSettings();
        });
        bindEvent("#settingsBtn", "click", showSettings);
        bindEvent(".btn-export", "click", function () {
            if (!dashboardData || !dashboardData.transactions || !dashboardData.transactions.length) {
                showToast(t("finances.exportEmpty"));
                return;
            }
            try {
                var blob = new Blob([JSON.stringify(dashboardData.transactions, null, 2)], { type: "application/json" });
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "transactions.json";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(a.href);
                showToast(t("toast.updated"));
            } catch (e) {
                console.warn(e);
            }
        });
        bindEvent("#shareBizBtn", "click", async function () {
            var refUrl = getActiveRefUrlForShare();
            if (!refUrl) {
                try {
                    await loadDashboard();
                    refUrl = getActiveRefUrlForShare();
                } catch (e) {}
            }
            if (!refUrl) {
                showToast(t("toast.copyError"));
                return;
            }
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Toza Yurak",
                        text: "Mening vizitkam. Loyihaga qo'shiling!",
                        url: refUrl
                    });
                } catch (e) {
                    console.warn(e);
                }
            } else {
                const ok = await copyTextSafe(refUrl);
                showToast(ok ? t("toast.copySuccess") : t("toast.copyError"));
            }
        });
        bindEvent("#copyBtn", "click", copyRef);

        document.querySelectorAll('[data-action="copy-ref"]').forEach(function (el) {
            el.addEventListener("click", copyRef);
        });

        bindEvent("#structureRefreshBtn", "click", function () {
            loadDashboard().then(function () {
                showToast(t("toast.updated"));
            });
        });
        bindEvent("#structureRefreshBtnOk", "click", function () {
            loadDashboard().then(function () {
                showToast(t("toast.updated"));
            });
        });
        bindEvent("#partnersRefreshBtn", "click", function () {
            loadDashboard().then(function () {
                showToast(t("toast.updated"));
            });
        });
        bindEvent("#finFilterApply", "click", function () {
            applyFinanceFilters().catch(function (e) {
                console.warn(e);
            });
        });
        bindEvent("#finFilterReset", "click", function () {
            resetFinanceFilters();
        });

        bindEvent("#marketingTableTrigger", "click", showImgModal);
        var mktTrig = byId("marketingTableTrigger");
        if (mktTrig) {
            mktTrig.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                showImgModal();
            });
        }
        bindEvent("#generateReceiptBtn", "click", function () {
            generateReceiptFromForm().catch(function (err) {
                console.error(err);
            });
        });
        bindEvent("#quickGenerateBtn", "click", function () {
            generateQuickReceipt().catch(function (err) {
                console.error(err);
            });
        });

        bindEvent("#receiptAmountInput", "input", function (e) {
            if (e.target && e.target.classList) e.target.classList.remove("r-input--invalid");
        });
        bindEvent("#receiptRecipientInput", "input", function (e) {
            if (e.target && e.target.classList) e.target.classList.remove("r-input--invalid");
        });
        bindEvent("#changeAccountBtn", "click", showModal);
        bindEvent("#modalCancelBtn", "click", hideModal);
        bindEvent("#modalOkBtn", "click", function () {
            hideModal();
            showToast(currentLanguage === "ru" ? "Выход..." : "Chiqilmoqda...");
            setTimeout(function () {
                clearSessionToken();
                window.location.reload();
            }, 600);
        });

        const imageModal = byId("imgModal");
        if (imageModal) {
            imageModal.addEventListener("click", function (event) {
                if (event.target === imageModal) {
                    hideImgModal();
                }
            });
        }

        document.querySelectorAll(".bnav .ni[data-page]").forEach(function (item) {
            item.addEventListener("click", function () {
                const page = item.dataset.page || "";
                showPage(page);
            });
            item.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                showPage(item.dataset.page || "");
            });
        });

        document.querySelectorAll(".smenu .smi[data-page]").forEach(function (item) {
            item.addEventListener("click", function () {
                const page = item.dataset.page || "";
                menuNav(page);
            });
        });

        bindEvent("#appSyncRetryBtn", "click", function () {
            loadDashboard().catch(function () {});
        });

        bindEvent("#btnPartnersTeam", "click", function () {
            showPage("home");
        });

        var partnersStructureCard = byId("partnersStructureCard");
        if (partnersStructureCard) {
            partnersStructureCard.addEventListener("click", function () {
                showPage("structure");
            });
            partnersStructureCard.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                showPage("structure");
            });
        }

        bindEvent("#docBtnAgreement", "click", function () {
            openExternalUrl(getAppLink("agreement"));
        });
        bindEvent("#docBtnEthics", "click", function () {
            openExternalUrl(getAppLink("ethics"));
        });

        bindEvent("#btnPresDownload", "click", function () {
            var pdf = getAppLink("presentationFile");
            if (pdf) openExternalUrl(pdf);
            else showToast(t("presentations.downloadHint"));
        });

        document.querySelectorAll(".g-item--link[data-app-link]").forEach(function (el) {
            function openGroupLink() {
                openExternalUrl(getAppLink(el.getAttribute("data-app-link")));
            }
            el.addEventListener("click", openGroupLink);
            el.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                openGroupLink();
            });
        });

        var toolCardVisit = byId("toolCardVisit");
        if (toolCardVisit) {
            toolCardVisit.addEventListener("click", function () {
                menuNav("bizcard");
            });
            toolCardVisit.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                menuNav("bizcard");
            });
        }

        document.querySelectorAll("#page-presentations .mat-item").forEach(function (el) {
            el.addEventListener("click", function () {
                showToast(t("toast.materialSoon"));
            });
        });

        var notifRowEl = byId("notifRow");
        if (notifRowEl) {
            notifRowEl.addEventListener("click", toggleNotifPreference);
            notifRowEl.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                toggleNotifPreference();
            });
        }

        var aboutRowEl = byId("aboutRow");
        if (aboutRowEl) {
            aboutRowEl.addEventListener("click", function () {
                showToast(t("about.toast"));
            });
            aboutRowEl.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                showToast(t("about.toast"));
            });
        }

        var bcRef = byId("bcRefSpan");
        if (bcRef) {
            bcRef.style.cursor = "pointer";
            bcRef.setAttribute("role", "button");
            bcRef.setAttribute("tabindex", "0");
            function copyBizRef() {
                var u = getActiveRefUrlForShare();
                if (!u) {
                    loadDashboard()
                        .then(function () {
                            var v = getActiveRefUrlForShare();
                            if (!v) {
                                showToast(t("toast.copyError"));
                                return;
                            }
                            return copyTextSafe(v).then(function (ok) {
                                showToast(ok ? t("toast.copySuccess") : t("toast.copyError"));
                            });
                        })
                        .catch(function () {
                            showToast(t("toast.copyError"));
                        });
                    return;
                }
                copyTextSafe(u).then(function (ok) {
                    showToast(ok ? t("toast.copySuccess") : t("toast.copyError"));
                });
            }
            bcRef.addEventListener("click", copyBizRef);
            bcRef.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                copyBizRef();
            });
        }

        const languageSelect = byId("languageSelect");
        if (languageSelect) {
            languageSelect.addEventListener("change", function (event) {
                const nextLanguage = getLanguageOrDefault(event.target.value);
                applyLanguage(nextLanguage);
                saveLanguage(nextLanguage);
                paintBizcardLive(dashboardData && dashboardData.user);
            });
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        setMenuState(false);
        hideModal();
        hideImgModal();
        closeBizcardPreviewModal();
    });

    document.addEventListener("DOMContentLoaded", function () {
        probeAndApplyApiFallback()
            .catch(function (e) {
                console.warn("probeAndApplyApiFallback", e);
            })
            .then(function () {
                warnApiMixedContent();
                try {
                    var apiNow = getApiFingerprint();
                    var apiKey = "ty_last_api_base";
                    var prevApi = window.localStorage.getItem(apiKey);
                    if (prevApi && prevApi !== apiNow) {
                        window.localStorage.removeItem(SESSION_STORAGE_KEY);
                        sessionToken = null;
                        lastTelegramInitDataExchanged = "";
                    }
                    window.localStorage.setItem(apiKey, apiNow);
                } catch (eApi) {}

                var tw = window.Telegram && window.Telegram.WebApp;
                if (tw) {
                    try {
                        tw.ready();
                        tw.expand();
                    } catch (e) {}
                    try {
                        var th =
                            typeof document !== "undefined" &&
                            document.querySelector &&
                            document.querySelector('meta[name="theme-color"]');
                        var tc = th && th.getAttribute("content");
                        if (tc && typeof tw.setHeaderColor === "function") {
                            tw.setHeaderColor(tc);
                        }
                        if (tc && typeof tw.setBackgroundColor === "function") {
                            tw.setBackgroundColor(tc);
                        }
                        if (
                            typeof tw.isVersionAtLeast === "function" &&
                            tw.isVersionAtLeast("7.7") &&
                            typeof tw.disableVerticalSwipes === "function"
                        ) {
                            tw.disableVerticalSwipes();
                        }
                    } catch (e2) {}
                }
                applyUserPillDisplay(null);
                applyLanguage(loadSavedLanguage());
                bindEvents();
                initBizcardEditor();
                showPage(DEFAULT_PAGE);
                loadDashboard().catch(function (e) {
                    console.warn(e);
                });
            });
    });
})();