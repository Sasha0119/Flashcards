import { Award, Layers, Star, Flame } from 'lucide-react';
import { Flashcard } from '../types';

interface DashboardStatsProps {
  cards: Flashcard[];
  streak: number;
}

export default function DashboardStats({ cards, streak }: DashboardStatsProps) {
  const totalCount = cards.length;
  const favoriteCount = cards.filter(c => c.isFavorite).length;
  const masteredCount = cards.filter(c => c.status === 'mastered').length;
  const learningCount = cards.filter(c => c.status === 'learning').length;

  const progressPercentage = totalCount > 0 
    ? Math.round((masteredCount / totalCount) * 100) 
    : 0;

  return (
    <div className="stats-grid" id="dashboard-stats-section">
      {/* Jami Kartochkalar */}
      <div className="stat-card" id="stat-total-cards">
        <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Layers size={24} />
        </div>
        <div className="stat-info">
          <div className="num">{totalCount}</div>
          <div className="lbl">Jami kartalar</div>
        </div>
      </div>

      {/* Sevimlilar */}
      <div className="stat-card" id="stat-favorites">
        <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
          <Star size={24} fill={favoriteCount > 0 ? 'var(--warning)' : 'none'} />
        </div>
        <div className="stat-info">
          <div className="num">{favoriteCount}</div>
          <div className="lbl">Sevimli kartalar</div>
        </div>
      </div>

      {/* O'zlashtirilgan */}
      <div className="stat-card" id="stat-mastered">
        <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
          <Award size={24} />
        </div>
        <div className="stat-info">
          <div className="num">{progressPercentage}%</div>
          <div className="lbl">O‘zlashtirildi ({masteredCount})</div>
        </div>
      </div>

      {/* Kunlik faollik streak */}
      <div className="stat-card" id="stat-streak">
        <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
          <Flame size={24} fill="var(--danger)" />
        </div>
        <div className="stat-info">
          <div className="num">{streak} kun</div>
          <div className="lbl">Kunlik faollik</div>
        </div>
      </div>
    </div>
  );
}
