import React from 'react'

function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full">
        <img
          className="block h-64 sm:h-96 w-full object-cover"
          src="https://images.pexels.com/photos/4240505/pexels-photo-4240505.jpeg"
          alt="Blog hero"
        />
         <div className="absolute inset-x-4 top-8 sm:inset-x-10 sm:top-10">
          <h1 className="max-w-xl break-words text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Blog App</h1>
          <p className="max-w-lg text-base sm:text-xl drop-shadow-md">Here you can share your thoughts and ideas</p>
        </div>
      </div>

      {/* Second Section */}
      <div className="relative w-full">
        <img
          className="block h-64 sm:h-96 w-full object-cover"
          src="https://images.pexels.com/photos/1283208/pexels-photo-1283208.jpeg"
          alt="Writing"
        />
        <div className="absolute inset-x-4 top-8 sm:inset-x-10 sm:top-10 text-white shadow-lg">
          <h3 className="max-w-xl text-3xl sm:text-4xl font-bold drop-shadow-lg">What's on your mind?</h3>
        </div>
      </div>


      <div className="relative w-full">
        <img
          className="block h-64 sm:h-96 w-full object-cover"
          src="https://media.istockphoto.com/id/1401461124/photo/hand-of-businessman-using-smart-phone-with-coin-icon.webp?a=1&b=1&s=612x612&w=0&k=20&c=jrKfE0a9gq_TAZeQUvCA1Q9d3yO1LbObo8OehCkFTHM="
          alt="Writing"
        />
       <div className="absolute inset-x-4 top-8 sm:inset-x-10 sm:top-10 text-white">
          <h3 className="max-w-xl text-3xl sm:text-4xl font-bold drop-shadow-lg">Earn With Us</h3>
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-4 sm:px-8">
        <h2 className="text-2xl font-bold mt-6 mb-4">Trending Blogs</h2>
      </div>
    </div>
  )
}

export default Home