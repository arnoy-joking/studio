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

// Manages loading the YouTube Iframe API script
const loadYouTubeAPI = () => {
    if (typeof window === 'undefined') return;

    // If script is already being managed, do nothing
    if (window.ytCallbacks) return;

    // If script is already loaded (by other means), do nothing
    if (window.YT && window.YT.Player) return;

    window.ytCallbacks = [];
    window.onYouTubeIframeAPIReady = () => {
        window.ytCallbacks?.forEach(callback => callback());
        window.ytCallbacks = undefined; // API is ready, no need for the queue anymore
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
};

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onVideoEnd: () => void;
}

export function VideoPlayer({ videoId, title, onVideoEnd }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const playerContainerId = `youtube-player-${videoId}`;

  const createPlayer = useCallback(() => {
      // Don't create player if the container is not in the DOM
      if (!document.getElementById(playerContainerId)) return;
      
      // Destroy previous player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const player = new window.YT.Player(playerContainerId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) { 
              onVideoEnd();
            }
          },
        },
      });
      playerRef.current = player;
  }, [videoId, onVideoEnd, playerContainerId]);

  useEffect(() => {
    loadYouTubeAPI();

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.ytCallbacks?.push(createPlayer);
    }

    return () => {
      // Cleanup on unmount
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      
      // If API is not ready yet, remove our callback from the queue
      if (window.ytCallbacks) {
        const index = window.ytCallbacks.indexOf(createPlayer);
        if (index > -1) {
            window.ytCallbacks.splice(index, 1);
        }
      }
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
