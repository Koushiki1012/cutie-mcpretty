import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface WishlistProps {
    user : User | null;
}

export default function Wishlist ({ user } : WishlistProps) {
    const { wishlistCount = 0 } = usePage<PageProps & { wishlistCount: number }>().props;
    return (
        <div>
            <button className='relative text-gray-600 hover:text-black transition flex flex-col items-center group'>
                <div className='realtive'>
                    <img src='/heart.png' alt='wishlist' className='h-8 w-8 object-contain hover:opacity-80 transition cursor-pointer'/>
                    {wishlistCount > 0 && (
                    <span className='absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs pointer-events-none transition-all duration-300 scale-100'>
                        {wishlistCount}
                    </span>)}
                </div>
                <span className='text-gray-600 font-medium text-xs mt-0.5 group-hover:text-black transition'>
                    Wishlist
                </span>
            </button>
        </div>
        
    )


    
}
                    
                    
                    
                    
                    