import { useState, useEffect } from 'react';

export function StockInput({
  stock,
  isZero,
  onCommit,
}: {
  stock: number;
  isZero: boolean;
  onCommit: (val: number) => void;
}) {
  const [inputVal, setInputVal] = useState(String(stock));

  useEffect(() => {
    setInputVal(String(stock));
  }, [stock]);

  const commit = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onCommit(parsed);
    } else {
      setInputVal(String(stock));
    }
  };

  return (
    <input
      type="number"
      min={0}
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      className={`text-sm font-bold w-8 text-center bg-transparent border-none outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] cursor-pointer focus:cursor-text ${isZero ? 'text-red-500' : 'text-stone-700'}`}
    />
  );
}
