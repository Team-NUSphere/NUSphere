import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "../firebase";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  let didRun = false;

  const [status, setStatus] = useState<"verifying" | "verified" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (didRun) return;
    didRun = true;
    console.log("OOB Code:", oobCode);
    if (!oobCode) {
      setStatus("error");
      setMessage("Missing verification code.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const result = await checkActionCode(auth, oobCode);
        console.log("Action code valid:", result);
        setStatus("verified");
        await applyActionCode(auth, oobCode);
      } catch (err: any) {
        console.error(err);
        setMessage(err.message || "Verification failed.");
        setStatus("error");
      }
    };

    if (status !== "verified") {
      verifyEmail();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-700">
          Email Verification
        </h1>

        {status === "verifying" && (
          <p className="text-gray-500">Verifying your email...</p>
        )}

        {status === "verified" && (
          <>
            <p className="text-gray-600">
              Account setup complete. You can now log in.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-600 font-medium">Error: {message}</p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
