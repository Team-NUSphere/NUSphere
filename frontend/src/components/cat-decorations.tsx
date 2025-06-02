import "../output.css"

export function CatDecorations() {
  return (
    <>
      {/* Left side cats */}
      <div className="absolute -left-16 top-8 hidden md:block">
        <div className="relative">
          {/* Orange cat */}
          <div className="w-16 h-16 bg-orange-400 rounded-full relative mb-4 transform hover:scale-110 transition-transform duration-300">
            {/* Eyes */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
            {/* Mouth */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black rounded-full"></div>
            {/* Ears */}
            <div className="absolute -top-2 left-3 w-4 h-4 bg-orange-400 rounded-full transform rotate-45"></div>
            <div className="absolute -top-2 right-3 w-4 h-4 bg-orange-400 rounded-full transform rotate-45"></div>
            {/* Inner ears */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-orange-300 rounded-full transform rotate-45"></div>
            <div className="absolute -top-1 right-4 w-2 h-2 bg-orange-300 rounded-full transform rotate-45"></div>
          </div>

          {/* White cat */}
          <div className="w-14 h-14 bg-gray-100 rounded-full relative ml-8 transform hover:scale-110 transition-transform duration-300">
            {/* Eyes */}
            <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
            {/* Mouth */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
            {/* Ears */}
            <div className="absolute -top-1 left-2 w-3 h-3 bg-gray-100 rounded-full transform rotate-45"></div>
            <div className="absolute -top-1 right-2 w-3 h-3 bg-gray-100 rounded-full transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Right side cats */}
      <div className="absolute -right-16 top-12 hidden md:block">
        <div className="relative">
          {/* Gray cat */}
          <div className="w-14 h-14 bg-gray-500 rounded-full relative mb-3 transform hover:scale-110 transition-transform duration-300">
            {/* Eyes */}
            <div className="absolute top-3 left-3 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full"></div>
            {/* Pupils */}
            <div className="absolute top-3.5 left-3.5 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-3.5 right-3.5 w-1 h-1 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
            {/* Mouth */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
            {/* Ears */}
            <div className="absolute -top-1 left-2 w-3 h-3 bg-gray-500 rounded-full transform rotate-45"></div>
            <div className="absolute -top-1 right-2 w-3 h-3 bg-gray-500 rounded-full transform rotate-45"></div>
          </div>

          {/* Brown cat */}
          <div className="w-16 h-16 bg-amber-700 rounded-full relative ml-4 transform hover:scale-110 transition-transform duration-300">
            {/* Eyes */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full"></div>
            {/* Pupils */}
            <div className="absolute top-4.5 left-4.5 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-4.5 right-4.5 w-1 h-1 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
            {/* Mouth */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black rounded-full"></div>
            {/* Ears */}
            <div className="absolute -top-2 left-3 w-4 h-4 bg-amber-700 rounded-full transform rotate-45"></div>
            <div className="absolute -top-2 right-3 w-4 h-4 bg-amber-700 rounded-full transform rotate-45"></div>
          </div>

          {/* Small orange cat */}
          <div className="w-12 h-12 bg-orange-500 rounded-full relative mt-3 ml-8 transform hover:scale-110 transition-transform duration-300">
            {/* Eyes */}
            <div className="absolute top-2 left-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>
            {/* Mouth */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-black rounded-full"></div>
            {/* Ears */}
            <div className="absolute -top-1 left-1.5 w-3 h-3 bg-orange-500 rounded-full transform rotate-45"></div>
            <div className="absolute -top-1 right-1.5 w-3 h-3 bg-orange-500 rounded-full transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Animated paw prints */}
      <div className="absolute top-4 left-8 opacity-20 animate-pulse">
        <div className="w-3 h-3 bg-gray-400 rounded-full relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>
        <div className="w-3 h-3 bg-gray-400 rounded-full relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-1/3 left-4 opacity-15 animate-pulse" style={{ animationDelay: "2s" }}>
        <div className="w-2 h-2 bg-gray-400 rounded-full relative">
          <div className="absolute -top-1 -left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-4 opacity-15 animate-pulse" style={{ animationDelay: "0.5s" }}>
        <div className="w-2 h-2 bg-gray-400 rounded-full relative">
          <div className="absolute -top-1 -left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </>
  )
}
