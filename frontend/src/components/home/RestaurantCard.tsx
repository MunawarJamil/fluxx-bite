import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

interface RestaurantCardProps {
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    distance: string;
    categories: string[];
    isOpen: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
    name,
    image,
    rating,
    deliveryTime,
    distance,
    categories,
    isOpen,
}) => {
    return (
        <div className="group relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-[#c5a059]/50 transition-all duration-500 flex flex-col shadow-2xl">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Dark Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                {/* Status Tag */}
                <div className="absolute top-6 left-6">
                    {isOpen ? (
                        <span className="px-3 py-1 bg-green-500/80 backdrop-blur-md text-white text-[8px] font-black rounded-full shadow-xl uppercase tracking-widest border border-white/10">OPEN</span>
                    ) : (
                        <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-[8px] font-black rounded-full shadow-xl uppercase tracking-widest border border-white/10">CLOSED</span>
                    )}
                </div>

                {/* Centered Name and Categories Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white font-serif tracking-widest mb-3 group-hover:text-[#c5a059] transition-colors duration-500 line-clamp-2 uppercase">
                        {name}
                    </h3>
                    <div className="h-px w-12 bg-[#c5a059]/50 mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <p className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">
                        {categories.join(' • ')}
                    </p>
                </div>
            </div>

            {/* Info Section (Similar to CuisineCategories stats) */}
            <div className="p-5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5 text-[#c5a059]">
                        <Star className="w-3.5 h-3.5 fill-[#c5a059]" />
                        <span>{rating}</span>
                    </div>
                    <span className="text-slate-500 text-[8px]">Rating</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5 text-[#c5a059]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{deliveryTime.split(' ')[0]}</span>
                    </div>
                    <span className="text-slate-500 text-[8px]">Mins</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5 text-[#c5a059]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{distance.split(' ')[0]}</span>
                    </div>
                    <span className="text-slate-500 text-[8px]">KM</span>
                </div>
            </div>
        </div>
    );
};


export default RestaurantCard;

