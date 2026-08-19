import { toast } from 'sonner'

export type ExportCell = string | number

function csvEscape(value: ExportCell) {
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function downloadCsv(filename: string, headers: string[], rows: ExportCell[][]) {
  const body = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  toast.success('CSV downloaded', { description: link.download })
}

export function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export type ReportSection = {
  heading?: string
  headers: string[]
  rows: ExportCell[][]
}

export function downloadCsvSections(filename: string, sections: ReportSection[]) {
  const chunks = sections.flatMap((section, index) => {
    const lines: string[] = []
    if (index > 0) lines.push('')
    if (section.heading) lines.push(csvEscape(section.heading))
    lines.push(section.headers.map(csvEscape).join(','))
    for (const row of section.rows) lines.push(row.map(csvEscape).join(','))
    return lines
  })
  const blob = new Blob([`\uFEFF${chunks.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  toast.success('CSV downloaded', { description: link.download })
}

export function printReport(title: string, sections: ReportSection[], subtitle?: string) {
  const body = sections
    .map(
      (section) => `
      ${section.heading ? `<h2>${section.heading}</h2>` : ''}
      <table>
        <thead>
          <tr>${section.headers.map((h) => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${section.rows
            .map(
              (row) =>
                `<tr>${row
                  .map((cell, i) => `<td class="${i === 0 ? '' : 'num'}">${cell}</td>`)
                  .join('')}</tr>`,
            )
            .join('')}
        </tbody>
      </table>
    `,
    )
    .join('')

  const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!popup) {
    toast.error('Allow pop-ups to export a PDF')
    return
  }
  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: Inter, ui-sans-serif, sans-serif; color: #1c1917; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      h2 { font-size: 13px; margin: 24px 0 8px; color: #6b645c; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
      p { color: #6b645c; font-size: 12px; margin: 0 0 20px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
      th, td { border-bottom: 1px solid #e8e8e8; padding: 8px 10px; font-size: 12px; text-align: left; }
      th { color: #6b645c; font-weight: 600; }
      td.num { text-align: right; font-variant-numeric: tabular-nums; }
      .mark { color: #ff7a35; font-weight: 700; margin-bottom: 16px; }
    </style>
  </head>
  <body>
    <div class="mark">Airests</div>
    <h1>${title}</h1>
    <p>${subtitle ?? 'Riverside Hospitality Group'}</p>
    ${body}
  </body>
</html>`)
  popup.document.close()
  popup.focus()
  popup.print()
  toast.success('Print opened', { description: 'Choose Save as PDF in the print dialog.' })
}

export function printPdf(title: string, headers: string[], rows: ExportCell[][], subtitle?: string) {
  const table = `
    <table>
      <thead>
        <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell, i) => `<td class="${i === 0 ? '' : 'num'}">${cell}</td>`)
                .join('')}</tr>`,
          )
          .join('')}
      </tbody>
    </table>
  `
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!popup) {
    toast.error('Allow pop-ups to export a PDF')
    return
  }
  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: Inter, ui-sans-serif, sans-serif; color: #1c1917; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      p { color: #6b645c; font-size: 12px; margin: 0 0 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #e8e8e8; padding: 8px 10px; font-size: 12px; text-align: left; }
      th { color: #6b645c; font-weight: 600; }
      td.num { text-align: right; font-variant-numeric: tabular-nums; }
    </style>
  </head>
  <body>
    <h1>Airests — ${title}</h1>
    <p>${subtitle ?? 'Riverside Hospitality Group'}</p>
    ${table}
  </body>
</html>`)
  popup.document.close()
  popup.focus()
  popup.print()
  toast.success('Print opened', { description: 'Choose Save as PDF in the print dialog.' })
}

export function fileStamp() {
  return new Date().toISOString().slice(0, 10)
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(cell.trim())
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell.trim())
      cell = ''
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else {
      cell += ch
    }
  }

  if (cell || row.length) {
    row.push(cell.trim())
    if (row.some(Boolean)) rows.push(row)
  }

  return rows
}

export function headerIndex(header: string[], ...aliases: string[]) {
  return header.findIndex((h) => aliases.some((alias) => h.toLowerCase().includes(alias)))
}
