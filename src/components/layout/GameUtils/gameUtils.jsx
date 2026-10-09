// gameUtils.js

// ===== НАСТРОЙКИ (localStorage) =====
const SETTINGS_KEY = 'word_game_settings';

export function getSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw
    ? JSON.parse(raw)
    : { count: 10, direction: 'ru-tj', sound: true, lang:'ru',mode: viice};
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ===== ТОП-5 РЕКОРДОВ (localStorage) =====
const RECORDS_KEY = 'word_game_records';

export function getRecords() {
  const raw = localStorage.getItem(RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addRecord({ score, total, direction }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const newRecord = {
    score,
    total,
    percent,
    direction,
    date: new Date().toISOString(),
  };

  const records = getRecords();
  records.push(newRecord);

  // Сортируем по проценту (убывание), потом по дате
  records.sort((a, b) =>
    b.percent - a.percent || new Date(b.date) - new Date(a.date)
  );

  // Оставляем только 5 лучших
  const top5 = records.slice(0, 5);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(top5));
  return top5;
}

export function clearRecords() {
  localStorage.removeItem(RECORDS_KEY);
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 🆕 answerKey: 'tj' (для ru-tj) или 'ru' (для tj-ru)
export function getOptions(currentWord, allWords, answerKey = 'tj', count = 4) {
  const correct = currentWord[answerKey];

  // Берём другие слова, исключая совпадающие переводы
  const others = allWords
    .filter((w) => w.id !== currentWord.id)
    .map((w) => w[answerKey])
    .filter((val) => val !== correct);

  // Убираем дубликаты (Set) — чтобы не было двух одинаковых вариантов
  const uniqueOthers = [...new Set(others)];

  const wrongOptions = shuffle(uniqueOthers).slice(0, count - 1);
  return shuffle([correct, ...wrongOptions]);
}




// ===== РЕКОРД (localStorage) =====
const RECORD_KEY = 'word_game_record';

export function getRecord() {
  const raw = localStorage.getItem(RECORD_KEY);
  return raw ? JSON.parse(raw) : { score: 0, total: 0, percent: 0 };
}

export function saveRecord(score, total) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const current = getRecord();

  // Сохраняем если побит рекорд по проценту (или по абсолютному счёту)
  if (percent > current.percent) {
    const newRecord = { score, total, percent };
    localStorage.setItem(RECORD_KEY, JSON.stringify(newRecord));
    return { ...newRecord, isNew: true };
  }

  return { ...current, isNew: false };
}