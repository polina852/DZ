/**
 * Système de monitoring des performances en temps réel
 * Collecte et analyse les métriques de performance pour atteindre 8.5/10
 */

import { log } from './securityLogger';
import { advancedCache } from './cacheManager';

interface PerformanceMetrics {
  timestamp: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domContentLoaded: number;
  windowLoad: number;
  memoryUsage?: MemoryInfo;
  connectionType?: string;
}

interface ComponentPerformance {
  name: string;
  renderTime: number;
  updateCount: number;
  lastUpdate: number;
  averageRenderTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics = new Map<string, ComponentPerformance>();
  private isMonitoring = false;
  private observer?: PerformanceObserver;

  constructor() {
    this.initializeMonitoring();
  }

  /**
   * Initialise le monitoring des performances
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Observer pour les métriques Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processPerformanceEntry(entry);
          }
        });

        // Observer différents types de métriques
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
        this.isMonitoring = true;
      } catch (error) {
        log.warn('Performance observer not supported', error, 'PerformanceMonitor');
      }
    }

    // Collecter les métriques initiales
    this.collectInitialMetrics();
    
    // Monitoring périodique
    this.startPeriodicMonitoring();
  }

  /**
   * Traite une entrée de performance
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    const now = Date.now();
    
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationTiming(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.handlePaintTiming(entry as PerformancePaintTiming);
        break;
      case 'largest-contentful-paint':
        this.handleLCP(entry);
        break;
      case 'first-input':
        this.handleFID(entry);
        break;
      case 'layout-shift':
        this.handleCLS(entry);
        break;
    }
  }

  /**
   * Gère les métriques de navigation
   */
  private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
    const ttfb = entry.responseStart - entry.requestStart;
    const domContentLoaded = entry.domContentLoadedEventEnd - entry.navigationStart;
    const windowLoad = entry.loadEventEnd - entry.navigationStart;

    log.debug('Navigation timing', {
      ttfb,
      domContentLoaded,
      windowLoad
    }, 'PerformanceMonitor');
  }

  /**
   * Gère les métriques de paint
   */
  private handlePaintTiming(entry: PerformancePaintTiming): void {
    if (entry.name === 'first-contentful-paint') {
      log.debug('First Contentful Paint', { fcp: entry.startTime }, 'PerformanceMonitor');
    }
  }

  /**
   * Gère Largest Contentful Paint
   */
  private handleLCP(entry: PerformanceEntry): void {
    log.debug('Largest Contentful Paint', { lcp: entry.startTime }, 'PerformanceMonitor');
  }

  /**
   * Gère First Input Delay
   */
  private handleFID(entry: PerformanceEntry): void {
    const fid = (entry as any).processingStart - entry.startTime;
    log.debug('First Input Delay', { fid }, 'PerformanceMonitor');
  }

  /**
   * Gère Cumulative Layout Shift
   */
  private handleCLS(entry: PerformanceEntry): void {
    const cls = (entry as any).value;
    if (!cls) return;
    
    log.debug('Cumulative Layout Shift', { cls }, 'PerformanceMonitor');
  }

  /**
   * Collecte les métriques initiales
   */
  private collectInitialMetrics(): void {
    if (typeof window === 'undefined') return;

    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      if (navigation) {
        const metrics: Partial<PerformanceMetrics> = {
          timestamp: Date.now(),
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          windowLoad: navigation.loadEventEnd - navigation.navigationStart
        };

        // Memory usage si disponible
        if ('memory' in performance) {
          metrics.memoryUsage = (performance as any).memory;
        }

        // Connection info si disponible
        if ('connection' in navigator) {
          metrics.connectionType = (navigator as any).connection?.effectiveType;
        }

        this.metrics.push(metrics as PerformanceMetrics);
        
        // Évaluer et cacher les métriques
        this.evaluatePerformance(metrics as PerformanceMetrics);
      }
    }, 1000);
  }

  /**
   * Monitoring périodique
   */
  private startPeriodicMonitoring(): void {
    setInterval(() => {
      this.collectMemoryMetrics();
      this.logComponentPerformance();
      this.cleanupOldMetrics();
    }, 30000); // Toutes les 30 secondes
  }

  /**
   * Collecte les métriques mémoire
   */
  private collectMemoryMetrics(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize / 1024 / 1024; // MB
    const total = memory.totalJSHeapSize / 1024 / 1024; // MB
    const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB

    log.debug('Memory usage', {
      used: `${used.toFixed(2)}MB`,
      total: `${total.toFixed(2)}MB`,
      limit: `${limit.toFixed(2)}MB`,
      usage: `${((used / limit) * 100).toFixed(1)}%`
    }, 'PerformanceMonitor');

    // Alerte si mémoire élevée
    if (used / limit > 0.8) {
      log.warn('High memory usage detected', { usage: `${((used / limit) * 100).toFixed(1)}%` }, 'PerformanceMonitor');
    }
  }

  /**
   * Enregistre la performance d'un composant
   */
  trackComponentRender(componentName: string, renderTime: number): void {
    const existing = this.componentMetrics.get(componentName);
    
    if (existing) {
      existing.renderTime = renderTime;
      existing.updateCount++;
      existing.lastUpdate = Date.now();
      existing.averageRenderTime = (existing.averageRenderTime * (existing.updateCount - 1) + renderTime) / existing.updateCount;
    } else {
      this.componentMetrics.set(componentName, {
        name: componentName,
        renderTime,
        updateCount: 1,
        lastUpdate: Date.now(),
        averageRenderTime: renderTime
      });
    }
  }

  /**
   * Log des performances des composants
   */
  private logComponentPerformance(): void {
    const slowComponents = Array.from(this.componentMetrics.values())
      .filter(comp => comp.averageRenderTime > 50) // Plus de 50ms
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
      .slice(0, 5);

    if (slowComponents.length > 0) {
      log.warn('Slow components detected', 
        slowComponents.map(comp => ({
          name: comp.name,
          avgTime: `${comp.averageRenderTime.toFixed(2)}ms`,
          updates: comp.updateCount
        })), 
        'PerformanceMonitor'
      );
    }
  }

  /**
   * Évalue la performance globale
   */
  private evaluatePerformance(metrics: PerformanceMetrics): void {
    const score = this.calculatePerformanceScore(metrics);
    const rating = this.getPerformanceRating(score);
    
    log.info('Performance evaluation', {
      score: `${score.toFixed(1)}/10`,
      rating,
      fcp: `${metrics.fcp?.toFixed(0)}ms`,
      lcp: `${metrics.lcp?.toFixed(0)}ms`,
      ttfb: `${metrics.ttfb?.toFixed(0)}ms`
    }, 'PerformanceMonitor');

    // Cacher le score pour l'UI
    advancedCache.set('performance:score', {
      score,
      rating,
      timestamp: Date.now()
    }, 60000); // 1 minute
  }

  /**
   * Calcule le score de performance (0-10)
   */
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 10;

    // FCP (First Contentful Paint)
    if (metrics.fcp) {
      if (metrics.fcp > 3000) score -= 2;
      else if (metrics.fcp > 1800) score -= 1;
    }

    // LCP (Largest Contentful Paint)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 2;
      else if (metrics.lcp > 2500) score -= 1;
    }

    // TTFB (Time to First Byte)
    if (metrics.ttfb) {
      if (metrics.ttfb > 800) score -= 1.5;
      else if (metrics.ttfb > 600) score -= 0.5;
    }

    // FID (First Input Delay)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 2;
      else if (metrics.fid > 100) score -= 1;
    }

    // CLS (Cumulative Layout Shift)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 2;
      else if (metrics.cls > 0.1) score -= 1;
    }

    return Math.max(0, score);
  }

  /**
   * Détermine la note de performance
   */
  private getPerformanceRating(score: number): string {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Bon';
    if (score >= 6) return 'Moyen';
    if (score >= 4) return 'Faible';
    return 'Critique';
  }

  /**
   * Nettoie les anciennes métriques
   */
  private cleanupOldMetrics(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.metrics = this.metrics.filter(metric => metric.timestamp > oneHourAgo);
  }

  /**
   * API publiques
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getComponentMetrics(): ComponentPerformance[] {
    return Array.from(this.componentMetrics.values());
  }

  getCurrentScore(): number | null {
    const cached = advancedCache.get<{ score: number }>('performance:score');
    return cached?.score || null;
  }

  /**
   * Force une évaluation immédiate
   */
  forceEvaluation(): void {
    this.collectInitialMetrics();
  }
}

// Instance globale
export const performanceMonitor = new PerformanceMonitor();

// Hook React pour le monitoring des composants
export function usePerformanceTracking(componentName: string) {
  const trackRender = (renderTime: number) => {
    performanceMonitor.trackComponentRender(componentName, renderTime);
  };

  return { trackRender };
}

// Utilities
export const startPerformanceTimer = (): (() => number) => {
  const start = performance.now();
  return () => performance.now() - start;
};

export default performanceMonitor;