import React, { useState, useMemo, useEffect } from 'react';
import Timer from '../Timer/Timer.jsx';
import OptionButton from '../OptionButton/OptionButton.jsx';
import ResultScreen from '../ResultScreen/ResultScreen.jsx';
import { words } from '../Words/words.jsx';
import { wordsEn } from '../Words/words-en.jsx';              // 🆕
import { getSettings, shuffle, getOptions, addRecord } from '../GameUtils/gameUtils.jsx';
import { playSound, stopSound, stopAllSounds } from '../Sound/Sound.jsx';
import '../Glavni/style.css';
import './Game.css'
import ProgressBar from '../ProgressBar/ProgressBar.jsx';

function Game({ onExit }) {
  const [transitioning, setTransitioning] = useState(false);
  // ===== Настройки =====
  const settings = useMemo(() => getSettings(), []);
  const { count = 10, direction = 'ru-tj', sound = true, lang = 'ru' } = settings;

  // ===== Выбор словаря =====
  const activeWords = lang === 'en' ? wordsEn : words;

  // ===== Ключи вопроса и ответа =====
  const questionKey = direction.split('-')[0];   // 'ru' | 'tj' | 'en'
  const answerKey = direction.split('-')[1];   // 'tj' | 'ru' | 'en'

  // ===== Слова для игры =====
  const gameWords = useMemo(() => {
    const shuffled = shuffle(activeWords);
    if (count === 'all') return shuffled;
    return shuffled.slice(0, count);
  }, [activeWords, count]);

  // ===== Состояния =====
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const [recordInfo, setRecordInfo] = useState(null);
  const [gameId, setGameId] = useState(0);

  const current = gameWords[index];

  // ===== Варианты ответа =====
  const options = useMemo(
    () => (current ? getOptions(current, activeWords, answerKey) : []),
    [current, activeWords, answerKey]
  );

  // ===== Останавливаем звуки при выходе =====
  useEffect(() => {
    return () => stopAllSounds();
  }, []);

  const finishGame = (finalScore) => {
    const info = addRecord({
      score: finalScore,
      total: gameWords.length,
      direction,
    });
    setRecordInfo({ isNew: true });
    setFinished(true);
  };

  const nextQuestion = () => {
    setSelected(null);
    setResetKey((k) => k + 1);
    if (index + 1 < gameWords.length) {
      setIndex((i) => i + 1);
    } else {
      setScore((s) => {
        finishGame(s);
        return s;
      });
    }
  };

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);

    stopSound('tick');
    stopSound('tickFast');

    if (option === current[answerKey]) {
      if (sound) playSound('correct', { volume: 0.7 });
      setScore((s) => s + 1);
    } else {
      if (sound) playSound('wrong', { volume: 0.7 });
    }

    setTimeout(() => {
      setTransitioning(true);       // 🆕 начинаем исчезновение
      setTimeout(() => {
        nextQuestion();             // смена вопроса
        setTransitioning(false);    // 🆕 показываем новый
      }, 200);
    }, 800);
  };

  const handleTimeUp = () => {
    if (selected) return;
    setSelected('__timeout__');
    stopSound('tick');
    stopSound('tickFast');
    if (sound) playSound('wrong', { volume: 0.7 });
    setTimeout(nextQuestion, 1000);
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setResetKey(0);
    setFinished(false);
    setRecordInfo(null);
    setGameId((id) => id + 1);
  };

  if (finished) {
    return (
      <ResultScreen
        score={score}
        total={gameWords.length}
        isNewRecord={recordInfo?.isNew}
        onRestart={handleRestart}
        onExit={onExit}
      />
    );
  }

  if (!current) return null;

  // ===== Флаги направления =====
  const dirEmoji = {
    'ru-tj': '🇷🇺 → 🇹🇯',
    'tj-ru': '🇹🇯 → 🇷🇺',
    'en-tj': '🇬🇧 → 🇹🇯',
    'tj-en': '🇹🇯 → 🇬🇧',
  }[direction] || '🇷🇺 → 🇹🇯';

  return (
    <div className="game" key={gameId}>
      <div className="game-header">
        <span>Счёт: {score}</span>
        <span>Вопрос: {index + 1}/{gameWords.length}</span>
        <button onClick={onExit}>Выйти</button>
      </div>
      <ProgressBar current={index + 1} total={gameWords.length} />   {/* 🆕 */}

      {/* <div className={`game-body ${transitioning ? 'fade-out' : ''}`}>
        <h2 key={index}>...</h2>
        <div className="options">...</div>
      </div> */}
      <div className="direction-hint">{dirEmoji}</div>

      <Timer
        duration={12}
        onTimeUp={handleTimeUp}
        resetKey={resetKey + gameId}
      />


      <h2 key={index}>Как переводится: «{current[questionKey]}»?</h2>

      <div className="options">
        {options.map((opt, i) => {
          const isCorrect = opt === current[answerKey];
          const isSelected = selected === opt;
          const showCorrect = selected !== null && isCorrect && !isSelected;

          return (
            <OptionButton
              key={opt}
              text={opt}
              isCorrect={isCorrect}
              isSelected={isSelected}
              showCorrect={showCorrect}
              disabled={selected !== null}
              style={{ animationDelay: `${i * 80}ms` }}   // 🆕
              onClick={() => handleAnswer(opt)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Game;