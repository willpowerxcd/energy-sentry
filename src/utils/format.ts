import dayjs from 'dayjs'

export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatMoney(value: number | null | undefined): string {
  if (value == null) return '—'
  if (Math.abs(value) >= 10000) return `${(value / 10000).toFixed(1)}万`
  return formatNumber(value)
}

export function formatPercent(value: number, digits = 1, signed = false): string {
  const pct = value * 100
  const sign = signed && pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(digits)}%`
}

export function formatCarbon(value: number | null | undefined): string {
  if (value == null) return '—'
  return value.toFixed(1)
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('MM-DD HH:mm')
}

export function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD')
}

export function formatShortDate(iso: string): string {
  return dayjs(iso).format('MM-DD')
}
