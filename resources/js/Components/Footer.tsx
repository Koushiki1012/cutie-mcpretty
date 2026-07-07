import { User } from '@/types';

interface FooterProps {
    user: User | null;
}

export default function Footer({ user }: FooterProps) {

    return (
        <footer className='flex justify-center bg-gradient-to-l from-red-100 p-6' >
            <p>Images courtesy of{' '}
                <a 
                    href="https://www.pexels.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:text-gray-900"
                >
                    Pexels
                </a></p>
        </footer>
    );
}