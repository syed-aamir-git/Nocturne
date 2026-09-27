import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { PlayerBar } from '../components/layout/PlayerBar';
import { ToastContainer } from '../components/primitives/Toast';
import { useUI } from '../state/UIContext';
import { useToast } from '../state/ToastContext';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useUI();
  const { toasts, removeToast } = useToast();

  return (
    <div className="nocturne-layout">
      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="nocturne-layout__backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="nocturne-layout__body">
        <TopBar />
        <main className="nocturne-layout__content" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Persistent Bottom Audio Player Placeholder */}
      <PlayerBar />

      {/* Global Notifications & Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
