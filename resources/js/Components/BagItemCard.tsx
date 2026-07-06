import { router } from '@inertiajs/react';
import { useState } from 'react';

interface BagItemProps {
    product: {
        id: number;
        name: string;
        price: number;
        sales_price?: number;
        images: string[];
        pivot: {
            quantity: number;
        };
    };
}

export default function BagItemCard({ product }: BagItemProps) {
    const [loading, setLoading] = useState(false);
    const currentQuantity = product.pivot.quantity;

    // Function to handle quantity updates via Inertia PATCH request
    const handleUpdateQuantity = (newQuantity: number) => {
        setLoading(true);

        router.patch(
            route('bag.update', product.id),
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <div className="flex items-center justify-between border p-4 rounded-lg bg-white shadow-sm gap-4">
            {/* Product Details & Image */}
            <div className="flex items-center gap-4">
                <img 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name} 
                    className="w-16 h-20 object-cover rounded bg-gray-100" 
                />
                <div>
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    <p className="text-sm font-bold text-gray-600 mt-1">
                        ₹{product.sales_price || product.price}
                    </p>
                </div>
            </div>

            {/* Quantity Adjuster (- Quantity +) */}
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-xs bg-gray-50">
                {/* Minus Button */}
                <button
                    type="button"
                    onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                    disabled={loading}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 hover:text-black transition disabled:opacity-40"
                >
                    -
                </button>

                {/* Current Quantity Display */}
                <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">
                    {loading ? '' : currentQuantity}
                </span>

                {/* Plus Button */}
                <button
                    type="button"
                    onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                    disabled={loading}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 hover:text-black transition disabled:opacity-40"
                >
                    +
                </button>
            </div>
        </div>
    );
}