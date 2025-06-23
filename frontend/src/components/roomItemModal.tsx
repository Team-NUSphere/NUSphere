import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getWebSocketContext } from "../contexts/webSocketContext";
import axios from "axios";
import { backendHttp } from "../constants";

export default function roomItemModal() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [roomIdPlaceholder, setRoomIdPlaceholder] = useState("");
  const { roomId, connectWebSocket, terminateWebSocket, createNewRoom } =
    getWebSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId !== "") navigate(`/room/${roomId}`, { replace: true });
    else navigate("/timetable", { replace: true });
  }, [roomId]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    setRoomIdPlaceholder("");
    connectWebSocket(roomIdPlaceholder);
    closeModal();
  }

  function handleCreateRoom() {
    createNewRoom();
    setRoomIdPlaceholder("");
    closeModal();
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const isActive = location.pathname.includes("/room/");
    if (roomId === "" || isActive) {
      e.preventDefault();
      openModal();
    }
  }

  return (
    <>
      <NavLink
        to={`/room/${roomId}`}
        onClick={handleClick}
        draggable={false}
        className={({ isActive }) => {
          return clsx(
            "flex flex-col items-center justify-center p-2 aspect-square w-full rounded-md transition-colors select-none",
            {
              "bg-blue-100 text-blue-600": isActive,
              "text-gray-500 hover:bg-gray-100": !isActive,
            }
          );
        }}
        end={false}
      >
        <FiUsers className="w-auto text-3xl h-auto mb-1" />
        <div className="w-full text-center overflow-hidden whitespace-nowrap">
          <span className="text-xs text-center inline-block">
            {roomId === "" ? "Room" : roomId}
          </span>
        </div>
      </NavLink>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 bg-opacity-30 z-101" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto z-102">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {roomId === "" ? "Create/Join Room" : `Room: ${roomId}`}
                  </DialogTitle>

                  {roomId === "" ? (
                    <form onSubmit={handleJoinRoom} className="mt-4 space-y-4">
                      <input
                        type="text"
                        placeholder="Join Room ID"
                        value={roomIdPlaceholder}
                        onChange={(e) => setRoomIdPlaceholder(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Join Room
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateRoom}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Create Room
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(roomId);
                          closeModal();
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Copy Room ID
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closeModal();
                          terminateWebSocket();
                          navigate("/timetable", { replace: true });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Leave
                      </button>
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
