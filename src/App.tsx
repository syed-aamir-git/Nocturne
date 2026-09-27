import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './state';
import { MainLayout } from './layouts/MainLayout';
import { DiscoverPage } from './pages/DiscoverPage';
import { LibraryPage } from './pages/LibraryPage';
import { SearchPage } from './pages/SearchPage';
import { PlaylistViewPage } from './pages/PlaylistViewPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import './styles/index.css';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DiscoverPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="playlist/:id" element={<PlaylistViewPage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
