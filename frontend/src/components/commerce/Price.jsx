export default function Price({ price, sale }) {
  const hasSale = sale && sale > 0 && sale < price;
  return (
    <div className="flex items-baseline gap-2">
      <div className={`font-semibold ${hasSale ? 'text-red-600' : ''}`}>
        {(hasSale ? sale : price).toLocaleString()}₫
      </div>
      {hasSale && <div className="text-sm line-through text-slate-500">{price.toLocaleString()}₫</div>}
    </div>
  );
}