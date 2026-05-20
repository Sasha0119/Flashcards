import { Flashcard, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Dasturlash', color: '#3b82f6', icon: 'Code' },
  { id: '2', name: 'Ingliz tili', color: '#10b981', icon: 'BookOpen' },
  { id: '3', name: 'Xotira mashqi', color: '#f59e0b', icon: 'Brain' },
  { id: '4', name: 'Tibbiyot & Salomatlik', color: '#ef4444', icon: 'HeartPulse' }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    front: 'React-da JSX nima?',
    back: 'JSX - bu JS uchun kengaytma sintaksisi bo‘lib, JavaScript fayl ichida HTML ga o‘xshash elementlarni yozish va ularni React elementlariga aylantirish uchun xizmat qiladi.',
    category: 'Dasturlash',
    isFavorite: true,
    status: 'learning',
    timesReviewed: 2,
    timesCorrect: 1,
    hint: 'JavaScript + XML'
  },
  {
    id: 'f2',
    front: 'Virtual DOM deganda nimani tushunasiz?',
    back: 'Virtual DOM - bu haqiqiy sahifa tuzilishining tezkor va engil xotiradagi nusxasidir. React har qanday o‘zgarishda avvalo Virtual DOM yordamida farqni hisoblab chiqadi va faqat o‘zgargan qismni haqiqiy DOM ga yuboradi (Reconciliation).',
    category: 'Dasturlash',
    isFavorite: false,
    status: 'new',
    timesReviewed: 0,
    timesCorrect: 0,
    hint: 'Brauzer renderingini optimallashtiruvchi bufer nusxa.'
  },
  {
    id: 'f3',
    front: 'Persist (v.) so‘zining tarjimasi va ma’nosi nima?',
    back: 'Persist - biror bir harakat yoki qarorda qat’iy turish, to‘xtamasdan davom etish, sabr ko‘rsatish (Masalan: "If you persist, you will succeed").',
    category: 'Ingliz tili',
    isFavorite: true,
    status: 'learning',
    timesReviewed: 3,
    timesCorrect: 2,
    hint: 'Qat’iyatlilik fe’li.'
  },
  {
    id: 'f4',
    front: 'Ebullient (adj.) so‘zining ma’nosi nima?',
    back: 'Ebullient - jo‘shqin, g‘ayratga to‘la, juda quvnoq va harakatchan (Masalan: "She was in an ebullient mood before the exam").',
    category: 'Ingliz tili',
    isFavorite: false,
    status: 'new',
    timesReviewed: 0,
    timesCorrect: 0,
    hint: 'Yuqori energiya va pozitivlik ifodalovchi sifat.'
  },
  {
    id: 'f5',
    front: 'Dunyodagi eng chuqur ko‘l qaysi va u qayerda?',
    back: 'Baykal ko‘li - u Rossiya Federatsiyasining Sibir o‘lkasida joylashgan. Maksimal chuqurligi 1642 metrgacha yetadi va sayyoramizdagi eng katta chuchuk suv havzasidir.',
    category: 'Xotira mashqi',
    isFavorite: false,
    status: 'mastered',
    timesReviewed: 5,
    timesCorrect: 5,
    hint: 'Sibirning ko‘k ko‘zi deb ataladi.'
  },
  {
    id: 'f6',
    front: 'Vodorod gazi (H) elementining tartib raqami va asosiy xususiyati qanday?',
    back: 'Vodorod elementlar davriy jadvalida 1-o‘rinda turadi. U koinotdagi eng ko‘p tarqalgan va moddalar ichida eng engil gaz bo‘lib, rangsiz va hidsizdir.',
    category: 'Xotira mashqi',
    isFavorite: false,
    status: 'new',
    timesReviewed: 0,
    timesCorrect: 0,
    hint: 'H harfi bilan belgilanadi.'
  },
  {
    id: 'f7',
    front: 'Inson tanasidagi eng katta ichki a’zo (organ) qaysi?',
    back: 'Jigar (Liver) - u organizmda qonni filtrlash, moddalar almashinuvini nazorat qilish va zaharli toksinlarni parchalash kabi 500 dan ortiq hayotiy vazifalarni bajaradi.',
    category: 'Tibbiyot & Salomatlik',
    isFavorite: true,
    status: 'mastered',
    timesReviewed: 4,
    timesCorrect: 4,
    hint: 'Vazni o‘rtacha 1.5 kg keladi va o‘ng qovurg‘a ostida joylashgan.'
  },
  {
    id: 'f8',
    front: 'Kundalik suv ichish normasi qancha va u nima uchun foydali?',
    back: 'O‘rtacha inson uchun kuniga 2.0 - 2.5 litr (yoki tana vaznining har kilogrammiga 30-35 ml). U tana haroratini boshqaradi, bo‘g‘imlarni moylaydi va hujayralarga ozuqa tashiydi.',
    category: 'Tibbiyot & Salomatlik',
    isFavorite: false,
    status: 'new',
    timesReviewed: 0,
    timesCorrect: 0,
    hint: 'H2O moddasi.'
  }
];
