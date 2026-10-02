import { useState } from "react";

const HN_TAGS = ["story", "comment", "show_hn", "ask_hn"];

export default function HnDemo({ onPlay }) {
  const [query, setQuery] = useState("react");
  const [tag, setTag] = useState("story");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(0);

  const endpoint = sort === "date" ? "search_by_date" : "search";
  const url = `hn.algolia.com/api/v1/${endpoint}?query=${encodeURIComponent(query)}&tags=${tag}&hitsPerPage=20&page=${page}`;
  const queryKey = `['stories', { query: '${query}', tag: '${tag}', sort: '${sort}', page: ${page} }]`;

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Build the query yourself</span>
        <span className="card-note mono">page resets on filter change</span>
      </div>

      <label htmlFor="hnq" className="field-label">
        search term
      </label>
      <input
        id="hnq"
        className="text-input"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
          onPlay();
        }}
      />

      <div className="row-wrap">
        {HN_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className="opt round mono accent chip"
            aria-pressed={tag === t}
            onClick={() => {
              setTag(t);
              setPage(0);
              onPlay();
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="row-wrap">
        <button
          type="button"
          className="opt round btn-ink chip"
          onClick={() => {
            setSort(sort === "relevance" ? "date" : "relevance");
            setPage(0);
            onPlay();
          }}
        >
          sort: {sort}
        </button>
        <button
          type="button"
          className="opt round chip"
          onClick={() => {
            setPage(page + 1);
            onPlay();
          }}
        >
          next page → {page}
        </button>
      </div>

      <div className="code" style={{ fontSize: 12.5 }}>
        <span style={{ color: "#8F8FA0" }}>GET </span>
        {url}
      </div>
      <div className="query-key mono">queryKey: {queryKey}</div>
    </div>
  );
}
