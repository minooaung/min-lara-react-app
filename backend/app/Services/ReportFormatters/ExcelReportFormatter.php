<?php

namespace App\Services\ReportFormatters;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;

class ExcelReportFormatter implements ReportFormatterInterface
{
    public function format(string $reportType, array $columns, iterable $data): string
    {
        if (empty($data)) return '';

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header Row
        $colIndex = 'A';
        foreach (array_keys($columns) as $header) {
            $sheet->setCellValue("{$colIndex}1", $header);
            $colIndex++;
        }

        // Data Rows
        $row = 2;
        foreach ($data as $item) {
            $colIndex = 'A';
            foreach ($columns as $label => $field) {
                if ($field === 'users') {
                    if ($item->users && count($item->users)) {
                        $userLines = [];
                        foreach ($item->users as $user) {
                            $userLines[] = "{$user->name} ({$user->email}) \n";
                        }
                        $sheet->setCellValue("{$colIndex}{$row}", implode("\n", $userLines));
                        $sheet->getStyle("{$colIndex}{$row}")->getAlignment()->setWrapText(true);
                    } else {
                        $sheet->setCellValue("{$colIndex}{$row}", "No assigned users");
                    }
                } else {
                    $sheet->setCellValue("{$colIndex}{$row}", $item->{$field});
                }
                $colIndex++;
            }
            $row++;
        }

        ob_start();
        $writer = new Xls($spreadsheet);
        $writer->save('php://output');
        return ob_get_clean();
    }
}

// class ExcelReportFormatter implements ReportFormatterInterface
// {
//     public function format(array $columns, iterable $data): string
//     {
//         if (empty($data)) return '';

//         $spreadsheet = new Spreadsheet();
//         $sheet = $spreadsheet->getActiveSheet();

//         $col = 'A';
//         foreach (array_keys($columns) as $header) {
//             $sheet->setCellValue("{$col}1", $header);
//             $col++;
//         }

//         $row = 2;
//         foreach ($data as $item) {
//             $col = 'A';
//             foreach ($columns as $field) {
//                 $sheet->setCellValue("{$col}{$row}", $item->{$field});
//                 $col++;
//             }
//             $row++;
//         }

//         ob_start();
//         $writer = new Xls($spreadsheet);
//         $writer->save('php://output');
//         return ob_get_clean();
//     }
// }