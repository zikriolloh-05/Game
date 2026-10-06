// gameUtils.js

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getOptions(currentWord, allWords, count = 4) {
  const correct = currentWord.tj;
  const others = allWords
    .filter((w) => w.id !== currentWord.id)
    .map((w) => w.tj);

  const wrongOptions = shuffle(others).slice(0, count - 1);
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