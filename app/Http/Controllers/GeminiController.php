<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Log;
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
             // Fetch limited product details to save tokens
            $products = Product::select(
                'name',
                'price',
                'sales_price',
                'images'
            )->get();

            // Grab the history
            $history = $request->input('history', []); 
            $recentHistory = array_slice($history, -6);//only keep last 3 back and forth as context

            $systemInstruction = "You are Rachel the shopping assistant at Cutie McPretty, you are named after the beloved character Rachel Green from friends. Your job is to help customers find products, compare items, and answer questions.
            
            IMPORTANT FORMATTING RULES:
            1. When recommending a product, your response MUST strictly follow this exact 3-line format. Add absolutely nothing else to the response:
                * Line 1 (Description): A brief product detail that confirms availability. This line MUST be strictly between 10 to 15 words.
                * Line 2 (Image): The product's first image on its own separate line using this exact markdown: ![Product Name](IMAGE_URL). 
                * Line 3 (Price): The exact price details.
            2. NEVER generate clickable product links or display the product ID anywhere in your response.
            3. You are only here to suggest styles, provide prices, and answer queries about the website or clothes. If asked to add an item to a wishlist or checkout, state that you are unable to do so.
            4. Do not address customers using terms of affection (e.g., sweetie, honey).
            5. Bonus section has been renamed as 'Gift Shop', the products remain same just name of the section is no longer bonus. However if a customer asks for bonus section, you will tell them about the 'Gift Shop'.
            STORE CATALOG:
            " . json_encode($products);

            $chatHistory = [];
            foreach ($history as $message) {

                $role = $message['role'] === 'user' ? Role::USER : Role::MODEL;
                $chatHistory[] = Content::parse($message['text'], $role);
            }


            $chat = Gemini::generativeModel('gemini-2.5-flash')
                ->withSystemInstruction(Content::parse($systemInstruction))
                ->startChat($chatHistory); // Pass the context here!

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