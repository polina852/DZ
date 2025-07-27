/**
 * Système de lazy loading optimisé pour les performances
 * Améliore le temps de chargement initial et réduit la taille des bundles
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { advancedCache } from './cacheManager';

interface LazyComponentOptions {
  fallback?: ComponentType;
  preload?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Wrapper lazy loading avec cache et retry
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const { retries = 3, timeout = 10000 } = options;
  
  let retryCount = 0;
  
  const enhancedImport = async (): Promise<{ default: T }> => {
    const cacheKey = `lazy:${importFn.toString().slice(0, 50)}`;
    
    // Vérifier le cache
    const cached = advancedCache.get<{ default: T }>(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      // Timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Import timeout')), timeout)
      );
      
      const importPromise = importFn();
      const result = await Promise.race([importPromise, timeoutPromise]);
      
      // Mettre en cache le résultat
      advancedCache.set(cacheKey, result, 60 * 60 * 1000); // 1 heure
      
      retryCount = 0; // Reset sur succès
      return result;
      
    } catch (error) {
      if (retryCount < retries) {
        retryCount++;
        console.warn(`Lazy import retry ${retryCount}/${retries}:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return enhancedImport();
      }
      throw error;
    }
  };
  
  return lazy(enhancedImport);
}

/**
 * Preloader pour les composants critiques
 */
export class ComponentPreloader {
  private static preloadPromises = new Map<string, Promise<any>>();
  
  static preload(importFn: () => Promise<any>, name: string): Promise<any> {
    if (this.preloadPromises.has(name)) {
      return this.preloadPromises.get(name)!;
    }
    
    const promise = importFn();
    this.preloadPromises.set(name, promise);
    
    return promise;
  }
  
  static async preloadCritical(): Promise<void> {
    // Précharger les composants critiques
    await Promise.allSettled([
      this.preload(() => import('@/components/Dashboard'), 'Dashboard'),
      this.preload(() => import('@/components/legal/LegalCatalog'), 'LegalCatalog'),
      this.preload(() => import('@/components/search/SearchInterface'), 'SearchInterface'),
    ]);
  }
}

// Composants lazy optimisés pour LYO
export const LazyDashboard = createLazyComponent(
  () => import('@/components/Dashboard'),
  { preload: true }
);

export const LazyLegalCatalog = createLazyComponent(
  () => import('@/components/legal/LegalCatalog')
);

export const LazyProceduresCatalog = createLazyComponent(
  () => import('@/components/procedures/ProceduresCatalog')
);

export const LazyOCRProcessor = createLazyComponent(
  () => import('@/components/ocr/DZOCRIAProcessor')
);

export const LazyAnalyticsDashboard = createLazyComponent(
  () => import('@/components/analytics/AnalyticsDashboard')
);

export const LazyAIAssistant = createLazyComponent(
  () => import('@/components/ai/UnifiedAIAssistant')
);

export const LazySearchInterface = createLazyComponent(
  () => import('@/components/search/SearchInterface')
);

export const LazyUserManagement = createLazyComponent(
  () => import('@/components/admin/UserManagement')
);

export const LazySecuritySettings = createLazyComponent(
  () => import('@/components/security/SecuritySettings')
);

export const LazyCollaborativeWorkspace = createLazyComponent(
  () => import('@/components/collaboration/CollaborativeWorkspace')
);

// Hook pour préchargement conditionnel
export function useLazyPreload() {
  const preloadOnHover = (componentName: string) => {
    return {
      onMouseEnter: () => {
        switch (componentName) {
          case 'legal':
            ComponentPreloader.preload(() => import('@/components/legal/LegalCatalog'), 'LegalCatalog');
            break;
          case 'procedures':
            ComponentPreloader.preload(() => import('@/components/procedures/ProceduresCatalog'), 'ProceduresCatalog');
            break;
          case 'ocr':
            ComponentPreloader.preload(() => import('@/components/ocr/DZOCRIAProcessor'), 'OCRProcessor');
            break;
          case 'ai':
            ComponentPreloader.preload(() => import('@/components/ai/UnifiedAIAssistant'), 'AIAssistant');
            break;
        }
      }
    };
  };
  
  return { preloadOnHover };
}

// Initialisation du préchargement
if (typeof window !== 'undefined') {
  // Précharger après le chargement initial
  window.addEventListener('load', () => {
    setTimeout(() => {
      ComponentPreloader.preloadCritical();
    }, 2000); // Attendre 2s après le load
  });
  
  // Préchargement au focus de la fenêtre
  window.addEventListener('focus', () => {
    ComponentPreloader.preloadCritical();
  });
}

export default {
  LazyDashboard,
  LazyLegalCatalog,
  LazyProceduresCatalog,
  LazyOCRProcessor,
  LazyAnalyticsDashboard,
  LazyAIAssistant,
  LazySearchInterface,
  LazyUserManagement,
  LazySecuritySettings,
  LazyCollaborativeWorkspace,
  ComponentPreloader,
  useLazyPreload,
  createLazyComponent
};