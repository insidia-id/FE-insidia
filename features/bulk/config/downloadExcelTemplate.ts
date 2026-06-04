import * as XLSX from 'xlsx';
import type { ExcelTemplateRow } from '../types/bulk.types';

type DownloadExcelTemplateProps<T extends ExcelTemplateRow> = {
  fileName: string;
  sheetName?: string;
  rows: T[];
};

export const downloadExcelTemplate = <T extends ExcelTemplateRow>({ fileName, sheetName = 'Template', rows }: DownloadExcelTemplateProps<T>) => {
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
};
export const fileAccept = '.csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

export const handleDownloadTemplateCsv = (template: any) => {
  const blob = new Blob([template.content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = template.fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const handleDownloadTemplateExcel = (template: any, templateRows: any[]) => {
  const excelFileName = template.fileName.replace(/\.csv$/i, '');
  downloadExcelTemplate({
    fileName: excelFileName,
    sheetName: 'Bulk User',
    rows: templateRows,
  });
};
