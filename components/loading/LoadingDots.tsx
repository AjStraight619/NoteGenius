import "./loadingDots.css";

type LoadingDotsProps = {
  className?: string;
};

function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={`loading-dots ${className}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
}

export default LoadingDots;

// className="left-2 bottom-6 absolute"
