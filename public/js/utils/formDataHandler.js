export const getFormData = (formElement) => {
   const formData = {};
   if (formElement) {
      Array.from(formElement).map((item) => {
         if (!item.name) return null;
         formData[item.name] = item.value;
      });
   }
   return formData;
};
