import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Carousel } from 'flowbite-react';
import React from 'react';
import GeminiChat from '@/Components/GeminiChat';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number ;
    sales_price?: number ;
    images: string[];
}
interface CarouselProps{
    products: Product[];
} 
interface StorefrontProps extends PageProps {
    products: Product[];
}

export default function Storefront({ auth, products }: StorefrontProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white-50">
            <Head title="Welcome to Cutie McPretty" />
            
            {/* Navbar */}
            <Navbar user={auth.user} />

            <main className="flex-grow w-full pt-0">
                {/* Banner Images */}
                <div className="w-full h-[40vh] sm:h-[50vh] md:h-[80vh] [&_.rounded-lg]:rounded-none"> {/* Override Flowbite's default rounded corners */}
                    <Carousel>
                        <img 
                            src="/images/e-traditional.png" 
                            alt="wome in traditional" 
                            className="w-full h-full object-contain md:object-cover object-center md:object-top" 
                        />
                        <img 
                            src="/images/e-western.png" 
                            alt="women in western" 
                            className="w-full h-full object-contain md:object-cover object-center md:object-top"
                        />
                    </Carousel>
                </div>
                
                {/* Gemini Chat */}
                <GeminiChat products={products} />
                
            </main>
            {/* Footer */}
            <div className='pt-'>
                <Footer user={auth.user}/>
            </div>
            
        </div>
    );
}
