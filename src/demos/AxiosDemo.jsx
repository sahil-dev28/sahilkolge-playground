import { useState } from "react";

const AX_STEPS = [
  "request interceptor adds withCredentials",
  "API call to /api/orders",
  "response interceptor normalizes the result",
  "UI gets one clean shape",
];

const AX_OUTPUT = {
  200: "{ ok: true, data: { orders: [...] } }",
  401: "{ ok: false, code: 'UNAUTHORIZED',\n  message: 'Session expired. Please log in again.' }",
  500: "{ ok: false, code: 'SERVER_ERROR',\n  message: 'Something broke on our side. Try again.' }",
};

export default function AxiosDemo({ onPlay }) {
  const [status, setStatus] = useState(null);

  return (
    <div className="card dark">
      <span className="card-title">Send a request through the interceptors</span>
      <div className="row-wrap">
        {[200, 401, 500].map((code) => (
          <button
            key={code}
            type="button"
            className="ax-btn mono chip"
            aria-pressed={status === code}
            onClick={() => {
              setStatus(code);
              onPlay();
            }}
          >
            server says {code}
          </button>
        ))}
      </div>
      <div className="ax-steps">
        {AX_STEPS.map((label, i) => {
          const lit = status !== null;
          const failed = lit && status !== 200 && i === 1;
          return (
            <div key={label} className={`ax-step ${failed ? "fail" : lit ? "lit" : ""}`}>
              <span className="mono">0{i + 1}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <pre className="code">{status === null ? "// pick a server response above" : AX_OUTPUT[status]}</pre>
    </div>
  );
}
