export default function Card({ children, className = '', style = {}, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 ${hover ? 'transition-transform duration-200 hover:-translate-y-0.5' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
