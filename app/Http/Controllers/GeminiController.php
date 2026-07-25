<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\Product; 
use Gemini\Data\Content;
use Gemini\Enums\Role;
class GeminiController extends Controller
{
   public function ask(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'history' => 'present|array', 
        ]);

        try {
            // Compact catalog cached for 1 hour — only first image, short keys
            $products = Cache::remember('gemini_catalog', now()->addHours(1), function () {
                return Product::select('name', 'price', 'sales_price', 'images', 'category', 'subcategory')
                    ->get()
                    ->map(fn($p) => [
                        'name' => $p->name,
                        'price' => $p->price,
                        'sale' => $p->sales_price,
                        'cat' => $p->category . '/' . $p->subcategory,
                        'img' => $p->images[0] ?? null,
                    ]);
            });

            // Grab the history — keep last 3 back and forth as context
            $history = $request->input('history', []); 
            $recentHistory = array_slice($history, -6);

            $systemInstruction = "You are Rachel, Cutie McPretty's shopping assistant (named after Rachel Green).
Help customers find products, compare items, and answer questions.

RULES:
1. Product recommendations must be exactly 3 lines:
   - Line 1: Brief detail (10-15 words)
   - Line 2: ![Product Name](IMAGE_URL)
   - Line 3: Price details
2. Never generate product links or show product IDs.
3. Cannot add items to wishlist/checkout — say so if asked.
4. Don't use terms of affection (sweetie, honey, etc).
5. 'Bonus' section is now 'Gift Shop' — same products, new name.

CATALOG:
" . json_encode($products);

            $chatHistory = [];
            foreach ($recentHistory as $message) {
                $role = $message['role'] === 'user' ? Role::USER : Role::MODEL;
                $chatHistory[] = Content::parse($message['text'], $role);
            }

            $chat = Gemini::generativeModel('gemini-2.5-flash')
                ->withSystemInstruction(Content::parse($systemInstruction))
                ->startChat($chatHistory);

            $result = $chat->sendMessage($request->input('prompt'));

            return response()->json([
                'success' => true,
                'data' => $result->text()
            ]);

        }  catch (\Exception $e) {
            //429 token exceeded error
            return response()->json([
                'success' => true, 
                'data' => "Oops, we have a lot of customers right now, I will be right back with you, feel free to browse the store in the meantime."
            ]);
        }
    }
}