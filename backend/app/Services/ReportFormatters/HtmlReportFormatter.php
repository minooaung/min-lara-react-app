<?php

namespace App\Services\ReportFormatters;

// use App\Services\ReportFormatters\ReportFormatterInterface;

class HtmlReportFormatter implements ReportFormatterInterface
{
    public function format(string $reportType, array $columns, iterable $data): string
    {
        if (empty($data)) {
            return "<h1>No data available</h1>";
        }

        $html = "<h1>Report - {$reportType}</h1><table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse;'>";
        $html .= "<tr>";
        foreach (array_keys($columns) as $header) {
            $html .= "<th style='background-color:#f2f2f2;'>{$header}</th>";
        }
        $html .= "</tr>";

        foreach ($data as $item) {
            $html .= "<tr>";
            foreach ($columns as $label => $field) {
                if ($field === 'users') {
                    $html .= "<td>";
                    if ($item->users && count($item->users)) {
                        $html .= "<ul style='margin:0; padding-left:1.2em;'>";
                        foreach ($item->users as $user) {
                            $html .= "<li>{$user->name} ({$user->email})</li>";
                        }
                        $html .= "</ul>";
                    } else {
                        $html .= "<em>No assigned users</em>";
                    }
                    $html .= "</td>";
                } else {
                    $html .= "<td>{$item->{$field}}</td>";
                }
            }
            $html .= "</tr>";
        }

        $html .= "</table>";
        return $html;
    }
}


// class HtmlReportFormatter implements ReportFormatterInterface
// {
//     public function format(array $columns, iterable $data): string
//     {
//         if (empty($data)) {
//             return "<h1>No data available</h1>";
//         }

//         $html = "<h1>Report</h1><table border='1'><tr>";
//         foreach (array_keys($columns) as $header) {
//             $html .= "<th>{$header}</th>";
//         }
//         $html .= "</tr>";

//         foreach ($data as $item) {
//             $html .= "<tr>";
//             foreach ($columns as $field) {
//                 $html .= "<td>{$item->{$field}}</td>";
//             }
//             $html .= "</tr>";
//         }

//         $html .= "</table>";
//         return $html;
//     }
// }