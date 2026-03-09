import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Choose an AI assistant to get started</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/code-assistant" className="dashboard-card">
          <div className="dashboard-card-icon code">💻</div>
          <h3>Code Assistant</h3>
          <p>Debug and improve your code with AI. Supports JavaScript, PHP & Python.</p>
        </Link>
        <Link to="/email-assistant" className="dashboard-card">
          <div className="dashboard-card-icon email">✉️</div>
          <h3>Email Copilot</h3>
          <p>Generate professional emails in seconds. Choose tone and get AI-powered drafts.</p>
        </Link>
        <Link to="/history" className="dashboard-card">
          <div className="dashboard-card-icon email">✉️</div>
          <h3>History</h3>
          <p>Generate professional emails in seconds. Choose tone and get AI-powered drafts.</p>
        </Link>
      </div>
    </>
  );
}
