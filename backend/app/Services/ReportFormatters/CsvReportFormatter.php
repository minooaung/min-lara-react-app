<?php

namespace App\Services\ReportFormatters;

class CsvReportFormatter implements ReportFormatterInterface
{
    public function format(string $reportType, array $columns, iterable $data): string
    {
        if (empty($data)) {
            return '';
        }

        $csv = implode(',', array_keys($columns)) . "\n";

        foreach ($data as $item) {
            $row = [];

            foreach ($columns as $label => $field) {
                if ($field === 'users' && method_exists($item, 'users')) {
                    if ($item->users && count($item->users)) {
                        $userSummary = collect($item->users)
                            ->map(fn($user) => "{$user->name} ({$user->email})")
                            ->implode('; ');
                        $row[] = "\"{$userSummary}\"";
                    } else {
                        $row[] = "\"No assigned users\"";
                    }
                } else {
                    $row[] = "\"{$item->{$field}}\"";
                }
            }

            $csv .= implode(',', $row) . "\n";
        }

        return $csv;
    }
}

// class CsvReportFormatter implements ReportFormatterInterface
// {
//     public function format(array $columns, iterable $data): string
//     {
//         if (empty($data)) return '';

//         $csv = implode(',', array_keys($columns)) . "\n";

//         foreach ($data as $item) {
//             $row = [];
//             foreach ($columns as $field) {
//                 $row[] = "\"{$item->{$field}}\"";
//             }
//             $csv .= implode(',', $row) . "\n";
//         }

//         return $csv;
//     }
// }