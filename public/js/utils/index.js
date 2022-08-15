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
         return successHandler(data);
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

const refreshTokenHandler = async (status) => {
   const { refreshToken } = localStorage.getStore();
   switch (status) {
      case 200:
         return true;
      case 403:
         // token expired
         const refreshTokenResponse = await axios.post('/api/user/refresh-token', { refreshToken });
         return responseHandler(refreshTokenResponse, (data) => {
            localStorage.setStore(data.payload);
            const { accessToken } = data.payload;
            return accessToken;
         });
      case 401:
         // No auth token
         toastr && toastr.error('Missing auth token, Please check again !');
         // window.location.href = '/401';
         break;
      default:
         console.log('status', status);
      // window.location.href = '/403';
   }
};

const privateRequestHandler = async (
   path,
   method = 'post',
   payload,
   successHandler,
   contentType = 'application/json',
) => {
   const { accessToken } = localStorage.getStore();
   const config = configHeaders(accessToken, contentType);
   let axiosParameters = [path, payload, config];
   if (method === 'delete') {
      axiosParameters = [path, config];
   }
   axios[method](...axiosParameters)
      .then(({ data, status }) => {
         successHandler(data, status);
      })
      .catch(async (error) => {
         console.log(error);
         const newToken = await refreshTokenHandler(error.response?.status);
         if (typeof newToken === 'string') {
            const newconfig = configHeaders(newToken, contentType);
            axiosParameters.pop();
            axiosParameters.push(newconfig);
            axios[method](...axiosParameters)
               .then(({ data, status }) => {
                  successHandler(data, status);
               })
               .catch((data) => {
                  toastr.error('Refresh token occured error , please try again !');
               });
         }
      });
};

export {
   responseHandler,
   localStorage,
   getFormData,
   privateRequestHandler,
   formatToCurrency,
   configHeaders,
   refreshTokenHandler,
};
