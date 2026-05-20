import { useState } from 'react';
import { Edit3, Trash2, Star, Eye, EyeOff, Tag, RefreshCcw } from 'lucide-react';
import { Flashcard, Category } from '../types';

interface FlashcardListProps {
  cards: Flashcard[];
  categories: Category[];
  searchQuery: string;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function FlashcardList({
  cards,
  categories,
  searchQuery,
  onEditCard,
  onDeleteCard,
  onToggleFavorite
}: FlashcardListProps) {
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Javoblarni katalog ko'rinishida yashirish/ko'rsatish kartalarni alohida boshqarish
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Karta toifasi uchun rang topish
  const getCategoryColor = (categoryName: string) => {
    const found = categories.find(c => c.name === categoryName);
    return found ? found.color : 'var(--primary)';
  };

  // Qidiruv va toifalar bo'yicha saralash
  const processCards = () => {
    let result = [...cards];

    // 1. Kategoriyali filtr
    if (selectedCatFilter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    } else if (selectedCatFilter !== 'all') {
      result = result.filter(c => c.category === selectedCatFilter);
    }

    // 2. Qidiruv qismini qayta tekshirish
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.front.toLowerCase().includes(q) || 
        c.back.toLowerCase().includes(q) ||
        (c.hint && c.hint.toLowerCase().includes(q))
      );
    }

    // 3. Tartiblash / Sort
    if (sortBy === 'newest') {
      // Yangilari yuqorida (Array oxiridagilar yoki id boyicha)
      result.reverse();
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.front.localeCompare(b.front));
    } else if (sortBy === 'correct_rate') {
      // Togri topilishi foizi kamlari yuqorida (qayta organilishi zarur bo'lganlar)
      result.sort((a, b) => {
        const rateA = a.timesReviewed > 0 ? a.timesCorrect / a.timesReviewed : 0;
        const rateB = b.timesReviewed > 0 ? b.timesCorrect / b.timesReviewed : 0;
        return rateA - rateB;
      });
    }

    return result;
  };

  const filteredCards = processCards();

  const getStatusLabelUz = (status: Flashcard['status']) => {
    switch (status) {
      case 'mastered': return 'O‘zlashtirildi';
      case 'learning': return 'O‘rganilyapti';
      default: return 'Yangi';
    }
  };

  return (
    <div className="catalog-container" id="cards-catalog-manager">
      
      {/* Kategoriya pilllar va Sortirovka satri */}
      <div className="card-filter-row" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-left">
          <button 
            className={`filter-pill ${selectedCatFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCatFilter('all')}
          >
            Hammasi ({cards.length})
          </button>
          <button 
            className={`filter-pill ${selectedCatFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setSelectedCatFilter('favorites')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            Sevimli ⭐ ({cards.filter(c => c.isFavorite).length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill ${selectedCatFilter === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCatFilter(cat.name)}
              style={selectedCatFilter === cat.name ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            >
              {cat.name} ({cards.filter(c => c.category === cat.name).length})
            </button>
          ))}
        </div>

        <div className="filter-right">
          <select 
            className="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-cards-dropdown"
          >
            <option value="newest">Eng yangilaridan boshlab</option>
            <option value="alphabetical">Alifbo bo‘yicha (A-Z)</option>
            <option value="correct_rate">O‘zlashtirish foizi pastlari</option>
          </select>
        </div>
      </div>

      {/* Kartalar to‘plami Grid */}
      {filteredCards.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem 1.5rem' }} id="catalog-empty-state">
          <div className="empty-state-icon" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <Tag size={32} />
          </div>
          <h3 className="empty-state-title">Kartochkalar topilmadi</h3>
          <p className="empty-state-desc">
            Siz tanlagan filtr yoki qidiruv so‘rovi bo‘yicha natijalar mavjud emas. Filtrlarni almashtirib ko‘ring.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSelectedCatFilter('all'); setSortBy('newest'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={14} /> Barcha kartalarni qaytarish
          </button>
        </div>
      ) : (
        <div className="cards-grid" id="catalog-cards-grid">
          {filteredCards.map((card) => {
            const catColor = getCategoryColor(card.category);
            const isRevealed = !!revealedCardIds[card.id];

            return (
              <div 
                className="catalog-card" 
                key={card.id} 
                style={{ borderTop: `4px solid ${catColor}` }}
                id={`catalog-card-item-${card.id}`}
              >
                {/* Karta yuqori satri */}
                <div className="catalog-card-header">
                  <span 
                    className="card-tag" 
                    style={{ 
                      color: catColor, 
                      backgroundColor: `${catColor}12`, 
                      borderColor: `${catColor}25`,
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem'
                    }}
                  >
                    {card.category}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`status-badge ${card.status}`}>
                      {getStatusLabelUz(card.status)}
                    </span>
                    <button 
                      className={`card-favorite-btn ${card.isFavorite ? 'favorite' : ''}`}
                      onClick={() => onToggleFavorite(card.id)}
                      style={{ padding: 0 }}
                    >
                      <Star size={16} fill={card.isFavorite ? 'var(--warning)' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Karta tanasi */}
                <div 
                  className="catalog-card-body" 
                  onClick={() => toggleReveal(card.id)}
                  title="Javobni ko‘rish uchun bosing"
                >
                  <div className="catalog-card-front-txt">{card.front}</div>
                  {isRevealed ? (
                    <div className="catalog-card-back-txt">{card.back}</div>
                  ) : (
                    <div 
                      className="catalog-card-back-txt" 
                      style={{ 
                        fontStyle: 'italic', 
                        color: 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        cursor: 'pointer',
                        borderColor: 'transparent'
                      }}
                    >
                      <Eye size={14} /> Javob yashirilgan (Ko‘rish uchun bosing)
                    </div>
                  )}
                  {card.hint && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      💡 <span>Yordam matni mavjud</span>
                    </div>
                  )}
                </div>

                {/* Karta quyi satri va boshqaruv */}
                <div className="catalog-card-footer">
                  <div className="catalog-card-meta">
                    <span>Ko‘rilgan: {card.timesReviewed}</span>
                    <span>•</span>
                    <span>Tog‘ri: {card.timesCorrect}</span>
                  </div>

                  <div className="card-actions-row">
                    <button 
                      className="action-btn" 
                      onClick={() => toggleReveal(card.id)}
                      title={isRevealed ? "Javobni yashirish" : "Javobni ochish"}
                      id={`reveal-action-btn-${card.id}`}
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => onEditCard(card)}
                      title="Kartochkani tahrirlash"
                      id={`edit-action-btn-${card.id}`}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="action-btn action-btn-danger" 
                      onClick={() => {
                        const confirmDelete = window.confirm("Rostdan ham ushbu yodlash kartochkasini o‘chirmoqchimisiz?");
                        if (confirmDelete) onDeleteCard(card.id);
                      }}
                      title="Kartochkani o‘chirish"
                      id={`delete-action-btn-${card.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
