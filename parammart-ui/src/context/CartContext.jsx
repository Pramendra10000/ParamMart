import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "parammart_cart";

// =========================================================
// CART PROVIDER
// =========================================================

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!storedCart) {
        return [];
      }

      const parsedCart =
        JSON.parse(storedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  // =======================================================
  // SAVE CART TO LOCAL STORAGE
  // =======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems]);

  // =======================================================
  // ADD TO CART
  // =======================================================

  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product?.id) {
      throw new Error(
        "Invalid product."
      );
    }

    const requestedQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      );

    setCartItems((previousItems) => {
      const existingItem =
        previousItems.find(
          (item) =>
            item.product.id ===
            product.id
        );

      // -----------------------------------------------
      // PRODUCT ALREADY EXISTS
      // -----------------------------------------------

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity +
            requestedQuantity,
          Number(product.stock) ||
            existingItem.quantity +
              requestedQuantity
        );

        return previousItems.map(
          (item) =>
            item.product.id ===
            product.id
              ? {
                  ...item,
                  product,
                  quantity:
                    newQuantity,
                }
              : item
        );
      }

      // -----------------------------------------------
      // NEW PRODUCT
      // -----------------------------------------------

      const safeQuantity = Math.min(
        requestedQuantity,
        Number(product.stock) ||
          requestedQuantity
      );

      return [
        ...previousItems,
        {
          product,
          quantity: safeQuantity,
        },
      ];
    });
  };

  // =======================================================
  // UPDATE QUANTITY
  // =======================================================

  const updateQuantity = (
    productId,
    quantity
  ) => {
    const requestedQuantity = Number(
      quantity
    );

    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if (
          item.product.id !==
          productId
        ) {
          return item;
        }

        const stock =
          Number(item.product.stock) ||
          requestedQuantity;

        const safeQuantity = Math.max(
          1,
          Math.min(
            requestedQuantity,
            stock
          )
        );

        return {
          ...item,
          quantity: safeQuantity,
        };
      })
    );
  };

  // =======================================================
  // INCREASE QUANTITY
  // =======================================================

  const increaseQuantity = (
    productId
  ) => {
    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if (
          item.product.id !==
          productId
        ) {
          return item;
        }

        const stock =
          Number(item.product.stock) ||
          item.quantity;

        if (
          item.quantity >= stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  // =======================================================
  // DECREASE QUANTITY
  // =======================================================

  const decreaseQuantity = (
    productId
  ) => {
    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if (
          item.product.id !==
          productId
        ) {
          return item;
        }

        if (item.quantity <= 1) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity - 1,
        };
      })
    );
  };

  // =======================================================
  // REMOVE FROM CART
  // =======================================================

  const removeFromCart = (
    productId
  ) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          item.product.id !==
          productId
      )
    );
  };

  // =======================================================
  // CLEAR CART
  // =======================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // =======================================================
  // CHECK WHETHER PRODUCT IS IN CART
  // =======================================================

  const isInCart = (productId) => {
    return cartItems.some(
      (item) =>
        item.product.id ===
        productId
    );
  };

  // =======================================================
  // GET PRODUCT QUANTITY
  // =======================================================

  const getCartItemQuantity = (
    productId
  ) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.product.id ===
        productId
    );

    return item?.quantity || 0;
  };

  // =======================================================
  // TOTAL ITEM COUNT
  // =======================================================

  const cartItemCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  // =======================================================
  // UNIQUE PRODUCT COUNT
  // =======================================================

  const cartProductCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  // =======================================================
  // CART SUBTOTAL
  // =======================================================

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price =
          Number(
            item.product.price
          ) || 0;

        return (
          total +
          price * item.quantity
        );
      },
      0
    );
  }, [cartItems]);

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const value = {
    cartItems,

    cartItemCount,
    cartProductCount,
    cartSubtotal,

    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,

    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================================================
// CART HOOK
// =========================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}