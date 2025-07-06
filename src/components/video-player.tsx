
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
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerId = `youtube-player-${videoId}-${Math.random()}`;

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  }, []);

  const saveCurrentProgress = useCallback(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime > 0) {
              onProgress(currentTime);
          }
      }
  }, [onProgress]);

  const createPlayer = useCallback(() => {
      if (!document.getElementById(playerContainerId) || !window.YT) return;
      
      cleanup();

      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          start: Math.floor(startTime),
        },
        events: {
          onStateChange: (event: any) => {
            // Clear any existing interval
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }

            if (event.data === window.YT.PlayerState.PLAYING) {
                // Start saving progress every 15 seconds while playing
                progressIntervalRef.current = setInterval(saveCurrentProgress, 15000);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
                // Save progress immediately when the user pauses
                saveCurrentProgress();
            } else if (event.data === window.YT.PlayerState.ENDED) { 
              onVideoEnd();
              // Save one last time to record the end state
              saveCurrentProgress();
            }
          },
        },
      });
  }, [videoId, startTime, onVideoEnd, saveCurrentProgress, playerContainerId, cleanup]);

  useEffect(() => {
    loadYouTubeAPI();

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        window.ytCallbacks?.push(createPlayer);
      }
    };
    
    const timer = setTimeout(initPlayer, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
      if (window.ytCallbacks) {
        const index = window.ytCallbacks.indexOf(createPlayer);
        if (index > -1) {
            window.ytCallbacks.splice(index, 1);
        }
      }
    };
  }, [createPlayer, cleanup]);

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
      <div id={playerContainerId} className="w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
