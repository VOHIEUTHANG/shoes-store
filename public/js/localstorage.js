const localstorage = () => {
   const LOCAL_STORAGE_KEY = 'devostack_store';
   return {
      setStore(data) {
         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      },
      getStore() {
         return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      },
      clearStore() {
         localStorage.removeItem(LOCAL_STORAGE_KEY);
      },
   };
};

export default localstorage();
