import { useState, useEffect, FormEvent } from 'react';
import { X, Check } from 'lucide-react';
import { Flashcard, Category } from '../types';

interface FlashcardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Omit<Flashcard, 'timesReviewed' | 'timesCorrect' | 'status'> & { id?: string }) => void;
  categories: Category[];
  editCard?: Flashcard | null;
}

export default function FlashcardFormModal({
  isOpen,
  onClose,
  onSave,
  categories,
  editCard
}: FlashcardFormModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [hint, setHint] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');

  // Edit card o'zgarishi bilan form ma'lumotlarini yuklash
  useEffect(() => {
    if (editCard) {
      setFront(editCard.front);
      setBack(editCard.back);
      setCategory(editCard.category);
      setHint(editCard.hint || '');
      setIsFavorite(editCard.isFavorite);
      setError('');
    } else {
      setFront('');
      setBack('');
      // Birinchi kelgan tahrirlash daxldor toifasini tanlab turamiz default qilib
      setCategory(categories[0]?.name || '');
      setHint('');
      setIsFavorite(false);
      setError('');
    }
  }, [editCard, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (front.trim().length < 3) {
      setError('Karta savoli kamida 3 ta belgidan iborat bo‘lishi shart.');
      return;
    }
    if (back.trim().length < 3) {
      setError('Karta javobi kamida 3 ta belgidan iborat bo‘lishi shart.');
      return;
    }
    if (!category) {
      setError('Iltimos, kartaga mos keladigan toifani tanlang.');
      return;
    }

    onSave({
      id: editCard?.id, // editCard bo'lsa id o'zgarmasdan qoladi, yangi bo'lsa undefined
      front: front.trim(),
      back: back.trim(),
      category,
      hint: hint.trim() || undefined,
      isFavorite
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="flashcard-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} id="flashcard-modal-box">
        
        {/* Modal Sarlavhasi */}
        <div className="modal-header">
          <h3 className="modal-title">
            {editCard ? 'Kartochkani tahrirlash' : 'Yangi yodlash kartochkasi'}
          </h3>
          <button className="modal-close-btn" onClick={onClose} id="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Modal Formasi */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {error && (
              <div 
                style={{ 
                  backgroundColor: 'var(--danger-light)', 
                  color: 'var(--danger)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderLeft: '4px solid var(--danger)'
                }}
                id="modal-error-alert"
              >
                ⚠️ {error}
              </div>
            )}

            {/* Savol / Front */}
            <div className="form-group">
              <label className="form-label" htmlFor="front-input">Savol / Tushuncha (Oldi tomoni)</label>
              <input
                id="front-input"
                type="text"
                className="form-input"
                placeholder="Masalan: JSX nima?"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                maxLength={120}
                required
              />
              <div className="field-info">
                <span>Esdan chiqmaydigan qisqa savol yozing</span>
                <span>{front.length}/120</span>
              </div>
            </div>

            {/* Javob / Back */}
            <div className="form-group">
              <label className="form-label" htmlFor="back-textarea">To‘g‘ri Javob / Ta’rif (Orqa tomoni)</label>
              <textarea
                id="back-textarea"
                className="form-textarea"
                placeholder="Savolga qisqa, tushunarli va mazmunli javob keltiring..."
                value={back}
                onChange={(e) => setBack(e.target.value)}
                maxLength={300}
                required
              />
              <div className="field-info">
                <span>Asosiy g‘oyani aniq va lo‘nda bayon eting</span>
                <span>{back.length}/300</span>
              </div>
            </div>

            {/* Kategoriya Tanlash */}
            <div className="form-group">
              <label className="form-label" htmlFor="category-select">Toifasi (Kategoriya)</label>
              <select
                id="category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Toifa tanlang</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Shama / Hint */}
            <div className="form-group">
              <label className="form-label" htmlFor="hint-input">Yordamchi shama / Hint (Ixtiyoriy)</label>
              <input
                id="hint-input"
                type="text"
                className="form-input"
                placeholder="Masalan: XML bosh harflari uyg‘unligi"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                maxLength={80}
              />
              <div className="field-info">
                <span>Mashq vaqtida esga soluvchi kalit so‘z</span>
                <span>{hint.length}/80</span>
              </div>
            </div>

            {/* Sevimlilar ro‘yxatiga tezkor qo‘shish */}
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem 0' }}>
              <input
                id="is-favorite-checkbox"
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="is-favorite-checkbox" style={{ fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Ushbu kartani sevimli (saralangan) sifatida saqlash
              </label>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} id="modal-cancel-btn">
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary" id="modal-submit-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={16} /> Saqlash
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
