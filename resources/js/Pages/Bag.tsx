import { Head, router, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import Navbar from '@/Components/Navbar';

interface BagItem {
    id: number;
    name: string;
    description: string;
    price: number;
    sales_price?: number;
    images: string[];
    pivot: {
        quantity: number;
    };
}

interface BagPageProps extends PageProps {
    bagItems: BagItem[];
}

export default function Bag({ auth, bagItems }: BagPageProps) {
    // Calculate order totals
    const subtotal = bagItems.reduce((total, item) => {
        const itemPrice = item.sales_price || item.price;
        return total + (itemPrice * item.pivot.quantity);
    }, 0);

    const shipping = subtotal > 0 ? 50 : 0; 
    const grandTotal = subtotal + shipping;

    // Update item quantity
    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemove(productId);
            return;
        }
        router.patch(route('bag.update', productId), { quantity: newQuantity }, { preserveScroll: true });
    };

    // Remove item from bag
    const handleRemove = (productId: number) => {
        router.delete(route('bag.remove', productId), { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <Head title="Shopping Bag" />
            <Navbar user={auth.user}/>
            
            <main className="max-w-6xl mx-auto p-4 flex flex-col gap-8">
                {/* Header */}
                <h1 className="flex justify-center text-3xl font-bold text-gray-900">Shopping Bag</h1>
                {bagItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Bag items */}
                        <div className="flex-1 flex flex-col gap-4">

                            {/* Product card */}
                            {bagItems.map((item) => (
                                <div key={item.id} className="relative flex items-center gap-4 p-4 bg-white border border-rose-300 rounded-lg shadow-sm">
                                    
                                    <button 
                                        onClick={() => handleRemove(item.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <img 
                                        src={item.images?.[0] || '/placeholder.png'} 
                                        alt={item.name} 
                                        className="w-24 h-32 rounded object-cover bg-gray-100 shrink-0" 
                                    />

                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                                            <p className="mt-1 font-bold">
                                                ₹{item.sales_price || item.price}
                                                {item.sales_price && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">₹{item.price}</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Quantity of each */}
                                        <div className="flex items-center bg-white border border-gray-300 rounded-md shrink-0">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.pivot.quantity - 1)} className="w-8 h-8 font-bold hover:bg-gray-100">&minus;</button>
                                            <span className="w-10 text-center text-sm font-semibold">{item.pivot.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.pivot.quantity + 1)} className="w-8 h-8 font-bold hover:bg-gray-100">&#43;</button>
                                        </div>

                                        <div className="hidden sm:block text-right w-24 font-bold shrink-0">
                                            ₹{(item.sales_price || item.price) * item.pivot.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order summary */}
                        <div className="lg:w-96 shrink-0">
                            <div className="sticky top-28 p-6 bg-white border border-rose-300 rounded-lg shadow-sm flex flex-col gap-4">
                                <h2 className="text-xl font-bold">Order Summary</h2>
                                
                                <div className="flex flex-col gap-2 text-sm text-gray-600 border-b pb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({bagItems.reduce((acc, item) => acc + item.pivot.quantity, 0)} items)</span>
                                        <span className="font-medium text-gray-900">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">₹{shipping}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{grandTotal}</span>
                                </div>

                                {/* Checkout button */}
                                <Link href={route('checkout.index')}>
                                    <PrimaryButton className="w-full justify-center">Proceed to Checkout</PrimaryButton>
                                </Link>

                                <p className="text-xs text-center text-gray-400">Secure checkout. Payment options on next step.</p>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* Empty Bag */
                    <div className="text-center">
                        
                        <p className="text-gray-700">Looks like you haven't added anything to your bag yet.</p>
                        
                    </div>
                )}
            </main>
        </div>
    );
}