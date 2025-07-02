import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: any;
    description: string;
    volume?: number;
    calories: number;
    ingredients: string[];
    quantity?: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface RestaurantInfo {
    name: string;
    id: string;
}

interface Cart {
    [restaurantId: string]: {
        restaurantInfo: RestaurantInfo;
        items: CartItem[];
    };
}

interface CartContextType {
    cart: Cart;
    addItemToCart: (product: Product, restaurantName: string, restaurantId: string) => void;
    clearCart: () => void;
    getItemsNumber: () => number;
    getCartPrice: () => number;
    getCartPriceById: (restaurantId: string) => number;
    getRestaurantCart: (restaurantId: string) => CartItem[];
    removeItemFromCart: (productId: string, restaurantId: string) => void;
    clearRestaurantCart: (restaurantId: string) => void;
    updateItemQuantity: (productId: string, restaurantId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart>({});

    const addItemToCart = (product: Product, restaurantName: string, restaurantId: string) => {
        setCart((prevCart) => {
            const existingCart = prevCart[restaurantId]?.items || [];
            const existingItem = existingCart.find(item => item.id === product.id);

            if (existingItem) {
                return {
                    ...prevCart,
                    [restaurantId]: {
                        restaurantInfo: { name: restaurantName, id: restaurantId },
                        items: existingCart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    },
                };
            } else {
                return {
                    ...prevCart,
                    [restaurantId]: {
                        restaurantInfo: { name: restaurantName, id: restaurantId },
                        items: [...existingCart, { ...product, quantity: 1 }],
                    },
                };
            }
        });
    };

    const getItemsNumber = () => {
        return Object.values(cart).flatMap(restaurant => restaurant.items).reduce((total, item) => total + item.quantity, 0);
    };

    const getCartPrice = () => {
        return Object.values(cart).flatMap(restaurant => restaurant.items).reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartPriceById = (restaurantId: string) => {
        const restaurantCart = cart[restaurantId]?.items || [];
        return restaurantCart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getRestaurantCart = (restaurantId: string) => {
        return cart[restaurantId]?.items || [];
    };

    const clearCart = () => setCart({});

    const removeItemFromCart = (productId: string, restaurantId: string) => {
        setCart((prevCart) => {
            const existingCart = prevCart[restaurantId]?.items || [];
            const updatedCart = existingCart.filter(item => item.id !== productId);

            if (updatedCart.length > 0) {
                return { ...prevCart, [restaurantId]: { ...prevCart[restaurantId], items: updatedCart } };
            } else {
                const { [restaurantId]: _, ...rest } = prevCart;
                return rest;
            }
        });
    };

    const clearRestaurantCart = (restaurantId: string) => {
        setCart((prevCart) => {
            const { [restaurantId]: _, ...rest } = prevCart;
            return rest;
        });
    };

    const updateItemQuantity = (productId: string, restaurantId: string, quantity: number) => {
        setCart((prevCart) => {
            const existingCart = prevCart[restaurantId]?.items || [];
            return {
                ...prevCart,
                [restaurantId]: {
                    ...prevCart[restaurantId],
                    items: existingCart.map(item =>
                        item.id === productId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                },
            };
        });
    };


    const contextValue = useMemo(() => ({
        cart,
        addItemToCart,
        clearCart,
        getItemsNumber,
        getCartPrice,
        getRestaurantCart,
        getCartPriceById,
        removeItemFromCart,
        clearRestaurantCart,
        updateItemQuantity,
    }), [cart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
