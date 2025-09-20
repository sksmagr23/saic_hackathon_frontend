import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"
import { Upload, TrendingUp, AlertTriangle, CheckCircle, FileText, Plus } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ReportUploadModal from "../components/ReportUploadModal"
import BiomarkerTrendChart from "../components/BiomarkerTrendChart"
import CurrentStatusPanel from "../components/CurrentStatusPanel"
import RecommendationsList from "../components/RecommendationsList"

const DashboardPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [latestReport, setLatestReport] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedBiomarker, setSelectedBiomarker] = useState("Total Cholesterol")
  const [trendData, setTrendData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (selectedBiomarker) {
      fetchTrendData(selectedBiomarker)
    }
  }, [selectedBiomarker])

  const fetchDashboardData = async () => {
    try {
      const [reportsResponse, profileResponse] = await Promise.all([
        axios.get("/api/reports", { withCredentials: true }),
        axios.get("/api/users/profile", { withCredentials: true }),
      ])

      setReports(reportsResponse.data)
      if (reportsResponse.data.length > 0) {
        const latest = reportsResponse.data[0]
        const detailResponse = await axios.get(`/api/reports/${latest._id}`, {
          withCredentials: true,
        })
        setLatestReport(detailResponse.data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendData = async (biomarker) => {
    try {
      const response = await axios.get(`/api/reports/trends/${biomarker}`, {
        withCredentials: true,
        params: { months: 12 },
      })
      setTrendData(response.data)
    } catch (error) {
      console.error("Failed to fetch trend data:", error)
      setTrendData([])
    }
  }

  const handleUploadSuccess = () => {
    setShowUploadModal(false)
    fetchDashboardData()
    toast.success("Health report uploaded and analyzed successfully!")
  }

  const getStatusColor = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return "text-red-600 bg-red-50"
      case "Borderline":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  const getStatusIcon = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      case "Borderline":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground mt-1">Here's your health overview and latest insights</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload Report
        </button>
      </div>

      {reports.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Health Reports Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upload your first health report to start tracking your biomarkers and get personalized insights.
          </p>
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
            Upload Your First Report
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status Panel */}
            {latestReport && (
              <CurrentStatusPanel
                report={latestReport}
                onBiomarkerSelect={setSelectedBiomarker}
                selectedBiomarker={selectedBiomarker}
              />
            )}

            {/* Trend Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Biomarker Trends</h2>
                <select
                  value={selectedBiomarker}
                  onChange={(e) => setSelectedBiomarker(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  {latestReport?.standardizedResults.map((result) => (
                    <option key={result.biomarker} value={result.biomarker}>
                      {result.biomarker}
                    </option>
                  ))}
                </select>
              </div>
              <BiomarkerTrendChart data={trendData} biomarker={selectedBiomarker} />
            </div>

            {/* Recent Reports */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Reports</h2>
              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{report.sourceFileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.reportDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{report.analysis?.length || 0} insights</span>
                      <div className="flex gap-1">
                        {report.analysis?.slice(0, 3).map((analysis, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.severity)}`}
                          >
                            {getStatusIcon(analysis.severity)}
                            {analysis.severity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            {latestReport && <RecommendationsList analysis={latestReport.analysis} />}

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Reports</span>
                  <span className="font-semibold text-foreground">{reports.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Latest Report</span>
                  <span className="font-semibold text-foreground">
                    {latestReport ? new Date(latestReport.reportDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Insights</span>
                  <span className="font-semibold text-foreground">{latestReport?.analysis?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <ReportUploadModal onClose={() => setShowUploadModal(false)} onSuccess={handleUploadSuccess} />
      )}
    </div>
  )
}

export default DashboardPage
