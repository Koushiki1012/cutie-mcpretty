import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';
import Checkout from './Checkout';
import Searchbar from './Searchbar';
import Wishlist from './WishlistIcon';
import { usePage } from '@inertiajs/react';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
    const [isTraditionalOpen, setIsTraditionalOpen] = useState(false);
    const [isWesternOpen, setIsWesternOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className='fixed top-0 w-full z-50 flex justify-between items-center bg-gradient-to-r from-red-100 to-white p-3 shadow-sm'>
            <div className='flex items-center gap-8'>
                <Link href='/'>
                    <img src='/favicon.png' alt='Logo' className='h-10 w-auto' />
                </Link>
                
                <nav className=' hidden md:flex gap-8 items-center'>
                    <div 
                        className='relative'
                        onMouseEnter={() => setIsTraditionalOpen(true)}
                        onMouseLeave={() => setIsTraditionalOpen(false)}
                    >
                        <button className='font-medium text-gray-700 hover:text-black py-2'>
                            Traditional
                        </button>
                        
                        {isTraditionalOpen && (
                            <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden'>
                                <Link href='/traditional/festive' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Festive</Link>
                                <Link href='/traditional/classics' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Classics</Link>
                                <Link href='/traditional/fusion' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Fusion</Link>
                            </div>
                        )}
                    </div>
                    <div 
                        className='relative'
                        onMouseEnter={() => setIsWesternOpen(true)}
                        onMouseLeave={() => setIsWesternOpen(false)}
                    >
                        <button className='font-medium text-gray-700 hover:text-black py-2'>
                            Western
                        </button>
                        
                        {isWesternOpen && (
                            <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden'>
                                <Link href='/western/tops' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Tops</Link>
                                <Link href='/western/dresses' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Dresses</Link>
                                <Link href='/western/bottoms' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Skirts & Pants</Link>
                            </div>
                        )}
                    </div>
                    <div 
                        className='relative'
                        onMouseEnter={() => setIsAccessoriesOpen(true)}
                        onMouseLeave={() => setIsAccessoriesOpen(false)}
                    >
                        <button className='font-medium text-gray-700 hover:text-black py-2'>
                            Accessories
                        </button>
                        
                        {isAccessoriesOpen && (
                            <div className='absolute top-full left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden'>
                                <Link href='/accessories/purses' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Purses</Link>
                                <Link href='/accessories/footwear' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Footwear</Link>
                                <Link href='/accessories/scarves' className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Scarves</Link>
                            </div>
                        )}
                    </div>
                    <Link href='/bonus' className='font-medium text-rose-700 hover:text-rose-950'>Bonus</Link>
                </nav>
            </div>

            <div className='flex items-center gap-6'>
                <Searchbar user={user} />
                <Wishlist user={user} />
                <Checkout user={user} />
                    {user ? (
                        <Link href={route('dashboard')}>
                            <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain hover:opacity-80 transition cursor-pointer' />
                        </Link>
                    ) : (
                        <div className='flex gap-4 items-center relative'>
                            <div 
                                className='relative'
                                onMouseEnter={() => setIsProfileOpen(true)}
                                onMouseLeave={() => setIsProfileOpen(false)}
                            >
                                <button className='font-medium text-gray-700 hover:text-black py-2'>
                                    <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain hover:opacity-80 transition cursor-pointer' />
                                <span className='text-black-600 font-medium text-xs'>Profile</span>
                                </button>
                                
                                {isProfileOpen && (
                                    <div className='absolute top-full left-1/2 -translate-x-1/2 w-24 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden'>
                                        <Link href={route('login')} className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Log in</Link>
                                        <Link href={route('register')} className='block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black'>Sign up</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
        </header>
    );
}