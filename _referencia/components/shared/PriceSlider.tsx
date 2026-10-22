import { useState, useRef, useEffect, useCallback } from "react";

interface PriceSliderProps {
  min: number;
  max: number;
  valorMin: number;
  valorMax: number;
  onChangeMin: (valor: number) => void;
  onChangeMax: (valor: number) => void;
}

export function PriceSlider({
  min,
  max,
  valorMin,
  valorMax,
  onChangeMin,
  onChangeMax,
}: PriceSliderProps) {
  const [localMin, setLocalMin] = useState(valorMin);
  const [localMax, setLocalMax] = useState(valorMax);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMin(valorMin);
    setLocalMax(valorMax);
  }, [valorMin, valorMax]);

  const clamp = useCallback((v: number) => Math.max(min, Math.min(max, v)), [min, max]);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value));
    if (v <= localMax - 1) {
      setLocalMin(v);
      onChangeMin(v);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value));
    if (v >= localMin + 1) {
      setLocalMax(v);
      onChangeMax(v);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 font-body">
        Rango de precio
      </p>

      <div className="relative h-2 mt-2" ref={trackRef}>
        <div className="absolute inset-0 rounded-full bg-border-soft" />
        <div
          className="absolute top-0 bottom-0 rounded-full bg-warm-accent/30"
          style={{ left: `${pct(localMin)}%`, right: `${100 - pct(localMax)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={localMin}
          onChange={handleMinChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warm-accent [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warm-accent [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warm-accent [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warm-accent [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        />
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-text-muted font-body">
        <span>${localMin}</span>
        <span>${localMax}</span>
      </div>
    </div>
  );
}
