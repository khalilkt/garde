export interface PositionInterface {
  x: string;
  y: string;
  z: string;
  orientation: "N" | "S" | "E" | "W";
}

export function PositionInput({
  value,
  className,
  onChange,
}: {
  value: PositionInterface;
  onChange: (value: PositionInterface) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-row rounded-md border border-primaryBorder py-2 text-sm text-black md:text-base ${className}`}
    >
      <input
        value={value.x}
        onChange={(e) => onChange({ ...value, x: e.target.value })}
        type="number"
        className="w-12 border-0 pl-2 text-center active:outline-0 "
        placeholder="00°"
      />
      <input
        onChange={(e) => onChange({ ...value, y: e.target.value })}
        value={value.y}
        type="number"
        className="w-12 border-0 pl-2 text-center active:outline-0"
        placeholder="00´"
      />
      <input
        value={value.z}
        onChange={(e) => onChange({ ...value, z: e.target.value })}
        type="number"
        className="w-12 border-0 pl-2 text-center active:outline-0"
        placeholder="00´´"
      />
      <select className="w-12 border-0 ">
        <option value="N">N</option>
        <option value="S">S</option>
        <option value="E">E</option>
        <option value="W">W</option>
      </select>
    </div>
  );
}
