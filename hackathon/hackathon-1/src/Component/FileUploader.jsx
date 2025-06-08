import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

const FileUploader = ({onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [closed, setClosed] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file); // 🔁 Send file to parent
    }
  };

  const handleClose = () => {
    setClosed(true);
    setFile(null);
  };

  return (
    <div
      className={`my-2 ${
        file ? "border-teal-800" : "border-gray-500"
      } p-3 rounded-lg`}
    >
      {!closed && (
        <div
  className="w-full h-48 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white flex flex-col items-center justify-center relative cursor-pointer"          onClick={handleClick}
        >
          <X
            size={20}
            className="absolute top-2 right-2 text-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center">
            <Plus size={40} className="text-gray" />
            <p
              className={`${
                file ? "text-teal-800" : "text-white"
              } font-medium`}
            >
              {file ? "File Selected" : "Add photos/videos"}
            </p>
            <p className="text-sm text-black">or drag and drop</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
