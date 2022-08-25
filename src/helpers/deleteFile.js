const fs= require('fs');
export default function (fileUrl){
    try {
        fs.unlinkSync('././././public'+fileUrl);
    } catch (error) {
        console.log('🚀 ~ file: deleteFile.js ~ line 4 ~ error', error)
    }
}