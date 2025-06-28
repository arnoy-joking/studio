"use client";

import { useEffect, useRef } from 'react';
import { Skeleton } from './ui/skeleton';

// Add YT and YT.Player types to the window object to avoid TS errors
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onVideoEnd: () => void;
}

export function VideoPlayer({ videoId, title, onVideoEnd }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const playerContainerId = `youtube-player-${videoId}`;

  useEffect(() => {
    const createPlayer = () => {
      if (!document.getElementById(playerContainerId) || !window.YT) return;
      
      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId: videoId,
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
    };

    const setupPlayer = () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      createPlayer();
    };

    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      const existingScript = document.querySelector(`script[src="${tag.src}"]`);
      if (!existingScript) {
        // If the onYouTubeIframeAPIReady function is already defined, chain it
        const oldReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          oldReady?.();
          setupPlayer();
        };
        document.head.appendChild(tag);
      } else {
         // Script is already in the DOM, but YT might not be ready.
         // A simple check is to see if YT.Player is available.
         if (window.YT && window.YT.Player) {
            setupPlayer();
         } else {
            // Fallback: if script is there but YT not ready, retry after a short delay
            const interval = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(interval);
                    setupPlayer();
                }
            }, 100);
         }
      }
    } else {
      setupPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onVideoEnd, playerContainerId]);

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border bg-muted">
      <div id={playerContainerId}>
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
