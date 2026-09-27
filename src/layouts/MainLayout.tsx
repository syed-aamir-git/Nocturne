import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { PlayerBar } from '../components/layout/PlayerBar';
import { RightPanel } from '../components/layout/RightPanel';
import { MobileNav } from '../components/layout/MobileNav';
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

      {/* Persistent Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="nocturne-layout__body">
        <TopBar />
        <div className="nocturne-layout__center-split">
          <main className="nocturne-layout__content" id="main-content">
            <Outlet />
          </main>
          {/* Optional Right-Side Panel */}
          <RightPanel />
        </div>
      </div>

      {/* Persistent Bottom Audio Player Placeholder */}
      <PlayerBar />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Notifications & Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
