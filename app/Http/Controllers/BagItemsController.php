<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class BagItemsController extends Controller
{
    public function toggle(Request $request, Product $product)
    {
        $request->user()->bagItems()->toggle($product->id);

        return back();
    }
    public function updateQuantity(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        if ($validated['quantity'] <= 0) {
            $user->bagItems()->detach($product->id);
        } else {
            $user->bagItems()->updateExistingPivot($product->id, [
                'quantity' => $validated['quantity']
            ]);
        }

        return back();
    }
}