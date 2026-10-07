import FailMusic from '../../../../public/Sounds/Fail.mp3'
import SuccessMusic from '../../../../public/Sounds/Succsess.mp3'
import TimerMusic from '../../../../public/Sounds/TimerMusic (2).mp3'
import winMusic from '../../../../public/Sounds/finishSuccess.mp3'
import FillMusic from '../../../../public/Sounds/FillMucis.mp3'

// Пути к аудиофайлам. Положи файлы в public/sounds/
const SOUNDS = {
    tick: TimerMusic,
    correct: SuccessMusic,
    wrong: FailMusic,
    win: winMusic,
    lose: FillMusic,
};

// Кэш Audio-объектов, чтобы не создавать каждый раз
const audioCache = {};

function getAudio(name) {
    if (!audioCache[name]) {
        const audio = new Audio(SOUNDS[name]);
        audio.preload = 'auto';
        audioCache[name] = audio;
    }
    return audioCache[name];
}

// Воспроизвести звук (без перезаписи — если играет, сначала остановить и начать заново)
export function playSound(name, { volume = 1, loop = false } = {}) {
    try {
        const audio = getAudio(name);

        if (!audio.paused && !loop) return;

        audio.currentTime = 0;
        audio.volume = volume;
        audio.loop = loop;
        audio.play().catch(() => { });
    } catch (e) {
        console.warn('Sound error:', e);
    }
}

// Остановить звук
export function stopSound(name) {
    const audio = audioCache[name];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// Остановить все звуки
export function stopAllSounds() {
    Object.values(audioCache).forEach((a) => {
        a.pause();
        a.currentTime = 0;
    });
}