const localstorageInit = () => {
   const LOCAL_STORAGE_KEY = 'devostack_store';
   return {
      setStore(data) {
         window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      },
      getStore() {
         return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
      },
      clearStore() {
         window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      },
   };
};
const localStorage = localstorageInit();

function responseHandler(responseResult, successHandler) {
   const { data, status } = responseResult;
   switch (status) {
      case 200:
         successHandler(data);
         break;
      case 401:
         window.location.href = '/401';
         break;
      case 403:
         window.location.href = '/403';
         break;
      default:
         window.location.href = '/404';
   }
}

const getFormData = (formElement) => {
   const formData = {};
   if (formElement) {
      Array.from(formElement).map((item) => {
         if (!item.name) return null;
         formData[item.name] = item.value;
      });
   }
   return formData;
};

const configHeaders = (token, contentType) => {
   const headers = {};
   if (token) headers.Authorization = `Bearer ${token}`;
   if (contentType) headers['Content-Type'] = contentType;
   return {
      headers,
   };
};

const formatToCurrency = (amout) => amout.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });

export { responseHandler, localStorage, getFormData, formatToCurrency, configHeaders };
