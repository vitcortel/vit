/* Krótkie efekty generowane lokalnie — bez pobierania plików audio. */
'use strict';
const gameAudio = (() => {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  const button = document.getElementById('sound');
  const label = document.getElementById('sound-label');
  const voices = new Set();
  const effects = {
    start: [[330, 0, .08], [440, .09, .08], [660, .18, .14]],
    rotate: [[520, 0, .055]],
    drop: [[180, 0, .07], [90, .06, .1]],
    lock: [[130, 0, .065]],
    clear: [[523, 0, .08], [659, .08, .08], [784, .16, .16]],
    over: [[330, 0, .14], [247, .15, .14], [165, .3, .25]]
  };
  let context = null;
  let enabled = Boolean(AudioEngine);
  try { enabled = enabled && localStorage.getItem('vit-klocki-sound') !== 'off'; } catch { /* Opcjonalny zapis. */ }

  function updateButton() {
    button.disabled = !AudioEngine;
    button.setAttribute('aria-pressed', String(enabled));
    label.textContent = !AudioEngine ? 'Dźwięk niedostępny' : `Dźwięk: ${enabled ? 'wł.' : 'wył.'}`;
  }
  async function unlock() {
    if (!enabled) return false;
    try {
      if (!context) context = new AudioEngine();
      if (context.state === 'suspended') await context.resume();
      return context.state === 'running';
    } catch { return false; } // Brak dostępu do audio nie przerywa gry.
  }
  function stop() {
    for (const voice of voices) {
      try { voice.oscillator.stop(); } catch { /* Dźwięk mógł już się skończyć. */ }
      voice.oscillator.disconnect();
      voice.gain.disconnect();
    }
    voices.clear();
  }
  function play(name) {
    if (!enabled || !context || context.state !== 'running' || document.hidden) return;
    try {
      for (const [frequency, delay, duration] of effects[name] || []) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const at = context.currentTime + delay;
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(.075, at + .005);
        gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        const voice = { oscillator, gain };
        voices.add(voice);
        oscillator.onended = () => {
          oscillator.disconnect(); gain.disconnect(); voices.delete(voice);
        };
        oscillator.start(at);
        oscillator.stop(at + duration + .01);
      }
    } catch { stop(); }
  }
  async function toggle() {
    if (!AudioEngine) return;
    enabled = !enabled;
    if (!enabled) stop();
    try { localStorage.setItem('vit-klocki-sound', enabled ? 'on' : 'off'); } catch { /* Opcjonalny zapis. */ }
    updateButton();
    if (enabled && await unlock()) play('rotate');
  }
  updateButton();
  button.addEventListener('click', toggle);
  return { unlock, play, stop, toggle };
})();
