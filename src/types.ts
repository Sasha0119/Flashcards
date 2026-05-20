export interface Flashcard {
  id: string;
  front: string; // Savol yoki Atama
  back: string;  // Javob yoki Ma'nosi
  category: string; // Toifa nomi
  isFavorite: boolean; // Sevimli statusi
  status: 'new' | 'learning' | 'mastered'; // O'zlashtirish holati
  timesReviewed: number; // Ko'rilgan soni
  timesCorrect: number;  // To'g'ri topilgan soni
  hint?: string; // Yordamchi matn yoki maslahat
}

export interface Category {
  id: string;
  name: string;
  color: string; // Karta toifasining rangi (border yoki fon uchun hex/rgb)
  icon: string;  // Lucide icon nomi
}

export interface StudyStats {
  totalReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
}
