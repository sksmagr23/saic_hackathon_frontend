import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

const BiomarkerTrendChart = ({ data, biomarker }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No trend data available for {biomarker}</p>
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map((point) => ({
    ...point,
    date: format(new Date(point.date), "MMM dd"),
    fullDate: new Date(point.date).toLocaleDateString(),
  }))

  // Extract reference range if available
  const referenceRange = data[0]?.referenceRange
  let normalRange = null

  if (referenceRange && referenceRange !== "Not specified") {
    // Parse reference range (e.g., "100-199", "<100", ">200")
    const rangeMatch = referenceRange.match(/(\d+)-(\d+)/)
    const lessThanMatch = referenceRange.match(/<\s*(\d+)/)
    const greaterThanMatch = referenceRange.match(/>\s*(\d+)/)

    if (rangeMatch) {
      normalRange = {
        lower: Number.parseFloat(rangeMatch[1]),
        upper: Number.parseFloat(rangeMatch[2]),
      }
    } else if (lessThanMatch) {
      normalRange = {
        lower: 0,
        upper: Number.parseFloat(lessThanMatch[1]),
      }
    } else if (greaterThanMatch) {
      const maxValue = Math.max(...data.map((d) => d.value))
      normalRange = {
        lower: Number.parseFloat(greaterThanMatch[1]),
        upper: maxValue * 1.2,
      }
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.fullDate}</p>
          <p className="text-primary">
            {biomarker}: {payload[0].value} {data.unit}
          </p>
          {referenceRange && (
            <p className="text-sm text-muted-foreground">
              Normal: {referenceRange} {data.unit}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Normal range reference area */}
          {normalRange && (
            <ReferenceArea
              y1={normalRange.lower}
              y2={normalRange.upper}
              stroke="none"
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
              label="Normal Range"
            />
          )}

          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            name={`${biomarker} (${data[0]?.unit || ""})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BiomarkerTrendChart
