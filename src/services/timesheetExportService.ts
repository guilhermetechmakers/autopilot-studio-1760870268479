import type { Timesheet } from '@/types/timetracking';
import { format } from 'date-fns';

/**
 * Export service for timesheets
 * Handles CSV, PDF, and QuickBooks export formats
 */

// CSV Export
export function exportTimesheetToCSV(timesheet: Timesheet): Blob {
  const headers = [
    'Date',
    'Start Time',
    'End Time',
    'Duration (hours)',
    'Description',
    'Task ID',
    'Project ID',
    'Billable',
    'Status',
  ];

  const rows = timesheet.entries.map((entry) => [
    format(new Date(entry.start_time), 'yyyy-MM-dd'),
    format(new Date(entry.start_time), 'HH:mm:ss'),
    entry.end_time ? format(new Date(entry.end_time), 'HH:mm:ss') : '',
    entry.duration_minutes ? (entry.duration_minutes / 60).toFixed(2) : '0.00',
    `"${entry.description.replace(/"/g, '""')}"`, // Escape quotes
    entry.task_id || '',
    entry.project_id || '',
    entry.is_billable ? 'Yes' : 'No',
    entry.status,
  ]);

  // Add summary row
  const summaryRow = [
    'TOTAL',
    '',
    '',
    timesheet.total_hours.toFixed(2),
    `Billable: ${timesheet.billable_hours.toFixed(2)}h`,
    '',
    '',
    '',
    '',
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
    summaryRow.join(','),
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

// QuickBooks IIF Export
export function exportTimesheetToQuickBooks(timesheet: Timesheet): Blob {
  // QuickBooks IIF format for time tracking
  const headers = ['!TIMERHDR', 'DATE', 'JOB', 'DUR', 'PROJ', 'NOTE', 'BILLINGSTATUS'];
  
  const rows = timesheet.entries
    .filter((entry) => entry.duration_minutes) // Only include completed entries
    .map((entry) => {
      const date = format(new Date(entry.start_time), 'MM/dd/yyyy');
      const duration = entry.duration_minutes ? (entry.duration_minutes / 60).toFixed(2) : '0.00';
      const billingStatus = entry.is_billable ? 'Billable' : 'Not Billable';
      
      return [
        'TIMERHDR',
        date,
        entry.project_id || '',
        duration,
        entry.task_id || '',
        `"${entry.description.replace(/"/g, '""')}"`,
        billingStatus,
      ].join('\t');
    });

  const iifContent = [headers.join('\t'), ...rows].join('\n');

  return new Blob([iifContent], { type: 'text/plain;charset=utf-8;' });
}

// PDF Export (simplified - in production, use a proper PDF library)
export function exportTimesheetToPDF(timesheet: Timesheet): Blob {
  // This is a simplified HTML-based approach
  // In production, use libraries like jsPDF or pdfmake
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Timesheet - Week of ${format(new Date(timesheet.week_start), 'MMM d, yyyy')}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #23272F;
      border-bottom: 2px solid #72D47A;
      padding-bottom: 10px;
    }
    .summary {
      background: #f5f5f5;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #23272F;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    tr:hover {
      background: #f9f9f9;
    }
    .billable {
      color: #72D47A;
      font-weight: bold;
    }
    .non-billable {
      color: #818899;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #818899;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>Timesheet Report</h1>
  
  <div class="summary">
    <h2>Week Summary</h2>
    <div class="summary-item">
      <strong>Period:</strong>
      <span>${format(new Date(timesheet.week_start), 'MMM d, yyyy')} - ${format(new Date(timesheet.week_end), 'MMM d, yyyy')}</span>
    </div>
    <div class="summary-item">
      <strong>Total Hours:</strong>
      <span>${timesheet.total_hours.toFixed(2)}h</span>
    </div>
    <div class="summary-item">
      <strong>Billable Hours:</strong>
      <span class="billable">${timesheet.billable_hours.toFixed(2)}h</span>
    </div>
    <div class="summary-item">
      <strong>Non-Billable Hours:</strong>
      <span class="non-billable">${(timesheet.total_hours - timesheet.billable_hours).toFixed(2)}h</span>
    </div>
    <div class="summary-item">
      <strong>Status:</strong>
      <span>${timesheet.status.toUpperCase()}</span>
    </div>
  </div>

  <h2>Time Entries</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Duration</th>
        <th>Description</th>
        <th>Billable</th>
      </tr>
    </thead>
    <tbody>
      ${timesheet.entries
        .map(
          (entry) => `
        <tr>
          <td>${format(new Date(entry.start_time), 'MMM d, yyyy')}</td>
          <td>${format(new Date(entry.start_time), 'h:mm a')}${entry.end_time ? ` - ${format(new Date(entry.end_time), 'h:mm a')}` : ''}</td>
          <td>${entry.duration_minutes ? (entry.duration_minutes / 60).toFixed(2) : '0.00'}h</td>
          <td>${entry.description}</td>
          <td class="${entry.is_billable ? 'billable' : 'non-billable'}">
            ${entry.is_billable ? 'Yes' : 'No'}
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated on ${format(new Date(), 'MMM d, yyyy h:mm a')}</p>
    <p>Autopilot Studio - Time Tracking System</p>
  </div>
</body>
</html>
  `;

  return new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
}

// Download helper
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Main export function
export function exportTimesheet(
  timesheet: Timesheet,
  exportFormat: 'csv' | 'pdf' | 'quickbooks'
): void {
  const extension = exportFormat === 'csv' ? 'csv' : exportFormat === 'pdf' ? 'html' : 'iif';
  const filename = `timesheet_${format(new Date(timesheet.week_start), 'yyyy-MM-dd')}.${extension}`;

  let blob: Blob;

  switch (exportFormat) {
    case 'csv':
      blob = exportTimesheetToCSV(timesheet);
      break;
    case 'pdf':
      blob = exportTimesheetToPDF(timesheet);
      break;
    case 'quickbooks':
      blob = exportTimesheetToQuickBooks(timesheet);
      break;
    default:
      throw new Error(`Unsupported export format: ${exportFormat}`);
  }

  downloadBlob(blob, filename);
}

// Batch export for multiple timesheets
export function exportMultipleTimesheets(
  timesheets: Timesheet[],
  exportFormat: 'csv' | 'pdf' | 'quickbooks'
): void {
  timesheets.forEach((timesheet) => {
    exportTimesheet(timesheet, exportFormat);
  });
}

// Export summary report for billing
export interface BillingExportData {
  period_start: string;
  period_end: string;
  total_hours: number;
  billable_hours: number;
  non_billable_hours: number;
  timesheets: Timesheet[];
}

export function exportBillingReport(data: BillingExportData): Blob {
  const headers = [
    'Week Start',
    'Week End',
    'Total Hours',
    'Billable Hours',
    'Non-Billable Hours',
    'Billable Rate %',
    'Status',
  ];

  const rows = data.timesheets.map((timesheet) => {
    const billableRate =
      timesheet.total_hours > 0
        ? ((timesheet.billable_hours / timesheet.total_hours) * 100).toFixed(1)
        : '0.0';

    return [
      format(new Date(timesheet.week_start), 'yyyy-MM-dd'),
      format(new Date(timesheet.week_end), 'yyyy-MM-dd'),
      timesheet.total_hours.toFixed(2),
      timesheet.billable_hours.toFixed(2),
      (timesheet.total_hours - timesheet.billable_hours).toFixed(2),
      billableRate,
      timesheet.status,
    ];
  });

  // Add summary row
  const summaryRow = [
    'TOTAL',
    '',
    data.total_hours.toFixed(2),
    data.billable_hours.toFixed(2),
    data.non_billable_hours.toFixed(2),
    data.total_hours > 0
      ? ((data.billable_hours / data.total_hours) * 100).toFixed(1)
      : '0.0',
    '',
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
    summaryRow.join(','),
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
