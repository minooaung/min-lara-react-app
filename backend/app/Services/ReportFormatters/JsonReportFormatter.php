<?php

namespace App\Services\ReportFormatters;

//use App\Services\ReportFormatters\ReportFormatterInterface;

class JsonReportFormatter implements ReportFormatterInterface
{
    public function format(string $reportType, array $columns, iterable $data): mixed
    {
        $result = [];

        foreach ($data as $item) {
            $row = [];

            foreach ($columns as $label => $field) {
                if ($field === 'users' && method_exists($item, 'users')) {
                    // Format assigned users
                    $row[$label] = $item->users->map(function ($user) {
                        return [
                            'Name' => $user->name,
                            'Email' => $user->email,
                            'Role' => $user->role,
                            'Created At' => $user->formatted_created_at ?? $user->created_at->format('Y-m-d H:i'),
                        ];
                    })->toArray();
                } else {
                    $row[$label] = $item->{$field};
                }
            }

            $result[] = $row;
        }

        return $result;
    }
}


// namespace App\Services\ReportFormatters;

// use App\Services\ReportFormatters\ReportFormatterInterface;

// class JsonReportFormatter implements ReportFormatterInterface
// {
//     public function format(array $columns, iterable $data): mixed
//     {
//         $result = [];

//         if (empty($data)) {
//             return json_encode([]);
//         }

//         foreach ($data as $item) {
//             $row = [];
//             foreach ($columns as $label => $field) {
//                 $row[$label] = $item->{$field};
//             }
//             $result[] = $row;
//         }

//         return $result; 
//     }
// }