import { CorsOptions } from "cors";

import { trustedOrigins } from "./trustedOrigins.js";

export const corsOptions: CorsOptions = {
  optionsSuccessStatus: 200,
  origin: (
    origin: string | undefined,
    callback: (arg0: Error | null, arg1: boolean | undefined) => void,
  ) => {
    if (!origin || trustedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
};
