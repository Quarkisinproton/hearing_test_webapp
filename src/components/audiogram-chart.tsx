"use client"

import { AudiogramDataPoint } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Tooltip } from "recharts";

type AudiogramChartProps = {
  data: AudiogramDataPoint[];
};

const chartConfig = {
  decibel: {
    label: "Hearing Threshold (dB HL)",
    color: "hsl(var(--primary))",
  },
};

export default function AudiogramChart({ data }: AudiogramChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audiogram Results</CardTitle>
        <CardDescription>Your hearing thresholds at different frequencies. Lower values are better.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full pr-4">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="frequency"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[125, 250, 500, 1000, 2000, 4000, 8000]}
              domain={['dataMin', 'dataMax']}
            >
                <Label value="Frequency (Hz)" position="bottom" offset={10} />
            </XAxis>
            <YAxis
              dataKey="decibel"
              type="number"
              reversed
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[-10, 120]}
              ticks={[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}
            >
                <Label value="Hearing Level (dB HL)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent 
                indicator="dot"
                formatter={(value, name) => [`${value} dB HL`, 'Threshold']}
                labelFormatter={(label) => `${label} Hz`}
                 />}
            />
            <Line
              dataKey="decibel"
              type="monotone"
              stroke="var(--color-decibel)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-decibel)",
                r: 4,
              }}
              activeDot={{
                r: 8,
                style: { stroke: 'hsl(var(--background))', strokeWidth: 2 }
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
