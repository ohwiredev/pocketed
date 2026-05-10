export default function TagPill({ tag }: { tag: string }) {
  return (
    <div className="tag-pill">
      <span>{tag}</span>
    </div>
  );
}
