import { useEffect, useState } from "react"
import { API } from "../services/api";
import CopyButton from "../components/CopyButton";
import "./History.css"

export default function History(){
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get("/history")
      .then(res => {
        setData(res.data || [])
        setFilteredData(res.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching history:", err)
        setLoading(false)
      })
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = data

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(item => 
        item.type?.toLowerCase() === filterType.toLowerCase()
      )
    }

    // Search by input text
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.input_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.output_text?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by most recent first
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB - dateA
    })

    setFilteredData(filtered)
  }, [data, filterType, searchTerm])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      API.delete(`/history/${id}`)
        .then(() => {
          setData(data.filter(item => item.id !== id))
        })
        .catch(err => console.error("Error deleting history:", err))
    }
  }

  const getTypeIcon = (type) => {
    const typeMap = {
      "code": "💻",
      "email": "✉️",
      "code-assistant": "💻",
      "email-assistant": "✉️"
    }
    return typeMap[type?.toLowerCase()] || "✨"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="history-container">
      {/* Header Section */}
      <div className="history-header">
        <div>
          <h1>📚 AI History</h1>
          <p>View and manage your previous AI interactions</p>
        </div>
        <div className="history-stats">
          <div className="stat-card">
            <span className="stat-number">{data.length}</span>
            <span className="stat-label">Total Interactions</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="history-controls">
        <div className="search-box">
          <input
            type="text"
            className="input search-input"
            placeholder="🔍 Search in history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select 
            className="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="code">Code Assistant</option>
            <option value="email">Email Assistant</option>
          </select>
        </div>

        <div className="results-info">
          {filteredData.length > 0 ? (
            <span>{filteredData.length} result{filteredData.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>No results found</span>
          )}
        </div>
      </div>

      {/* History List */}
      <div className="history-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your history...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <h3>No history found</h3>
            <p>Your AI interactions will appear here</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="history-card">
              {/* Card Header */}
              <div className="history-card-header">
                <div className="card-title">
                  <span className="type-icon">{getTypeIcon(item.type)}</span>
                  <div>
                    <h3>{item.type || "AI Interaction"}</h3>
                    <span className="card-date">{formatDate(item.created_at)}</span>
                  </div>
                </div>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(item.id)}
                  title="Delete this item"
                >
                  🗑️
                </button>
              </div>

              {/* Card Content */}
              <div className="history-card-content">
                {/* Input Section */}
                <div className="content-section">
                  <h4 className="section-title">Input</h4>
                  <div className="content-box input-box">
                    <p>{item.input_text || "No input provided"}</p>
                  </div>
                </div>

                {/* Output Section */}
                <div className="content-section">
                  <div className="output-header">
                    <h4 className="section-title">Output</h4>
                    <CopyButton text={item.output_text} />
                  </div>
                  <div className="content-box output-box">
                    <pre>{item.output_text || "No output generated"}</pre>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="history-card-footer">
                <span className="item-id">ID: {item.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}