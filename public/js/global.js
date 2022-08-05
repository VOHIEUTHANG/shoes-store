!(() => {
   return {
      toastrConfig() {
         toastr.options.closeMethod = 'fadeOut';
         toastr.options.closeDuration = 300;
         toastr.options.closeEasing = 'swing';
         toastr.options.progressBar = true;
         toastr.options.closeButton = true;
         toastr.options.timeOut = 5000;
         toastr.options.extendedTimeOut = 5000;
      },
      tippy() {
         tippy('.user-section', {
            content: 'Tài khoản',
         });
      },
      run() {
         this.toastrConfig();
         this.tippy();
      },
   };
})().run();
