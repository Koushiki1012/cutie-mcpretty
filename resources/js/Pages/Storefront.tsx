import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Carousel } from 'flowbite-react';
import ProductCarousel from '@/Components/ProductCarousal';

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
    console.log("REACT IS RECEIVING:", products);
    return (
        <div className="flex flex-col min-h-screen bg-white-50">
            <Head title="Welcome to Cutie McPretty" />
            
            {/* Navbar */}
            <Navbar user={auth.user} />

            <main className="flex-grow max-w mx-auto p-8 pt-32">
                <h1 className="flex justify-center text-4xl font-bold mb-8">Featured Drops</h1>
                
                {/* Products */}
                {/* <ProductCarousel products={products} /> */}
            </main>
            {/* Footer */}
            <Footer user={auth.user}/>
        </div>
    );
}