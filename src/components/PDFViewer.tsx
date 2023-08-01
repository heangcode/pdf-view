import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  HiArrowDownTray,
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiOutlineArrowPath,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePrinter,
} from "react-icons/hi2";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<"pagination" | "continuous">(
    () =>
      (localStorage.getItem("viewMode") as "pagination" | "continuous") ||
      "pagination"
  ); // Retrieve view mode from local storage

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  const downloadPDF = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
    }
  };

  const printPDF = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
    }
  };

  const renderPages = () => {
    if (viewMode === "continuous") {
      return Array.from({ length: numPages! }, (_, index) => (
        <Page
          key={index}
          pageNumber={index + 1}
          renderTextLayer={false}
          scale={zoomLevel}
        />
      ));
    } else {
      return (
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          scale={zoomLevel}
        />
      );
    }
  };

  const zoomPercentage = (zoomLevel * 100).toFixed(0) + "%";

  // Effect to update local storage when view mode changes
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);
  return (
    <div className="container mx-auto p-4">
      <div className="sticky top-0 z-10 bg-white p-4 flex justify-between items-center mb-4 shadow">
        <div className="flex space-x-4">
          <button
            onClick={downloadPDF}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
          >
            <HiArrowDownTray className="w-6 h-6" />
          </button>
          <button
            onClick={printPDF}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
          >
            <HiOutlinePrinter className="w-6 h-6" />
          </button>
          <button
            onClick={() => setZoomLevel(zoomLevel + 0.1)}
            className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100 transition"
          >
            <HiMagnifyingGlassPlus className="w-6 h-6" />
          </button>
          <span className="text-gray-600">{zoomPercentage}</span>
          <button
            onClick={() => setZoomLevel(zoomLevel - 0.1)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
          >
            <HiMagnifyingGlassMinus className="w-6 h-6" />
          </button>
          <button
            onClick={() =>
              setViewMode(
                viewMode === "pagination" ? "continuous" : "pagination"
              )
            }
            className="text-purple-500 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100 transition"
          >
            <HiOutlineArrowPath className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 text-2xl p-2 rounded-full hover:bg-red-100 transition"
        >
          &times; {/* Close icon */}
        </button>
      </div>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="mb-4"
      >
        {renderPages()} {/* Render pages based on the view mode */}
      </Document>
      {viewMode === "pagination" && (
        <div className="sticky bottom-0 z-10 bg-white p-4 shadow">
          <p className="text-center">
            Page {pageNumber} of {numPages}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>
            <button
              disabled={pageNumber >= numPages!}
              onClick={() => setPageNumber(pageNumber + 1)}
              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
