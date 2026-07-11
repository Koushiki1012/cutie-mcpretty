import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import ProductCarousal from '@/Components/ProductCarousal';
import Navbar from '@/Components/Navbar';

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

interface SearchProps extends PageProps {
    products: Product[];
    searchQuery: string;
}

export default function Search({ auth,products, searchQuery }: SearchProps) {
    return (
        <div className="min-h-screen bg-white pt-40 pb-6">
            <Head title={`Search Results for "${searchQuery}"`} />
            <Navbar user={auth.user} />
            <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl text-gray-900 font-bold mb-2">Search Results</h1>
                    <p className="text-gray-500">
                        {products.length} {products.length === 1 ? 'result' : 'results'} found for <span className="text-gray-900 font-bold">"{searchQuery}"</span>
                    </p>
                </div>

                {products.length > 0 ? (
                    //display products
                    <div className="flex flex-wrap justify-center gap-6 m-4 pb-4">
                        <ProductCarousal products={products} />
                    </div>
                    
                ) : (
                    //invalid search
                    <div className="text-center py-20">
                        <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <h2 className="text-lg font-medium text-gray-900">No products found</h2>
                        <p className="text-gray-500 mt-2">Try checking for typos or searching for a different term.</p>
                        <Link href="/" className="mt-6 inline-block text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1">
                            Clear Search
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}