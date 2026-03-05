'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    interactive?: boolean;
}

const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
};

export default function StarRating({
    value,
    onChange,
    max = 5,
    size = 'md',
    label,
    interactive = false,
}: StarRatingProps) {
    return (
        <div>
            {label && (
                <p className="text-sm font-medium text-gray-700 mb-2">
                    {label}: <span className="text-[#874B61] font-bold">{value}/{max}</span>
                </p>
            )}
            <div className="flex gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => interactive && onChange?.(n)}
                        className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                            } ${value >= n ? 'text-yellow-400' : 'text-gray-300'}`}
                        disabled={!interactive}
                    >
                        <Star
                            className={`${sizeMap[size]} ${value >= n ? 'fill-yellow-400' : ''}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
