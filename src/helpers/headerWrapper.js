import brandService from '../service/brand.service';
import categoryService from '../service/category.service';

export default function headerWrapper(controllerFunction) {
   return async (req, res, next) => {
      try {
         const brands = await brandService.getAllBrands();
         const categorys = await categoryService.getAllCategory();
         const brandNameList = brands.map((brand) => brand.brandName);
         const categoryNameList = categorys.map((category) => category.name);
         req.payload = { brandNameList, categoryNameList };
      } catch (error) {
         console.log('error', err);
         res.status(400).json({ status: 'Select brand or category occured error!' });
      }
      return controllerFunction(req, res, next);
   };
}
