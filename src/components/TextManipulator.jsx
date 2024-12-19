import React, { useState, useRef, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

const TextContainer = styled(animated.div)`
  width: 80%;
  user-select: none;
  touch-action: none;
`;

const TextLine = styled(animated.div)`
  cursor: pointer;
  padding: 0.2rem 0;
`;

const TextManipulator = ({ textLines }) => {
  const [spacing, setSpacing] = useState(1);
  const [overlapIndex, setOverlapIndex] = useState(null);
  const [isOverlapping, setIsOverlapping] = useState(false);

  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  const [styles, api] = useSpring(() => ({
    spacing: 1,
    config: { tension: 30, friction: 30 },
  }));

  useEffect(() => {
    if (lineRefs.current.length > 1) {
      const positions = lineRefs.current.map((line) =>
        line.getBoundingClientRect()
      );

      let overlapDetected = false;
      for (let i = 0; i < positions.length - 1; i++) {
        if (positions[i + 1].top - positions[i].bottom <= 0) {
          overlapDetected = true;
          break;
        }
      }

      setIsOverlapping(overlapDetected);
    }
  }, [spacing]);

  const bind = useGesture(
    {
      onPinch: ({ delta: [deltaDistance], direction: [, dirY], event }) => {
        event.preventDefault();
        const adjustmentFactor = 0.5;
        let newSpacing = spacing;

        if (deltaDistance < 0 || dirY > 0) {
          // Pinch-in: Lines move closer
          newSpacing = spacing - adjustmentFactor;
        } else if (deltaDistance > 0 || dirY < 0) {
          // Pinch-out: Lines move farther
          newSpacing = spacing + adjustmentFactor;
        }

        if (isOverlapping && newSpacing <= spacing) {
          return;
        }

        setSpacing(newSpacing);
        api.start({ spacing: newSpacing });
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
    }
  );

  return (
    <TextContainer ref={containerRef} style={{ marginTop: "2rem", ...styles }}>
      {textLines.map((line, idx) => (
        <TextLine
          key={idx}
          ref={(el) => (lineRefs.current[idx] = el)}
          style={{
            marginBottom: styles.spacing.to((s) => `${s * 10}px`),
            transform:
              overlapIndex === idx
                ? "translateY(-10px) scale(1.05)"
                : "translateY(0px) scale(1)",
            zIndex: overlapIndex === idx ? 1 : 0,
            boxShadow:
              overlapIndex === idx ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
          }}
          onClick={() => setOverlapIndex(idx === overlapIndex ? null : idx)}
        >
          {line}
        </TextLine>
      ))}
    </TextContainer>
  );
};

export default TextManipulator;
