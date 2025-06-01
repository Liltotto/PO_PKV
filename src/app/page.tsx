import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function HomePage() {
    const { userId } = auth();
    if (userId != null) redirect('/events');

    return (
        <div className="text-center container my-4 mx-auto">
            <h1 className="text-3xl mb-4">Главная страница</h1>
            <div className="flex gap-2 justify-center">
                <Button asChild>
                    <SignInButton />
                </Button>
                <Button asChild>
                    <SignUpButton />
                </Button>
                <UserButton />
            </div>
        </div>
    );
}

// import React from 'react';
// import styles from './Button.module.css';

// interface ButtonProps {
//     children: React.ReactNode;
//     onClick?: () => void;
//     disabled?: boolean;
//     variant?: 'primary' | 'secondary' | 'danger';
//     size?: 'small' | 'medium' | 'large';
//     isLoading?: boolean;
// }

// const EventForm: React.FC<ButtonProps> = ({
//     children,
//     onClick,
//     disabled = false,
//     variant = 'primary',
//     size = 'medium',
//     isLoading = false,
// }) => {
//     const buttonClasses = [
//         styles.button,
//         styles[`variant-${variant}`],
//         styles[`size-${size}`],
//         disabled ? styles.disabled : '',
//         isLoading ? styles.loading : '',
//     ].join(' ');

//     return (
//         <button
//             className={buttonClasses}
//             onClick={onClick}
//             disabled={disabled || isLoading}
//             aria-busy={isLoading}
//         >
//             {isLoading ? 'Loading...' : children}
//         </button>
//     );
// };

// export default EventForm;