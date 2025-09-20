import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

const CurrentStatusPanel = ({ report, onBiomarkerSelect, selectedBiomarker }) => {
  if (!report || !report.standardizedResults) {
    return null
  }

  const getStatusColor = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "Borderline":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getStatusIcon = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      case "Borderline":
        return <TrendingUp className="h-4 w-4" />
      case "Low":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getBiomarkerStatus = (biomarker) => {
    const analysis = report.analysis?.find((a) =>
      a.interpretation.toLowerCase().includes(biomarker.biomarker.toLowerCase()),
    )
    return analysis ? analysis.severity : "Normal"
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Latest Health Status</h2>
          <p className="text-muted-foreground">Report from {new Date(report.reportDate).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{report.standardizedResults.length} biomarkers analyzed</p>
          <p className="text-sm text-muted-foreground">{report.analysis?.length || 0} insights generated</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.standardizedResults.map((biomarker, index) => {
          const status = getBiomarkerStatus(biomarker)
          const isSelected = selectedBiomarker === biomarker.biomarker

          return (
            <div
              key={index}
              onClick={() => onBiomarkerSelect(biomarker.biomarker)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground text-sm">{biomarker.biomarker}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                >
                  {getStatusIcon(status)}
                  {status}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  {biomarker.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{biomarker.unit}</span>
                </p>
                <p className="text-xs text-muted-foreground">Normal: {biomarker.referenceRange}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CurrentStatusPanel
