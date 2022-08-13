import brandService from '../service/brand.service';
import categoryService from '../service/category.service';
import cartService from '../service/cart.service';

export default function headerWrapper(controllerFunction) {
   return async (req, res, next) => {
      try {
         const username = req.user?.userName;
         let cartList = undefined;
         if (username) {
            cartList = await cartService.getAllCartByUsername(username);
         }
         const brands = await brandService.getAllBrands();
         const categorys = await categoryService.getAllCategory();
         const brandNameList = brands.map((brand) => brand.brandName);
         const categoryNameList = categorys.map((category) => category.name);
         req.payload = { brandNameList, categoryNameList, cartList };
      } catch (error) {
         console.log('error', error);
         res.status(400).json({ status: 'Select brand or category occured error!' });
      }
      return controllerFunction(req, res, next);
   };
}

export function cartListWrapper(controllerFunction) {
   return async (req, res, next) => {
      if (username) {
      }
      return controllerFunction(req, res, next);
   };
}
