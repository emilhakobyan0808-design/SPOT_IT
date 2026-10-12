export type Question={id:string;topic:number;prompt:string;options:string[];answer:number;explanation:string;kind:'choice'|'fact'|'action'};
export type Lesson={id:number;title:string;short:string;icon:string;color:string;intro:string;example:string;tip:string};
export const lessons:Lesson[]=[
{id:0,title:'Факт или мнение?',short:'Учимся различать',icon:'◈',color:'#e8edff',intro:'Факт можно проверить по наблюдениям, документам или измерениям. Мнение выражает оценку или предпочтение. В одном сообщении могут быть и факты, и мнения.',example:'«В библиотеке 200 книг» — проверяемое утверждение. «Это лучшая библиотека» — оценка. Даже утверждение, похожее на факт, сначала нужно проверить.',tip:'Спроси себя: как я могу это проверить?'},
{id:1,title:'Ловушка заголовка',short:'Замечаем кликбейт',icon:'⚡',color:'#fff0d0',intro:'Кликбейт — заголовок, который привлекает внимание громким обещанием или сильной эмоцией. Заголовок не доказывает содержание новости: прочитай текст и найди подтверждения.',example:'«Ты НЕ ПОВЕРИШЬ, что нашли во дворе!» привлекает любопытство, но не объясняет, что случилось. Спокойный заголовок тоже может быть неточным.',tip:'Сделай паузу перед тем, как нажать «поделиться».'},
{id:2,title:'След ведёт к источнику',short:'Проверяем информацию',icon:'⌕',color:'#e3f4ed',intro:'Источник — место, откуда пришла информация. Найди автора, дату, первоначальное сообщение и доказательства. Сравни с независимыми источниками: десять копий одной новости — не десять подтверждений.',example:'В чате написали, что завтра нет уроков. Открой официальный канал школы или спроси учителя. Красивый логотип сам по себе ничего не доказывает.',tip:'Кто сообщил? Когда? На чём основано?'},
{id:3,title:'За кадром',short:'Фото и контекст',icon:'▧',color:'#f1e9ff',intro:'Настоящее фото может вводить в заблуждение, если у него неверная подпись, дата или обрезан важный фрагмент. Проверь, где и когда оно было сделано, и найди оригинал.',example:'Фото заснеженного двора подписали «Сегодня в нашем городе», хотя его сняли два года назад в другом месте. Сам снимок настоящий, а сообщение неточное.',tip:'Проверяй не только картинку, но и её историю.'},
{id:4,title:'Кто хочет тебя убедить?',short:'Узнаём рекламу',icon:'✦',color:'#ffe8e0',intro:'Реклама помогает продать товар или услугу. Она бывает в роликах, играх и постах любимых авторов. Отделяй обещания от проверяемых свойств и замечай рекламные пометки.',example:'Автор говорит: «С этим рюкзаком все станут твоими друзьями!» Это обещание вызывает желание купить, но дружбу покупка не гарантирует.',tip:'Подумай, кому выгодно, чтобы я поверил.'},
{id:5,title:'Мой цифровой щит',short:'Защищаем себя',icon:'◇',color:'#e3f1ff',intro:'Пароли, адрес дома и коды из сообщений — личная информация. Не отправляй их незнакомцам. Если сообщение пугает, торопит или просит секретные данные, остановись и обратись к взрослому, которому доверяешь.',example:'«Ты выиграл приз! Пришли пароль до вечера». Даже знакомое имя может быть поддельным. Пароль нельзя сообщать, а сообщение нужно показать взрослому.',tip:'Остановись. Проверь. Попроси помощи.'}
];
export const items=[
{id:'detective',name:'Юный детектив',description:'Лупа для больших открытий',price:30,icon:'⌕',type:'accessory'},
{id:'viking',name:'Храбрый викинг',description:'Шлем для смелых вопросов',price:60,icon:'♜',type:'accessory'},
{id:'crown',name:'Корона знаний',description:'Твой маленький триумф',price:80,icon:'♛',type:'accessory'},
{id:'glasses',name:'Умные очки',description:'Замечай каждую деталь',price:40,icon:'∞',type:'accessory'},
{id:'cap',name:'Кепка исследователя',description:'Приключения начинаются!',price:35,icon:'▰',type:'accessory'},
{id:'mint',name:'Мятная поляна',description:'Свежий фон для героя',price:25,icon:'❋',type:'background'},
{id:'lavender',name:'Космическая сирень',description:'Целая вселенная идей',price:45,icon:'✧',type:'background'},
{id:'sunset',name:'Тёплый закат',description:'Поймай солнечное настроение',price:25,icon:'☀',type:'background'}
] as const;
export type Profile={id:string;nickname:string;avatar:string;xp:number;coins:number;completed:number[];results:Record<string,number>;owned:string[];equipped:{accessory?:string;background?:string}};
export type SafeQuestion=Omit<Question,'answer'|'explanation'>;
export const merchandise=[
{id:'merch-plush',name:'Плюшевый SPOT IT',description:'Мягкий друг для больших открытий',price:60,image:'/merch/plush.png',category:'toys'},
{id:'merch-keychain',name:'Брелок-помощник',description:'Маленький герой всегда рядом',price:20,image:'/merch/keychain.png',category:'toys'},
{id:'merch-figurine',name:'Фигурка детектива',description:'Твой герой в миниатюре',price:50,image:'/merch/figurine.png',category:'toys'},
{id:'merch-pencilcase',name:'Пенал исследователя',description:'Яркое место для карандашей и идей',price:35,image:'/merch/pencilcase.png',category:'stationery'},
{id:'merch-book',name:'Книга медиадетектива',description:'Приключения SPOT IT на книжной обложке',price:40,image:'/merch/book.png',category:'books'}
] as const;
