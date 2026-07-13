interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  min?: number;
  max?: number;
}

export function Slider({
  label,
  value,
  onChange,
  hint,
  min = 0,
  max = 100,
}: Props) {
  return (
    <div className="slider-group">
      <label>
        <span>{label}</span>
        <span className="mono">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint ? <div className="slider-hint">{hint}</div> : null}
    </div>
  );
}
