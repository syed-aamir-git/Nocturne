import React, { createContext, useContext, useState } from 'react';

export type RightPanelTab = 'info' | 'lyrics' | 'queue' | 'credits';
export type LyricsTab = 'lyrics' | 'info' | 'credits';
export type NowPlayingTab = 'artwork' | 'lyrics' | 'queue' | 'info' | 'credits';

interface UIContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;
  rightPanelTab: RightPanelTab;
  setRightPanelTab: (tab: RightPanelTab) => void;
  openRightPanel: (tab?: RightPanelTab) => void;
  toggleRightPanel: () => void;
  isLyricsOpen: boolean;
  setIsLyricsOpen: (open: boolean) => void;
  lyricsTab: LyricsTab;
  setLyricsTab: (tab: LyricsTab) => void;
  openLyrics: (tab?: LyricsTab) => void;
  closeLyrics: () => void;
  toggleLyrics: () => void;
  isNowPlayingOpen: boolean;
  setIsNowPlayingOpen: (open: boolean) => void;
  nowPlayingTab: NowPlayingTab;
  setNowPlayingTab: (tab: NowPlayingTab) => void;
  openNowPlaying: (tab?: NowPlayingTab) => void;
  closeNowPlaying: () => void;
  toggleNowPlaying: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('queue');
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [lyricsTab, setLyricsTab] = useState<LyricsTab>('lyrics');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);
  const [nowPlayingTab, setNowPlayingTab] = useState<NowPlayingTab>('artwork');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const toggleRightPanel = () => setRightPanelOpen((prev) => !prev);
  const openRightPanel = (tab?: RightPanelTab) => {
    if (tab) setRightPanelTab(tab);
    setRightPanelOpen(true);
  };
  const openLyrics = (tab?: LyricsTab) => {
    if (tab) setLyricsTab(tab);
    setIsLyricsOpen(true);
  };
  const closeLyrics = () => setIsLyricsOpen(false);
  const toggleLyrics = () => setIsLyricsOpen((prev) => !prev);
  const openNowPlaying = (tab?: NowPlayingTab) => {
    if (tab) setNowPlayingTab(tab);
    setIsNowPlayingOpen(true);
  };
  const closeNowPlaying = () => setIsNowPlayingOpen(false);
  const toggleNowPlaying = () => setIsNowPlayingOpen((prev) => !prev);
  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        mobileMenuOpen,
        setMobileMenuOpen,
        rightPanelOpen,
        setRightPanelOpen,
        rightPanelTab,
        setRightPanelTab,
        openRightPanel,
        toggleRightPanel,
        isLyricsOpen,
        setIsLyricsOpen,
        lyricsTab,
        setLyricsTab,
        openLyrics,
        closeLyrics,
        toggleLyrics,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        nowPlayingTab,
        setNowPlayingTab,
        openNowPlaying,
        closeNowPlaying,
        toggleNowPlaying,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
