// App.js
import React from "react";
import ChatInterface from "./ChatInterface";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Multilingual Chat Interface
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Support for English, हिंदी, ಕನ್ನಡ, தமிழ்
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ChatInterface />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Supported Languages: English | हिंदी (Hindi) | ಕನ್ನಡ (Kannada) | தமிழ் (Tamil)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;