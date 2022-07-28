const LOCAL_STORAGE_KEY = 'devostack_store';
export default function setLocal(data) {
   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
