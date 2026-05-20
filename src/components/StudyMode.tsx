import { useState, useEffect } from 'react';
import { RotateCw, HelpCircle, Star, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Flashcard, Category } from '../types';

interface StudyModeProps {
  cards: Flashcard[];
  categories: Category[];
  selectedCategory: string; // 'all' yoki 'favorites' yoki Toifa nomi
  onCardUpdate: (id: string, isCorrect: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onIncrementStreak: () => void;
}

export default function StudyMode({
  cards,
  categories,
  selectedCategory,
  onCardUpdate,
  onToggleFavorite,
  onIncrementStreak
}: StudyModeProps) {
  // O'rganish uchun kartalar ro'yxatini filtrlash
  const getFilteredCards = () => {
    let filteredArr = [...cards];
    if (selectedCategory === 'favorites') {
      filteredArr = filteredArr.filter(c => c.isFavorite);
    } else if (selectedCategory !== 'all') {
      filteredArr = filteredArr.filter(c => c.category === selectedCategory);
    }
    return filteredArr;
  };

  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // O'quv seansi dagi statistikalar
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Har gal kategoriya yoki jami kartochkalar yangilanganda deck qayta yuklanadi
  useEffect(() => {
    const rawFiltered = getFilteredCards();
    // Kartalarni chalkash (shuffle) qilish (qiziqarliroq bo'lishi uchun)
    const shuffled = [...rawFiltered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    // Seans statistikalari reset
    setSessionReviewed(0);
    setSessionCorrect(0);
  }, [selectedCategory, cards.length]);

  const handleRestart = () => {
    const rawFiltered = getFilteredCards();
    const shuffled = [...rawFiltered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    setSessionReviewed(0);
    setSessionCorrect(0);
  };

  if (deck.length === 0) {
    return (
      <div className="empty-state" id="study-empty-state">
        <div className="empty-state-icon">
          <Layers size={36} />
        </div>
        <h3 className="empty-state-title">O‘rganish uchun kartalar yo‘q</h3>
        <p className="empty-state-desc">
          {selectedCategory === 'favorites' 
            ? "Siz sevimli deb belgilagan kartalar topilmadi. Avval sevimlilar ro‘yxatiga karta qo‘shing." 
            : selectedCategory === 'all'
              ? "Hozircha ilovada kartalar mavjud emas. Yuqoridagi tugma orqali o‘zingizning birinchi yodlash kartochkangizni yarating!"
              : `${selectedCategory} toifasida hozircha kartalar yo‘q. Yangi karta qo‘shing yoki boshqa toifani tanlang.`}
        </p>
      </div>
    );
  }

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleFeedback = (isCorrect: boolean) => {
    // Parent state va local storageni yangilash
    onCardUpdate(currentCard.id, isCorrect);
    
    // Seans statistikalari
    setSessionReviewed(prev => prev + 1);
    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
    }

    // Keyingi kartaga o'tish
    setIsFlipped(false);
    setShowHint(false);
    
    // Animatsiya silliq tugashi uchun kichik kechikish bilan index o'zgaradi
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Deck tugadi!
        setIsFinished(true);
        // Streakni oshirish
        onIncrementStreak();
      }
    }, 200);
  };

  const handleSkip = () => {
    setIsFlipped(false);
    setShowHint(false);
    
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  // Agar seans tugagan bo'lsa, natijalarni ko'rsatish (Celebration)
  if (isFinished) {
    const successRate = sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0;
    return (
      <div className="celebration-box" id="study-celebration-container">
        <div className="success-checkmark">
          <Sparkles size={40} />
        </div>
        <h2 className="celebration-title">Mashq Yakunlandi!</h2>
        <p className="empty-state-desc" style={{ margin: '0.5rem auto 1.5rem' }}>
          Baraka toping! Ushbu mashg‘ulot to‘plamini muvaffaqiyatli o‘rganib chiqdingiz.
        </p>

        <div className="celebration-grid">
          <div className="celebration-stat">
            <div className="celebration-stat-num">{sessionReviewed}</div>
            <div className="celebration-stat-lbl">KO‘RILGAN KARTALAR</div>
          </div>
          <div className="celebration-stat2 celebration-stat">
            <div className="celebration-stat-num success">{sessionCorrect}</div>
            <div className="celebration-stat-lbl">TO‘G‘RI TOPILDI</div>
          </div>
          <div className="celebration-stat3 celebration-stat">
            <div className="celebration-stat-num" style={{ color: 'var(--primary)' }}>{successRate}%</div>
            <div className="celebration-stat-lbl">O‘ZLASHTIRISH COEF.</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={handleRestart} id="restart-study-btn">
            <RefreshCw size={16} /> Qayta mashq qilish
          </button>
        </div>
      </div>
    );
  }

  // Toifa boyicha rangni olish
  const currentCategoryObj = categories.find(cat => cat.name === currentCard.category);
  const categoryColor = currentCategoryObj?.color || 'var(--primary)';

  // Rivojlanish ko'rsatkichi (progress) hisobi
  const calculatedProgress = ((currentIndex) / deck.length) * 100;

  return (
    <div className="study-container" id="study-engine-workspace">
      {/* Kadr sarlavhasi va progress bar */}
      <div className="study-header">
        <div className="study-deck-info">
          <span className="study-deck-title">O‘rganish: </span>
          <span 
            className="card-tag" 
            style={{ 
              backgroundColor: `${categoryColor}15`, 
              color: categoryColor,
              borderColor: `${categoryColor}30`,
              fontWeight: 700 
            }}
          >
            {selectedCategory === 'all' 
              ? 'Barcha kartalar' 
              : selectedCategory === 'favorites' 
                ? 'Sevimli mavzular' 
                : selectedCategory}
          </span>
        </div>
        
        <div className="study-progress-container">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${calculatedProgress || (100 / deck.length) * currentIndex}%` }} 
            />
          </div>
          <span className="progress-text">{currentIndex + 1} / {deck.length}</span>
        </div>
      </div>

      {/* 3D Flip karta maydoni */}
      <div className="deck-stage">
        <div 
          className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`} 
          onClick={handleFlip}
          id={`3d-flashcard-${currentCard.id}`}
        >
          <div className="flashcard-inner">
            
            {/* SAVOL TARAF (Front Face) */}
            <div className="card-face card-face-front" style={{ borderTopColor: categoryColor }}>
              <div className="card-top-row">
                <span className="card-tag" style={{ color: categoryColor, backgroundColor: `${categoryColor}12`, borderColor: `${categoryColor}25` }}>
                  {currentCard.category}
                </span>
                <button 
                  className={`card-favorite-btn ${currentCard.isFavorite ? 'favorite' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Kartani burib yubormasligi uchun prevent qilamiz
                    onToggleFavorite(currentCard.id);
                  }}
                  title={currentCard.isFavorite ? "Sevimlidan o‘chirish" : "Sevimliga qo‘shish"}
                >
                  <Star size={20} fill={currentCard.isFavorite ? "var(--warning)" : "none"} />
                </button>
              </div>

              <div className="card-body">
                <span className="card-title-label">Savol / Tushuncha</span>
                <div className="card-text">{currentCard.front}</div>
                {showHint && currentCard.hint && (
                  <div className="card-hint-text">
                    💡 <strong>Yordam:</strong> {currentCard.hint}
                  </div>
                )}
              </div>

              <div className="card-top-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                {currentCard.hint ? (
                  <div 
                    className="card-hint-action" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                  >
                    <HelpCircle size={15} /> 
                    {showHint ? "Yordamni yashirish" : "Yordam matni asgari"}
                  </div>
                ) : (
                  <div></div>
                )}
                <span className="card-flip-action-hint">
                  <RotateCw size={12} /> Burish uchun bosing
                </span>
              </div>
            </div>

            {/* JAVOB TARAF (Back Face) */}
            <div className="card-face card-face-back">
              <div className="card-top-row">
                <span className="card-tag">{currentCard.category}</span>
                <button 
                  className={`card-favorite-btn ${currentCard.isFavorite ? 'favorite' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(currentCard.id);
                  }}
                >
                  <Star size={20} fill={currentCard.isFavorite ? "#eab308" : "none"} />
                </button>
              </div>

              <div className="card-body">
                <span className="card-title-label">To‘g‘ri Javob / Ta’rif</span>
                <div className="card-text" style={{ fontWeight: 500 }}>{currentCard.back}</div>
              </div>

              <div className="card-top-row" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Statistika: To‘g‘ri topilgan: {currentCard.timesCorrect}/{currentCard.timesReviewed} marta</span>
                <span className="card-flip-action-hint">
                  <RotateCw size={12} /> Mashqga qaytish
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Mashq nazorat tugmalari */}
        <div className="study-controls">
          {isFlipped ? (
            <div className="study-feedback-buttons">
              <button 
                className="feedback-btn feedback-dont-know" 
                onClick={() => handleFeedback(false)}
                id="feedback-no-btn"
              >
                <span className="feedback-lbl">Bilmayman 👎</span>
                <span className="feedback-sublbl">Yaxshiroq o‘rganish</span>
              </button>
              <button 
                className="feedback-btn feedback-know" 
                onClick={() => handleFeedback(true)}
                id="feedback-yes-btn"
              >
                <span className="feedback-lbl">Bilaman 👍</span>
                <span className="feedback-sublbl">Menga tanish</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.9rem' }} 
                onClick={handleFlip}
                id="flip-main-btn"
              >
                <RotateCw size={16} /> Javobni ko‘rish (Burish)
              </button>
              <button 
                className="skip-card-btn" 
                onClick={handleSkip}
                id="skip-main-btn"
              >
                O‘tkazib yuborish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
