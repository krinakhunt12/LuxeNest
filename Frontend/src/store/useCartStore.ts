import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartData {
    items: CartItem[];
}

interface CartState {
    // Store items for all accounts: { [userId: string]: CartItem[] }
    allCarts: Record<string, CartItem[]>;
    currentUserId: string; // 'guest' or actual userId

    // Actions
    setUserId: (userId: string | null) => void;
    getItems: () => CartItem[];
    addItem: (product: Product, quantity?: number, color?: string) => void;
    removeItem: (productId: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, color?: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            allCarts: { guest: [] },
            currentUserId: 'guest',

            setUserId: (userId: string | null) => {
                const id = userId || 'guest';
                set((state) => {
                    const newAllCarts = { ...state.allCarts };
                    if (!newAllCarts[id]) {
                        newAllCarts[id] = [];
                    }
                    return { currentUserId: id, allCarts: newAllCarts };
                });
            },

            getItems: () => {
                const state = get();
                return state.allCarts[state.currentUserId] || [];
            },

            addItem: (product: Product, quantity = 1, color = '') => {
                set((state) => {
                    const userId = state.currentUserId;
                    const currentItems = state.allCarts[userId] || [];
                    const existingItemIndex = currentItems.findIndex(
                        (item) => item.id === product.id && item.selectedColor === color
                    );

                    let newItems;
                    if (existingItemIndex > -1) {
                        newItems = [...currentItems];
                        newItems[existingItemIndex].quantity += quantity;
                    } else {
                        newItems = [...currentItems, { ...product, quantity, selectedColor: color }];
                    }

                    return {
                        allCarts: {
                            ...state.allCarts,
                            [userId]: newItems,
                        },
                    };
                });
            },

            removeItem: (productId: string, color = '') => {
                set((state) => {
                    const userId = state.currentUserId;
                    const currentItems = state.allCarts[userId] || [];
                    const newItems = currentItems.filter(
                        (item) => !(item.id === productId && item.selectedColor === color)
                    );

                    return {
                        allCarts: {
                            ...state.allCarts,
                            [userId]: newItems,
                        },
                    };
                });
            },

            updateQuantity: (productId: string, quantity: number, color = '') => {
                set((state) => {
                    const userId = state.currentUserId;
                    const currentItems = state.allCarts[userId] || [];
                    const newItems = currentItems.map((item) =>
                        item.id === productId && item.selectedColor === color
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    );

                    return {
                        allCarts: {
                            ...state.allCarts,
                            [userId]: newItems,
                        },
                    };
                });
            },

            clearCart: () => {
                set((state) => ({
                    allCarts: {
                        ...state.allCarts,
                        [state.currentUserId]: [],
                    },
                }));
            },

            getTotalItems: () => {
                const items = get().allCarts[get().currentUserId] || [];
                return items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                const items = get().allCarts[get().currentUserId] || [];
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'luxenest-cart-v2',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
