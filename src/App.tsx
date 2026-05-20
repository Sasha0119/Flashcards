import { useState, useEffect, FormEvent } from 'react';
import * as Icons from 'lucide-react';
import { 
  Plus, 
  Menu, 
  X, 
  Layers, 
  Star, 
  Search, 
  Info, 
  Sparkles,
  Award
} from 'lucide-react';

import { Flashcard, Category } from './types';
import { INITIAL_CATEGORIES, INITIAL_FLASHCARDS } from './initialData';
import DashboardStats from './components/DashboardStats';
import StudyMode from './components/StudyMode';
import FlashcardList from './components/FlashcardList';
import FlashcardFormModal from './components/FlashcardFormModal';

// Dinamik Lucide Icon chiqaruvchi komponentimiz
const DynamicIcon = ({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.Tag;
  return <IconComponent size={size} className={className} />;
};

export default function App() {
  // --- STATE ---
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [streak, setStreak] = useState<number>(3); // Default streak (3 kun)
  
  const [activeTab, setActiveTab] = useState<'learn' | 'cards'>('learn');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modallar va tahrirlash state-lari
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  
  // Mobil sidebar boshqaruvi
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  
  // Yangi kategoriya yaratish fildlari
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#a855f7'); // default binafsha
  
  const colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6'];

  // --- LOCAL STORAGE YUKLASH/SAQLASH ---
  useEffect(() => {
    const storedCards = localStorage.getItem('flashcards_data');
    const storedCategories = localStorage.getItem('flashcards_categories');
    const storedStreak = localStorage.getItem('flashcards_streak');

    if (storedCards) {
      setCards(JSON.parse(storedCards));
    } else {
      setCards(INITIAL_FLASHCARDS);
      localStorage.setItem('flashcards_data', JSON.stringify(INITIAL_FLASHCARDS));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('flashcards_categories', JSON.stringify(INITIAL_CATEGORIES));
    }

    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    } else {
      setStreak(3);
      localStorage.setItem('flashcards_streak', '3');
    }
  }, []);

  // Kartalar o'zgarganda saqlash
  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem('flashcards_data', JSON.stringify(newCards));
  };

  // Kategoriyalar o'zgarganda saqlash
  const saveCategories = (newCats: Category[]) => {
    setCategories(newCats);
    localStorage.setItem('flashcards_categories', JSON.stringify(newCats));
  };

  // --- AMALLAR (FUNCTIONS) ---
  
  // Karta tahrirlash yoki uning ustidan mashq bajarilganlik natijasi
  const handleCardUpdateStatus = (id: string, isCorrect: boolean) => {
    const updated = cards.map(c => {
      if (c.id === id) {
        const nextReviewed = c.timesReviewed + 1;
        const nextCorrect = isCorrect ? c.timesCorrect + 1 : c.timesCorrect;
        
        // Agar o'quvchi to'g'ri topsa "mastered" (o'zlashtirilgan) bo'ladi, aks holds "learning"
        const nextStatus = isCorrect ? 'mastered' : 'learning';

        return {
          ...c,
          timesReviewed: nextReviewed,
          timesCorrect: nextCorrect,
          status: nextStatus as 'learning' | 'mastered'
        };
      }
      return c;
    });
    saveCards(updated);
  };

  // Sevimli kartalarni yoqish/o'chirish
  const handleToggleFavorite = (id: string) => {
    const updated = cards.map(c => {
      if (c.id === id) {
        return { ...c, isFavorite: !c.isFavorite };
      }
      return c;
    });
    saveCards(updated);
  };

  // Yangi karta saqlash yoki tahrirlanganini yangilash
  const handleSaveCard = (cardData: Omit<Flashcard, 'timesReviewed' | 'timesCorrect' | 'status'> & { id?: string }) => {
    if (cardData.id) {
      // Tahrirlash (Edit)
      const updated = cards.map(c => {
        if (c.id === cardData.id) {
          return {
            ...c,
            front: cardData.front,
            back: cardData.back,
            category: cardData.category,
            hint: cardData.hint,
            isFavorite: cardData.isFavorite
          };
        }
        return c;
      });
      saveCards(updated);
    } else {
      // Yangi karta qo'shish (Add)
      const newCardEntry: Flashcard = {
        id: 'f-' + Date.now(),
        front: cardData.front,
        back: cardData.back,
        category: cardData.category,
        hint: cardData.hint,
        isFavorite: cardData.isFavorite,
        status: 'new',
        timesReviewed: 0,
        timesCorrect: 0
      };
      saveCards([...cards, newCardEntry]);
    }
    setEditingCard(null);
  };

  // Karta o'chirish
  const handleDeleteCard = (id: string) => {
    const filtered = cards.filter(c => c.id !== id);
    saveCards(filtered);
  };

  // Yangi toifa (kategoriya) yaratish sidebar-dan
  const handleCreateCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Toifa nomi dublicat bo'lmasligi kerak
    const exists = categories.some(cat => cat.name.toLowerCase() === newCatName.trim().toLowerCase());
    if (exists) {
      alert("Bu nomdagi toifa allaqachon mavjud!");
      return;
    }

    const newCategory: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      color: newCatColor,
      icon: 'BookOpen' // default chiroyli kitobcha belgisi
    };

    const updated = [...categories, newCategory];
    saveCategories(updated);
    
    // reset inputs
    setNewCatName('');
    setSelectedCategory(newCategory.name); // yangi yaratilgan toifaga avtomatik o'tish
  };

  // Toifani o'chirish
  const handleDeleteCategory = (catId: string, catName: string) => {
    const confirmDelete = window.confirm(`"${catName}" toifasini o‘chirmoqchimisiz? Shu toifaga tegishli kartalar default 'Dasturlash' toifasiga o‘tkaziladi.`);
    if (!confirmDelete) return;

    // Toifani sidebar o'chiradi
    const remainingCats = categories.filter(c => c.id !== catId);
    saveCategories(remainingCats);

    // Shu toifadagi kartalarni default bizdagi birinchi toifaga o'tkazish
    const fallbackCategoryName = remainingCats[0]?.name || 'Dasturlash';
    const updatedCards = cards.map(c => {
      if (c.category === catName) {
        return { ...c, category: fallbackCategoryName };
      }
      return c;
    });
    saveCards(updatedCards);

    if (selectedCategory === catName) {
      setSelectedCategory('all');
    }
  };

  // Kunlik dars tugatganda yoki muvaffaqiyat qozonganda streakni oshirish
  const handleIncrementStreak = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    localStorage.setItem('flashcards_streak', nextStreak.toString());
  };

  // Karta tahrirlash modalini ochish amali
  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  // Yangi karta yaratish modalini ochish amali
  const openAddModal = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };

  return (
    <div>
      {/* 1. MOBIL HEADER */}
      <header className="mobile-header" id="mobile-navigation-bar">
        <div className="sidebar-logo">
          🎓 Flashcards <span>Uzbek</span>
        </div>
        <button 
          className="menu-toggle-btn" 
          onClick={() => setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile)}
          aria-label="Menyu"
        >
          {isSidebarOpenOnMobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ASOSIY ILOVA TARKIBI (GRID) */}
      <div className="app-container" id="app-main-layout">
        
        {/* 2. YON PANEL (SIDEBAR) */}
        <aside className={`sidebar ${isSidebarOpenOnMobile ? 'mobile-open' : ''}`} id="app-sidebar-panel">
          
          {/* Logo faqat desktopda */}
          <div className="sidebar-logo" style={{ marginBottom: '1rem' }}>
            🎓 Flashcards <span>Uz Uzbek</span>
          </div>

          {/* Menyu Bo'limi */}
          <div className="sidebar-menu-section">
            <h4 className="sidebar-section-title">Asosiy amallar</h4>
            
            <button 
              className={`sidebar-nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('learn');
                setIsSidebarOpenOnMobile(false);
              }}
              id="sidebar-learn-mode-btn"
            >
              <div className="left-content">
                <Sparkles size={18} />
                <span>Mashq / O‘rganish</span>
              </div>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('cards');
                setIsSidebarOpenOnMobile(false);
              }}
              id="sidebar-card-catalog-btn"
            >
              <div className="left-content">
                <Layers size={18} />
                <span>Kartalar ro‘yxati</span>
              </div>
              <span className={`badge ${activeTab === 'cards' ? 'active' : ''}`}>
                {cards.length}
              </span>
            </button>
          </div>

          {/* Toifalar (Kategoriyalar) Filter Bo'limi */}
          <div className="sidebar-menu-section">
            <h4 className="sidebar-section-title">O‘rganish Toifalari</h4>
            
            {/* Hammasi filtri */}
            <button 
              className={`category-nav-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('all');
                setIsSidebarOpenOnMobile(false);
              }}
              style={{ color: '#fff', fontSize: '0.95rem', fontWeight: selectedCategory === 'all' ? '700' : '500' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="category-color-dot" style={{ backgroundColor: 'var(--primary)' }} />
                <span>Barcha toifalar</span>
              </div>
            </button>

            {/* Sevimlilar */}
            <button 
              className={`category-nav-btn ${selectedCategory === 'favorites' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('favorites');
                setIsSidebarOpenOnMobile(false);
              }}
              style={{ color: '#f59e0b', fontSize: '0.95rem', fontWeight: selectedCategory === 'favorites' ? '700' : '500' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Star size={14} fill="currentColor" />
                <span>Saralangan mavzular</span>
              </div>
            </button>

            {/* Dinamik toifalar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.25rem' }}>
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <button
                    className={`category-nav-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setIsSidebarOpenOnMobile(false);
                    }}
                    style={{ flex: 1, color: '#f1f5f9' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="category-color-dot" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                  </button>

                  {/* Kategoriya o'chirish - kamida bitta kategoriya turishi uchun */}
                  {categories.length > 1 && (
                    <button 
                      className="cat-delete-btn"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      title="Toifani o‘chirish"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Yangi Toifa Qo'shish Qutichasi */}
          <form className="new-category-box" onSubmit={handleCreateCategory} id="new-category-form">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f1f5f9', opacity: 0.9 }}>
              + Yangi toifa qo‘shish
            </span>
            <input 
              type="text" 
              className="new-category-input"
              placeholder="Toifa nomi (m-n: Fizika)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              maxLength={22}
              required
            />
            
            {/* Rangni tanlash dots */}
            <div className="new-category-color-picker">
              {colorOptions.map(color => (
                <div 
                  key={color}
                  className={`color-dot-option ${newCatColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCatColor(color)}
                />
              ))}
            </div>

            <button type="submit" className="add-cat-go-btn" id="add-cat-go-btn">
              Toifa qo‘shish 🚀
            </button>
          </form>

          {/* Pro Tip Qutichasi */}
          <div className="pro-tip-box" style={{ marginTop: 'auto', backgroundColor: '#1e293b' }}>
            <span className="pro-tip-icon" style={{ color: '#818cf8' }}>💡</span>
            <div className="pro-tip-content">
              <h5 style={{ color: '#fff' }}>Tezkor maslahat!</h5>
              <p style={{ color: '#94a3b8' }}>Mashqda narsani yodda saqlash uchun fonga yordam hints yarating va card-ustiga bosing.</p>
            </div>
          </div>

        </aside>

        {/* 3. ASOSIY ISHCHI BO'LIM (MAIN PANELS) */}
        <main className="main-wrapper" id="app-workspace-main">
          
          {/* Yuqori Header Satri */}
          <header className="header" id="app-header-controls">
            
            <div className="search-bar-container">
              <input 
                type="text" 
                className="search-input"
                placeholder="Savol yoki javoblar bo‘ylab qidirish..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Qidiruv boshlangan zahotiyoq avtomatik list tabiga otkazish orni saqlab qoladi
                  if (activeTab !== 'cards' && e.target.value !== '') {
                    setActiveTab('cards');
                  }
                }}
                id="global-search-query"
              />
              <Search className="search-icon" size={16} />
            </div>

            <div className="header-actions">
              {/* Yangi karta qo'shish */}
              <button className="btn btn-primary" onClick={openAddModal} id="yangi-karta-btn">
                <Plus size={16} /> Yangi Karta
              </button>
            </div>

          </header>

          <div className="content-body" id="app-dashboard-workspace">
            
            {/* Statistika Plitkalari */}
            <DashboardStats cards={cards} streak={streak} />

            {/* TAB-NAVIGATION BUTTONS */}
            <div className="tab-navigation" id="workspace-tab-controls">
              <button 
                className={`tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
                onClick={() => setActiveTab('learn')}
                id="tab-btn-learn"
              >
                Mashq qilish rejimi (Quiz)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
                onClick={() => setActiveTab('cards')}
                id="tab-btn-cards"
              >
                Karta katalogi ({cards.length} ta)
              </button>
            </div>

            {/* TAB CONTROLLERS INTRO */}
            {activeTab === 'learn' ? (
              <StudyMode 
                cards={cards}
                categories={categories}
                selectedCategory={selectedCategory}
                onCardUpdate={handleCardUpdateStatus}
                onToggleFavorite={handleToggleFavorite}
                onIncrementStreak={handleIncrementStreak}
              />
            ) : (
              <FlashcardList 
                cards={cards}
                categories={categories}
                searchQuery={searchQuery}
                onEditCard={openEditModal}
                onDeleteCard={handleDeleteCard}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

          </div>

          {/* Dashboard bottom branding */}
          <footer style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Kartochkalar Ilovasi</strong> — O‘zbekistondagi eng ilg‘or intellektual yodlash va xotira mashqlari tizimi © 2026.
          </footer>

        </main>

      </div>

      {/* 4. YANGIRLASH/TASHRIFLASH MODALI */}
      <FlashcardFormModal 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        categories={categories}
        editCard={editingCard}
      />
    </div>
  );
}
