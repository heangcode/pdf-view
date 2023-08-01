import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import PDFViewer from "./components/PDFViewer";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload PDF
        </label>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {file && (
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer p-4 border-2 border-blue-400 rounded-lg shadow-lg text-center hover:bg-blue-50 transition"
        >
          <p className="text-blue-600 font-bold">{file.name}</p>
          <p className="text-sm text-gray-500 mt-1">Click to view</p>
        </div>
      )}
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <PDFViewer file={file} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
