"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const series = [
  { t: "10:00", speed: 45, latency: 18, downtime: 0 },
  { t: "11:00", speed: 52, latency: 15, downtime: 0 },
  { t: "12:00", speed: 48, latency: 22, downtime: 1 },
  { t: "13:00", speed: 55, latency: 13, downtime: 0 },
  { t: "14:00", speed: 51, latency: 17, downtime: 0 },
]

export default function Page() {
 const navigate = useNavigate()
  const [showGraph, setShowGraph] = useState(true)

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <CardTitle className="text-brand-green flex items-center gap-2">
                  Performance Graph
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex-1" />
            <div className="flex items-center gap-4 justify-end w-full">
              <Button variant="outline" onClick={() => setShowGraph((s) => !s)}>
                {showGraph ? "Hide Graph" : "Show Graph"}
              </Button>
            </div>
          </div>
          {showGraph && (
            <div>
              <ChartContainer
                className="h-[360px] w-full"
                config={{
                  speed: { label: "Speed (Mbps)", color: "hsl(var(--chart-1))" },
                  latency: { label: "Latency (ms)", color: "hsl(var(--chart-2))" },
                  downtime: { label: "Downtime (min)", color: "hsl(var(--chart-5))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="t" label={{ value: "Time of Day", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Metric Value (varies)", angle: -90, position: "insideLeft" }} />
                    <Legend verticalAlign="top" height={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="speed" stroke="var(--color-speed)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="latency" stroke="var(--color-latency)" strokeWidth={2} dot={false} />
                    <Line
                      type="monotone"
                      dataKey="downtime"
                      stroke="var(--color-downtime)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
