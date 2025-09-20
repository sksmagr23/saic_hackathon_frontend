import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { FileText, Calendar, Eye, Plus, Search, X } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ReportUploadModal from "../components/ReportUploadModal"

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports", { withCredentials: true })
      setReports(response.data)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
      toast.error("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    setShowUploadModal(false)
    fetchReports()
    toast.success("Report uploaded successfully!")
  }

  const viewReportDetails = async (reportId) => {
    try {
      const response = await axios.get(`/api/reports/${reportId}`, {
        withCredentials: true,
      })
      setSelectedReport(response.data)
    } catch (error) {
      console.error("Failed to fetch report details:", error)
      toast.error("Failed to load report details")
    }
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

  const filteredReports = reports.filter(
    (report) =>
      report.sourceFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(report.reportDate).toLocaleDateString().includes(searchTerm),
  )

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Reports</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your uploaded health reports</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload Report
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {searchTerm ? "No matching reports" : "No reports yet"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? "Try adjusting your search terms" : "Upload your first health report to get started"}
          </p>
          {!searchTerm && (
            <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
              Upload Your First Report
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div key={report._id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{report.sourceFileName}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.reportDate).toLocaleDateString()}
                      </span>
                      <span>Format: {report.sourceFormat}</span>
                      <span>{report.analysis?.length || 0} insights</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status indicators */}
                  <div className="flex gap-1">
                    {report.analysis?.slice(0, 3).map((analysis, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.severity)}`}
                      >
                        {analysis.severity}
                      </span>
                    ))}
                    {report.analysis?.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        +{report.analysis.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => viewReportDetails(report._id)}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">File Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Filename:</span> {selectedReport.sourceFileName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Format:</span> {selectedReport.sourceFormat}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Report Date:</span>{" "}
                      {new Date(selectedReport.reportDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Uploaded:</span>{" "}
                      {new Date(selectedReport.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Analysis Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Biomarkers:</span>{" "}
                      {selectedReport.standardizedResults?.length || 0}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Insights:</span> {selectedReport.analysis?.length || 0}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Notes:</span> {selectedReport.userNotes?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Biomarkers */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Biomarkers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedReport.standardizedResults?.map((biomarker, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground">{biomarker.biomarker}</h4>
                      <p className="text-2xl font-bold text-primary">
                        {biomarker.value} <span className="text-sm font-normal">{biomarker.unit}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Normal: {biomarker.referenceRange}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              {selectedReport.analysis && selectedReport.analysis.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-4">Analysis & Recommendations</h3>
                  <div className="space-y-4">
                    {selectedReport.analysis.map((analysis, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.severity)}`}
                          >
                            {analysis.severity}
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground mb-2">{analysis.interpretation}</h4>
                        <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

export default ReportsPage
