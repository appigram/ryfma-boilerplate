const baseGifts = {
  /* 'id1', title: `Award-1`, image: `https://cdn.ryfma.com/defaults/gifts/1-min.png`, price: 50 },
  'id2', title: `Award-2`, image: `https://cdn.ryfma.com/defaults/gifts/2-min.png`, price: 50 },
  'id3', title: `Award-3`, image: `https://cdn.ryfma.com/defaults/gifts/3-min.png`, price: 50 },
  'id4', title: `Award-4`, image: `https://cdn.ryfma.com/defaults/gifts/4-min.png`, price: 50 },
  'id5', title: `Award-5`, image: `https://cdn.ryfma.com/defaults/gifts/5-min.png`, price: 50 },
  'id6', title: `Award-6`, image: `https://cdn.ryfma.com/defaults/gifts/6-min.png`, price: 50 }, */
  'id7': {
    _id: '7', title: `Люблю`, image: `https://cdn.ryfma.com/defaults/gifts/7-min.png`, price: 200, desc: 'Люблю тебя и всё, что ты делаешь'
  },
  'id8': {
    _id: '8', title: `Окей`, image: `https://cdn.ryfma.com/defaults/gifts/8-min.png`, price: 70, desc: 'Ты радуешь и вдохновляешь!'
  },
  'id9': {
    _id: '9', title: `Как ты?`, image: `https://cdn.ryfma.com/defaults/gifts/9-min.png`, price: 50, desc: 'Как дела? Надеюсь, что всё ОК!'
  },
  'id10': {
    _id: '10', title: `Спасибо`, image: `https://cdn.ryfma.com/defaults/gifts/10-min.png`, price: 100, desc: 'Благодарю за то, что ты есть'
  },
  'id11': {
    _id: '11', title: `Сердце`, image: `https://cdn.ryfma.com/defaults/gifts/11-min.png`, price: 100, desc: 'Ты окрыляешь меня'
  },
  'id12': {
    _id: '12', title: `Крутой(ая)`, image: `https://cdn.ryfma.com/defaults/gifts/12-min.png`, price: 100, desc: 'Ты крутой(ая), не забывай об этом'
  },
  'id13': {
    _id: '13', title: `Привет`, image: `https://cdn.ryfma.com/defaults/gifts/13-min.png`, price: 70, desc: 'Приветствую тебя и желаю отличного дня!'
  },
  'id14': {
    _id: '14', title: `Хит`, image: `https://cdn.ryfma.com/defaults/gifts/14-min.png`, price: 100, desc: 'Твой огонь согревает меня'
  },
  'id15': {
    _id: '15', title: `Телевизор`, image: `https://cdn.ryfma.com/defaults/gifts/15-min.png`, price: 300, desc: 'Ты достоин(на) блистать на экранах телевизоров'
  },
  'id16': {
    _id: '16', title: `Коктейль`, image: `https://cdn.ryfma.com/defaults/gifts/16-min.png`, price: 300, desc: 'Ты невероятно аппетитный (ая) и вкусный (ая)'
  },
  'id17': {
    _id: '17', title: `Музыка`, image: `https://cdn.ryfma.com/defaults/gifts/17-min.png`, price: 300, desc: 'Ты звучишь в моей голове, как классный трек'
  },
  'id18': {
    _id: '18', title: `Мороженое`, image: `https://cdn.ryfma.com/defaults/gifts/18-min.png`, price: 300, desc: 'Ты такой же сладкий (ая), как это мороженое'
  },
  'id19': {
    _id: '19', title: `Зелье`, image: `https://cdn.ryfma.com/defaults/gifts/19-min.png`, price: 200, desc: 'Волшебное зелье для поднятия настроения!'
  },
  'id20': {
    _id: '20', title: `Хэллоуин`, image: `https://cdn.ryfma.com/defaults/gifts/20-min.png`, price: 200, desc: 'Счастливого тебе Хэллоуина!'
  },
  'id21': {
    _id: '21', title: `Колдун(ья)`, image: `https://cdn.ryfma.com/defaults/gifts/21-min.png`, price: 200, desc: 'Ты околдовал(а) и заворожил(а) меня'
  },
  'id22': {
    _id: '22', title: `Да, детка`, image: `https://cdn.ryfma.com/defaults/gifts/22-min.png`, price: 100, desc: 'Да, ты самая настоящая бомба, детка'
  },
  'id23': {
    _id: '23', title: `Класс`, image: `https://cdn.ryfma.com/defaults/gifts/23-min.png`, price: 100, desc: 'Нравится! Продолжай в том же духе!'
  },
  'id24': {
    _id: '24', title: `Лучшему/Лучшей`, image: `https://cdn.ryfma.com/defaults/gifts/24-min.png`, price: 150, desc: 'Награда самому лучшему человечку'
  },
  'id25': {
    _id: '25', title: `Звезда`, image: `https://cdn.ryfma.com/defaults/gifts/25-min.png`, price: 150, desc: 'Ты настоящая звездочка!'
  },
  'id26': {
    _id: '26', title: `Корона`, image: `https://cdn.ryfma.com/defaults/gifts/26-min.png`, price: 200, desc: 'Корона для короля/королевы'
  },
  'id27': {
    _id: '27', title: `Сердце`, image: `https://cdn.ryfma.com/defaults/gifts/27-min.png`, price: 150, desc: 'Дарю тебе своё сердце'
  },
  'id28': {
    _id: '28', title: `Кофе`, image: `https://cdn.ryfma.com/defaults/gifts/28-min.png`, price: 150, desc: 'Чашка бодрящего кофе для продуктивного дня'
  },
  'id29': {
    _id: '29', title: `Мороженое`, image: `https://cdn.ryfma.com/defaults/gifts/29-min.png`, price: 100, desc: 'Сладкое мороженое для самого (ой) сладкого (ой)'
  },
  'id30': {
    _id: '30', title: `Карандаш`, image: `https://cdn.ryfma.com/defaults/gifts/30-min.png`, price: 100, desc: 'Не переставай творить никогда'
  },
  'id31': {
    _id: '31', title: `Идея`, image: `https://cdn.ryfma.com/defaults/gifts/31-min.png`, price: 100, desc: 'У тебя самые потрясающие идеи'
  },
  'id32': {
    _id: '32', title: `Печатная машинка`, image: `https://cdn.ryfma.com/defaults/gifts/32-min.png`, price: 300, desc: 'Для твоих потрясающих историй'
  },
  'id33': {
    _id: '33', title: `Пончик`, image: `https://cdn.ryfma.com/defaults/gifts/33-min.png`, price: 300, desc: 'Вкуснейший пончик для поднятия настроения'
  },
  'id34': {
    _id: '34', title: `Подсолнух`, image: `https://cdn.ryfma.com/defaults/gifts/34-min.png`, price: 150, desc: 'Подсолнух для самого солнечного человека'
  },
  'id35': {
    _id: '35', title: `Свинка`, image: `https://cdn.ryfma.com/defaults/gifts/35-min.png`, price: 150, desc: 'Ты такой (ая) же милаха, как эта розовая свинка'
  },
  'id36': {
    _id: '36', title: `Задорный смайлик`, image: `https://cdn.ryfma.com/defaults/gifts/36-min.png`, price: 100, desc: 'Задорный смайлик для тебя'
  },
  'id37': {
    _id: '37', title: `Милый смайлик`, image: `https://cdn.ryfma.com/defaults/gifts/37-min.png`, price: 100, desc: 'Милый смайлик для тебя'
  },
  'id38': {
    _id: '38', title: `Весёлый смайлик`, image: `https://cdn.ryfma.com/defaults/gifts/38-min.png`, price: 100, desc: 'Весёлый смайлик для тебя'
  },
  'id39': {
    _id: '39', title: `Котейка`, image: `https://cdn.ryfma.com/defaults/gifts/39-min.png`, price: 300, desc: 'Инопланетный котейка для самого (ой) фантастичного (ой)'
  },
  'id40': {
    _id: '40', title: `Вселенная`, image: `https://cdn.ryfma.com/defaults/gifts/40-min.png`, price: 300, desc: 'Ты - центр моей вселенной'
  },
  'id41': {
    _id: '41', title: `Щенок`, image: `https://cdn.ryfma.com/defaults/gifts/41-min.png`, price: 300, desc: 'Забавный щенок, который всегда тебя подбодрит'
  },
  'id42': {
    _id: '42', title: `Банан`, image: `https://cdn.ryfma.com/defaults/gifts/42-min.png`, price: 300, desc: 'Ешь полезные вкусняшки и будь здоров(а)'
  },
  'id43': {
    _id: '43', title: `Кошка-радуга`, image: `https://cdn.ryfma.com/defaults/gifts/43-min.png`, price: 300, desc: 'Пусть рядом будут только верные и уютные питомцы'
  },
  'id44': {
    _id: '44', title: `Книга`, image: `https://cdn.ryfma.com/defaults/gifts/44-min.png`, price: 200, desc: 'Ты такой же загадочный (ая), как непрочитанная книга'
  },
  'id45': {
    _id: '45', title: `Пирог`, image: `https://cdn.ryfma.com/defaults/gifts/45-min.png`, price: 200, desc: 'Проведи этот вечер с кусочком вкусного пирога'
  },
  'id46': {
    _id: '46', title: `Чашка чая`, image: `https://cdn.ryfma.com/defaults/gifts/46-min.png`, price: 200, desc: 'Подними настроение чашкой ароматного горячего чая'
  },
  'id52': {
    _id: '52', title: `Кофе`, image: `https://cdn.ryfma.com/defaults/gifts/52-min.png`, price: 300, desc: 'Кружка горячего кофе для тебя'
  },
  'id53': {
    _id: '53', title: `Вишня`, image: `https://cdn.ryfma.com/defaults/gifts/53-min.png`, price: 300, desc: 'Будь всегда такой же сладкой'
  },
  'id54': {
    _id: '54', title: `Киса`, image: `https://cdn.ryfma.com/defaults/gifts/54-min.png`, price: 300, desc: 'Ты замурчательный (ая)'
  },
  'id55': {
    _id: '55', title: `Клубника`, image: `https://cdn.ryfma.com/defaults/gifts/55-min.png`, price: 300, desc: 'Спелая клубника для тебя'
  },
  'id56': {
    _id: '56', title: `Пончик`, image: `https://cdn.ryfma.com/defaults/gifts/56-min.png`, price: 300, desc: 'Вкуснейший пончик для тебя'
  },
  'id57': {
    _id: '57', title: `Мороженое`, image: `https://cdn.ryfma.com/defaults/gifts/57-min.png`, price: 300, desc: 'Сладкое мороженое для самого (ой) сладкого (ой)'
  },
  'id58': {
    _id: '58', title: `Корона`, image: `https://cdn.ryfma.com/defaults/gifts/58-min.png`, price: 500, desc: 'Корона для настоящего короля (королевы)'
  },
  'id59': {
    _id: '59', title: `Бриллиант`, image: `https://cdn.ryfma.com/defaults/gifts/59-min.png`, price: 500, desc: 'Драгоценность для самого (ой) драгоценного (ой)'
  },
  'id60': {
    _id: '60', title: `Звезда`, image: `https://cdn.ryfma.com/defaults/gifts/60-min.png`, price: 300, desc: 'Всегда сияй так же ярко'
  },
  'id61': {
    _id: '61', title: `Единорог`, image: `https://cdn.ryfma.com/defaults/gifts/61-min.png`, price: 300, desc: 'Волшебный единорог для тебя'
  },
  'id62': {
    _id: '62', title: `Радуга`, image: `https://cdn.ryfma.com/defaults/gifts/62-min.png`, price: 300, desc: 'Будь таким(ой) же ярким(ой), как эта радуга'
  },
  'id63': {
    _id: '63', title: `Гамбургер`, image: `https://cdn.ryfma.com/defaults/gifts/63-min.png`, price: 300, desc: 'Сытный гамбургер восполнит твои силы'
  },
  'id64': {
    _id: '64', title: `Бодрый смайлик`, image: `https://cdn.ryfma.com/defaults/gifts/64-min.png`, price: 100, desc: 'Будь бодрым(ой) и позитивным(ой)'
  },
  'id65': {
    _id: '65', title: `Гитара`, image: `https://cdn.ryfma.com/defaults/gifts/65-min.png`, price: 300, desc: 'Никогда не прекращай творить'
  },
  'id66': {
    _id: '66', title: `Машина`, image: `https://cdn.ryfma.com/defaults/gifts/66-min.png`, price: 300, desc: 'Езжай за своей мечтой'
  },
  'id67': {
    _id: '67', title: `Вкусняшка`, image: `https://cdn.ryfma.com/defaults/gifts/67-min.png`, price: 300, desc: 'Подкрепись перед новыми свершениями'
  },
  'id68': {
    _id: '68', title: `Кассета`, image: `https://cdn.ryfma.com/defaults/gifts/68-min.png`, price: 300, desc: 'Слушай музыку и твори'
  },
}

/* const sortableGifts = [];
for (var gift in baseGifts) {
  sortableGifts.push([gift, baseGifts[gift]]);
}

sortableGifts.sort(function (a, b) {
  return a[1].price - b[1].price
})

console.log('sortableGifts: ', sortableGifts) */

export default baseGifts
