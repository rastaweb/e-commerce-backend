export const generateFinalPrice = (price: number, discount: number) => {
    return discount ? price - (price * (discount / 100)) : price;
}