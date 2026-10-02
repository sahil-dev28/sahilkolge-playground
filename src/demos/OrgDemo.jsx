import { useState } from "react";

const ORG_ACTIONS = [
  { label: "Make Riya report to Arjun", ok: false, code: "409 EMPLOYEE_CHAIN", msg: "Blocked. An employee cannot report to another employee." },
  { label: "Add a 2nd HR Manager to Engineering", ok: false, code: "409 DEPT_HAS_HR", msg: "Blocked. Each department gets exactly one HR manager." },
  { label: "Make Meera report to Riya", ok: false, code: "409 CIRCULAR_CHAIN", msg: "Blocked. That would create a circular reporting chain." },
  { label: "Move Arjun under Kabir", ok: true, code: "200 OK", msg: "Allowed. Arjun now reports to Kabir. Chart updated." },
];

export default function OrgDemo({ onPlay }) {
  const [result, setResult] = useState(null);

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Try to break the org chart</span>
        <span className="card-note mono">demo data</span>
      </div>

      <div className="org-tree">
        <span className="org-node strong">Meera · Admin</span>
        <span className="org-line" />
        <span className="org-node hr">Kabir · HR Manager, Engineering</span>
        <span className="org-line" />
        <div className="org-row">
          <span className="org-node">Riya · Employee</span>
          <span className="org-node">Arjun · Employee</span>
        </div>
      </div>

      <div className="org-actions">
        {ORG_ACTIONS.map((a) => (
          <button
            key={a.label}
            type="button"
            className="chip btn-reset"
            onClick={() => {
              setResult(a);
              onPlay();
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {result ? (
        <div key={result.code} className={`status ${result.ok ? "ok" : "bad"}`} role="status">
          <span className="mono">{result.code}</span>
          <span>{result.msg}</span>
        </div>
      ) : (
        <div className="status idle">
          <span className="mono">waiting</span>
          <span>Pick an action above. The server rules decide.</span>
        </div>
      )}
    </div>
  );
}
