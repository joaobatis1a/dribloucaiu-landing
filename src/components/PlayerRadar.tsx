import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export default function PlayerRadar({ data }: { data: Array<{ stat: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="68%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="stat" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
        <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
