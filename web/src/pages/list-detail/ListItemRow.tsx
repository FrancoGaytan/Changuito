import { useState, useEffect } from 'react';
import {
  Check,
  Minus,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { listDetailLocale } from '@/locale/listDetailLocale';

const l = listDetailLocale;

interface ListItemRowProps {
  item: {
    product: { id: string; name: string; category: string; unit?: string };
    quantity: number;
    checked: boolean;
    failed?: boolean;
  };
  onCheck: () => void;
  onChangeQuantity: (q: number) => void;
  onRemove: () => void;
  onFail?: () => void;
}

export function ListItemRow({ item, onCheck, onChangeQuantity, onRemove, onFail }: ListItemRowProps) {
  const [inputVal, setInputVal] = useState(String(item.quantity));

  useEffect(() => {
    setInputVal(String(item.quantity));
  }, [item.quantity]);

  const commitValue = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChangeQuantity(parsed);
    } else {
      setInputVal(String(item.quantity));
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm transition-all">
      <button
        onClick={item.failed ? undefined : onCheck}
        disabled={item.failed}
        className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          item.checked
            ? 'bg-[#1b5e20] border-[#1b5e20] text-white'
            : item.failed
              ? 'border-stone-200 text-stone-300 cursor-not-allowed opacity-70'
              : 'border-stone-300 text-transparent hover:border-stone-400'
        }`}
      >
        <Check className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            item.checked
              ? 'text-stone-400 line-through'
              : item.failed
                ? 'text-red-600 line-through'
                : 'text-stone-800'
          }`}
        >
          {item.product.name}
        </p>
        {item.failed && (
          <span className="inline-block mt-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {l.item.notAvailable}
          </span>
        )}
        <p className="text-[11px] text-stone-400">
          {item.product.category} · {item.product.unit}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#f4f5f5] rounded-lg p-0.5">
          <button
            onClick={() => onChangeQuantity(item.quantity - 1)}
            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={0}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitValue}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
            className="w-8 text-center text-xs font-bold text-stone-700 bg-transparent border-none outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] cursor-pointer focus:cursor-text"
          />
          <button
            onClick={() => onChangeQuantity(item.quantity + 1)}
            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onFail}
          title={item.failed ? 'Marcar como disponible' : 'Marcar como fracaso / no disponible'}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${item.failed ? 'bg-red-50 text-red-500' : 'text-amber-600 hover:bg-amber-50'}`}
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
