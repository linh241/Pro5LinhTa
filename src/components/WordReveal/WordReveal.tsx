interface WordRevealProps {
  text: string;
  className?: string;
}

export function WordReveal({ text, className = '' }: WordRevealProps) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return (
    <span className={`word-reveal-group ${className}`}>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="reveal-word" 
          style={{ 
            display: 'inline-block', 
            marginRight: '0.25em',
            opacity: 0.2 // Initial faded state
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
