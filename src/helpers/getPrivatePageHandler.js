export default function getPrivatePageHandler(req, res) {
   const user = req.user;
   if (!user) return res.redirect('/');
   const payloadInfo = req.payload;
   const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
   payload.user = user;
   payload.isLoggedIn = true;
   return payload;
}
