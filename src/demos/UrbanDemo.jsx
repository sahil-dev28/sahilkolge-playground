import { useState } from "react";

const UE_GROUPS = [
  { key: "price", label: "max price", opts: ["any", "50L", "1Cr", "2Cr"] },
  { key: "city", label: "city", opts: ["any", "Mumbai", "Pune", "Bengaluru"] },
  { key: "sort", label: "sort by", opts: ["newest", "price_asc", "price_desc"] },
];

export default function UrbanDemo({ onPlay }) {
  const [filters, setFilters] = useState({ price: "any", city: "any", sort: "newest" });
  const [history, setHistory] = useState(1);

  const qs = [];
  if (filters.price !== "any") qs.push(`maxPrice=${filters.price}`);
  if (filters.city !== "any") qs.push(`city=${filters.city.toLowerCase()}`);
  qs.push(`sort=${filters.sort}`);

  return (
    <div className="card browser">
      <div className="browser-bar">
        <span className="mono">history {history}</span>
        <div className="address mono">
          urban-estate.app/properties<span>?{qs.join("&")}</span>
        </div>
      </div>
      <div className="browser-body">
        <span className="card-title">Change a filter, watch the URL</span>
        {UE_GROUPS.map((g) => (
          <div key={g.key} className="filter-group">
            <span>{g.label}</span>
            <div className="row-wrap">
              {g.opts.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="opt square ink chip"
                  aria-pressed={filters[g.key] === v}
                  onClick={() => {
                    setFilters({ ...filters, [g.key]: v });
                    setHistory((h) => h + 1);
                    onPlay();
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
