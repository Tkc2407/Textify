import React from "react";
import { Document, Page } from "react-pdf";
import styled from "styled-components";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const ViewerContainer = styled.div`
  width: 80%;
  margin-bottom: 2rem;
`;

const PDFViewer = ({
  file,
  onTextExtracted,
  onDocumentLoadSuccess,
  currentPage,
}) => {
const onPageLoadSuccess = (page) => {
  // console.log("Page loaded:", page); // Log the page object to inspect its structure

  page
    .getTextContent()
    .then((textContent) => {
      // console.log("Text content:", textContent); // Log the extracted text content
      onTextExtracted(currentPage, textContent);
    })
    .catch((error) => {
      console.error("Error extracting text:", error);
    });
};


  return (
    <ViewerContainer>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => onDocumentLoadSuccess(numPages)}
        loading={<div>Loading PDF...</div>}
      >
        <Page
          pageNumber={currentPage}
          onLoadSuccess={onPageLoadSuccess}
          width={800}
        />
      </Document>
    </ViewerContainer>
  );
};

export default PDFViewer;
