"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Play, Share2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YT_REGEX } from "@/app/lib/utils";
import React from "react";
import { Appbar } from "./Appbar";
//@ts-expect-error IDK
import YouTubePlayer from 'youtube-player';

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [playNextLoader, setplayNextLoader] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>();


  async function refreshStreams() {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
      credentials: "include",
    });
    const json = await res.json();
    setQueue(json.streams.sort((a: Video, b: Video) => b.upvotes - a.upvotes));

    setCurrentVideo(video => {
      if(video?.id === json.activeStream?.stream?.id){
        return video;
      }
      return json.activeStream.stream
    });
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(!videoPlayerRef.current){
      return;
    }
    const player = YouTubePlayer(videoPlayerRef.current);

    player.loadVideoById(currentVideo?.extractedId);
    player.playVideo();
    function eventHandler(event: YouTubePlayer.PlayerEvent){
      if(event.data === 0){
        handlePlayNext();
      }
    }
    player.on('stateChange', eventHandler);
    return () => {
      player.destroy();
    }
  }, [currentVideo, videoPlayerRef]);

  useEffect(() => {
    document.documentElement.style.setProperty("--toastify-color-light", "#374151");
    document.documentElement.style.setProperty("--toastify-color-dark", "#1F2937");
    document.documentElement.style.setProperty("--toastify-color-info", "#60A5FA");
    document.documentElement.style.setProperty("--toastify-color-success", "#34D399");
    document.documentElement.style.setProperty("--toastify-color-warning", "#FBBF24");
    document.documentElement.style.setProperty("--toastify-color-error", "#F87171");
    document.documentElement.style.setProperty("--toastify-text-color-light", "#E5E7EB");
    document.documentElement.style.setProperty("--toastify-text-color-dark", "#E5E7EB");
  }, []); // Empty array to run only on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/streams/", {
      method: "POST",
      body: JSON.stringify({
        creatorId,
        url: inputLink,
      }),
    });
    setQueue([...queue, await res.json()]);
    setLoading(false);
    toast.success("Video added to queue!");
    setInputLink("");
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );

    fetch(`/api/streams/${isUpvote ? "upvotes" : "downvotes"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };

  const handlePlayNext = async () => {
    if (queue.length > 0) {
      try {
        setplayNextLoader(true);
        const data = await fetch("/api/streams/next", {
          method: "GET",
        });
        const json = await data.json();
        const nextVideo = queue[0];
        setCurrentVideo(json.stream);
        setQueue(q => q.filter(x => x.id !== json.stream?.id))
        toast.success(`Now playing: ${nextVideo.title}`);
      } catch (error) {
        console.log(error);
      }
      setplayNextLoader(false);
    } else {
      toast.warning("No more videos in the queue!");
    }
  };

  const handleShare = async () => {
    try {
      const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Appbar/>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">Stream Song Voting</h1>
          <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Submit a Song</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter YouTube video link"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-purple-500"
              />
              <Button
                disabled={loading}
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Loading.." : "Add to Queue"}
              </Button>
            </form>

            {inputLink && inputLink.match(YT_REGEX) && !loading && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <LiteYouTubeEmbed title="YouTube Video" id={inputLink.split("?v=")[1]} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
            <div className="aspect-w-16 aspect-h-9">
              {currentVideo ? (
                <div>
                  {playVideo ? (
                    <>
                    {/* @ts-expect-error IDK */}
                    <div ref={videoPlayerRef} className="w-full h-full"/>
                      {/* <iframe width="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                        allow="autoplay"
                        onError={(e) => console.log("Error loading video:", e)}
                      ></iframe> */}
                    </>
                  ) : (
                    <>
                      <img src={currentVideo.bigImg} className="w-full h-72 object-cover rounded" />
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-400">No Video Playing</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Songs</h2>
            {playVideo && (
              <Button disabled={playNextLoader} onClick={handlePlayNext} className="bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                {playNextLoader ? "Loading..." : "Play Next"}
              </Button>
            )}
          </div>
          <ul className="space-y-4">
            {queue?.map((video) => (
              <li key={video.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <span className="font-semibold">{video.title}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVote(video.id, video.haveUpvoted ? false : true)}
                      aria-label="Upvote"
                    >
                      {video.haveUpvoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                    <span>{video.upvotes}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
