function createToast(title, body) {
    return `
     <div class="toast-header"> 
       <strong class="me-auto">${title}</strong>
       <small class="text-muted">2 seconds ago</small>
       <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
     </div>
     <div class="toast-body">
       ${body}
     </div>
   `;
  }
  function showToast(str) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add("show");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = str;
    document.getElementById("showToast").appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }