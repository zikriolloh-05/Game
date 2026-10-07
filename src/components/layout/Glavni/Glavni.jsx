import React, { useState } from 'react';
import { getRecord } from '../GameUtils/gameUtils.jsx';
import { words } from '../Words/words.jsx';        // ⬅️ нужно для MAX
import './style.css';
import './Glavni.css';

// Максимум вопросов = все слова в словаре
const MAX_QUESTIONS = words.length;
const MIN_QUESTIONS = 5;

// Быстрые кнопки
const QUICK_COUNTS = [5, 10, 20, 50, 'all'];

function Glavni({ onStart }) {
  const record = getRecord();
  const [count, setCount] = useState(10);
  const [inputValue, setInputValue] = useState('10');
  const [error, setError] = useState('');

  // Обработка ввода в input
  const handleInputChange = (e) => {
    const raw = e.target.value;

    // разрешаем только цифры
    if (raw !== '' && !/^\d+$/.test(raw)) return;

    setInputValue(raw);

    const num = Number(raw);
    if (raw === '') {
      setError('');
      return;
    }
    if (num < MIN_QUESTIONS) {
      setError(`Минимум ${MIN_QUESTIONS} вопросов`);
      return;
    }
    if (num > MAX_QUESTIONS) {
      setError(`Максимум ${MAX_QUESTIONS} вопросов`);
      return;
    }
    setError('');
    setCount(num);
  };

  // Клик по быстрой кнопке
  const handleQuickCount = (val) => {
    if (val === 'all') {
      setCount('all');
      setInputValue(String(MAX_QUESTIONS));
      setError('');
    } else {
      setCount(val);
      setInputValue(String(val));
      setError('');
    }
  };

  // Клик по кнопке «Играть»
  const handleStart = () => {
    if (error) return;

    let finalCount = count;
    if (count === 'all') {
      finalCount = 'all';
    } else {
      finalCount = Math.min(Math.max(count, MIN_QUESTIONS), MAX_QUESTIONS);
    }
    onStart(finalCount);
  };

  return (
    <section className="hero">
      <h1>Игра: Перевод слов</h1>
      <p>Русский → Таджикский</p>

      {record.total > 0 && (
        <div className="record-badge">
          🏆 Рекорд: {record.percent}% ({record.score}/{record.total})
        </div>
      )}

      <h3>Сколько вопросов?</h3>

      {/* ===== Быстрые кнопки ===== */}
      <div className="quick-counts">
        {QUICK_COUNTS.map((val) => {
          const isActive =
            val === 'all'
              ? count === 'all'
              : count === val && inputValue === String(val);

          return (
            <button
              key={val}
              className={`quick-count-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleQuickCount(val)}
            >
              {val === 'all' ? `Все (${MAX_QUESTIONS})` : val}
            </button>
          );
        })}
      </div>

      {/* ===== Кастомный ввод ===== */}
      <div className="custom-count">
        <label htmlFor="custom-count-input">
          Своё число (от {MIN_QUESTIONS} до {MAX_QUESTIONS}):
        </label>
        <div className="custom-count-row">
          <button
            className="stepper-btn"
            onClick={() => {
              const current = Number(inputValue) || MIN_QUESTIONS;
              handleQuickCount(Math.max(current - 5, MIN_QUESTIONS));
            }}
          >
            −
          </button>

          <input
            id="custom-count-input"
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            className={error ? 'has-error' : ''}
            placeholder="10"
          />

          <button
            className="stepper-btn"
            onClick={() => {
              const current = Number(inputValue) || MIN_QUESTIONS;
              handleQuickCount(Math.min(current + 5, MAX_QUESTIONS));
            }}
          >
            +
          </button>
        </div>

        {error && <div className="input-error">{error}</div>}
      </div>

      {/* ===== Кнопка старта ===== */}
      <button
        className="start-btn"
        onClick={handleStart}
        disabled={!!error}
      >
        ▶ Играть
      </button>

      <p className="hero-hint">
        Будет выбрано{' '}
        <b>{count === 'all' ? MAX_QUESTIONS : count}</b>{' '}
        {count === 1 ? 'вопрос' : 'вопросов'}
      </p>
    </section>
  );
}

export default Glavni;