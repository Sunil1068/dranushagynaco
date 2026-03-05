'use client';

import StarRating from './StarRating';
import { User, Stethoscope, Quote } from 'lucide-react';

interface TestimonialCardProps {
    patientName: string;
    condition: string;
    improvementLevel: number;
    satisfactionScore: number;
    comments?: string;
    createdAt: string;
}

export default function TestimonialCard({
    patientName,
    condition,
    improvementLevel,
    satisfactionScore,
    comments,
    createdAt,
}: TestimonialCardProps) {
    return (
        <div className="group relative bg-white rounded-2xl shadow-md border border-[#874B61]/10 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Decorative gradient corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#874B61]/5 to-transparent rounded-bl-full" />

            {/* Quote icon */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-10 w-10 text-[#874B61]" />
            </div>

            {/* Patient Info */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#874B61] to-[#B06E87] flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{patientName}</h3>
                    <p className="text-xs text-gray-400">
                        {new Date(createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            {/* Condition Badge */}
            <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F6EEDE] text-[#874B61] text-xs font-medium rounded-full">
                    <Stethoscope className="h-3 w-3" />
                    {condition}
                </span>
            </div>

            {/* Ratings */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Improvement</span>
                    <StarRating value={improvementLevel} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Satisfaction</span>
                    <StarRating value={satisfactionScore} size="sm" />
                </div>
            </div>

            {/* Comment */}
            {comments && (
                <div className="border-t border-[#874B61]/10 pt-3">
                    <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-3">
                        &ldquo;{comments}&rdquo;
                    </p>
                </div>
            )}
        </div>
    );
}
