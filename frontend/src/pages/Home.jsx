import React from 'react';

const Home = ({ onEnterDashboard, darkMode }) => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: darkMode ? "url('/page2.png')" : "url('/page1.png')",
      }}
    >
      
      <div className="absolute inset-0  bg-opacity-40"></div>

     
      <div className="relative z-10 flex flex-col items-start h-full w-1/2 px-3 ml-10 justify-center">
        <div className="transform -translate-y-10">
          <h1 className={`text-6xl mt-12 font-extrabold mb-8 leading-tight ${darkMode ? 'text-green-300' : 'text-green-400'}`}>
            Know the Health Impact of Your Surroundings with One Click
          </h1>
          <p className={`text-3xl mt-12 font-medium mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Make smarter, healthier decisions with AI-powered insights tailored to your neighborhood.
          </p>

          {/* Green button */}
        <button
  onClick={onEnterDashboard}
  className={`px-10 py-6 rounded-full text-2xl font-semibold shadow-lg transition
    ${darkMode 
      ? 'bg-green-800 text-white hover:bg-green-900' 
      : 'bg-green-500 text-white hover:bg-green-700'}`}
>
  Get Started
</button>

        </div>
      </div>
    </div>
  );
};

export default Home;






