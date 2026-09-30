import { useState } from "react";
import MyDetailsTab from "../components/settings/MyDetailsTab";
import PasswordTab from "../components/settings/PasswordTab";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"details" | "password">("details");

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="border-b border-gray-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "details"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              My details
              {activeTab === "details" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "password"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Password
              {activeTab === "password" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        {activeTab === "details" && <MyDetailsTab />}
        {activeTab === "password" && <PasswordTab />}
      </div>
    </div>
  );
}
