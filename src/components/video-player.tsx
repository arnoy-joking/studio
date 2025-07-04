
"use client";

import { useEffect, useRef, useCallback } from 'react';
import { Skeleton } from './ui/skeleton';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
    ytCallbacks?: (() => void)[];
  }
}

const loadYouTubeAPI = () => {
    if (typeof window === 'undefined') return;
    if (window.ytCallbacks) return;
    if (window.YT && window.YT.Player) return;

    window.ytCallbacks = [];
    window.onYouTubeIframeAPIReady = () => {
        window.ytCallbacks?.forEach(callback => callback());
        window.ytCallbacks = undefined;
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
};

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onVideoEnd: () => void;
  startTime?: number;
  onProgress: (currentTime: number) => void;
}

export function VideoPlayer({ videoId, title, onVideoEnd, startTime = 0, onProgress }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerId = `youtube-player-${videoId}-${Math.random()}`;

  const saveCurrentTime = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
            onProgress(currentTime);
        }
    }
  }, [onProgress]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying YouTube player:", e);
      }
      playerRef.current = null;
    }
  }, []);

  const createPlayer = useCallback(() => {
      if (!document.getElementById(playerContainerId) || !window.YT) return;
      
      let timeToStart = startTime;
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
            timeToStart = currentTime;
            saveCurrentTime();
        }
      }

      cleanup();

      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          start: Math.floor(timeToStart),
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) { 
              onVideoEnd();
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
              saveCurrentTime();
            }
          },
          onReady: (event: any) => {
            intervalRef.current = setInterval(() => {
                if (event.target.getPlayerState() === window.YT.PlayerState.PLAYING) {
                    saveCurrentTime();
                }
            }, 5000);
          }
        },
      });
  }, [videoId, startTime, onVideoEnd, saveCurrentTime, playerContainerId, cleanup]);

  useEffect(() => {
    loadYouTubeAPI();

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        window.ytCallbacks?.push(createPlayer);
      }
    };
    
    const container = document.getElementById(playerContainerId);
    if (container) {
        initPlayer();
    } else {
        setTimeout(initPlayer, 100);
    }

    return () => {
      saveCurrentTime();
      cleanup();
      if (window.ytCallbacks) {
        const index = window.ytCallbacks.indexOf(createPlayer);
        if (index > -1) {
            window.ytCallbacks.splice(index, 1);
        }
      }
    };
  }, [createPlayer, playerContainerId, saveCurrentTime, cleanup]);

  // Effect to handle window resizing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
        clearTimeout(resizeTimeout);
        // Debounce the player recreation to avoid performance issues.
        resizeTimeout = setTimeout(() => {
            createPlayer();
        }, 500); 
    };

    window.addEventListener('resize', handleResize);

    return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
    };
  }, [createPlayer]);

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
      <div id={playerContainerId} className="w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
