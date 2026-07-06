<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\BagItemsController;  
use App\Models\Product; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// STOREFRONT 
Route::get('/', function () {
    return Inertia::render('Storefront', [
        'products' => Product::all(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');


// TRADITIONAL ROUTES
Route::prefix('traditional')->group(function () {
    Route::get('/festive', function () {
        return Inertia::render('Traditional/Festive', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'festive')->latest()->get()
        ]);
    })->name('festive');

    Route::get('/classics', function () {
        return Inertia::render('Traditional/Classics', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'classics')->latest()->get()
        ]);
    })->name('classics');

    Route::get('/fusion', function () {
        return Inertia::render('Traditional/Fusion', [
            'products' => Product::where('category', 'traditional')->where('subcategory', 'fusion')->latest()->get()
        ]);
    })->name('fusion');
});


// WESTERN ROUTES
Route::prefix('western')->group(function () {
    Route::get('/tops', function () {
        return Inertia::render('Western/Tops', [
            'products' => Product::where('category', 'western')->where('subcategory', 'tops')->latest()->get()
        ]);
    })->name('tops');

    Route::get('/dresses', function () {
        return Inertia::render('Western/Dresses', [
            'products' => Product::where('category', 'western')->where('subcategory', 'dresses')->latest()->get()
        ]);
    })->name('dresses');

    Route::get('/bottoms', function () {
        return Inertia::render('Western/Bottoms', [
            'products' => Product::where('category', 'western')->where('subcategory', 'bottoms')->latest()->get()
        ]);
    })->name('bottoms');
});


// ACCESSORIES ROUTES
Route::prefix('accessories')->group(function () {
    Route::get('/purses', function () {
        return Inertia::render('Accessories/Purses', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'purses')->latest()->get()
        ]);
    })->name('purses');

    Route::get('/footwear', function () {
        return Inertia::render('Accessories/Footwear', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'footwear')->latest()->get()
        ]);
    })->name('footwear');

    Route::get('/scarves', function () {
        return Inertia::render('Accessories/Scarves', [
            'products' => Product::where('category', 'accessories')->where('subcategory', 'scarves')->latest()->get()
        ]);
    })->name('scarves');
});


// BONUS ROUTE
Route::get('/bonus', function () {
    return Inertia::render('Bonus', [
        'products' => Product::where('category', 'bonus')->latest()->get()
    ]);
})->name('bonus');


// AUTHENTICATED USER ROUTES
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// WISHLIST ROUTES
Route::middleware('auth')->group(function () {
    Route::post('/wishlist/add/{product}', [WishlistController::class, 'toggle'])
        ->name('wishlist.add');
});


//BAG ROUTES
Route::middleware('auth')->group(function () {
    Route::get('/bag', function () {
    return Inertia::render('Bag', [
        'bagItems' => request()->user()->bagItems()->get(), 
    ]);})->name('bag.view');
    Route::post('/bag/add/{product}', [BagItemsController::class, 'toggle'])
        ->name('bag.add');
    Route::delete('/bag/remove/{product}', [BagItemsController::class, 'remove'])
        ->name('bag.remove');
    Route::patch('/bag/update/{product}', [BagItemsController::class, 'updateQuantity'])
    ->name('bag.update');
});

require __DIR__.'/auth.php';