"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  initialVideoId: string;
  initialTitle: string;
}

export function VideoPlayer({ initialVideoId, initialTitle }: VideoPlayerProps) {
  const { toast } = useToast();
  const [videoId, setVideoId] = useState(initialVideoId);
  const [title, setTitle] = useState(initialTitle);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleVideoChange = (event: CustomEvent) => {
      setVideoId(event.detail.videoId);
      setTitle(event.detail.title);
    };

    window.addEventListener("changeVideo", handleVideoChange as EventListener);
    return () => window.removeEventListener("changeVideo", handleVideoChange as EventListener);
  }, []);


  useEffect(() => {
    if (!isClient) return;

    toast({
      title: "Loading Video",
      description: `Now playing: "${title}"`,
    });
    
    // Mock saving progress. In a real app, you'd use the YouTube Player API
    // to get the current time and save it.
    const interval = setInterval(() => {
      localStorage.setItem(`progress_${videoId}`, 'watched');
    }, 15000); // Save every 15 seconds

    return () => clearInterval(interval);

  }, [videoId, title, toast, isClient]);

  if (!isClient) {
    return (
      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading player...</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
