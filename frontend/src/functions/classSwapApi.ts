import axiosApi from "./axiosApi";

export async function getAllLessonClasses(moduleCode: string) {
  const res = await axiosApi({
    method: "GET",
    url: `/swap/lessons/${moduleCode}`,
  });
  return res.data;
}

export async function createNewSwap(
  moduleCode: string,
  lessonType: string,
  fromClassNo: string,
  toClassNos: string[]
) {
  const res = await axiosApi({
    method: "POST",
    url: `/swap/new`,
    data: {
      moduleCode,
      lessonType,
      fromClassNo,
      toClassNos,
    },
  });
  return res.data as {
    id: string;
    status: "pending" | "matched" | "fulfilled" | "cancelled";
  };
}

export async function cancelExistingSwap(swapId: string) {
  const res = await axiosApi({
    method: "DELETE",
    url: `/swap/requests/${swapId}`,
  });
  if (res.status !== 200) {
    throw new Error("Failed to delete swap request");
  }
  return res.status === 200;
}

export async function readMySwaps() {
  const res = await axiosApi({
    method: "GET",
    url: "/swap/requests",
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch swap requests");
  }
  return res.data;
}

export async function fulfillSwap(swapId: string) {
  const res = await axiosApi({
    method: "PUT",
    url: `/swap/requests/${swapId}`,
  });
  if (res.status !== 200) {
    throw new Error("Failed to complete swap request");
  }
  return res.status === 200;
}
