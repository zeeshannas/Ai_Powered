<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class AiController extends Controller
{

public function debugCode(Request $request)
{

$code = $request->code;
$language = $request->language;

$prompt = "Debug this $language code. 
Explain errors and give fixed code:

".$code;

$response = Http::withHeaders([
    'Authorization' => 'Bearer '.env('GROQ_API_KEY'),
    'Content-Type' => 'application/json'
    ])->post("https://api.groq.com/openai/v1/chat/completions", [
    
    "model" => "llama-3.1-8b-instant",
    
    "messages" => [
    [
    "role"=>"user",
    "content"=>$prompt
    ]
    ],
    
    "temperature"=>0.7
    
    ]);

$data = $response->json();

// Error response handle karo
if (!$response->successful()) {
    return response()->json([
        'error' => $data['error']['message'] ?? 'API request failed',
        'details' => $data
    ], $response->status());
}

// choices check karo
if (empty($data['choices'][0]['message']['content'])) {
    return response()->json([
        'error' => 'No response from AI',
        'details' => $data
    ], 500);
}

$content = $data['choices'][0]['message']['content'];

AiRequest::create([
    'user_id' => Auth::id(),
    'type'    => 'code',
    'input_text' => $code,
    'output_text'=>$content
]);

return response()->json($content);

}

public function generateEmail(Request $request)
{

$prompt = "
Generate professional email.

Tone: ".$request->tone."

Content idea: ".$request->content."
";

$response = Http::withHeaders([
'Authorization' => 'Bearer '.env('GROQ_API_KEY'),
'Content-Type' => 'application/json'
])->post("https://api.groq.com/openai/v1/chat/completions", [

"model" => "llama-3.1-8b-instant",

"messages" => [
[
"role"=>"user",
"content"=>$prompt
]
],

"temperature"=>0.7

]);

$data = $response->json();
if (!$response->successful()) {
    return response()->json([
        'error' => $data['error']['message'] ?? 'API request failed',
        'details' => $data
    ], $response->status());
}
if (empty($data['choices'][0]['message']['content'])) {
    return response()->json([
        'error' => 'No response from AI',
        'details' => $data
    ], 500);
}
$content = $response->json()['choices'][0]['message']['content'];

AiRequest::create([
'user_id'=> Auth::id(),
'type' => 'email',
'input_text' => $request->content,
'output_text' => $content
]);

return response()->json($content);

}

}