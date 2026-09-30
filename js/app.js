/**
 * Application Entry Point
 * Orchestrates Audio, Particles, Visual Novel State, and UI Events.
 */

import { audio } from './audio.js';
import { ParticleSystem } from './particles.js';
import { VisualNovelEngine } from './vnEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles
  const canvas = document.getElementById('vn-particles-canvas');
  const particleSystem = new ParticleSystem(canvas);

  // 2. Query DOM Elements
  const container = document.getElementById('vn-container');
  const topBar = document.getElementById('vn-top-bar');
  const btnTopBack = document.getElementById('btn-top-back');
  const progressCounter = document.getElementById('progress-counter');
  const progressBar = document.getElementById('progress-bar');
  const progressIndicator = document.getElementById('story-progress-indicator');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const btnMenuToggle = document.getElementById('btn-menu-toggle');

  const screens = {
    intro: document.getElementById('screen-intro'),
    story: document.getElementById('screen-story'),
    confession: document.getElementById('screen-confession'),
    response: document.getElementById('screen-response')
  };

  const storyPanel = document.getElementById('story-dialog-panel');
  const storyTextBody = document.getElementById('story-text-body');
  const chapterBadge = document.getElementById('chapter-badge');
  const btnStoryPrev = document.getElementById('btn-story-prev');
  const btnStoryNext = document.getElementById('btn-story-next');
  const btnStartStory = document.getElementById('btn-start-story');

  const confessionQuote = document.getElementById('confession-quote');
  const confessionQuestion = document.getElementById('confession-question');
  const btnChoiceAccept = document.getElementById('btn-choice-accept');
  const btnChoiceDecline = document.getElementById('btn-choice-decline');

  const responseCard = document.getElementById('response-card');
  const responseBadge = document.getElementById('response-badge');
  const responseTitle = document.getElementById('response-title');
  const responseMessage = document.getElementById('response-message');
  const btnResponseAction = document.getElementById('btn-response-action');

  const menuBackdrop = document.getElementById('menu-backdrop');
  const btnDrawerClose = document.getElementById('btn-drawer-close');
  const btnDrawerAudio = document.getElementById('btn-drawer-audio');
  const sliderVolume = document.getElementById('slider-volume');
  const checkInstantText = document.getElementById('check-instant-text');
  const btnDrawerRestart = document.getElementById('btn-drawer-restart');
  const chapterJumpGrid = document.getElementById('chapter-jump-grid');

  // 3. Initialize Visual Novel Engine
  const engine = new VisualNovelEngine({
    particleSystem
  });

  engine.init({
    screens,
    storyPanel,
    textContainer: storyTextBody,
    chapterBadge,
    pageIndicator: progressCounter,
    progressBar,
    btnPrev: btnStoryPrev,
    btnNext: btnStoryNext,
    confessionQuote,
    confessionQuestion,
    responseCard,
    responseBadge,
    responseTitle,
    responseMessage,
    btnResponseAction
  });

  // 4. Update UI State on Screen Change
  function updateUIForScreen(screenName) {
    if (screenName === 'intro') {
      container.className = 'vn-container state-intro';
      btnTopBack.style.visibility = 'hidden';
      progressIndicator.style.visibility = 'hidden';
    } else if (screenName === 'story') {
      container.className = 'vn-container state-story';
      btnTopBack.style.visibility = 'visible';
      progressIndicator.style.visibility = 'visible';
    } else if (screenName === 'confession') {
      container.className = 'vn-container state-confession';
      btnTopBack.style.visibility = 'visible';
      progressIndicator.style.visibility = 'hidden';
    } else if (screenName === 'response') {
      container.className = 'vn-container state-response';
      btnTopBack.style.visibility = 'visible';
      progressIndicator.style.visibility = 'hidden';
    }

    // Update active state in chapter jump drawer
    const jumpButtons = chapterJumpGrid.querySelectorAll('.btn-chapter-jump');
    jumpButtons.forEach((btn) => {
      const idx = parseInt(btn.dataset.index, 10);
      if (screenName === 'story' && idx === engine.currentIndex) {
        btn.classList.add('active');
      } else if (screenName === 'confession' && idx === engine.totalSlides) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  window.addEventListener('vn:screen-change', (e) => {
    updateUIForScreen(e.detail.screen);
  });

  // Initial UI sync
  updateUIForScreen('intro');

  // 5. User Interactions

  // Start button on Intro
  btnStartStory.addEventListener('click', () => {
    engine.startStory(false);
  });

  // Next & Prev buttons on Story Panel
  btnStoryNext.addEventListener('click', (e) => {
    e.stopPropagation();
    engine.handleNext();
  });

  btnStoryPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    engine.handlePrev();
  });

  // Tapping the story panel or text directly
  storyPanel.addEventListener('click', (e) => {
    // If the click was not on a button or link
    if (!e.target.closest('button')) {
      engine.handleNext();
    }
  });

  // Top Back Button
  btnTopBack.addEventListener('click', () => {
    audio.playClick();
    if (engine.currentScreen === 'story') {
      engine.handlePrev();
    } else if (engine.currentScreen === 'confession') {
      // Go back to slide 7
      engine.setScreen('story');
      engine.renderSlide(engine.totalSlides - 1);
    } else if (engine.currentScreen === 'response') {
      // Go back to confession
      engine.showConfession();
    }
  });

  // Confession Choices
  btnChoiceAccept.addEventListener('click', () => {
    engine.handleChoice('accept');
  });

  btnChoiceDecline.addEventListener('click', () => {
    engine.handleChoice('decline');
  });

  // Response Screen Action
  btnResponseAction.addEventListener('click', () => {
    audio.playClick();
    const actionType = btnResponseAction.dataset.actionType;
    if (actionType === 'accept') {
      // "Baca Cerita Lagi"
      engine.restart();
    } else {
      // "Kembali ke Cerita"
      engine.jumpToChapter(0);
    }
  });

  // 6. Audio Controls
  function updateAudioButtonState() {
    const isPlaying = audio.isPlaying && !audio.isMuted;
    if (isPlaying) {
      btnAudioToggle.classList.remove('muted');
      btnDrawerAudio.classList.remove('muted');
      btnAudioToggle.setAttribute('title', 'Matikan Musik');
    } else {
      btnAudioToggle.classList.add('muted');
      btnDrawerAudio.classList.add('muted');
      btnAudioToggle.setAttribute('title', 'Putar Musik');
    }
  }

  btnAudioToggle.addEventListener('click', () => {
    audio.unlockAudio();
    if (!audio.isPlaying) {
      audio.startBGM();
    } else {
      audio.setMuted(!audio.isMuted);
    }
    updateAudioButtonState();
  });

  btnDrawerAudio.addEventListener('click', () => {
    btnAudioToggle.click();
  });

  sliderVolume.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.setVolume(val);
    if (audio.isMuted && val > 0) {
      audio.setMuted(false);
      updateAudioButtonState();
    }
  });

  // 7. Menu Drawer Open/Close
  function openMenu() {
    audio.playClick();
    menuBackdrop.classList.add('open');
    menuBackdrop.removeAttribute('aria-hidden');
  }

  function closeMenu() {
    audio.playClick();
    menuBackdrop.classList.remove('open');
    menuBackdrop.setAttribute('aria-hidden', 'true');
  }

  btnMenuToggle.addEventListener('click', openMenu);
  btnDrawerClose.addEventListener('click', closeMenu);

  menuBackdrop.addEventListener('click', (e) => {
    if (e.target === menuBackdrop) {
      closeMenu();
    }
  });

  // Chapter Jump buttons
  chapterJumpGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-chapter-jump');
    if (!btn) return;

    const targetIdx = parseInt(btn.dataset.index, 10);
    closeMenu();
    engine.jumpToChapter(targetIdx);
  });

  // Text speed setting
  checkInstantText.addEventListener('change', (e) => {
    engine.instantText = e.target.checked;
  });

  // Restart Story from drawer
  btnDrawerRestart.addEventListener('click', () => {
    closeMenu();
    engine.restart();
  });

  // Escape key closes menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBackdrop.classList.contains('open')) {
      closeMenu();
    }
  });

  // Set initial audio button appearance
  updateAudioButtonState();
});
