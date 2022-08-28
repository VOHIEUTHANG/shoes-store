export default async function deleteCartItemOnLick(_this, privateRequestHandler, formatToCurrency, successHandler) {
   const cartItem = $(_this).closest('.single-product-cart');
   const productItemID = _this.dataset.productId;
   let cartItemPrice = _this.dataset.cartPrice;
   let totalPrice = $('.cart-price h4').text();

   function convertFromStringToNumber(stringNumber) {
      const removeUnit = stringNumber.slice(0, stringNumber.length - 4);
      let numberArray = removeUnit.split('.');
      numberArray = numberArray.join('');
      return Number(numberArray);
   }
   cartItemPrice = convertFromStringToNumber(cartItemPrice);
   totalPrice = convertFromStringToNumber(totalPrice);
   const newPrice = totalPrice - cartItemPrice;
   $('.cart-price h4').text(formatToCurrency(newPrice));
   try {
      await privateRequestHandler(`/api/user/delete-cart-item/${productItemID}`, 'delete', {}, (data, status) => {
         if (data.status === 'success') {
            cartItem.remove();
            const currentCartCount = Number($('.shop-count.pink').text());
            $('.shop-count.pink').text(currentCartCount - 1);
            if ($('.cart-scroll-list').children().length === 0) {
               $('.cart-scroll-list').remove();
               $('.cart-foot').remove();
               $('.cart-dropdown')[0].innerHTML = `
                    <div style="flex-direction: column" class="d-flex justify-content-center align-items-center">
                       <i style="font-size: 4rem !important" class="ti-face-sad"> </i>
                       <p style="text-align: center; margin-top: 2rem" class="nothing-title">
                          Bạn không có sản phẩm nào trong giỏ hàng !
                       </p>
                    </div>
                 `;
            }
            successHandler && successHandler(productItemID);
         } else {
            toastr[data.status](data.message);
         }
      });
   } catch (error) {
      console.log('🚀 ~ file: foot.ejs ~ line 45 ~ error', error);
      toastr.error('Xóa sản phẩm xảy ra lỗi !');
   }
}
