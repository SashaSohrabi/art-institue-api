import type { FormEvent } from "react";

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
    <form className="join w-full" onSubmit={handleSubmit}>
      <input
        className="input input-bordered join-item w-full"
        placeholder="Search artworks (e.g., Monet, Water Lilies)…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search artworks"
      />
      <button
        type="submit"
        className="btn join-item btn-primary"
        disabled={submitting}
      >
        Search
      </button>
      <button
        type="button"
        className="btn join-item"
        onClick={onClear}
        disabled={!value}
      >
        Clear
      </button>
    </form>
  );
}
