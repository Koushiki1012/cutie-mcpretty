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
        <div className="min-h-screen bg-gray-50 pb-8 pt-[18px] md:pb-12 md:pt-[28px]">
            <Head title="My Wishlist" />
            
            <Navbar user={auth.user}/>
            <main className="max-w-6xl mx-auto px-3 pb-4 md:px-4 md:pb-4 flex flex-col ">
                <div className="text-center">
                    <h1 className="flex justify-center text-[22.5px] md:text-[36px] font-bold text-gray-900 mb-[18px] md:mb-[28px]">My Wishlist</h1>
                    <p className="text-sm md:text-base text-gray-500">
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
                        <p className="text-sm md:text-base text-gray-700">Browse products and add your favorites here.</p>
                    </div>
                )}
                
            </main>
        </div>
    );
}