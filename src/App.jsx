import React, { useState } from "react";
import PDFViewer from "./components/PDFViewer";
import TextManipulator from "./components/TextManipulator";
import NavigationButtons from "./components/NavigationButtons";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #aea8a8; /* Ensure this applies to the entire page */
    color: #000000;
    font-family: Arial, sans-serif;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden; /* Prevent horizontal scrolling */
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: margin-top 0.3s ease;
  margin-top: ${(props) =>
    props.isFileSelected
      ? "0"
      : "30vh"}; /* Move header to top once file is selected */
`;

const ViewerAndManipulator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 5rem;
`;

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 1rem;
  color: #000000;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: aea8a8;
`;

const ManipulatorContainer = styled.div`
  flex: 2;
  background-color: #2b2a2a;
  color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 5rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const App = () => {
  const [textData, setTextData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTextExtracted = (page, text) => {
    setTextData((prev) => ({
      ...prev,
      [page]: text.items.map((item) => item.str),
    }));
  };

  const handleDocumentLoadSuccess = (numPages) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTextData({});
    }
  };

  return (
    <>
      <GlobalStyle />
      <HeaderContainer isFileSelected={selectedFile}>
        <Heading
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            margin: "2",
          }}
        >
          Textify
        </Heading>{" "}
        <FileInput
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </HeaderContainer>
      <AppContainer>
        {selectedFile && (
          <ViewerAndManipulator>
            <ViewerContainer>
              <PDFViewer
                file={selectedFile}
                onTextExtracted={handleTextExtracted}
                onDocumentLoadSuccess={handleDocumentLoadSuccess}
                currentPage={currentPage}
              />
              <NavigationButtons
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={numPages}
              />
            </ViewerContainer>
            <ManipulatorContainer>
              {textData[currentPage] && (
                <TextManipulator textLines={textData[currentPage]} />
              )}
            </ManipulatorContainer>
          </ViewerAndManipulator>
        )}
      </AppContainer>
    </>
  );
};

export default App;
