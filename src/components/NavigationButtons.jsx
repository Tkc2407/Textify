import React from "react";
import styled from "styled-components";

const NavContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #a0c5f5;
    cursor: not-allowed;
  }
`;

const NavigationButtons = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <NavContainer>
      <NavButton
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </NavButton>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <NavButton
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </NavButton>
    </NavContainer>
  );
};

export default NavigationButtons;
