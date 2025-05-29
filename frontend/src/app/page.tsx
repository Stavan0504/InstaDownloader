"use client"

import axios from "axios"
import React, { useState } from "react"
import { Instagram, ArrowRight, User } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [url, setUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [profileUrl, setProfileUrl] = useState("")
  interface ProfileData {
    username: string;
    full_name: string;
    biography: string;
    followers_count: number;
    following_count: number;
    media_count: number;
    profile_pic_url: string;
    is_verified?: boolean;
    category?: string;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState("")
  const [profileError, setProfileError] = useState("")

  const cleanInstagramUrl = (inputUrl: string): string => {
    let cleanUrl = inputUrl.split('?')[0]
    if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1)
    return cleanUrl
  }

  async function handleReelSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setVideoUrl("")
    try {
      const cleanedUrl = cleanInstagramUrl(url)
      const response = await axios.request({
        method: "GET",
        url: "https://instagram-reels-downloader-api.p.rapidapi.com/download",
        headers: {
          "x-rapidapi-key": "a39a70be31msh74f618556a748b1p12ea79jsn797d1d01b492",
          "x-rapidapi-host": "instagram-reels-downloader-api.p.rapidapi.com"
        },
        params: { url: cleanedUrl }
      })
      setVideoUrl(response.data.data.medias[0].url)
    } catch (error) {
      console.error("Reel download error:", error);
      setError("Failed to download the reel. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError("")
    setProfileData(null)

    try {
      // Extract username from URL or use direct username input
      let username = profileUrl;
      
      // If it's a URL, extract the username part
      if (profileUrl.includes('instagram.com/') || profileUrl.includes('/')) {
        const urlParts = profileUrl.split('/');
        username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  
        username = username.split('?')[0];
      }
    
      const userIdResponse = await axios.request({
        method: "GET",
        url: "https://instagram-best-experience.p.rapidapi.com/user_id_by_username",
        headers: {
          "x-rapidapi-key": "e2a8a5440cmshea2086a6af898c6p18db40jsncb7ffd3b3f67",
          "x-rapidapi-host": "instagram-best-experience.p.rapidapi.com"
        },
        params: { username: username }
      });
      
      const userId = userIdResponse.data.UserID;
      if (!userId) {
        throw new Error("Could not find user ID");
      }
      
      const profileResponse = await axios.request({
        method: "GET",
        url: "https://instagram-best-experience.p.rapidapi.com/profile",
        headers: {
          "x-rapidapi-key": "e2a8a5440cmshea2086a6af898c6p18db40jsncb7ffd3b3f67",
          "x-rapidapi-host": "instagram-best-experience.p.rapidapi.com"
        },
        params: { user_id: userId }
      });
      

      let profileImageUrl = "https://via.placeholder.com/150?text=Profile";
      
      if (profileResponse.data.hd_profile_pic_url_info?.url) {
        profileImageUrl = profileResponse.data.hd_profile_pic_url_info.url;
      } else if (profileResponse.data.hd_profile_pic_versions?.[0]?.url) {
        profileImageUrl = profileResponse.data.hd_profile_pic_versions[0].url;
      } else if (profileResponse.data.profile_pic_url) {
        profileImageUrl = profileResponse.data.profile_pic_url;
      }
      
      const profileData = {
        ...profileResponse.data,
        followers_count: profileResponse.data.follower_count,
        following_count: profileResponse.data.following_count,
        full_name: profileResponse.data.full_name || username,
        media_count: profileResponse.data.media_count,
        biography: profileResponse.data.biography || "",
        profile_pic_url: profileImageUrl
      };
      
      setProfileData(profileData);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setProfileError("Failed to fetch profile. Please check the username or try again.");
    } finally {
      setProfileLoading(false)
    }
  }
  console.log(profileData?.profile_pic_url)

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex flex-col items-center justify-center p-4 md:p-8 space-y-10">
      
      {/* Reels Downloader */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-center mb-6">
            <Instagram className="w-8 h-8 text-[#E1306C] mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-transparent bg-clip-text">
              Reels Downloader
            </h1>
          </div>
          <form onSubmit={handleReelSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Paste Instagram Reel URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1306C]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
            >
              {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Download Reel <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}
        </div>
      </div>

      {/* Profile Fetcher */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-center mb-6">
            <User className="w-7 h-7 text-[#E1306C] mr-2" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-transparent bg-clip-text">
              Instagram Profile Viewer
            </h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Paste Instagram Profile URL or Username"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-4 focus:border-t-amber-500 focus:border-b-purple-500 focus:border-r-yellow-500 focus:border-l-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
            >
              {profileLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Fetch Profile <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
          {profileError && <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{profileError}</div>}
        </div>
      </div>

      {/* Profile Display */}
      {profileData && (
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg text-center space-y-4">
          {/* Using Next.js Image component would be better for performance, but keeping img for simplicity */}
          <div className="relative w-24 h-24 mx-auto">
            <Image
              width={96}
              height={96} 
              src={profileData?.profile_pic_url}
              alt={`${profileData.username}'s Profile`}
              className="w-24 h-24 text-black rounded-full mx-auto shadow-md object-cover"

            />
            {profileData.is_verified && (
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <h3 className="text-xl text-black font-bold">{profileData.full_name}</h3>
          <p className="text-gray-700">@{profileData.username}</p>
          {profileData.biography && <p className="text-gray-600 text-sm">{profileData.biography}</p>}
          {profileData.category && <p className="text-blue-600 text-xs font-medium">{profileData.category}</p>}
          <div className="flex justify-center gap-6 text-gray-800 mt-2">
            <div><strong>{profileData.followers_count?.toLocaleString()}</strong><br />Followers</div>
            <div><strong>{profileData.following_count?.toLocaleString()}</strong><br />Following</div>
            <div><strong>{profileData.media_count?.toLocaleString()}</strong><br />Posts</div>
          </div>
        </div>
      )}

      {/* Reel Display */}
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
    </div>
  )
}