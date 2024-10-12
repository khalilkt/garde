import fileSaver from "file-saver";
import React from "react";
import * as XLSX from "xlsx";
import { OutlinedButton } from "./buttons";

export function exportToExcel({
  data,
  fileName,
}: {
  data: any[];
  fileName: string;
}) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  fileSaver.saveAs(blob, `${fileName}.xlsx`);
}

export const ExcelExportButton = ({
  data,
  fileName,
}: {
  data: any[];
  fileName: string;
}) => {
  return (
    <OutlinedButton
      onClick={() => {
        exportToExcel({ data, fileName });
      }}
      className="border border-green-800 text-green-800"
    >
      Excel
    </OutlinedButton>
  );
};
