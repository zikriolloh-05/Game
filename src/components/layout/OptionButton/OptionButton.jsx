// OptionButton.jsx
import React from 'react';

function OptionButton({
  text,
  isCorrect,
  isSelected,
  showCorrect,
  disabled,
  onClick,
}) {
  let className = 'option-btn';

  if (isSelected) {
    className += isCorrect ? ' correct' : ' wrong';
  } else if (showCorrect) {
    // Игрок ошибся — подсвечиваем правильный ответ зелёным контуром
    className += ' reveal-correct';
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default OptionButton;