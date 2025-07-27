/**
 * Performance Provider - Initialise tous les systèmes d'optimisation
 * Objectif : Atteindre 8.5/10 en performance
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { advancedCache } from '@/utils/cacheManager';
import { ComponentPreloader } from '@/utils/lazyComponents';
import { log } from '@/utils/securityLogger';

interface PerformanceContextType {
  score: number | null;
  rating: string;
  isOptimized: boolean;
  cacheStats: any;
  forceOptimization: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [score, setScore] = useState<number | null>(null);
  const [rating, setRating] = useState('Initialisation...');
  const [isOptimized, setIsOptimized] = useState(false);
  const [cacheStats, setCacheStats] = useState(null);

  useEffect(() => {
    initializePerformanceOptimizations();
    
    // Monitoring périodique
    const interval = setInterval(updatePerformanceMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const initializePerformanceOptimizations = async () => {
    try {
      log.info('Initializing performance optimizations', {}, 'PerformanceProvider');
      
      // 1. Précharger les composants critiques
      await ComponentPreloader.preloadCritical();
      
      // 2. Optimiser le cache
      const stats = advancedCache.getStats();
      setCacheStats(stats);
      
      // 3. Initialiser le monitoring
      performanceMonitor.forceEvaluation();
      
      // 4. Optimisations CSS et DOM
      optimizeDOM();
      
      // 5. Marquer comme optimisé
      setIsOptimized(true);
      
      log.info('Performance optimizations completed', {}, 'PerformanceProvider');
      
    } catch (error) {
      log.error('Performance optimization failed', error, 'PerformanceProvider');
    }
  };

  const optimizeDOM = () => {
    if (typeof window === 'undefined') return;
    
    // Optimiser le viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }
    
    // Préconnexions DNS
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    preconnects.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });
    
    // Préchargement des ressources critiques
    const preloads = [
      { href: '/dalil-new-logo.png', as: 'image' },
      { href: '/manifest.json', as: 'fetch', crossorigin: 'anonymous' }
    ];
    
    preloads.forEach(({ href, as, crossorigin }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (crossorigin) link.crossOrigin = crossorigin;
      document.head.appendChild(link);
    });
  };

  const updatePerformanceMetrics = () => {
    const currentScore = performanceMonitor.getCurrentScore();
    if (currentScore) {
      setScore(currentScore);
      setRating(getPerformanceRating(currentScore));
    }
    
    const stats = advancedCache.getStats();
    setCacheStats(stats);
  };

  const getPerformanceRating = (score: number): string => {
    if (score >= 9) return 'Excellent';
    if (score >= 8.5) return 'Très bon';
    if (score >= 8) return 'Bon';
    if (score >= 6) return 'Moyen';
    if (score >= 4) return 'Faible';
    return 'Critique';
  };

  const forceOptimization = () => {
    initializePerformanceOptimizations();
    performanceMonitor.forceEvaluation();
  };

  const value: PerformanceContextType = {
    score,
    rating,
    isOptimized,
    cacheStats,
    forceOptimization
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
      
      {/* Indicateur de performance en développement */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceIndicator 
          score={score} 
          rating={rating} 
          isOptimized={isOptimized}
        />
      )}
    </PerformanceContext.Provider>
  );
}

// Indicateur visuel de performance
function PerformanceIndicator({ 
  score, 
  rating, 
  isOptimized 
}: { 
  score: number | null; 
  rating: string; 
  isOptimized: boolean; 
}) {
  if (!isOptimized) return null;

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-500';
    if (score >= 8.5) return 'bg-green-500';
    if (score >= 8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed bottom-4 left-4 z-[60] bg-white border rounded-lg p-2 shadow-sm text-xs">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getScoreColor(score)}`}></div>
        <span>Perf: {score?.toFixed(1) || '?'}/10</span>
        <span className="text-gray-500">({rating})</span>
      </div>
    </div>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}

export default PerformanceProvider;