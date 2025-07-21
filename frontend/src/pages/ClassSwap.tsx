import type { SwapRequestType } from "../types";
import SwapRequests from "../components/SwapRequests";
import NewSwap from "../components/NewSwap";
import TelegramLoginButton from "../components/TelegramLoginButton";
import { useEffect, useState } from "react";
import {
  cancelExistingSwap,
  createNewSwap,
  fulfillSwap,
  readMySwaps,
} from "../functions/classSwapApi";
import { v4 as uuidv4 } from "uuid";

export default function ClassSwap() {
  const [requests, setRequests] = useState<SwapRequestType[]>([]);

  const handleCreateSwapRequest = (data: {
    moduleCode: string;
    lessonType: string;
    fromClassNo: string;
    toClassNos: string[];
  }) => {
    const tempId = uuidv4();
    setRequests((prev) => [
      { ...data, id: tempId, status: "pending" },
      ...prev,
    ]);
    createNewSwap(
      data.moduleCode,
      data.lessonType,
      data.fromClassNo,
      data.toClassNos
    )
      .then((responseData) => {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === tempId
              ? { ...req, id: responseData.id, status: responseData.status }
              : req
          )
        );
      })
      .catch((error) => {
        console.error("Error creating swap request:", error);
      });
  };

  const handleFulfillSwapRequest = async (swapId: string) => {
    try {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === swapId ? { ...req, status: "fulfilled" } : req
        )
      );
      await fulfillSwap(swapId);
    } catch (error) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === swapId ? { ...req, status: "pending" } : req
        )
      );
      console.error("Error fulfilling swap request:", error);
    }
  };

  const handleCancelSwapRequest = async (swapId: string) => {
    try {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === swapId ? { ...req, status: "cancelled" } : req
        )
      );
      await cancelExistingSwap(swapId);
    } catch (error) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === swapId ? { ...req, status: "pending" } : req
        )
      );
      console.error("Error canceling swap request:", error);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await readMySwaps();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching swap requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-8 h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Class Swap</h1>
        <TelegramLoginButton />
      </div>
      <div className="grid grid-cols-2 gap-6 items-start">
        <NewSwap onCreate={handleCreateSwapRequest} />
        <SwapRequests
          requests={requests}
          onCancel={handleCancelSwapRequest}
          onFulfill={handleFulfillSwapRequest}
        />
      </div>
    </div>
  );
}
