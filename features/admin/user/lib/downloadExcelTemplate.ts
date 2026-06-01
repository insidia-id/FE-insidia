import * as XLSX from 'xlsx';

export type ExcelTemplateRow = Record<string, string | number | null>;

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
