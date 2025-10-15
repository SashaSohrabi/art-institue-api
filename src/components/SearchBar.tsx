import type { FormEvent } from "react";
import ElectricBorder from "@/components/ElectricBorder";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export default function SearchBar({ value, onChange, onClear, onSubmit, submitting }: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <ElectricBorder color="#605dff" speed={0.2} chaos={0.3} thickness={2} className="rounded-xl">
      <form className="join w-full rounded-xl bg-base-100/70 backdrop-blur" onSubmit={handleSubmit}>
        <input
          className="input join-item w-full border-none bg-transparent focus:outline-none"
          placeholder="Search artworks (e.g., Monet, Water Lilies)…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search artworks"
        />
        <button
          type="submit"
          className="btn join-item btn-primary border-none"
          disabled={submitting}
        >
          Search
        </button>
        <button
          type="button"
          className="btn join-item border-none rounded-none rounded-tr-xl rounded-br-xl"
          onClick={onClear}
          disabled={!value}
        >
          Clear
        </button>
      </form>
    </ElectricBorder>
  );
}
