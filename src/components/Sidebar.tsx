import React from 'react';
import { 
  X, Layers, PlusCircle, Music, PlusSquare, Settings, User 
} from 'lucide-react';
import type { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  userProfile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeRoute,
  onNavigate,
  userProfile
}) => {
  const menuItems = [
    { id: 'setlists', label: 'My Setlists', icon: <Layers size={18} /> },
    { id: 'setlist-new', label: 'New Setlist', icon: <PlusCircle size={18} /> },
    { id: 'songs', label: 'All Songs', icon: <Music size={18} /> },
    { id: 'song-new', label: 'New Song', icon: <PlusSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Top Profile Header Card (Without the edit button) */}
        <div 
          className="sidebar-profile-card"
          style={{ background: userProfile.bannerUrl }}
          onClick={() => {
            onNavigate('settings-profile');
            onClose();
          }}
          title="Click to view profile in settings"
        >
          <div className="profile-card-overlay">
            <button className="sidebar-close-btn" onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} aria-label="Close sidebar">
              <X size={18} />
            </button>

            <div className="profile-info-row">
              <div className="profile-avatar-container">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-fallback">
                    <User size={26} color="#fff" />
                  </div>
                )}
              </div>
              <div className="profile-texts">
                <span className="profile-name">{userProfile.name || 'Musician'}</span>
                <span className="profile-role">{userProfile.role || 'Keyboardist & Arranger'}</span>
                {userProfile.band && <span className="profile-band">🎸 {userProfile.band}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Brand strip */}
        <div className="sidebar-brand-strip">
          <div className="brand-dot" />
          <span className="brand-title-text">Open Stage Setlist</span>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav-menu">
          {menuItems.map((item) => {
            const isActive = activeRoute === item.id || 
              (item.id === 'setlists' && activeRoute === 'setlist-view') ||
              (item.id === 'songs' && activeRoute === 'song-view') ||
              (item.id === 'settings' && activeRoute.startsWith('settings-'));

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <div className="nav-item-left">
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="sidebar-footer">
          <span>v1.4.0 • Zero Cloud Stage Mode</span>
        </div>
      </aside>
    </>
  );
};
