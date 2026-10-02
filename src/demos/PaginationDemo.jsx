import { useState } from "react";

export default function PaginationDemo({ onPlay }) {
  const [mode, setMode] = useState("offset");
  const [page, setPage] = useState(1200);

  const perPage = 20;
  const isOffset = mode === "offset";
  const skip = (page - 1) * perPage;
  const scanned = isOffset ? skip + perPage : perPage;
  const maxScan = 5000 * perPage;
  const pct = isOffset ? Math.max(2, Math.round((Math.log10(scanned) / Math.log10(maxScan)) * 100)) : 4;

  const query = isOffset
    ? `db.products\n  .find({})\n  .sort({ _id: 1 })\n  .skip(${skip.toLocaleString("en-US")})\n  .limit(20)`
    : "db.products\n  .find({ _id: { $gt: lastSeenId } })\n  .sort({ _id: 1 })\n  .limit(20)";

  const pick = (m) => {
    setMode(m);
    onPlay();
  };

  return (
    <div className="card dark">
      <div className="card-head">
        <span className="card-title">Why keyset pagination?</span>
        <div className="seg">
          <button type="button" aria-pressed={isOffset} onClick={() => pick("offset")}>
            offset
          </button>
          <button type="button" aria-pressed={!isOffset} onClick={() => pick("keyset")}>
            keyset
          </button>
        </div>
      </div>

      <label htmlFor="pg" className="range-label mono">
        <span>jump to page</span>
        <strong>page {page}</strong>
      </label>
      <input
        id="pg"
        type="range"
        min="1"
        max="5000"
        step="1"
        value={page}
        onChange={(e) => {
          setPage(Number(e.target.value) || 1);
          onPlay();
        }}
      />

      <pre className="code">{query}</pre>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="meter-label mono">
          <span>documents the database walks through</span>
          <span>{scanned.toLocaleString("en-US")}</span>
        </div>
        <div className="meter">
          <div style={{ width: `${pct}%`, background: isOffset ? "#F06A5B" : "#5BD49A" }} />
        </div>
        <span className="panel-note">
          {isOffset
            ? "Offset makes the database skip every row before your page. Deep pages get slower."
            : "Keyset jumps straight to the last seen id. Page 1 and page 5,000 cost the same."}
        </span>
      </div>
    </div>
  );
}
