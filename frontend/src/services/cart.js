// src/services/cart.js
const KEY = 'cart';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function write(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart_changed'));
}

export function getCart() { return read(); }
export const getItems = getCart;
export function clearCart() { write([]); }
export const clear = clearCart;

/** addItem(product, qty, size)  |  addItem(lineObject) */
export function addItem(input, qty = 1, size) {
  const cart = read();
  const isLine = input && (input.productId || input.price) && !input.images;
  let line;

  if (isLine) {
    const sizeVal = input.size ?? size ?? null;
    const qtyVal = Math.max(1, Number(input.qty ?? qty) || 1);
    const priceVal = Number(input.price || 0);
    line = {
      id: `${input.slug}__${sizeVal || ''}`,
      productId: input.productId ?? null,
      slug: input.slug,
      name: input.name,
      size: sizeVal,
      color: input.color || null,
      sku: input.sku || null,
      price: priceVal,
      qty: qtyVal,
      image: input.image || null,
    };
  } else {
    const priceVal = Number(input?.salePrice || input?.price || 0);
    const sizeVal = size || null;
    const qtyVal = Math.max(1, Number(qty) || 1);
    line = {
      id: `${input.slug}__${sizeVal || ''}`,
      productId: input?._id || input?.id || null,
      slug: input.slug,
      name: input.name,
      size: sizeVal,
      color: input.color || null,
      sku: input.sku || null,
      price: priceVal,
      qty: qtyVal,
      image: input?.images?.[0]?.url || input?.image || null,
    };
  }

  const i = cart.findIndex(x => x.id === line.id);
  if (i >= 0) {
    cart[i].qty = Math.min(99, (cart[i].qty || 1) + (line.qty || 1));
  } else {
    cart.push(line);
  }
  write(cart);
  return cart;
}

export function updateQty(id, qty) {
  const cart = read();
  const i = cart.findIndex(x => x.id === id);
  if (i >= 0) {
    cart[i].qty = Math.max(1, Math.min(99, Number(qty) || 1));
    write(cart);
  }
  return cart;
}

export function removeItem(id) {
  const cart = read().filter(x => x.id !== id);
  write(cart);
  return cart;
}

export function countItems() {
  return read().reduce((s, x) => s + Number(x.qty || 0), 0);
}
export function totalPrice() {
  return read().reduce((s, x) => s + Number(x.price || 0) * Number(x.qty || 0), 0);
}

const cartDefault = {
  add: addItem,
  addItem,
  getItems,
  getCart,
  clear: clearCart,
  clearCart,
  updateQty,
  remove: removeItem,
  removeItem,
  countItems,
  totalPrice,
};
export default cartDefault;
