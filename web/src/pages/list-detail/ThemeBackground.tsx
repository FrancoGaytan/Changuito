interface Props {
  theme?: string;
}

export function ThemeBackground({ theme }: Props) {
  const backgrounds: Record<string, string> = {
    asado: 'https://cdn-icons-png.flaticon.com/512/3238/3238714.png',
    verduleria: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png',
    carniceria: 'https://cdn-icons-png.flaticon.com/512/3143/3143644.png',
    default: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
  };

  const url = backgrounds[theme ?? 'default'] ?? backgrounds.default;

  return (
    <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
      <div
        className="w-64 h-64 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url('${url}')` }}
      />
    </div>
  );
}
