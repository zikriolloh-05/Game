import React, { useState } from 'react';
import { getRecord } from '../GameUtils/gameUtils.jsx';
import './style.css';

const QUESTION_COUNTS = [
  { value: 5,     label: '5 вопросов' },
  { value: 10,    label: '10 вопросов' },
  { value: 20,    label: '20 вопросов' },
  { value: 'all', label: 'Все вопросы' },
];

function Home({ onStart }) {
  const record = getRecord();
  const [count, setCount] = useState(10);

  return (
    <section className="hero">
      <h1>Игра: Перевод слов</h1>
      <p>Русский → Таджикский</p>

      {record.total > 0 && (
        <div className="record-badge">
          🏆 Рекорд: {record.percent}% ({record.score}/{record.total})
        </div>
      )}

      <h3>Количество вопросов:</h3>
      <select
        className="count-select"
        value={count}
        onChange={(e) => {
          const val = e.target.value;
          setCount(val === 'all' ? 'all' : Number(val));
        }}
      >
        {QUESTION_COUNTS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        className="start-btn"
        onClick={() => onStart(count)}
      >
        ▶ Играть
      </button>
    </section>
  );
}

export default Home;