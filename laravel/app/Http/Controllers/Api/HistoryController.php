<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiRequest;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index()
    {
        $data = AiRequest::where('user_id', Auth::id())->latest()->get();
        return response()->json($data);
    }
    public function destroy($id)
    {
        $item = AiRequest::where('user_id', Auth::id())->find($id);
        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
