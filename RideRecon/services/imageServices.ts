export const getAccountImage = (file:any)=>{
    if (file && typeof file == "string") return file;
    if (file && typeof file == "object") return file;

    return require("../assets/images/design/defaultAvatar.png");
}