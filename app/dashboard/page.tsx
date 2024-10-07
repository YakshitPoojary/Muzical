"use client"
import 'react-toastify/dist/ReactToastify.css'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import StreamView from "../components/StreamView"

const creatorId = "612cfbe8-dc18-4ac7-882d-37f5f26b098d"

export default function Component() {
  return <StreamView creatorId={creatorId} playVideo={true}/>
}

