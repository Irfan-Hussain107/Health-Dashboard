import React from "react";
import {
  AiOutlineSearch,
  AiOutlineCloud,
  AiOutlineSound,
  AiOutlineAlert,
  AiOutlineRobot,
  AiOutlineMessage,
  AiOutlineSend,
} from "react-icons/ai";

const features = [
  {
    icon: <AiOutlineSearch className="w-12 h-12" />,
    title: "Interactive Location Search",
    description:
      "Find environmental health info instantly by typing an address or clicking directly on the map.",
  },
  {
    icon: <AiOutlineCloud className="w-12 h-12" />,
    title: "Real-Time Air Quality Data",
    description:
      "Get up-to-the-minute AQI and PM2.5 readings from the nearest official monitoring station.",
  },
  {
    icon: <AiOutlineSound className="w-12 h-12" />,
    title: "Noise Pollution Score",
    description:
      "See estimated noise levels based on proximity to highways, railways, and other noise sources.",
  },
  {
    icon: <AiOutlineAlert className="w-12 h-12" />,
    title: "Live Civic Complaints Overview",
    description:
      "Stay updated on real-world quality of life issues through live civic complaint summaries.",
  },
  {
    icon: <AiOutlineRobot className="w-12 h-12" />,
    title: "AI-Powered Summary",
    description:
      "Instantly understand complex environmental data through simple AI-generated summaries.",
  },
  {
    icon: <AiOutlineMessage className="w-12 h-12" />,
    title: "Contextual Health Chatbot",
    description:
      "Ask specific health-related questions and get instant, data-driven answers tailored to your location.",
  },
  {
    icon: <AiOutlineSend className="w-12 h-12" />,
    title: "AI Complaint Assistant",
    description:
      "Draft professional complaint emails effortlessly—just describe the problem, and our AI does the rest.",
  },
];

const Features = ({ darkMode }) => {
  return (
    <section className={`${darkMode ? "bg-[#2E2B2B]" : "bg-green-100"} py-16`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className={`text-5xl font-extrabold mt-4 mb-16 text-center ${
            darkMode ? "text-green-300" : "text-green-500"
          }`}
        >
          Why Choose Our Dashboard?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map(({ icon, title, description }, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 hover:shadow-2xl transition cursor-pointer shadow-lg ${
                darkMode
                  ? "bg-[#504C4C] text-gray-200 hover:#454242"
                  : "bg-white text-gray-800"
              }`}
            >
              <div className={`${darkMode ? "text-green-400" : "text-green-500"}`}>
                {icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

