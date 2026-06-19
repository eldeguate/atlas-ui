interface UserBubbleProps {
  content: string;
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-[var(--radius-card)] rounded-br-sm bg-navy px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
        {content}
      </div>
    </div>
  );
}