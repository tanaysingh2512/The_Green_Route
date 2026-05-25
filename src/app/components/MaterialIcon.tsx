interface MaterialIconProps {
  icon: string;
  className?: string;
  size?: number;
  filled?: boolean;
}

export function MaterialIcon({ icon, className = '', size = 20, filled = false }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
      }}
    >
      {icon}
    </span>
  );
}
