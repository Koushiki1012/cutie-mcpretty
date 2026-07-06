import { Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

interface CustomPageProps extends PageProps {
    bagCount: number;
}

interface CheckoutProps {
    user: User | null;
}

export default function Checkout({ user }: CheckoutProps) {
    const { bagCount = 0 } = usePage<CustomPageProps>().props;

    return (
        <div>
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
        </div>            
    );
}