export default function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute right-0 top-0 h-full w-1/2 opacity-30 ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="200,0 400,200 200,200" fill="#2D7DD2" opacity="0.6" />
      <polygon points="300,0 400,0 400,100" fill="#4DACF7" opacity="0.8" />
      <polygon points="250,50 350,150 250,150" fill="#2D7DD2" opacity="0.4" />
      <polygon points="320,80 400,160 320,160" fill="#4DACF7" opacity="0.5" />
      <polygon points="200,100 280,180 200,180" fill="#2D7DD2" opacity="0.3" />
      <polygon points="350,200 400,250 350,250" fill="#4DACF7" opacity="0.6" />
      <polygon points="280,20 310,50 280,50" fill="#FFFFFF" opacity="0.3" />
      <polygon points="360,120 380,140 360,140" fill="#FFFFFF" opacity="0.2" />
      <polygon points="220,160 250,190 220,190" fill="#4DACF7" opacity="0.4" />
      <polygon points="300,220 340,260 300,260" fill="#2D7DD2" opacity="0.5" />
      <polygon points="340,280 400,340 340,340" fill="#4DACF7" opacity="0.3" />
      <polygon points="250,300 300,350 250,350" fill="#2D7DD2" opacity="0.2" />
    </svg>
  );
}
