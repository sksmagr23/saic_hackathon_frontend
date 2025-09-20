import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import toast from "react-hot-toast"
import { X, Upload, FileText, Calendar } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"

const ReportUploadModal = ({ onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false)
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append("healthReport", file)
        formData.append("reportDate", reportDate)

        await axios.post("/api/reports/upload", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        onSuccess()
      } catch (error) {
        console.error("Upload failed:", error)
        toast.error(error.response?.data?.error || "Failed to upload report")
      } finally {
        setUploading(false)
      }
    },
    [reportDate, onSuccess],
  )

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Upload Health Report</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={uploading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Report Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={uploading}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Health Report File</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div className="space-y-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-muted-foreground">Processing your report...</p>
                </div>
              ) : acceptedFiles.length > 0 ? (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">{acceptedFiles[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Click to change file or drag a new one</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">
                      {isDragActive ? "Drop your file here" : "Drag & drop your health report"}
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Supports PDF, CSV, and JSON files (max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your report will be securely processed</li>
              <li>• Biomarkers will be extracted and analyzed</li>
              <li>• You'll receive personalized insights and recommendations</li>
              <li>• Data will be added to your health trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportUploadModal
