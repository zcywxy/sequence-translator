import { isMobile } from "../../libs/mobile";
import { limitNumber } from "../../libs/utils";

export default function TranBtn({
  onTrigger,
  btnEvent,
  position,
  btnOffsetX,
  btnOffsetY,
}) {
  const left = limitNumber(position.x + btnOffsetX, 0, window.innerWidth - 32);
  const top = limitNumber(position.y + btnOffsetY, 0, window.innerHeight - 32);

  return (
    <div
      className="KT-tranbtn"
      style={{
        cursor: "pointer",
        position: "fixed",
        left,
        top,
        zIndex: 2147483647,
      }}
      {...{ [btnEvent]: onTrigger }}
    >
      <style>
        {`
          @keyframes kt-btn-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(32, 156, 238, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 8px rgba(32, 156, 238, 0);
            }
          }
          @keyframes kt-btn-glow {
            0%, 100% {
              text-shadow: 0 0 2px rgba(0, 212, 255, 0.6), 0 0 4px rgba(32, 156, 238, 0.4);
            }
            50% {
              text-shadow: 0 0 4px rgba(0, 212, 255, 0.9), 0 0 8px rgba(32, 156, 238, 0.6);
            }
          }
          @keyframes kt-btn-rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .KT-tranbtn-wrapper {
            position: relative;
            width: ${isMobile ? "36px" : "28px"};
            height: ${isMobile ? "36px" : "28px"};
            border-radius: 50%;
            background: linear-gradient(135deg, #209CEE 0%, #00d4ff 50%, #209CEE 100%);
            background-size: 200% 200%;
            animation: kt-btn-pulse 2s ease-in-out infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .KT-tranbtn-wrapper::before {
            content: '';
            position: absolute;
            inset: 2px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            z-index: 1;
          }
          .KT-tranbtn-wrapper::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid transparent;
            background: linear-gradient(135deg, #00d4ff, #209CEE, #00d4ff) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: kt-btn-rotate 3s linear infinite;
          }
          .KT-tranbtn-text {
            position: relative;
            z-index: 2;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${isMobile ? "14px" : "11px"};
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #00d4ff;
            animation: kt-btn-glow 2s ease-in-out infinite;
            user-select: none;
            -webkit-user-select: none;
          }
          .KT-tranbtn-wrapper:hover {
            animation: none;
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(32, 156, 238, 0.6), 0 0 40px rgba(0, 212, 255, 0.3);
          }
          .KT-tranbtn-wrapper:hover .KT-tranbtn-text {
            animation: none;
            text-shadow: 0 0 6px rgba(0, 212, 255, 1), 0 0 12px rgba(32, 156, 238, 0.8);
          }
        `}
      </style>
      <div className="KT-tranbtn-wrapper">
        <span className="KT-tranbtn-text">ST</span>
      </div>
    </div>
  );
}
