<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json");

    require __DIR__ . '/google-client-php/vendor/autoload.php';

    function verifySignature($paymentId, $orderId, $signature, $secret)
    {
        $generated = hash_hmac('sha256', $orderId . "|" . $paymentId, $secret);
        return hash_equals($generated, $signature);
    }

    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        echo json_encode(["success" => false, "error" => "Invalid payload"]);
        exit;
    }

    $paymentId  = $input["payment_id"] ?? null;
    $orderId    = $input["order_id"] ?? null;
    $signature  = $input["payment_signature"] ?? null;

    $nameOnJersey    = trim($input["nameOnJersey"] ?? "");
    $numberOnJersey  = trim($input["numberOnJersey"] ?? "");
    $department      = trim($input["department"] ?? "");
    $size            = trim($input["size"] ?? ""); // S, M, L, XL, XXL

    if (!$nameOnJersey || !$numberOnJersey || !$department || !$size) {
        echo json_encode(["success" => false, "error" => "Missing jersey fields"]);
        exit;
    }

    $RAZORPAY_SECRET = "YOUR_RAZORPAY_SECRET_KEY";

    if (!$paymentId || !$orderId || !$signature) {
        echo json_encode(["success" => false, "error" => "Missing payment fields"]);
        exit;
    }

    if (!verifySignature($paymentId, $orderId, $signature, $RAZORPAY_SECRET)) {
        echo json_encode(["success" => false, "error" => "Invalid signature"]);
        exit;
    }

    // GOOGLE SHEETS CONFIG
    putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/service-account.json');

    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope(Google_Service_Sheets::SPREADSHEETS);
    $service = new Google_Service_Sheets($client);

    $spreadsheetId = "1cn0ewHFFfw40I7GSzdR5ZCjrUUpL5YOyYhsbO4PjOdQ";
    $sheetTitle = "Jersey";

    // FETCH NEXT SR. NO FROM COLUMN A
    $range = "$sheetTitle!A:A";
    $response = $service->spreadsheets_values->get($spreadsheetId, $range);
    $values = $response->getValues() ?? [];

    $lastSr = 0;
    foreach ($values as $row) {
        if (isset($row[0]) && is_numeric($row[0])) {
            $lastSr = max($lastSr, intval($row[0]));
        }
    }
    $nextSr = $lastSr + 1;

    // Build row: Sr. No | Name on Jersey | Number on Jersey | Department | Size | Payment ID
    $row = [
        $nextSr,
        $nameOnJersey,
        $numberOnJersey,
        $department,
        $size,
        $paymentId,
    ];

    $body = new Google_Service_Sheets_ValueRange([
        'values' => [ $row ],
    ]);
    $params = ['valueInputOption' => 'RAW'];

    // Insert starting at row 6 (headers on row 5)
    $service->spreadsheets_values->append(
        $spreadsheetId,
        "$sheetTitle!A6",
        $body,
        $params
    );

    echo json_encode([
        "success" => true,
        "sr_no" => $nextSr,
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "trace"  => $e->getTraceAsString(),
    ]);
}

