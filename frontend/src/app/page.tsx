"use client"

import axios from "axios"
import type React from "react"
import { useState } from "react"
import { Instagram, ArrowRight } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const options = {
    method: 'GET',
    url: 'https://instagram-reels-downloader-api.p.rapidapi.com/download',
    headers: {
      'x-rapidapi-key': 'a39a70be31msh74f618556a748b1p12ea79jsn797d1d01b492',
      'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com'
    }
  };

  const cleanInstagramUrl = (inputUrl: string): string => {
    let cleanUrl = inputUrl.split('?')[0];

    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    return cleanUrl;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setVideoUrl("") // Reset the video URL on submit to ensure it updates with new URL

    try {
      // Clean the URL before sending to API
      const cleanedUrl = cleanInstagramUrl(url);
      console.log("Original URL:", url);
      console.log("Cleaned URL:", cleanedUrl);
      
      const response = await axios.request({ 
        ...options, 
        params: { url: cleanedUrl } // Use the cleaned URL
      })
      console.log(response.data.data.medias)
      setVideoUrl(response.data.data.medias[0].url)
    } catch (err) {
      console.error(err)
      setError("Failed to download the reel. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-center mb-6">
            <Instagram className="w-8 h-8 text-[#E1306C] mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-transparent bg-clip-text">
              Reels Downloader
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                title="Reels"
                placeholder="Paste Instagram Reel URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1306C] transition-all"
                required
              />
            </div>

            <button
              type="submit"
              title="Submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Download Reel <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {error && <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}
        </div>
      </div>

      {videoUrl && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Your Reel is Ready!</h2>

          <div className="relative rounded-xl overflow-hidden aspect-[9/16] max-h-[70vh] mx-auto">
            <video className="w-full h-full object-contain bg-black" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>

          <div className="mt-4 text-center">
            <a
              href={videoUrl}
              download
              className="inline-block bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              Download Video
            </a>
          </div>
        </div>
      )}

      <footer className="mt-8 text-white text-sm opacity-80">
        Download your favorite Instagram Reels easily and quickly
      </footer>
    </div>
  )
}
