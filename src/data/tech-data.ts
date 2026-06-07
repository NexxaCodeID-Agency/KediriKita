import type { ChartConfig } from "@/components/ui/chart"

export const ekonomiData = [
  { tahun: "2019", umkm: 5070, qris: 0 },
  { tahun: "2020", umkm: 5070, qris: 15000 },
  { tahun: "2021", umkm: 5808, qris: 45000 },
  { tahun: "2022", umkm: 7077, qris: 86318 },
  { tahun: "2023", umkm: 9553, qris: 401103 },
  { tahun: "2024", umkm: 10035, qris: 425000 },
  { tahun: "2025", umkm: 10322, qris: 450833 },
]

export const smartCityData = [
  { tahun: "2019", indeks: 2.10 },
  { tahun: "2020", indeks: 2.45 },
  { tahun: "2021", indeks: 2.80 },
  { tahun: "2022", indeks: 3.12 },
  { tahun: "2023", indeks: 3.38 }, 
  { tahun: "2024", indeks: 3.45 },
  { tahun: "2025", indeks: 3.60 },
]

export const bandaraData = [
  { tahun: "2019", penumpang: 0 },
  { tahun: "2020", penumpang: 0 },
  { tahun: "2021", penumpang: 0 },
  { tahun: "2022", penumpang: 0 },
  { tahun: "2023", penumpang: 0 },
  { tahun: "2024", penumpang: 10000 },  
  { tahun: "2025", penumpang: 6789 }, 
  { tahun: "2026", penumpang: 3375 }, 
]

export const chartConfig = {
  umkm: { label: "Usaha Mikro (Kota)", color: "#f0c040" },
  qris: { label: "Merchant QRIS", color: "#06b6d4" },
  indeks: { label: "Indeks Smart City", color: "#a855f7" },
  penumpang: { label: "Penumpang Bandara", color: "#22c55e" },
} satisfies ChartConfig