import { useState } from "react";
import Box from "@mui/material/Box";
import { isMobile } from "../../libs/mobile";
import { useTheme, alpha } from "@mui/material/styles";

function Pointer({
  direction,
  size,
  setSize,
  position,
  setPosition,
  children,
  minSize,
  maxSize,
  ...props
}) {
  const [origin, setOrigin] = useState(null);

  function handlePointerDown(e) {
    !isMobile && e.target.setPointerCapture(e.pointerId);
    const { clientX, clientY } = isMobile ? e.targetTouches[0] : e;
    setOrigin({
      x: position.x,
      y: position.y,
      w: size.w,
      h: size.h,
      clientX,
      clientY,
    });
  }

  function handlePointerMove(e) {
    const { clientX, clientY } = isMobile ? e.targetTouches[0] : e;
    if (origin) {
      const dx = clientX - origin.clientX;
      const dy = clientY - origin.clientY;
      let x = position.x;
      let y = position.y;
      let w = size.w;
      let h = size.h;

      switch (direction) {
        case "Header":
          x = origin.x + dx;
          y = origin.y + dy;
          break;
        case "TopLeft":
          x = origin.x + dx;
          y = origin.y + dy;
          w = origin.w - dx;
          h = origin.h - dy;
          break;
        case "Top":
          y = origin.y + dy;
          h = origin.h - dy;
          break;
        case "TopRight":
          y = origin.y + dy;
          w = origin.w + dx;
          h = origin.h - dy;
          break;
        case "Left":
          x = origin.x + dx;
          w = origin.w - dx;
          break;
        case "Right":
          w = origin.w + dx;
          break;
        case "BottomLeft":
          x = origin.x + dx;
          w = origin.w - dx;
          h = origin.h + dy;
          break;
        case "Bottom":
          h = origin.h + dy;
          break;
        case "BottomRight":
          w = origin.w + dx;
          h = origin.h + dy;
          break;
        default:
      }

      if (w < minSize.w) {
        w = minSize.w;
        x = position.x;
      }
      if (w > maxSize.w) {
        w = maxSize.w;
        x = position.x;
      }
      if (h < minSize.h) {
        h = minSize.h;
        y = position.y;
      }
      if (h > maxSize.h) {
        h = maxSize.h;
        y = position.y;
      }

      setPosition({ x, y });
      setSize({ w, h });
    }
  }

  function handlePointerUp(e) {
    e.stopPropagation();
    setOrigin(null);
  }

  const touchProps = isMobile
    ? {
      onTouchStart: handlePointerDown,
      onTouchMove: handlePointerMove,
      onTouchEnd: handlePointerUp,
    }
    : {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    };

  return (
    <div {...props} {...touchProps}>
      {children}
    </div>
  );
}

export default function DraggableResizable({
  header,
  children,
  position = {
    x: 0,
    y: 0,
  },
  size = {
    w: 600,
    h: 400,
  },
  minSize = {
    w: 300,
    h: 200,
  },
  maxSize = {
    w: 1200,
    h: 1200,
  },
  setSize,
  setPosition,
  onChangeSize,
  onChangePosition,
  autoHeight,
  ...props
}) {
  const lineWidth = 4;
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  const glowShadow = isDark
    ? `
        0 0 1px rgba(0, 212, 255, 0.8),
        0 0 4px rgba(0, 212, 255, 0.4),
        0 0 8px rgba(32, 156, 238, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.5)
      `
    : ` 
        0 0 1px rgba(32, 156, 238, 0.6),
        0 0 4px rgba(32, 156, 238, 0.2),
        0 4px 20px rgba(0, 0, 0, 0.15)
      `;
  
  const gradientBorder = isDark
    ? "linear-gradient(135deg, #00d4ff 0%, #209CEE 25%, #00d4ff 50%, #209CEE 75%, #00d4ff 100%)"
    : "linear-gradient(135deg, #209CEE 0%, #00d4ff 25%, #209CEE 50%, #00d4ff 75%, #209CEE 100%)";
    
  const opts = {
    size,
    setSize,
    position,
    setPosition,
    minSize,
    maxSize,
  };

  return (
    <Box
      className="KT-draggable"
      style={{
        touchAction: "none",
        position: "fixed",
        left: position.x,
        top: position.y,
        display: "grid",
        gridTemplateColumns: `${lineWidth * 2}px auto ${lineWidth * 2}px`,
        gridTemplateRows: `${lineWidth * 2}px auto ${lineWidth * 2}px`,
        zIndex: 2147483647,
        borderRadius: "14px",
        overflow: "hidden",
      }}
      {...props}
    >
      <style>
        {`
          @keyframes kt-border-flow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes kt-glow-pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
          }
          .KT-draggable-border {
            position: absolute;
            inset: 0;
            border-radius: 14px;
            padding: 1.5px;
            background: ${gradientBorder};
            background-size: 300% 300%;
            animation: kt-border-flow 4s ease infinite;
            -webkit-mask: 
              linear-gradient(#fff 0 0) content-box, 
              linear-gradient(#fff 0 0);
            mask: 
              linear-gradient(#fff 0 0) content-box, 
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
          }
          .KT-draggable-glow {
            position: absolute;
            inset: -2px;
            border-radius: 16px;
            background: ${gradientBorder};
            background-size: 300% 300%;
            animation: kt-border-flow 4s ease infinite, kt-glow-pulse 3s ease-in-out infinite;
            filter: blur(8px);
            opacity: 0.4;
            pointer-events: none;
            z-index: -1;
          }
          .KT-draggable-body {
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            background: ${isDark 
              ? "linear-gradient(180deg, rgba(22, 33, 62, 0.98) 0%, rgba(26, 26, 46, 0.98) 100%)" 
              : `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`};
            box-shadow: ${glowShadow};
          }
          .KT-draggable-body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent);
          }
        `}
      </style>
      <Pointer
        direction="TopLeft"
        style={{
          transform: `translate(${lineWidth}px, ${lineWidth}px)`,
          cursor: "nw-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="Top"
        style={{
          margin: `0 ${lineWidth}px`,
          transform: `translate(0px, ${lineWidth}px)`,
          cursor: "row-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="TopRight"
        style={{
          transform: `translate(-${lineWidth}px, ${lineWidth}px)`,
          cursor: "ne-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="Left"
        style={{
          margin: `${lineWidth}px 0`,
          transform: `translate(${lineWidth}px, 0px)`,
          cursor: "col-resize",
        }}
        {...opts}
      />
      <Box
        className="KT-draggable-body"
      >
        <div className="KT-draggable-glow" />
        <div className="KT-draggable-border" />
        <Pointer
          className="KT-draggable-header"
          direction="Header"
          style={{ cursor: "move" }}
          {...opts}
        >
          {header}
        </Pointer>
        <Box
          className="KT-draggable-container"
          sx={() => {
            const containerStyle = autoHeight
              ? {
                  width: size.w,
                  maxHeight: size.h,
                  overflow: "hidden auto",
                }
              : {
                  width: size.w,
                  height: size.h,
                  overflow: "hidden auto",
                };

            const scrollbarTrackColor = theme.palette.mode === "dark" ? "#1f1f23" : theme.palette.background.paper;
            const scrollbarThumbColor = theme.palette.mode === "dark" ? alpha(theme.palette.text.primary, 0.28) : alpha(theme.palette.text.primary, 0.24);

            return {
              ...containerStyle,
              backgroundColor: "transparent",
              "&::-webkit-scrollbar": {
                width: 10,
                height: 10,
              },
              "&::-webkit-scrollbar-track": {
                background: scrollbarTrackColor,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: scrollbarThumbColor,
                borderRadius: 8,
                border: `2px solid ${theme.palette.background.paper}`,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: alpha(theme.palette.text.primary, 0.36),
              },
              scrollbarWidth: "thin",
              scrollbarColor: `${scrollbarThumbColor} ${scrollbarTrackColor}`,
            };
          }}
        >
          {children}
        </Box>
      </Box>
      <Pointer
        direction="Right"
        style={{
          margin: `${lineWidth}px 0`,
          transform: `translate(-${lineWidth}px, 0px)`,
          cursor: "col-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="BottomLeft"
        style={{
          transform: `translate(${lineWidth}px, -${lineWidth}px)`,
          cursor: "ne-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="Bottom"
        style={{
          margin: `0 ${lineWidth}px`,
          transform: `translate(0px, -${lineWidth}px)`,
          cursor: "row-resize",
        }}
        {...opts}
      />
      <Pointer
        direction="BottomRight"
        style={{
          transform: `translate(-${lineWidth}px, -${lineWidth}px)`,
          cursor: "nw-resize",
        }}
        {...opts}
      />
    </Box>
  );
}
