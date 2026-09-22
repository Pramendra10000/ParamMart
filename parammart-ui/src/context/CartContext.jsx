import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCart,
  addToCart as addToCartApi,
  updateCartQuantity,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartInitialized, setCartInitialized] = useState(false);

  // =========================================================
  // NORMALIZE BACKEND CART
  // =========================================================

  const normalizeCart = (response) => {
    const cart = response?.data ?? response;

    if (!cart || !Array.isArray(cart.cartItems)) {
      return [];
    }

    return cart.cartItems.map((item) => ({
      id: item.id,
      product: {
        id: item.productId,
        name: item.productName,
        price: Number(item.price) || 0,
        stock: undefined,
      },
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      totalPrice: Number(item.totalPrice) || 0,
    }));
  };

  // =========================================================
  // LOAD CART FROM BACKEND
  // =========================================================

  const loadCart = async () => {
    try {
      setCartLoading(true);

      console.log("=================================");
      console.log("LOADING CART FROM BACKEND");
      console.log("=================================");

      const response = await getCart();

      console.log("GET CART RESPONSE:", response);

      const normalizedItems = normalizeCart(response);

      console.log("NORMALIZED CART ITEMS:", normalizedItems);

      setCartItems(normalizedItems);
    } catch (error) {
      console.error("FAILED TO LOAD CART:", error);

      // If cart does not exist yet, treat it as empty.
      if (error?.response?.status === 404) {
        setCartItems([]);
      } else {
        setCartItems([]);
      }
    } finally {
      setCartLoading(false);
      setCartInitialized(true);
    }
  };

  // =========================================================
  // INITIAL CART LOAD
  // =========================================================

  useEffect(() => {
    loadCart();
  }, []);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = async (product, quantity = 1) => {
    if (!product?.id) {
      throw new Error("Invalid product.");
    }

    const requestedQuantity =
      Math.max(1, Number(quantity) || 1);

    try {
      console.log("=================================");
      console.log("ADDING PRODUCT TO CART");
      console.log("Product:", product);
      console.log("Product ID:", product.id);
      console.log("Quantity:", requestedQuantity);
      console.log("=================================");

      const response = await addToCartApi(
        product.id,
        requestedQuantity
      );

      console.log("ADD TO CART RESPONSE:", response);

      const normalizedItems = normalizeCart(response);

      setCartItems(normalizedItems);

      return response;
    } catch (error) {
      console.error("ADD TO CART FAILED:", error);
      throw error;
    }
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    const requestedQuantity = Number(quantity);

    if (!productId) {
      throw new Error("Product ID is required.");
    }

    if (
      !Number.isFinite(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      throw new Error(
        "Quantity must be greater than zero."
      );
    }

    try {
      const response = await updateCartQuantity(
        productId,
        requestedQuantity
      );

      console.log(
        "UPDATE CART RESPONSE:",
        response
      );

      const normalizedItems = normalizeCart(response);

      setCartItems(normalizedItems);

      return response;
    } catch (error) {
      console.error(
        "UPDATE CART QUANTITY FAILED:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = async (productId) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.product.id === productId
    );

    if (!item) {
      return;
    }

    const newQuantity = item.quantity + 1;

    return updateQuantity(
      productId,
      newQuantity
    );
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      return;
    }

    const newQuantity = item.quantity - 1;

    return updateQuantity(
      productId,
      newQuantity
    );
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeFromCart = async (productId) => {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    try {
      const response =
        await removeCartItem(productId);

      console.log(
        "REMOVE CART ITEM RESPONSE:",
        response
      );

      // Remove locally immediately after backend success.
      setCartItems((previousItems) =>
        previousItems.filter(
          (item) =>
            item.product.id !== productId
        )
      );

      return response;
    } catch (error) {
      console.error(
        "REMOVE CART ITEM FAILED:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = async () => {
    try {
      const response = await clearCartApi();

      console.log(
        "CLEAR CART RESPONSE:",
        response
      );

      setCartItems([]);

      return response;
    } catch (error) {
      console.error(
        "CLEAR CART FAILED:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // CHECK PRODUCT IN CART
  // =========================================================

  const isInCart = (productId) => {
    return cartItems.some(
      (item) =>
        item.product.id === productId
    );
  };

  // =========================================================
  // GET PRODUCT QUANTITY
  // =========================================================

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.product.id === productId
    );

    return item?.quantity || 0;
  };

  // =========================================================
  // TOTAL ITEM QUANTITY
  // =========================================================

  const cartItemCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + (Number(item.quantity) || 0),
      0
    );
  }, [cartItems]);

  // =========================================================
  // NUMBER OF DIFFERENT PRODUCTS
  // =========================================================

  const cartProductCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  // =========================================================
  // CART SUBTOTAL
  // =========================================================

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price =
          Number(item.price) ||
          Number(item.product?.price) ||
          0;

        const quantity =
          Number(item.quantity) || 0;

        return total + price * quantity;
      },
      0
    );
  }, [cartItems]);

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    cartItems,
    cartItemCount,
    cartProductCount,
    cartSubtotal,

    cartLoading,
    cartInitialized,

    loadCart,

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
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// =========================================================
// USE CART HOOK
// =========================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}