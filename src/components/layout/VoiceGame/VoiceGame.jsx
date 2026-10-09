import React, { useState, useMemo, useEffect, useRef } from 'react';
import Timer from '../Timer/Timer.jsx';
import ResultScreen from '../ResultScreen/ResultScreen.jsx';
import { words } from '../Words/words.jsx';
import { wordsEn } from '../Words/words-en.jsx';
import { getSettings, shuffle, addRecord } from '../GameUtils/gameUtils.jsx';
import { playSound } from '../Sound/Sound.jsx';
import './VoiceGame.css';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';

// Нормализация — убираем пробелы, знаки, регистр
function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/[.,!?;:«»"'()]/g, '')
    .trim();
}

// Проверка совпадения голоса с правильным ответом
function isAnswerCorrect(spoken, correct) {
  const a = normalize(spoken);
  const b = normalize(correct);
  if (!a) return false;
  if (a === b) return true;
  // Если правильный ответ длинный (несколько слов) — проверяем вхождение
  if (b.includes(a) || a.includes(b)) return true;
  // Точное совпадение по первому слову (для коротких)
  const firstA = a.split(' ')[0];
  const firstB = b.split(' ')[0];
  return firstA === firstB;
}

function VoiceGame({ onExit }) {
  const settings = useMemo(() => getSettings(), []);
  const { count = 10, direction = 'ru-tj', lang = 'ru' } = settings;

  const activeWords = lang === 'en' ? wordsEn : words;
  const questionKey = direction.split('-')[0];
  const answerKey   = direction.split('-')[1];

  const gameWords = useMemo(() => {
    const shuffled = shuffle(activeWords);
    if (count === 'all') return shuffled;
    return shuffled.slice(0, count);
  }, [activeWords, count]);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');   // 'idle' | 'listening' | 'correct' | 'wrong'
  const [spoken, setSpoken] = useState('');
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gameId, setGameId] = useState(0);
  const [error, setError] = useState('');         // если микрофон не работает

  const recognitionRef = useRef(null);
  const current = gameWords[index];

  // ===== Запуск распознавания =====
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Твой браузер не поддерживает распознавание речи. Попробуй Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : 'ru-RU';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSpoken(text);
        checkAnswer(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setStatus('idle');
        if (event.error === 'not-allowed') {
          setError('Разреши доступ к микрофону в настройках браузера.');
        }
      };

      recognition.onend = () => {
        if (status === 'listening') setStatus('idle');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setStatus('listening');
      setError('');
    } catch (e) {
      console.warn(e);
      setStatus('idle');
    }
  };

  // ===== Остановить распознавание =====
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus('idle');
  };

  // ===== Проверка ответа =====
  const checkAnswer = (text) => {
    const correct = current[answerKey];
    if (isAnswerCorrect(text, correct)) {
      setStatus('correct');
      playSound('correct', { volume: 0.7 });
      setScore((s) => s + 1);
      setTimeout(nextQuestion, 1200);
    } else {
      setStatus('wrong');
      playSound('wrong', { volume: 0.7 });
      setTimeout(nextQuestion, 2000);   // чуть дольше, чтобы увидеть правильный ответ
    }
  };

  const nextQuestion = () => {
    stopListening();
    setStatus('idle');
    setSpoken('');
    setResetKey((k) => k + 1);
    if (index + 1 < gameWords.length) {
      setIndex((i) => i + 1);
    } else {
      setScore((s) => {
        addRecord({ score: s, total: gameWords.length, direction });
        setFinished(true);
        return s;
      });
    }
  };

  const handleTimeUp = () => {
    if (status === 'correct' || status === 'wrong') return;
    stopListening();
    setStatus('wrong');
    playSound('wrong', { volume: 0.7 });
    setTimeout(nextQuestion, 2000);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setStatus('idle');
    setSpoken('');
    setResetKey(0);
    setFinished(false);
    setGameId((id) => id + 1);
  };

  // Авто-запуск микрофона при смене вопроса
  useEffect(() => {
    if (!finished && current) {
      const t = setTimeout(() => startListening(), 600);
      return () => clearTimeout(t);
    }
  }, [index, gameId, finished]);

  if (finished) {
    return (
      <ResultScreen
        score={score}
        total={gameWords.length}
        onRestart={handleRestart}
        onExit={onExit}
      />
    );
  }

  if (!current) return null;

  const dirEmoji = {
    'ru-tj': '🇷🇺 → 🇹🇯',
    'tj-ru': '🇹🇯 → 🇷🇺',
    'en-tj': '🇬🇧 → 🇹🇯',
    'tj-en': '🇹🇯 → 🇬🇧',
  }[direction] || '🇷🇺 → 🇹🇯';

  return (
    <div className="voice-game" key={gameId}>
      <div className="game-header">
        <span>Счёт: {score}</span>
        <span>Вопрос: {index + 1}/{gameWords.length}</span>
        <button onClick={onExit}>Выйти</button>
      </div>
      <ProgressBar current={index + 1} total={gameWords.length} />   


      <div className="direction-hint">{dirEmoji}</div>

      <Timer
        duration={12}
        onTimeUp={handleTimeUp}
        resetKey={resetKey + gameId}
      />

      <h2>Скажи перевод: «{current[questionKey]}»</h2>

      {/* Статус */}
      <div className={`voice-status ${status}`}>
        {status === 'idle' && '🎤 Нажми «Говорить» или подожди...'}
        {status === 'listening' && '🔴 Слушаю тебя...'}
        {status === 'correct' && `✅ Правильно!`}
        {status === 'wrong' && `❌ Неправильно`}
      </div>

      {/* Что распознали */}
      {spoken && (
        <div className="spoken-text">
          Ты сказал: <b>«{spoken}»</b>
        </div>
      )}

      {/* Правильный ответ при ошибке */}
      {status === 'wrong' && (
        <div className="correct-answer-box">
          Правильный ответ: <b>{current[answerKey]}</b>
        </div>
      )}

      {/* Ошибка микрофона */}
      {error && <div className="mic-error">{error}</div>}

      {/* Кнопки */}
      <div className="voice-buttons">
        <button
          className="mic-btn"
          onClick={startListening}
          disabled={status === 'listening' || status === 'correct' || status === 'wrong'}
        >
          🎤 Говорить
        </button>
        <button
          className="skip-btn"
          onClick={nextQuestion}
          disabled={status === 'correct' || status === 'wrong'}
        >
          ⏭ Пропустить
        </button>
      </div>
    </div>
  );
}

export default VoiceGame;