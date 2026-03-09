import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="app-logo">
          <span>AI Assist</span>
        </div>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span>📊</span> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/code-assistant"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span>💻</span> Code Assistant
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/email-assistant"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span>✉️</span> Email Copilot
              </NavLink>
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: "100%" }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
