import { useEffect } from "react";
import { authenticateTelegram, getAuth } from "../contexts/authContext";

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const TelegramLoginButton = () => {
  const { telegramId, setTelegramId } = getAuth();
  useEffect(() => {
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log("Telegram user authenticated:", user);

      const success = await authenticateTelegram(user);
      if (success) {
        const container = document.getElementById("telegram-login-container");
        setTelegramId(user.id);
        console.log("Telegram authentication successful");
        if (container) {
          container.innerHTML = "";
        }
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "nusphere_bot");
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = document.getElementById("telegram-login-container");
    container?.appendChild(script);

    return () => {
      container && (container.innerHTML = "");
    };
  }, []);

  return <div>{!telegramId && <div id="telegram-login-container" />}</div>;
};

export default TelegramLoginButton;
