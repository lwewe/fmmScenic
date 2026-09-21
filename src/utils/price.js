// price.js
export const PRICE_INCREASE_RATE = 1.1; // 价格增加10%

export function calculatePrice(price) {
    if (!price || price === '0' || price === 0) return '0.00';
    const originalPrice = typeof price === 'string' ? parseFloat(price) : price;
    return (originalPrice * PRICE_INCREASE_RATE).toFixed(2);
}

export function formatPrice(price) {
    return `￥${price}`;
}

export function calculateTotalPrice(unitPrice, quantity) {
    const increasedUnitPrice = calculatePrice(unitPrice);
    return (parseFloat(increasedUnitPrice) * quantity).toFixed(2);
}