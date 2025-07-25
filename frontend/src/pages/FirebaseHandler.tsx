import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function FirebaseHandler() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (!mode || !oobCode) {
      navigate("/error");
      return;
    }

    switch (mode) {
      case "verifyEmail":
        navigate(`/email-verified?oobCode=${oobCode}`);
        break;
      case "resetPassword":
        navigate(`/reset-password?oobCode=${oobCode}`);
        break;
      case "recoverEmail":
        // Optional: handle recover email use case
        navigate(`/recover-email?oobCode=${oobCode}`);
        break;
      default:
        navigate("/error");
        break;
    }
  }, [params]);

  return <p className="text-center mt-20 text-gray-500">Processing...</p>;
}
