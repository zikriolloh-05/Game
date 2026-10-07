import React, { useState, useMemo, useEffect } from 'react';
import Timer from '../Timer/Timer.jsx';
import OptionButton from '../OptionButton/OptionButton.jsx';
import ResultScreen from '../ResultScreen/ResultScreen.jsx';
import { words } from '../Words/words.jsx';                    // ⬅️ только words
import { shuffle, getOptions, saveRecord } from '../GameUtils/gameUtils.jsx';
import { playSound, stopSound, stopAllSounds } from '../Sound/Sound.jsx';
import '../Glavni/style.css';

function Game({ count = 10, direction = 'ru-tj', onExit }) {
  // ===== Слова для игры =====
  const gameWords = useMemo(() => {
    const shuffled = shuffle(words);
    if (count === 'all') return shuffled;
    return shuffled.slice(0, count);
  }, [count]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const [recordInfo, setRecordInfo] = useState(null);
  const [gameId, setGameId] = useState(0);

  const current = gameWords[index];

  // 🆕 Ключи вопроса и ответа зависят от направления
  // ru-tj: вопрос = ru, правильный ответ = tj
  // tj-ru: вопрос = tj, правильный ответ = ru
  const questionKey = direction === 'ru-tj' ? 'ru' : 'tj';
  const answerKey   = direction === 'ru-tj' ? 'tj' : 'ru';

  // 🆕 getOptions теперь генерирует варианты по нужному ключу
  const options = useMemo(
    () => (current ? getOptions(current, words, answerKey) : []),
    [current, answerKey]
  );

  useEffect(() => {
    return () => stopAllSounds();
  }, []);

  const finishGame = (finalScore) => {
    const info = saveRecord(finalScore, gameWords.length);
    setRecordInfo(info);
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

    if (option === current[answerKey]) {   // 🆕 сравнение по answerKey
      playSound('correct', { volume: 0.7 });
      setScore((s) => s + 1);
    } else {
      playSound('wrong', { volume: 0.7 });
    }

    setTimeout(nextQuestion, 1000);
  };

  const handleTimeUp = () => {
    if (selected) return;
    setSelected('__timeout__');
    stopSound('tick');
    stopSound('tickFast');
    playSound('wrong', { volume: 0.7 });
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

  return (
    <div className="game" key={gameId}>
      <div className="game-header">
        <span>Счёт: {score}</span>
        <span>Вопрос: {index + 1}/{gameWords.length}</span>
        <button onClick={onExit}>Выйти</button>
      </div>

      {/* 🆕 Показываем подсказку направления */}
      <div className="direction-hint">
        {direction === 'ru-tj' ? '🇷🇺 → 🇹🇯' : '🇹🇯 → 🇷🇺'}
      </div>

      <Timer
        duration={12}
        onTimeUp={handleTimeUp}
        resetKey={resetKey + gameId}
      />

      {/* 🆕 Вопрос берём по questionKey */}
      <h2>Как переводится: «{current[questionKey]}»?</h2>

      <div className="options">
        {options.map((opt) => {
          const isCorrect = opt === current[answerKey];   // 🆕
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
              onClick={() => handleAnswer(opt)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Game;