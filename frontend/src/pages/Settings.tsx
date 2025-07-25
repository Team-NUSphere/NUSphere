import type React from "react";
import { useState, useEffect } from "react";
import { getAuth } from "../contexts/authContext";
import axiosApi from "../functions/axiosApi";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { cooldownTime } from "./EmailVerificationNotice";

interface UserProfile {
  uid: string;
  username: string;
}

export default function Settings() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const { currentUser } = getAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosApi.get("/user/profile");
      setUserProfile(response.data);
      setNewUsername(response.data.username);
    } catch (err) {
      setError("Failed to load user profile");
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosApi.put("/user/username", { newUsername });
      setSuccess("Username updated successfully!");
      await fetchUserProfile();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResend = async () => {
    if (!currentUser || !currentUser.email) return;
    setResending(true);
    setSuccess("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, currentUser.email, {
        url: "https://shining-rattler-apparently.ngrok-free.app/firebase-handler",
        handleCodeInApp: true,
      });
      setCooldown(cooldownTime);
      setSuccess(`A verification email has been sent to ${currentUser.email}.`);
    } catch (error: any) {
      console.error("Error resending verification:", error);
      setError("Failed to resend email. Try again later.");
    } finally {
      setResending(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-auto">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">Your account details</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={currentUser?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userProfile.uid}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Username Update Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Username
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Change your display name
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleUsernameUpdate} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    minLength={3}
                    maxLength={30}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter new username"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || newUsername === userProfile.username}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Username"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Password Update Card - Full Width */}
        {currentUser?.providerData.some(
          (profile) => profile.providerId === "password"
        ) && (
          <div>
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-100 flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your account password
                  </p>
                </div>
                <button
                  type="submit"
                  onClick={handlePasswordResend}
                  disabled={cooldown > 0 || resending}
                  className={`bg-gradient-to-r text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                    ${
                      cooldown > 0 || resending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {resending
                    ? "Resending..."
                    : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend Verification Email"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// {/* Security Notice */}
// <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
//   <div className="flex items-start">
//     <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center mr-3 mt-0.5">
//       <div className="w-2 h-2 bg-white rounded-full"></div>
//     </div>
//     <div>
//       <h3 className="font-medium text-amber-800 mb-1">
//         Security Notice
//       </h3>
//       <p className="text-sm text-amber-700">
//         Keep your account secure by using a strong password and
//         updating it regularly. Your password should be at least 6
//         characters long and include a mix of letters, numbers, and
//         symbols.
//       </p>
//     </div>
//   </div>
// </div>
