import brandService from '../service/brand.service';
import categoryService from '../service/category.service';
import cartService from '../service/cart.service';
import formatCurrency from '../helpers/formatCurrency';

export default function headerWrapper(controllerFunction) {
   return async (req, res, next) => {
      try {
         const username = req.user?.userName;
         let cartList = undefined;
         if (username) {
            cartList = await cartService.getAllCartByUsername(username);

            const total = cartList.reduce((acc, cart) => {
               return !!cart.PRODUCT_ITEM.PRODUCT.discounts
                  ? acc +
                       Number(
                          Math.round(
                             (cart.PRODUCT_ITEM.PRODUCT.price *
                                (100 - cart.PRODUCT_ITEM.PRODUCT.discounts.percentReduction)) /
                                100,
                          ),
                       ) *
                          cart.quantity
                  : acc + cart.PRODUCT_ITEM.PRODUCT.price * cart.quantity;
            }, 0);

            const originPrice = cartList.reduce((acc, cart) => {
               return acc + cart.PRODUCT_ITEM.PRODUCT.price * cart.quantity;
            }, 0);

            const discountPrice = cartList.reduce((acc, cart) => {
               return !!cart.PRODUCT_ITEM.PRODUCT.discounts
                  ? acc +
                       Number(
                          Math.round(
                             (cart.PRODUCT_ITEM.PRODUCT.price * cart.PRODUCT_ITEM.PRODUCT.discounts.percentReduction) /
                                100,
                          ),
                       ) *
                          cart.quantity
                  : acc + 0;
            }, 0);

            cartList = cartList.map((cart) => {
               return {
                  ...cart,
                  PRODUCT_ITEM: {
                     ...cart.PRODUCT_ITEM,
                     PRODUCT: {
                        ...cart.PRODUCT_ITEM.PRODUCT,
                        price: formatCurrency(cart.PRODUCT_ITEM.PRODUCT.price * 1000),
                     },
                  },
               };
            });

            cartList.totalPrice = formatCurrency(total * 1000);
            cartList.originPrice = formatCurrency(originPrice * 1000);
            cartList.discountPrice = formatCurrency(discountPrice * 1000);

            console.log('cartList', cartList);
         }
         const brands = await brandService.getAllBrands();
         const categorys = await categoryService.getAllCategory();
         req.payload = { brands, categorys, cartList };
      } catch (error) {
         console.log('error', error);
         res.status(400).json({ status: 'Select brand or category occured error!' });
      }
      return controllerFunction(req, res, next);
   };
}
