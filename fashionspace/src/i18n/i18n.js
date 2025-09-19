import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const defaultLang = 'pt-BR';

const translations = {
  'pt-BR': {
    nav: {
      home: 'Início',
      feed: 'Feed',
      notifications: 'Notificações',
      addBazar: 'Adicionar Bazar',
      favorites: 'Favoritos',
      profile: 'Perfil',
      subscription: 'Assinaturas',
      aiAssistant: 'IA Assistente',
      support: 'Suporte',
      settings: 'Configurações',
    },
    sidebar: {
      hello: 'Olá,',
      owner: 'Dono de Bazar',
      user: 'Usuário',
    },
    topbar: {
      searchPlaceholder: 'Buscar bazares...',
      notificationsTitle: 'Notificações',
      unreadCount: '{{count}} não lidas',
      showMenu: 'Mostrar Menu',
      hideMenu: 'Ocultar Menu',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Escuro',
      online: 'Online',
      myProfile: 'Meu Perfil',
      appSettings: 'Configurações',
      help: 'Ajuda',
      logout: 'Sair da Conta',
    },
    home: {
      heroTitle: 'Descubra os Melhores Bazares de Moda',
      heroSubtitle: 'Conecte-se com bazares únicos, encontre peças especiais e apoie negócios locais',
      createBazar: 'Criar Bazar',
      exploreNow: 'Explorar Agora',
      filterByCategory: 'Filtrar por Categoria',
      all: 'Todas',
      allBazaresTitle: 'Explore Todos os Bazares',
      allBazaresSubtitle: 'Encontre o bazar perfeito para você',
      searchPlaceholder: 'Buscar bazares por nome, descrição ou cidade...',
      emptyTitle: 'Nenhum bazar encontrado',
      emptyDescription: 'Tente ajustar os filtros ou buscar por outros termos.',
    },
    settings: {
      title: 'Configurações',
      subtitle: 'Personalize sua experiência no FashionSpace',
      notifications: 'Notificações',
      privacy: 'Privacidade',
      preferences: 'Preferências',
      dangerZone: 'Zona de Perigo',
      language: 'Idioma',
      theme: 'Tema',
      automatic: 'Automático',
      light: 'Claro',
      dark: 'Escuro',
      save: 'Salvar Configurações',
      saving: 'Salvando...',
      cancel: 'Cancelar',
      restoreDefaults: 'Restaurar Padrões',
      deleteAccount: 'Excluir Conta',
    },
  },
  'en-US': {
    nav: {
      home: 'Home',
      feed: 'Feed',
      notifications: 'Notifications',
      addBazar: 'Add Bazar',
      favorites: 'Favorites',
      profile: 'Profile',
      subscription: 'Subscriptions',
      aiAssistant: 'AI Assistant',
      support: 'Support',
      settings: 'Settings',
    },
    sidebar: {
      hello: 'Hello,',
      owner: 'Bazar Owner',
      user: 'User',
    },
    topbar: {
      searchPlaceholder: 'Search bazars...',
      notificationsTitle: 'Notifications',
      unreadCount: '{{count}} unread',
      showMenu: 'Show Menu',
      hideMenu: 'Hide Menu',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      online: 'Online',
      myProfile: 'My Profile',
      appSettings: 'Settings',
      help: 'Help',
      logout: 'Sign out',
    },
    home: {
      heroTitle: 'Discover the Best Fashion Bazaars',
      heroSubtitle: 'Connect with unique bazaars, find special pieces and support local businesses',
      createBazar: 'Create Bazar',
      exploreNow: 'Explore Now',
      filterByCategory: 'Filter by Category',
      all: 'All',
      allBazaresTitle: 'Explore All Bazaars',
      allBazaresSubtitle: 'Find the perfect bazaar for you',
      searchPlaceholder: 'Search by name, description or city...',
      emptyTitle: 'No bazars found',
      emptyDescription: 'Try adjusting the filters or searching for other terms.',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize your FashionSpace experience',
      notifications: 'Notifications',
      privacy: 'Privacy',
      preferences: 'Preferences',
      dangerZone: 'Danger Zone',
      language: 'Language',
      theme: 'Theme',
      automatic: 'Automatic',
      light: 'Light',
      dark: 'Dark',
      save: 'Save Settings',
      saving: 'Saving...',
      cancel: 'Cancel',
      restoreDefaults: 'Restore Defaults',
      deleteAccount: 'Delete Account',
    },
  },
  'es-ES': {
    nav: {
      home: 'Inicio',
      feed: 'Feed',
      notifications: 'Notificaciones',
      addBazar: 'Agregar Bazar',
      favorites: 'Favoritos',
      profile: 'Perfil',
      subscription: 'Suscripciones',
      aiAssistant: 'Asistente IA',
      support: 'Soporte',
      settings: 'Configuración',
    },
    sidebar: {
      hello: 'Hola,',
      owner: 'Dueño de Bazar',
      user: 'Usuario',
    },
    topbar: {
      searchPlaceholder: 'Buscar bazares...',
      notificationsTitle: 'Notificaciones',
      unreadCount: '{{count}} sin leer',
      showMenu: 'Mostrar Menú',
      hideMenu: 'Ocultar Menú',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      online: 'En línea',
      myProfile: 'Mi Perfil',
      appSettings: 'Configuración',
      help: 'Ayuda',
      logout: 'Cerrar sesión',
    },
    home: {
      heroTitle: 'Descubre los Mejores Bazares de Moda',
      heroSubtitle: 'Conéctate con bazares únicos, encuentra piezas especiales y apoya negocios locales',
      createBazar: 'Crear Bazar',
      exploreNow: 'Explorar Ahora',
      filterByCategory: 'Filtrar por Categoría',
      all: 'Todas',
      allBazaresTitle: 'Explora Todos los Bazares',
      allBazaresSubtitle: 'Encuentra el bazar perfecto para ti',
      searchPlaceholder: 'Buscar por nombre, descripción o ciudad...',
      emptyTitle: 'No se encontraron bazares',
      emptyDescription: 'Intenta ajustar los filtros o buscar otros términos.',
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Personaliza tu experiencia en FashionSpace',
      notifications: 'Notificaciones',
      privacy: 'Privacidad',
      preferences: 'Preferencias',
      dangerZone: 'Zona de Peligro',
      language: 'Idioma',
      theme: 'Tema',
      automatic: 'Automático',
      light: 'Claro',
      dark: 'Oscuro',
      save: 'Guardar Configuración',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      restoreDefaults: 'Restaurar Valores Predeterminados',
      deleteAccount: 'Eliminar Cuenta',
    },
  },
};

function getInitialLanguage() {
  try {
    const lsSettings = JSON.parse(localStorage.getItem('fashionspace_settings') || '{}');
    const saved = lsSettings?.preferences?.language || localStorage.getItem('fashionspace_language');
    return saved || defaultLang;
  } catch {
    return defaultLang;
  }
}

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => `${params[key.trim()] ?? ''}`);
}

function getFromPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj);
}

const I18nContext = createContext({
  language: defaultLang,
  setLanguage: () => {},
  t: (key, params) => key,
});

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage());

  useEffect(() => {
    try {
      // Keep a dedicated key and also sync into settings.preferences.language if exists
      localStorage.setItem('fashionspace_language', language);
      const settings = JSON.parse(localStorage.getItem('fashionspace_settings') || '{}');
      if (settings && settings.preferences) {
        settings.preferences.language = language;
        localStorage.setItem('fashionspace_settings', JSON.stringify(settings));
      }
      document.documentElement.setAttribute('lang', language);
    } catch {}
  }, [language]);

  const setLanguage = (lang) => setLanguageState(lang);

  const t = (key, params) => {
    const bundle = translations[language] || translations[defaultLang];
    const value = getFromPath(bundle, key) ?? getFromPath(translations[defaultLang], key) ?? key;
    if (typeof value === 'string') return interpolate(value, params);
    return value ?? key;
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return React.createElement(
    I18nContext.Provider,
    { value },
    children
  );
};

export const useI18n = () => useContext(I18nContext);
