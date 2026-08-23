import React from 'react';
import { Layers, Play, Calendar, Clock, Trash2, ChevronRight, Music } from 'lucide-react';
import type { Setlist } from '../types';

interface MySetlistsPageProps {
  setlists: Setlist[];
  onOpenSetlist: (setlist: Setlist) => void;
  onLaunchLiveStage: (setlist: Setlist, startIndex?: number) => void;
  onRequestDeleteSetlist: (setlist: Setlist) => void;
}

export const MySetlistsPage: React.FC<MySetlistsPageProps> = ({
  setlists,
  onOpenSetlist,
  onLaunchLiveStage,
  onRequestDeleteSetlist
}) => {
  return (
    <div className="page-container">
      {/* Page Title Header (Without duplicate New button) */}
      <div className="page-header-row">
        <div className="page-title-group">
          <div className="page-icon-pill">
            <Layers size={22} color="var(--accent-color)" />
          </div>
          <div>
            <h1 className="page-title">My Setlists</h1>
            <p className="page-subtitle">Manage your live gig & fellowship setlists</p>
          </div>
        </div>
      </div>

      {/* Setlists Grid */}
      <div className="setlists-grid">
        {setlists.map((setlist) => {
          const songCount = setlist.items.filter((i) => i.type === 'song').length;
          const breakCount = setlist.items.filter((i) => i.type === 'break').length;

          return (
            <div 
              key={setlist.id} 
              className="setlist-overview-card"
              onClick={() => onOpenSetlist(setlist)}
            >
              <div className="card-main">
                <div className="card-top-row">
                  <h3 className="setlist-card-name">{setlist.name}</h3>
                  <button
                    className="icon-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDeleteSetlist(setlist);
                    }}
                    title="Delete Setlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="setlist-card-details">
                  <div className="detail-pill">
                    <Calendar size={13} />
                    <span>{setlist.eventDate || 'No date'}</span>
                  </div>
                  <div className="detail-pill">
                    <Clock size={13} />
                    <span>Target: {setlist.targetDurationMinutes || 30} min</span>
                  </div>
                  <div className="detail-pill">
                    <Music size={13} />
                    <span>{songCount} songs {breakCount > 0 ? `+ ${breakCount} breaks` : ''}</span>
                  </div>
                </div>

                {setlist.notes && (
                  <p className="setlist-card-notes">{setlist.notes}</p>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="setlist-card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="primary-btn small"
                  onClick={() => onLaunchLiveStage(setlist, 0)}
                  disabled={songCount === 0}
                  title="Play Live Stage"
                >
                  <Play size={14} fill="currentColor" /> Play Stage
                </button>

                <button
                  className="secondary-btn small"
                  onClick={() => onOpenSetlist(setlist)}
                  title="View Setlist Songs"
                >
                  <span>View Tracklist</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {setlists.length === 0 && (
          <div className="empty-state-box">
            <Layers size={48} color="var(--accent-color)" />
            <h3>No Setlists Created Yet</h3>
            <p>Use the <strong>New Setlist</strong> option in the sidebar (☰) to build your first setlist.</p>
          </div>
        )}
      </div>
    </div>
  );
};
