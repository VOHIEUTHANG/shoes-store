new Glide('.glide', {
   type: 'carousel',
   autoplay: 5000,
   hoverpause: true,
}).mount();

new Glide('.glide.category-product', {
   type: 'carousel',
   perView: 4,
   gap: 20,
}).mount();
