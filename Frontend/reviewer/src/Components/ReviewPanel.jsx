import "./ReviewPanel.css";

function getScoreClass(score) {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export default function ReviewPanel({ review }) {
  if (!review) return null;

  const {
    complexity_score,
    structure_score,
    readability_score,
    summary,
    issues,
    suggestions,
  } = review;

  return (
    <div className="review-panel">
      <h2>Review Results</h2>

      {/* Score cards */}
      <div className="scores-grid">

        <div className="score-card">
          <p className="score-label">Complexity</p>
          <p className={`score-value ${getScoreClass(complexity_score)}`}>
            {complexity_score}
          </p>
          <p className="score-max">/ 10</p>
          <div className="score-bar">
            <div
              className={`score-bar-fill ${getScoreClass(complexity_score)}`}
              style={{ width: `${complexity_score * 10}%` }}
            />
          </div>
        </div>

        <div className="score-card">
          <p className="score-label">Structure</p>
          <p className={`score-value ${getScoreClass(structure_score)}`}>
            {structure_score}
          </p>
          <p className="score-max">/ 10</p>
          <div className="score-bar">
            <div
              className={`score-bar-fill ${getScoreClass(structure_score)}`}
              style={{ width: `${structure_score * 10}%` }}
            />
          </div>
        </div>

        <div className="score-card">
          <p className="score-label">Readability</p>
          <p className={`score-value ${getScoreClass(readability_score)}`}>
            {readability_score}
          </p>
          <p className="score-max">/ 10</p>
          <div className="score-bar">
            <div
              className={`score-bar-fill ${getScoreClass(readability_score)}`}
              style={{ width: `${readability_score * 10}%` }}
            />
          </div>
        </div>

      </div>

      {/* Summary */}
      {summary && (
        <div className="summary-box">
          {summary}
        </div>
      )}

      {/* Issues */}
      {issues && issues.length > 0 && (
        <div>
          <p className="section-title">
            Issues Found
            <span className="badge badge-red">{issues.length}</span>
          </p>
          <ul className="issues-list">
            {issues.map((issue, i) => (
              <li key={i} className="issue-item">
                <span className="dot" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div>
          <p className="section-title">
            Suggestions
            <span className="badge badge-green">{suggestions.length}</span>
          </p>
          <ul className="suggestions-list">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="suggestion-item">
                <span className="dot" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}