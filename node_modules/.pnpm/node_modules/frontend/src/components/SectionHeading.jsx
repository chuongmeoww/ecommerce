export default function SectionHeading({ title, action }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      {action}
    </div>
  );
}
