export default function formatPath(file) {
   const pathFormated = '/' + file.path.replaceAll('\\', '/');
   return pathFormated.slice(pathFormated.indexOf('assets') - 1);
}
