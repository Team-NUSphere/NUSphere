import type { SwapRequestType } from "../types";

export default function SwapRequests({
  requests,
  onCancel,
  onFulfill,
}: {
  requests: SwapRequestType[];
  onCancel: (id: string) => void;
  onFulfill: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-3xl w-full max-h-[85vh] flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 shrink-0">
        Your Swap Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">You have no active swap requests.</p>
      ) : (
        <div className="overflow-y-auto space-y-4 pr-2 flex-1 min-h-0">
          {requests.map((req) => (
            <SwapRequest
              key={req.id}
              request={req}
              onCancel={onCancel}
              onFulfill={onFulfill}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SwapRequest({
  request,
  onCancel,
  onFulfill,
}: {
  request: SwapRequestType;
  onCancel: (id: string) => void;
  onFulfill: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-6 pb-2">
        <div className="flex items-start justify-between mb-3">
          <span className="text-lg font-semibold">
            {request.moduleCode}: {request.lessonType}
          </span>
          <div
            className={`text-xs font-medium px-3 py-1 rounded-md border min-w-[60px] text-center ${
              request.status === "pending"
                ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                : request.status === "matched"
                ? "bg-green-100 border-green-500 text-green-700"
                : request.status === "cancelled"
                ? "bg-red-100 border-red-500 text-red-700"
                : "bg-blue-100 border-blue-500 text-blue-700"
            }`}
          >
            {request.status}
          </div>
        </div>
        <div className="flex flex-row items-center font-medium space-x-2">
          <div className="px-4 py-1.5 rounded-full text-sm border bg-blue-100 border-blue-500 text-blue-700 hover:bg-blue-200 min-w-[80px] text-center">
            {request.fromClassNo}
          </div>
          <div className="text-gray-500">➝</div>
          <div className="flex flex-wrap gap-2">
            {request.toClassNos.map((cls) => (
              <div
                key={cls}
                className="px-4 py-1.5 rounded-full text-sm border bg-green-100 border-green-500 text-green-700 hover:bg-green-200 min-w-[80px] text-center"
              >
                {cls}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs flex space-x-2 justify-end mt-3">
          {request.status === "matched" && (
            <button
              className="text-green-500 hover:underline"
              onClick={() => onFulfill(request.id)}
            >
              Complete
            </button>
          )}
          <button
            className="text-red-500 hover:underline"
            onClick={() => onCancel(request.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
