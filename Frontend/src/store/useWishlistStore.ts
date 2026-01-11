import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
    allWishlists: Record<string, Product[]>;
    currentUserId: string;

    setUserId: (userId: string | null) => void;
    getItems: () => Product[];
    toggleItem: (product: Product) => void;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            allWishlists: { guest: [] },
            currentUserId: 'guest',

            setUserId: (userId: string | null) => {
                const id = userId || 'guest';
                set((state) => {
                    const newAllWishlists = { ...state.allWishlists };
                    if (!newAllWishlists[id]) {
                        newAllWishlists[id] = [];
                    }
                    return { currentUserId: id, allWishlists: newAllWishlists };
                });
            },

            getItems: () => {
                const state = get();
                return state.allWishlists[state.currentUserId] || [];
            },

            toggleItem: (product: Product) => {
                const isInWishlist = get().isInWishlist(product.id);
                if (isInWishlist) {
                    get().removeItem(product.id);
                } else {
                    get().addItem(product);
                }
            },

            addItem: (product: Product) => {
                set((state) => {
                    const userId = state.currentUserId;
                    const currentItems = state.allWishlists[userId] || [];
                    if (currentItems.some((item) => item.id === product.id)) {
                        return state;
                    }
                    return {
                        allWishlists: {
                            ...state.allWishlists,
                            [userId]: [...currentItems, product],
                        },
                    };
                });
            },

            removeItem: (productId: string) => {
                set((state) => {
                    const userId = state.currentUserId;
                    const currentItems = state.allWishlists[userId] || [];
                    return {
                        allWishlists: {
                            ...state.allWishlists,
                            [userId]: currentItems.filter((item) => item.id !== productId),
                        },
                    };
                });
            },

            isInWishlist: (productId: string) => {
                const items = get().allWishlists[get().currentUserId] || [];
                return items.some((item) => item.id === productId);
            },

            clearWishlist: () => {
                set((state) => ({
                    allWishlists: {
                        ...state.allWishlists,
                        [state.currentUserId]: [],
                    },
                }));
            },
        }),
        {
            name: 'luxenest-wishlist-v2',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
