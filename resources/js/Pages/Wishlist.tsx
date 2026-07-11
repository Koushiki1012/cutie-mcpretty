import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import ProductCarousal, { Product } from '@/Components/ProductCarousal';
import Navbar from '@/Components/Navbar';
import { Link } from '@inertiajs/react';

interface WishlistPageProps extends PageProps {
    wishlistItems: Product[];
    userBagQuantities?: Record<number, number>; 
}

export default function Wishlist({ auth, wishlistItems, userBagQuantities = {} }: WishlistPageProps) {
    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-32">
            <Head title="My Wishlist" />
            
            <Navbar user={auth.user}/>
            <main className="max-w-5xl mx-auto p-4 flex flex-col gap-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
                    <p className="text-gray-500">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length > 0 ? (
                    //product carousal
                    <div>
                        <ProductCarousal 
                            products={wishlistItems} 
                            userBagQuantities={userBagQuantities}
                        />
                    </div>
                ) : (
                    //empty wishlist
                    <div className="text-center">
                        <p className="text-gray-700">Browse products and add your favorites here.</p>
                    </div>
                )}
                
            </main>
        </div>
    );
}