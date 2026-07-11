import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface NavbarProps {
    user: User | null;
}

interface CustomPageProps extends PageProps {
    wishlistCount: number;
    bagCount: number;
}

export default function Navbar({ user }: NavbarProps) {
    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
    const [isTraditionalOpen, setIsTraditionalOpen] = useState(false);
    const [isWesternOpen, setIsWesternOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const { wishlistCount = 0, bagCount = 0 } = usePage<CustomPageProps>().props;

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery });
        }
    };

    return (
        <header className='fixed top-0 w-full z-50 flex justify-between items-center bg-gradient-to-r from-red-100 to-white p-6 shadow-sm'>
            
            <div className='flex items-center gap-8'>
                <Link href='/'>
                    <img src='/favicon.png' alt='Logo' className='h-10 w-auto' />
                </Link>
                
                {/* Product pages */}
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
                                <Link href='/traditional/festive' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Festive Kurta Sets</Link>
                                <Link href='/traditional/classics' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Cotton Kurta Sets</Link>
                                <Link href='/traditional/fusion' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Short Kurtis</Link>
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
                                <Link href='/western/tops' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Shirts & Tshirts</Link>
                                <Link href='/western/dresses' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Dresses & more</Link>
                                <Link href='/western/bottoms' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Skirts & Pants</Link>
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
                                <Link href='/accessories/purses' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Purses</Link>
                                <Link href='/accessories/footwear' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Footwear</Link>
                                <Link href='/accessories/scarves' className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Scarves</Link>
                            </div>
                        )}
                    </div>
                    <Link href='/bonus' className='font-medium text-rose-700 hover:text-rose-950'>Gift Shop</Link>
                </nav>
            </div>

            {/* Searchbar */}
            <div className='flex items-center gap-6'>
                <form 
                    onSubmit={handleSearch} 
                    className='flex items-center border pl-4 gap-2 border-rose-300 h-[46px] rounded-full overflow-hidden w-[400px] '
                >
                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 30 30' fill='#6B7280'>
                        <path d='M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8'/>
                    </svg>
                    
                    <input 
                        type='text' 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search...' 
                        className='w-full h-full border-none outline-none focus:ring-0 text-gray-700 bg-transparent placeholder-gray-400 text-sm pr-4' 
                    />
                </form>
                
                {/* Wishlist */}
                <Link 
                    href={route('wishlist.index')} 
                    className="relative text-gray-600 hover:text-black transition flex flex-col items-center group"
                >
                    <div className="relative">
                        <img src="/heart.png" alt="wishlist" className="h-8 w-8 object-contain cursor-pointer" />
                        
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                {wishlistCount}
                            </span>
                        )}
                    </div>
                    <span className="text-gray-600 font-medium text-xs mt-0.5 group-hover:text-black transition">
                        Wishlist
                    </span>
                </Link>

                {/* Bag */}
                <Link 
                    href="/bag" 
                    className="relative text-gray-600 hover:text-black transition flex flex-col items-center group"
                >
                    <div className="relative">
                        <img 
                            src="/shopping.png" 
                            alt="Shopping Bag" 
                            className="h-8 w-8 object-contain hover:opacity-80 transition cursor-pointer" 
                        />
                        {bagCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs pointer-events-none transition-all duration-300 scale-100">
                                {bagCount}
                            </span>
                        )}
                    </div>
                    <span className="text-gray-600 font-medium text-xs mt-0.5 group-hover:text-black transition">
                        Bag
                    </span>
                </Link>

                {/* Profile Section */}
                {user ? (
                    <Link href={route('dashboard')} className="flex flex-col items-center group">
                        <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain hover:opacity-80 transition cursor-pointer' />
                        <span className='text-gray-600 group-hover:text-black font-medium text-xs mt-1 transition'>Profile</span>
                    </Link>
                ) : (
                    <div className='flex gap-4 items-center relative'>
                        <div 
                            className='relative flex flex-col items-center'
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button className='flex flex-col items-center text-gray-600 hover:text-black transition'>
                                <img src='/user.png' alt='Profile' className='h-7 w-7 object-contain cursor-pointer' />
                                <span className='font-medium text-xs mt-1'>Profile</span>
                            </button>
                            
                            {isProfileOpen && (
                                <div className='absolute top-full right-0 w-24 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden'>
                                    <Link href={route('login')} className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Log in</Link>
                                    <Link href={route('register')} className='block px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-black'>Sign up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}