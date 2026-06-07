"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Chart, ChartConfiguration, registerables } from "chart.js"

Chart.register(...registerables)

// Import data sources riil langsung dari file tech-data.ts bosquu
import { ekonomiData, smartCityData, bandaraData } from "@/data/tech-data"

type Category = "ekonomi" | "smart" | "potensi"

interface LegendItem {
  color: string
  label: string
}

interface CategoryData {
  headline: string
  cardTitle: string
  desc: string
  footer: string
  statBadge: string
  legend: LegendItem[]
  config: ChartConfiguration
}

const GRID_COLOR = "rgba(255,255,255,0.03)"
const TICK_STYLE = {
  color: "rgba(255,255,255,0.4)",
  font: { family: "var(--font-dm-sans, 'DM Sans', sans-serif)", size: 11 },
}

const CATS: Record<Category, CategoryData> = {
  ekonomi: {
    headline: "Akselerasi Ekonomi Digital Regional",
    cardTitle: "Akselerasi Ekonomi Digital Regional",
    desc: "Runtun waktu integrasi Katalog UMKM Go Digital bersama akselerasi Merchant QRIS Kota Kediri.",
    footer: "Pertumbuhan merchant QRIS naik tajam di periode 2022–2025",
    statBadge: "+450k",
    legend: [
      { color: "#06b6d4", label: "Merchant QRIS" },
      { color: "#f0c040", label: "Usaha Mikro (Kota)" },
    ],
    config: {
      type: "line",
      data: {
        labels: ekonomiData.map(d => d.tahun),
        datasets: [
          {
            label: "Merchant QRIS",
            data: ekonomiData.map(d => d.qris),
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.04)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#06b6d4",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Usaha Mikro (Kota)",
            data: ekonomiData.map(d => d.umkm),
            borderColor: "#f0c040",
            backgroundColor: "rgba(240, 192, 64, 0.04)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#f0c040",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            fill: true,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false }, tooltip: buildTooltip() },
        scales: {
          x: { grid: { display: false }, ticks: TICK_STYLE },
          y: { 
            display: true, 
            position: "left",
            grid: { color: GRID_COLOR },
            border: { display: false },
            ticks: {
              ...TICK_STYLE,
              callback: function(val: number | string) {
                const value = Number(val)
                return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : val
              }
            }
          },
          y2: { 
            display: true, 
            position: "right",
            grid: { display: false },
            border: { display: false },
            ticks: {
              ...TICK_STYLE,
              callback: function(val: number | string) {
                const value = Number(val)
                return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : val
              }
            }
          },
        },
        animation: { duration: 400, easing: "easeOutCubic" },
      },
    },
  },
  smart: {
    headline: "Transformasi Digital Governance",
    cardTitle: "Transformasi Digital Governance",
    desc: "Pencapaian Indeks Kemajuan Smart City Kota Kediri melalui efisiensi sistem administrasi digital.",
    footer: "Indeks Smart City Kota Kediri kini mencapai kategori Sangat Tinggi (3.60)",
    statBadge: "3.60",
    legend: [{ color: "#a855f7", label: "Indeks Smart City" }],
    config: {
      type: "line",
      data: {
        labels: smartCityData.map(d => d.tahun),
        datasets: [
          {
            label: "Indeks Smart City",
            data: smartCityData.map(d => d.indeks),
            borderColor: "#a855f7",
            backgroundColor: "rgba(168, 85, 247, 0.05)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#a855f7",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            fill: true,
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false }, tooltip: buildTooltip() },
        scales: {
          x: { grid: { display: false }, ticks: TICK_STYLE },
          y: { 
            display: true, 
            min: 1.0, 
            max: 4.0,
            border: { display: false },
            grid: { color: GRID_COLOR }, 
            ticks: TICK_STYLE 
          },
        },
        animation: { duration: 400, easing: "easeOutCubic" },
      },
    },
  },
  potensi: {
headline: "Gerbang Aviasi & Jalur Logistik Udara",
  cardTitle: "Gerbang Aviasi & Jalur Logistik Udara",
  desc: "Analisis Tren Kunjungan Penumpang Pasca-Operasional Awal Bandara Internasional Dhoho (Data Tahunan).",
  footer: "Dinamika volume mobilitas penumpang sejak awal pembukaan rute komersial",
  statBadge: "20k+",
    legend: [{ color: "#22c55e", label: "Penumpang Bandara" }],
    config: {
      type: "bar",
      data: {
        labels: bandaraData.map(d => d.tahun),
        datasets: [
          {
            label: "Penumpang Bandara",
            data: bandaraData.map(d => d.penumpang),
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            borderColor: "#22c55e",
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false,
            hoverBackgroundColor: "rgba(34, 197, 94, 0.25)",
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false }, tooltip: buildTooltip() },
        scales: {
          x: { grid: { display: false }, ticks: TICK_STYLE },
          y: { 
            display: true,
            border: { display: false },
            grid: { color: GRID_COLOR }, 
            ticks: {
              ...TICK_STYLE,
              callback: function(val: number | string) {
                const value = Number(val)
                return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : val
              }
            }
          },
        },
        animation: { duration: 400, easing: "easeOutCubic" },
      },
    } as ChartConfiguration,
  },
}

function buildTooltip() {
  return {
    enabled: true,
    backgroundColor: "rgba(10, 11, 22, 0.95)",
    borderColor: "rgba(212, 160, 23, 0.25)",
    borderWidth: 1,
    padding: 14,
    cornerRadius: 12,
    titleColor: "#F0D080",
    titleFont: { family: "'Cormorant Garamond', serif", size: 14, weight: "bold" as const },
    bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
    bodyColor: "rgba(255, 255, 255, 0.8)",
    multiKeyBackground: "transparent",
    displayColors: true,
    boxWidth: 7,
    boxHeight: 7,
    boxPadding: 6,
    usePointStyle: true,
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: function(context: any) {
        return `Periode Analisis: ${context[0].label}`
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: function(context: any) {
        let label = context.dataset.label || ''
        if (label) label += ': '
        if (context.parsed.y !== null) {
          const val = context.parsed.y
          label += val >= 1000 ? `${(val / 1000).toLocaleString('id-ID')} ` : val
        }
        return `  ${label}`
      }
    }
  }
}

function WaveOrnament() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none transform rotate-180" style={{ zIndex: 11, height: "80px" }}>
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
        <path d="M0 40 Q120 8 240 40 Q360 72 480 40 Q600 8 720 40 Q840 72 960 40 Q1080 8 1200 40 Q1320 72 1440 40 V80 H0 Z" fill="var(--color-emas, #C9A84C)" opacity="0.12" />
        <path d="M0 54 Q120 22 240 54 Q360 86 480 54 Q600 22 720 54 Q840 86 960 54 Q1080 22 1200 54 Q1320 86 1440 54 V80 H0 Z" fill="var(--color-ornamen, rgba(201,168,76,0.25))" opacity="0.3" />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={60 + i * 120} cy={40} r={2.5} fill="var(--color-emas-muda, #F0D080)" opacity="0.4" />
        ))}
      </svg>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 max-w-sm mx-auto mb-7">
      <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
      <div className="w-2 h-2 flex-shrink-0 opacity-60" style={{ background: "#C9A84C", transform: "rotate(45deg)", borderRadius: 1 }} />
      <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
    </div>
  )
}

interface TabButtonProps {
  cat: Category
  active: Category
  onClick: (c: Category) => void
  icon: React.ReactNode
  label: string
}

function TabButton({ cat, active, onClick, icon, label }: TabButtonProps) {
  const isActive = cat === active
  const activeClasses: Record<Category, string> = {
    ekonomi: "bg-gradient-to-br from-[#f0c040] to-[#f59e0b] text-[#0d0d1f] font-bold shadow-lg shadow-[#f0c040]/10",
    smart:   "bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] text-white font-bold shadow-lg shadow-[#a855f7]/10",
    potensi: "bg-gradient-to-br from-[#22c55e] to-[#10b981] text-white font-bold shadow-lg shadow-[#22c55e]/10",
  }
  return (
    <button
      onClick={() => onClick(cat)}
      className={[
        "flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.1em] uppercase rounded-full border-none cursor-pointer transition-all duration-300 font-[DM_Sans,sans-serif]",
        isActive ? activeClasses[cat] : "bg-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  )
}

const IconActivity = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const IconSmartCity = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)
const IconPlane = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-1-5.5.5L10 6 1.8 4.2c-.5-.1-.9.4-.7.9l2 5.5c.1.3.4.5.7.5H8l-1 2H5v2h2l-.5 1.5c-.1.5.4.8.9.6L12 15l-2 4h2l4-4h2l1.5-4.2c.4-1.1-.2-2.3-1.3-2.6z" />
  </svg>
)
const IconTrendingUp = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={2}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

export function KediriTechChart() {
  const [active, setActive] = useState<Category>("ekonomi")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const renderChart = useCallback((cat: Category) => {
    if (!canvasRef.current) return
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const chartConfig = JSON.parse(JSON.stringify(CATS[cat].config))
    chartRef.current = new Chart(ctx, chartConfig)
  }, [])

  useEffect(() => {
    renderChart(active)
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [active, renderChart])

  const data = CATS[active]

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <section className="relative w-full bg-[#0d0d1f] px-6 pt-20 pb-10 overflow-hidden font-[DM_Sans,sans-serif] min-h-[620px]">
        <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] -translate-y-1/2 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] -translate-y-1/2 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />

        <WaveOrnament />

        <div className="relative z-10 max-w-[860px] mx-auto">
          <p className="text-center text-[10px] tracking-[0.3em] font-light text-[rgba(201,168,76,0.55)] mb-2">✦ KOTA KEDIRI · DATA &amp; INOVASI ✦</p>
          <h2 className="text-center text-[26px] font-semibold tracking-[0.04em] mb-1 transition-opacity duration-300" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D080" }}>{data.headline}</h2>
          <p className="text-center text-[11px] tracking-[0.1em] uppercase font-light text-white/30 mb-6">Kota Kediri · Jawa Timur</p>

          <Divider />

          <div className="flex gap-2.5 justify-center flex-wrap mx-auto mb-8 w-fit rounded-full p-1.5 border border-white/[0.06] bg-[#0a0a16]/60 backdrop-blur-md">
            <TabButton cat="ekonomi" active={active} onClick={setActive} icon={<IconActivity />} label="QRIS & UMKM" />
            <TabButton cat="smart"   active={active} onClick={setActive} icon={<IconSmartCity />} label="Smart City Index" />
            <TabButton cat="potensi" active={active} onClick={setActive} icon={<IconPlane />} label="Konektivitas Udara" />
          </div>

          <div className="rounded-[24px] overflow-hidden border border-[rgba(212,160,23,0.18)] bg-[#040610]/85 backdrop-blur-xl transition-all duration-500 hover:border-[rgba(212,160,23,0.3)]" style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
            <div className="px-8 pt-7 pb-6 border-b border-white/[0.04]" style={{ background: "linear-gradient(180deg, rgba(212,160,23,0.04) 0%, transparent 100%)" }}>
              <p className="text-[22px] font-bold tracking-[0.02em] mb-1.5 transition-all duration-300" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--color-emas-muda, #F0D080)" }}>{data.cardTitle}</p>
              <p className="text-[12px] leading-relaxed font-light text-white/50 max-w-2xl" style={{ fontFamily: "var(--font-lato), 'DM Sans', sans-serif" }}>{data.desc}</p>
            </div>

            <div className="px-6 pt-6 pb-4">
              <div className="relative w-full h-[280px]">
                <canvas key={active} ref={canvasRef} role="img" aria-label="Chart data digital Kota Kediri">Data perkembangan digital Kota Kediri.</canvas>
              </div>
            </div>

            <div className="flex gap-5 justify-center flex-wrap px-6 pb-5">
              {data.legend.map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-[11px] tracking-wide text-white/40 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 px-8 py-4 border-t border-white/[0.04]" style={{ background: "linear-gradient(0deg, rgba(4,6,16,0.6) 0%, transparent 100%)" }}>
              <div className="flex items-center gap-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.15)] flex items-center justify-center flex-shrink-0 shadow-inner">
                  <IconTrendingUp />
                </div>
                <span className="text-[11.5px] tracking-[0.02em] text-white/45 font-medium" style={{ fontFamily: "var(--font-lato), 'DM Sans', sans-serif" }}>{data.footer}</span>
              </div>
              <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md shadow-[0_0_15px_rgba(52,211,153,0.1)] font-mono">
                {data.statBadge}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default KediriTechChart