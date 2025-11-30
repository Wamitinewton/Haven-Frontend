import { useState, useRef } from "react";

export const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedFileTypes.includes(file.type)) {
      alert("Please upload an image, PDF, or Word document");
      return;
    }

    setUploadedFile(file);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || uploadedFile) && !disabled) {
      onSend(message, uploadedFile);
      setMessage("");
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 md:p-4 bg-white border-t border-gray-200"
    >
      <div className="max-w-5xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-gray-300 p-3 md:p-4">
          {/* Top Section - Input Field */}
          <div className="mb-4">
            <div className="flex items-center gap-3 bg-transparent">
              <div className="pl-4">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="1"
                placeholder={
                  disabled ? "Waiting for response..." : "Ask me anything..."
                }
                className="flex-1 bg-transparent border-0 focus:border-0 focus:ring-0 focus:ring-offset-0 resize-none min-h-[52px] py-3 pr-4 rounded-lg focus:outline-none disabled:cursor-not-allowed text-black placeholder-gray-400"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Bottom Section - Actions */}
          <div className="flex items-center justify-between gap-2">
            {/* File Preview or Select Source Dropdown */}
            {uploadedFile ? (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors shrink-0"
              >
                <span className="text-xs font-medium">
                  {getFileExtension(uploadedFile.name)}
                </span>
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-3xl border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Select Source</span>
              </button>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
              {/* Attach Button */}
              <button
                type="button"
                onClick={handleAttachClick}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white rounded-3xl border border-gray-500 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="hidden md:inline text-sm font-medium">
                  Attach
                </span>
              </button>

              {/* Voice Button */}
              <button
                type="button"
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white rounded-3xl border border-gray-500 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <span className="hidden md:inline text-sm font-medium">
                  Voice
                </span>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={disabled || (!message.trim() && !uploadedFile)}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-3xl bg-black text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span className="hidden md:inline text-sm font-medium">
                  Send
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
