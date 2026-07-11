import PrimaryButton from '@/Components/PrimaryButton';
import { Carousel } from 'flowbite-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sales_price?: number;
    images: string[];
}

interface CarouselProps {
    products: Product[];
    userBagQuantities?: Record<number, number>; 
}

export default function ProductCarousal({ products, userBagQuantities = {} }: CarouselProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [addingToBagId, setAddingToBagId] = useState<number | null>(null);

    // Add product to wishlist
    const handleAddToWishlist = (productId: number) => {
        setLoadingId(productId);

        router.post(
            route('wishlist.add', productId),
            {}, 
            {
                preserveScroll: true,
                onSuccess: () => {},
                onFinish: () => setLoadingId(null),
            }
        );
    };

    // Add product to bag
    const handleAddToBag = (productId: number) => {
        setAddingToBagId(productId);

        router.post(
            route('bag.add', productId),
            {},
            {
                preserveScroll: true,
                // Induced Artificial Delay
                onFinish: () => {
                    setTimeout(() => {
                        setAddingToBagId(null);
                    }, 800);
                },
            }
        );
    };

    // Update bag quantity
    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        setAddingToBagId(productId);

        router.patch(
            route('bag.update', productId),
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setAddingToBagId(null),
            }
        );
    };
    return (
        // Product Card
        <div className="flex flex-wrap justify-center gap-6 m-8 pb-4">
            {products && products.length > 0 ? (
                products.map((product) => {
                    const currentQty = userBagQuantities[product.id] || 0;

                    return (
                        <div 
                            key={product.id} 
                            className="w-[210px] md:w-[240px] flex-shrink-0 border-2 border-red-200 p-4 rounded-md shadow bg-white flex flex-col justify-between snap-start"
                        >
                            <div>
                                {/* Product images */}
                                {product.images && product.images.length > 0 ? (
                                    <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden mb-4 bg-gray-100">
                                        <div className="h-full w-full">
                                            <Carousel slide={false}>
                                                {product.images.map((imgUrl, index) => (
                                                    <img 
                                                        key={index}
                                                        src={imgUrl} 
                                                        alt={`${product.name} - Angle ${index + 1}`} 
                                                        className="h-full w-full object-cover" 
                                                    />
                                                ))}
                                            </Carousel>
                                        </div>

                                        {/* Wishlist button */}
                                        <button 
                                            onClick={() => handleAddToWishlist(product.id)}
                                            disabled={loadingId === product.id}
                                            type="button"
                                            className="group absolute top-2 right-2 p-2 bg-gray-50 backdrop-blur-sm rounded-full shadow-sm hover:bg-zinc-800 transition-all duration-300 z-10 disabled:opacity-50"
                                        >
                                            <img 
                                                src="/heart.png" 
                                                alt="Add to Wishlist" 
                                                className={`w-5 h-5 object-contain transition-all duration-300 group-hover:invert group-hover:scale-100 ${
                                                    loadingId === product.id ? 'animate-pulse' : ''
                                                }`} 
                                            />     
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center rounded-md mb-4 text-gray-400">
                                        No Image Available
                                    </div>
                                )}

                                <h3 className="font-semibold text-sm line-clamp-<2>">{product.name}</h3>
                            </div>
                            
                            {/* Product pricing */}
                            <div className="mt-4 pt-2 border-t border-gray-100">
                                {product.sales_price ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-red-600 font-bold text-l">
                                            ₹{product.sales_price}
                                        </span>
                                        
                                        <span className="text-gray-400 line-through text-sm">
                                            ₹{product.price}
                                        </span>

                                        <span className="text-emerald-600 font-medium text-xs">
                                            {Math.round(((product.price - product.sales_price) / product.price) * 100)}% off
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-indigo-600 font-bold text-l">
                                        ₹{product.price}
                                    </p>
                                )}
                            </div>
                            
                            {/* Add to bag */}
                            <div className="mt-5 h-[42px]">
                                {currentQty === 0 ? (
                                    <PrimaryButton 
                                        onClick={() => handleAddToBag(product.id)}
                                        disabled={addingToBagId === product.id}
                                        className="w-full h-full transition-all duration-800 ease-in-out justify-center disabled:opacity-50"
                                    >
                                        {addingToBagId === product.id ? 'Adding...' : 'Add to bag'}
                                    </PrimaryButton>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-between border-2 border-gray-900 bg-gray-900 text-white rounded-md overflow-hidden shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(product.id, currentQty - 1)}
                                            disabled={addingToBagId === product.id}
                                            className="w-10 h-full flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
                                        >
                                            &minus;
                                        </button>

                                        <span className="font-bold text-sm select-none px-2 flex flex-col items-center justify-center leading-tight">
                                            {addingToBagId === product.id ? (
                                                <span className="animate-pulse">...</span>
                                            ) : (
                                                <>
                                                    <span>{currentQty}</span>
                                                    <span className="text-[9px] font-normal text-gray-400 uppercase tracking-wider -mt-1">in bag</span>
                                                </>
                                            )}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleUpdateQuantity(product.id, currentQty + 1)}
                                            disabled={addingToBagId === product.id}
                                            className="w-10 h-full flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
                                        >
                                            &#43;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500 p-4">No featured drops available right now.</p>
            )}
        </div>
    );
}