// Book formats
const formats = [
  { key: 'ebook', text: 'Ebook', value: 'ebook' },
  { key: 'paperback', text: 'Paperback', value: 'paperback' },
  { key: 'hardcover', text: 'Hardcover', value: 'hardcover' },
  { key: 'audiobook', text: 'Audiobook', value: 'audiobook' }
]

// Book genres

const genresList = {
  "alternative-history": {
    slug: "alternative-history",
    en: "Alternative history",
    ru: "Альтернативная история",
    ruDesc: "",
    enDesc: ""
  },
  "anime-fanfic": {
    slug: "anime-fanfic",
    en: "Anime fanfic",
    ru: "Аниме фанфики",
    ruDesc: "",
    enDesc: ""
  },
  "dystopia": {
    slug: "dystopia",
    en: "Dystopia",
    ru: "Антиутопия",
    ruDesc: "",
    enDesc: ""
  },
  "business": {
    slug: "business",
    en: "Business",
    ru: "Бизнес литература",
    ruDesc: "",
    enDesc: ""
  },
  "biography": {
   slug: "biography",
    en: "Biography",
    ru: "Биография",
    ruDesc: "",
    enDesc: ""
  },
  "combat-fantasy": {
    slug: "combat-fantasy",
    en: "Combat fantasy",
    ru: "Боевая фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "action": {
    slug: "action",
    en: "Action",
    ru: "Боевик",
    ruDesc: "",
    enDesc: ""
  },
  "fantasy-action": {
    slug: "fantasy-action",
    en: "Fantasy action",
    ru: "Боевое фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "fantasy-city": {
    slug: "fantasy-city",
    en: "Fantasy city",
    ru: "Городское фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "detective": {
    slug: "detective",
    en: "Detective",
    ru: "Детектив",
    ruDesc: "",
    enDesc: ""
  },
  "children-s": {
    slug: "children-s",
    en: "For children's",
    ru: "Детская литература",
    ruDesc: "",
    enDesc: ""
  },
  "drama": {
    slug: "drama",
    en: "Drama",
    ru: "Драма",
    ruDesc: "",
    enDesc: ""
  },
  "female-detective": {
    slug: "female-detective",
    en: "Female detective",
    ru: "Женский детектив",
    ruDesc: "",
    enDesc: ""
  },
  "female-novel": {
    slug: "female-novel",
    en: "Female novel",
    ru: "Женский роман",
    ruDesc: "",
    enDesc: ""
  },
  "art": {
    slug: "art",
    en: "Art",
    ru: "Искусство",
    ruDesc: "",
    enDesc: ""
  },
  "history": {
    slug: "history",
    en: "History",
    ru: "История",
    ruDesc: "",
    enDesc: ""
  },
  "history-detective": {
    slug: "History detective",
    en: "history-detective",
    ru: "Исторический детектив",
    ruDesc: "",
    enDesc: ""
  },
  "history-love-novel": {
    slug: "history-love-novel",
    en: "History love novel",
    ru: "Исторический любовный роман",
    ruDesc: "",
    enDesc: ""
  },
  "history-novel": {
    slug: "history-novel",
    en: "History novel",
    ru: "Исторический роман",
    ruDesc: "",
    enDesc: ""
  },
  "history-fantasy": {
    slug: "history-fantasy",
    en: "History fantasy",
    ru: "Историческое фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "history-fiction": {
    slug: "history-fiction",
    en: "History fiction",
    ru: "Историческая фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "cyberpunk": {
    slug: "cyberpunk",
    en: "Cyberpunk",
    ru: "Киберпанк",
    ruDesc: "",
    enDesc: ""
  },
  "classic": {
    slug: "classic",
    en: "Classic",
    ru: "Классика",
    ruDesc: "",
    enDesc: ""
  },
  "classical-detective": {
    slug: "classical-detective",
    en: "Classical detective",
    ru: "Классический детектив",
    ruDesc: "",
    enDesc: ""
  },
  "comics": {
    slug: "comics",
    en: "Comics",
    ru: "Комикс",
    ruDesc: "",
    enDesc: ""
  },
  "short-love-novel": {
    slug: "short-love-novel",
    en: "Short love novel",
    ru: "Короткий любовный роман",
    ruDesc: "",
    enDesc: ""
  },
  "space-fiction": {
    slug: "space-fiction",
    en: "Space fiction",
    ru: "Космическая фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "crime-detective": {
    slug: "crime-detective",
    en: "Crime detective",
    ru: "Криминальный детектив",
    ruDesc: "",
    enDesc: ""
  },
  "crime-thriller": {
    slug: "crime-thriller",
    en: "Crime thriller",
    ru: "Криминальный триллер",
    ruDesc: "",
    enDesc: ""
  },
  "litrpg": {
    slug: "litrpg",
    en: "LitRPG",
    ru: "ЛитРПГ",
    ruDesc: "",
    enDesc: ""
  },
  "love-fiction": {
    slug: "love-fiction",
    en: "Love fiction",
    ru: "Любовная фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "love-fantasy": {
    slug: "love-fantasy",
    en: "Love fantasy",
    ru: "Любовное фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "love-novel": {
    slug: "love-novel",
    en: "Love novel",
    ru: "Любовный роман",
    ruDesc: "",
    enDesc: ""
  },
  "magical-detective": {
    slug: "magical-detective",
    en: "Magical detective",
    ru: "Магический детектив",
    ruDesc: "",
    enDesc: ""
  },
  "manga-fanfic": {
    slug: "manga-fanfic",
    en: "Manga fanfic",
    ru: "Манга фанфики",
    ruDesc: "",
    enDesc: ""
  },
  "memoir": {
    slug: "memoir",
    en: "Memoir",
    ru: "Мемуары",
    ruDesc: "",
    enDesc: ""
  },
  "mystic": {
    slug: "mystic",
    en: "Mystic",
    ru: "Мистика",
    ruDesc: "",
    enDesc: ""
  },
  "mystical-thriller": {
    slug: "mystical-thriller",
    en: "Mystical thriller",
    ru: "Мистический триллер",
    ruDesc: "",
    enDesc: ""
  },
  "young-mystic": {
    slug: "young-mystic",
    en: "Young mystic",
    ru: "Молодежная мистика",
    ruDesc: "",
    enDesc: ""
  },
  "youth-proze": {
    slug: "youth-proze",
    en: "Youth proze",
    ru: "Молодежная проза",
    ruDesc: "",
    enDesc: ""
  },
  "male-novel": {
    slug: "male-novel",
    en: "Male novel",
    ru: "Мужской роман",
    ruDesc: "",
    enDesc: ""
  },
  "music": {
    slug: "music",
    en: "Music",
    ru: "Музыка",
    ruDesc: "",
    enDesc: ""
  },
  "sci-fi": {
    slug: "sci-fi",
    en: "Sci-fi",
    ru: "Научная фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "non-format": {
    slug: "non-format",
    en: "Non-format",
    ru: "Неформат",
    ruDesc: "",
    enDesc: ""
  },
  "non-fiction": {
    slug: "non-fiction",
    en: "Non-fiction",
    ru: "Нон-фикшн",
    ruDesc: "",
    enDesc: ""
  },
  "paranormal": {
    slug: "paranormal",
    en: "Paranormal",
    ru: "Паранормальное",
    ruDesc: "",
    enDesc: ""
  },
  "young-adult": {
    slug: "young-adult",
    en: "Young adult",
    ru: "Подростковая проза",
    ruDesc: "",
    enDesc: ""
  },
  "political-thriller": {
    slug: "political-thriller",
    en: "Political thriller",
    ru: "Политический триллер",
    ruDesc: "",
    enDesc: ""
  },
  "police-detective": {
    slug: "police-detective",
    en: "Police detective",
    ru: "Полицейский детектив",
    ruDesc: "",
    enDesc: ""
  },
  "popadantsy": {
    slug: "popadantsy",
    en: "Popadantsy",
    ru: "Попаданцы",
    ruDesc: "",
    enDesc: ""
  },
  "popadantsy-in-another-worlds": {
    slug: "popadantsy-in-another-worlds",
    en: "Popadantsy in another worlds",
    ru: "Попаданцы в другие миры",
    ruDesc: "",
    enDesc: ""
  },
  "popadantsy-in-time": {
    slug: "popadantsy-in-time",
    en: "Popadantsy in time",
    ru: "Попаданцы во времени",
    ruDesc: "",
    enDesc: ""
  },
  "postapocalyptic": {
    slug: "postapocalyptic",
    en: "Postapocalyptic",
    ru: "Постапокалипсис",
    ruDesc: "",
    enDesc: ""
  },
  "poetry": {
    slug: "poetry",
    en: "Poetry",
    ru: "Поэзия",
    ruDesc: "",
    enDesc: ""
  },
  "adventure": {
    slug: "adventure",
    en: "Adventure",
    ru: "Приключения",
    ruDesc: "",
    enDesc: ""
  },
  "adventure-novel": {
    slug: "adventure-novel",
    en: "Adventure novel",
    ru: "Приключенческий роман",
    ruDesc: "",
    enDesc: ""
  },
  "adventure-fantasy": {
    slug: "adventure-fantasy",
    en: "Adventure fantasy",
    ru: "Приключенческое фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "proze": {
    slug: "proze",
    en: "Proze",
    ru: "Проза",
    ruDesc: "",
    enDesc: ""
  },
  "psychological-thriller": {
    slug: "psychological-thriller",
    en: "Psychological thriller",
    ru: "Психологический триллер",
    ruDesc: "",
    enDesc: ""
  },
  "psychology": {
    slug: "psychology",
    en: "Psychology",
    ru: "Психология",
    ruDesc: "",
    enDesc: ""
  },
  "self-help": {
    slug: "self-help",
    en: "Self help",
    ru: "Развитие личности",
    ruDesc: "",
    enDesc: ""
  },
  "religion": {
    slug: "religion",
    en: "Religion",
    ru: "Религия",
    ruDesc: "",
    enDesc: ""
  },
  "romantic-erotic": {
    slug: "romantic-erotic",
    en: "Romantic erotic",
    ru: "Романтическая эротика",
    ruDesc: "",
    enDesc: ""
  },
  "slash-famslash": {
    slug: "slash-famslash",
    en: "Slash famslash",
    ru: "Слэш и фэмслеш",
    ruDesc: "",
    enDesc: ""
  },
  "modern-proze": {
    slug: "modern-proze",
    en: "Modern proze",
    ru: "Современная проза",
    ruDesc: "",
    enDesc: ""
  },
  "modern-love-novel": {
    slug: "modern-love-novel",
    en: "Modern love novel",
    ru: "Современный любовный роман",
    ruDesc: "",
    enDesc: ""
  },
  "thriller": {
    slug: "thriller",
    en: "Thriller",
    ru: "Триллеры",
    ruDesc: "",
    enDesc: ""
  },
  "wuxia": {
    slug: "wuxia",
    en: "Wuxia",
    ru: "Уся (Wuxia)",
    ruDesc: "",
    enDesc: ""
  },
  "horror": {
    slug: "horror",
    en: "Horror",
    ru: "Ужасы",
    ruDesc: "",
    enDesc: ""
  },
  "fiction": {
    slug: "fiction",
    en: "Fiction",
    ru: "Фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "fiction-detective": {
    slug: "fiction-detective",
    en: "Fiction-detective",
    ru: "Фантастический детектив",
    ruDesc: "",
    enDesc: ""
  },
  "fanfic": {
    slug: "fanfic",
    en: "Fanfic",
    ru: "Фанфик",
    ruDesc: "",
    enDesc: ""
  },
  "fanfic-by-book": {
    slug: "Fanfic-by-book",
    en: "Fanfic by book",
    ru: "Фанфик по книге",
    ruDesc: "",
    enDesc: ""
  },
  "fanfic-by-movie": {
    slug: "fanfic-by-movie",
    en: "Fanfic by movie",
    ru: "Фанфик по фильму",
    ruDesc: "",
    enDesc: ""
  },
  "fantasy": {
    slug: "fantasy",
    en: "Fantasy",
    ru: "Фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "philosophy": {
    slug: "philosophy",
    en: "Philosophy",
    ru: "Философия",
    ruDesc: "",
    enDesc: ""
  },
  "esoterics": {
    slug: "esoterics",
    en: "Esoterics",
    ru: "Эзотерика",
    ruDesc: "",
    enDesc: ""
  },
  "epic-fantasy": {
    slug: "epic-fantasy",
    en: "Epic fantasy",
    ru: "Эпическое фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "erotic": {
    slug: "erotic",
    en: "Erotic",
    ru: "Эротика",
    ruDesc: "",
    enDesc: ""
  },
  "erotic-fiction": {
    slug: "erotic-fiction",
    en: "Erotic fiction",
    ru: "Эротическая фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "erotic-fanfic": {
    slug: "erotic-fanfic",
    en: "Erotic fanfic",
    ru: "Эротический фанфик",
    ruDesc: "",
    enDesc: ""
  },
  "erotic-fantasy": {
    slug: "erotic-fantasy",
    en: "Erotic fantasy",
    ru: "Эротическая фэнтези",
    ruDesc: "",
    enDesc: ""
  },
  "humor": {
    slug: "humor",
    en: "Humor",
    ru: "Юмор",
    ruDesc: "",
    enDesc: ""
  },
  "humor-fiction": {
    slug: "humor-fiction",
    en: "Humor fiction",
    ru: "Юмористическая фантастика",
    ruDesc: "",
    enDesc: ""
  },
  "humor-fantasy": {
    slug: "Humor-fantasy",
    en: "Humor fantasy",
    ru: "Юмористическое фэнтези",
    ruDesc: "",
    enDesc: ""
  }
}

// Languages
const languages = [
  { key: 'russian', text: 'Русский', value: 'russian' },
  { key: 'belorussian', text: 'Белорусский', value: 'belorussian' },
  { key: 'ukranian', text: 'Украинский', value: 'ukranian' },
  { key: 'english', text: 'English', value: 'english' },
  { key: 'french', text: 'French', value: 'french' },
  { key: 'german', text: 'German', value: 'german' },
  { key: 'spanish', text: 'Spanish', value: 'spanish' },
  { key: 'italian', text: 'Italian', value: 'italian' }
]

const status = [
  { key: 'inprogress', text: 'In progress', value: 'inprogress' }, // 1
  // { key: '2', text: 'Excerpt', value: 'excerpt' }, // 2
  { key: 'complete', text: 'Complete', value: 'complete' } // 3
]

const gendersList = [
  { key: 'fm', text: 'F/M', value: 'fm' },
  { key: 'gen', text: 'Gen', value: 'gen' },
  { key: 'mm', text: 'M/M', value: 'mm' },
  { key: 'other', text: 'Other', value: 'other' },
  { key: 'ff', text: 'F/F', value: 'ff' },
  { key: 'multi', text: 'Multi', value: 'Multi' }
]

export { formats, genresList, languages, status, gendersList }
