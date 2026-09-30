/**
 * Visual Novel Engine
 * Manages screen transitions, story progression, typewriter effects,
 * session persistence, and UI events.
 */

import { STORY_SLIDES, CONFESSION_DATA, RESPONSE_DATA, STORY_META } from './storyData.js';
import { audio } from './audio.js';

export class VisualNovelEngine {
  constructor(options = {}) {
    this.currentScreen = 'intro'; // 'intro' | 'story' | 'confession' | 'response'
    this.currentIndex = 0; // 0 to 6 for the 7 story slides
    this.totalSlides = STORY_SLIDES.length;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.currentText = '';
    this.targetText = '';
    this.textCharIndex = 0;
    this.typeSpeed = 24; // ms per char (natural VN pace)
    this.instantText = false;
    this.particleSystem = options.particleSystem || null;

    // Elements cache
    this.dom = {};
  }

  init(domElements) {
    this.dom = domElements;
    this.loadSavedProgress();
    this.bindEvents();
    this.renderInitialState();
  }

  loadSavedProgress() {
    try {
      const savedIndex = sessionStorage.getItem('vn_story_index');
      if (savedIndex !== null) {
        const parsed = parseInt(savedIndex, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < this.totalSlides) {
          this.currentIndex = parsed;
        }
      }
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
  }

  saveProgress() {
    try {
      sessionStorage.setItem('vn_story_index', this.currentIndex.toString());
    } catch (e) {
      // Ignore
    }
  }

  bindEvents() {
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'story') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.handlePrev();
        }
      } else if (this.currentScreen === 'intro') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.startStory();
        }
      }
    });
  }

  // Set the active screen with cinematic transitions
  setScreen(screenName) {
    const screens = ['intro', 'story', 'confession', 'response'];
    screens.forEach((s) => {
      const el = this.dom.screens[s];
      if (el) {
        if (s === screenName) {
          el.classList.add('active');
          el.removeAttribute('aria-hidden');
        } else {
          el.classList.remove('active');
          el.setAttribute('aria-hidden', 'true');
        }
      }
    });

    this.currentScreen = screenName;

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('vn:screen-change', { detail: { screen: screenName } }));
  }

  renderInitialState() {
    this.setScreen('intro');
  }

  startStory(resume = false) {
    audio.unlockAudio();
    audio.playClick();
    if (!audio.isPlaying && !audio.isMuted) {
      audio.startBGM();
    }

    if (!resume) {
      this.currentIndex = 0;
    }
    this.setScreen('story');
    this.renderSlide(this.currentIndex);
  }

  renderSlide(index) {
    if (index < 0) index = 0;
    if (index >= this.totalSlides) {
      this.showConfession();
      return;
    }

    this.currentIndex = index;
    this.saveProgress();

    const slide = STORY_SLIDES[index];

    // Play soft page turn sound
    audio.playPageTurn();

    // Update Indicators
    const pageStr = `${String(slide.id).padStart(2, '0')} / ${String(this.totalSlides).padStart(2, '0')}`;
    if (this.dom.pageIndicator) {
      this.dom.pageIndicator.textContent = pageStr;
    }
    if (this.dom.progressBar) {
      const percent = ((index + 1) / this.totalSlides) * 100;
      this.dom.progressBar.style.width = `${percent}%`;
    }

    if (this.dom.chapterBadge) {
      this.dom.chapterBadge.textContent = slide.label;
    }

    // Story Panel animation trigger
    if (this.dom.storyPanel) {
      this.dom.storyPanel.classList.remove('panel-slide-up');
      void this.dom.storyPanel.offsetWidth; // trigger reflow
      this.dom.storyPanel.classList.add('panel-slide-up');
    }

    // Start Typewriter
    this.startTypewriter(slide.text);

    // Update Nav Buttons
    if (this.dom.btnPrev) {
      this.dom.btnPrev.disabled = index === 0;
      this.dom.btnPrev.style.opacity = index === 0 ? '0.4' : '1';
    }
  }

  startTypewriter(text) {
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }

    this.targetText = text;
    this.textCharIndex = 0;
    this.isTyping = true;

    if (this.dom.textContainer) {
      this.dom.textContainer.innerHTML = '';
      this.dom.textContainer.classList.add('typing');
    }

    if (this.instantText) {
      this.finishTypewriterInstant();
      return;
    }

    this.typeNextChar();
  }

  typeNextChar() {
    if (!this.isTyping) return;

    if (this.textCharIndex < this.targetText.length) {
      const char = this.targetText.charAt(this.textCharIndex);
      this.textCharIndex++;

      if (this.dom.textContainer) {
        // Format newlines as paragraph breaks
        const formatted = this.targetText.slice(0, this.textCharIndex).replace(/\n\n/g, '<br><br>');
        this.dom.textContainer.innerHTML = formatted;
      }

      // Slightly longer pause on punctuation
      let delay = this.typeSpeed;
      if (char === '.' || char === '!' || char === '?') {
        delay = 240;
      } else if (char === ',' || char === '—') {
        delay = 120;
      } else if (char === '…') {
        delay = 300;
      }

      this.typewriterTimer = setTimeout(() => this.typeNextChar(), delay);
    } else {
      this.finishTypewriter();
    }
  }

  finishTypewriterInstant() {
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isTyping = false;
    if (this.dom.textContainer) {
      this.dom.textContainer.innerHTML = this.targetText.replace(/\n\n/g, '<br><br>');
      this.dom.textContainer.classList.remove('typing');
    }
  }

  finishTypewriter() {
    this.isTyping = false;
    if (this.dom.textContainer) {
      this.dom.textContainer.classList.remove('typing');
    }
  }

  handleNext() {
    // If text is still typing, clicking finishes text immediately
    if (this.isTyping) {
      this.finishTypewriterInstant();
      return;
    }

    // Move to next slide or confession
    if (this.currentIndex < this.totalSlides - 1) {
      this.renderSlide(this.currentIndex + 1);
    } else {
      this.showConfession();
    }
  }

  handlePrev() {
    if (this.currentIndex > 0) {
      this.renderSlide(this.currentIndex - 1);
    } else {
      // Return to intro
      audio.playClick();
      this.setScreen('intro');
    }
  }

  showConfession() {
    audio.playPageTurn();
    this.setScreen('confession');

    if (this.dom.confessionQuote) {
      this.dom.confessionQuote.textContent = `"${CONFESSION_DATA.quote}"`;
    }
    if (this.dom.confessionQuestion) {
      this.dom.confessionQuestion.textContent = CONFESSION_DATA.question;
    }
  }

  handleChoice(choiceId) {
    audio.playClick();

    if (choiceId === 'accept') {
      audio.playConfessionSparkle();
      if (this.particleSystem) {
        this.particleSystem.triggerCelebration();
      }
      this.renderResponse('accept');
    } else {
      audio.playCalmTone();
      this.renderResponse('decline');
    }
  }

  renderResponse(type) {
    const data = RESPONSE_DATA[type];
    if (!data) return;

    this.setScreen('response');

    if (this.dom.responseBadge) {
      this.dom.responseBadge.textContent = data.badge;
    }
    if (this.dom.responseTitle) {
      this.dom.responseTitle.textContent = data.title;
    }
    if (this.dom.responseMessage) {
      this.dom.responseMessage.textContent = data.message;
    }
    if (this.dom.btnResponseAction) {
      this.dom.btnResponseAction.textContent = data.actionText;
      this.dom.btnResponseAction.dataset.actionType = type;
    }

    const card = this.dom.responseCard;
    if (card) {
      card.classList.remove('theme-golden', 'theme-ocean');
      card.classList.add(`theme-${data.theme}`);
    }
  }

  restart() {
    audio.playClick();
    this.currentIndex = 0;
    this.saveProgress();
    this.setScreen('intro');
  }

  jumpToChapter(index) {
    audio.playClick();
    if (index >= 0 && index < this.totalSlides) {
      this.setScreen('story');
      this.renderSlide(index);
    } else if (index === this.totalSlides) {
      this.showConfession();
    }
  }
}
