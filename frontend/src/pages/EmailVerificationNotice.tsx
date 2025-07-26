import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

export const cooldownTime = 5; // seconds
export default function EmailVerificationNotice() {
  const [cooldown, setCooldown] = useState(cooldownTime);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!user) return;
    setResending(true);
    setMessage("");

    try {
      await sendEmailVerification(user, {
        url: "https://shining-rattler-apparently.ngrok-free.app/firebase-handler",
        handleCodeInApp: true,
      });
      setCooldown(cooldownTime);
      setMessage("Verification email resent.");
    } catch (error: any) {
      console.error("Error resending verification:", error);
      setMessage("Failed to resend email. Try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-gray-600">
          A verification email has been sent to <strong>{user?.email}</strong>.{" "}
          <br />
          Please check your inbox and click the verification link.
        </p>
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className={`w-full h-12 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            cooldown > 0 || resending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
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
  );
}
