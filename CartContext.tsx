import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface Cart {
    [restaurantId: string]: CartItem[];
}

interface CartContextType {
    cart: Cart;
    addItemToCart: (product: Product, restaurantId: string) => void;
    clearCart: () => void;
    getItemsNumber: () => number;
    getCartPrice: () => number;
    getCartPriceById: (restaurantId: string) => number;
    getRestaurantCart: (restaurantId: string) => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart>({});

    const addItemToCart = (product: Product, restaurantId: string) => {
        setCart((prevCart) => {
            const existingCart = prevCart[restaurantId] || [];
            const existingItem = existingCart.find(item => item.id === product.id);

            if (existingItem) {
                return {
                    ...prevCart,
                    [restaurantId]: existingCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...prevCart,
                    [restaurantId]: [...existingCart, { ...product, quantity: 1 }],
                };
            }
        });
    };

    const getItemsNumber = () => {
        return Object.values(cart).flat().reduce((total, item) => total + item.quantity, 0);
    };

    const getCartPrice = () => {
        return Object.values(cart).flat().reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartPriceById = (restaurantId: string) => {
        const restaurantCart = cart[restaurantId] || [];
        return restaurantCart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getRestaurantCart = (restaurantId: string) => {
        return cart[restaurantId] || [];
    };

    const clearCart = () => setCart({});

    useEffect(() => {
        console.log("Nouveau panier mis à jour: ", cart);
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addItemToCart, clearCart, getItemsNumber, getCartPrice, getRestaurantCart, getCartPriceById }}>
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
