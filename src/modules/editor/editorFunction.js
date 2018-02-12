import ImagePicker from 'react-native-image-picker';

let optionsImage = {
    mediaType: 'image',
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

let optionsVideo = {
    mediaType: 'video',
    title: 'Select Video',
    takePhotoButtonTitle: 'Take video',
    storageOptions: {
        skipBackup: true,
        path: 'videos'
    }
};

const UPLOAD_IMAGE_URL = 'http://api.colorme.vn/upload-image-public';
const UPLOAD_VIDEO_URL = 'http://api.colorme.vn/upload-video-public';

uploadImage = (file, completeHandler, progressHandler, error) => {
    let formdata = new FormData();
    formdata.append('image', file);
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.upload.onprogress = progressHandler;
    ajax.open("POST", UPLOAD_IMAGE_URL);
    ajax.send(formdata);
    ajax.addEventListener("error", error, false);
}

uploadVideo = (file, completeHandler, progressHandler, error) => {
    let formdata = new FormData();
    formdata.append('video', file);
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.upload.onprogress = progressHandler;
    ajax.open("POST", UPLOAD_VIDEO_URL);
    ajax.send(formdata);
    ajax.addEventListener("error", error, false);
}
/**
 * FUNCTION CHOICE IMAGE FROM LIBRARY
 * @param func
 */
export let choiceImage = (openLibrary, completeHandler, progressHandler, error) => {
    ImagePicker.showImagePicker(optionsImage, (response) => {
        console.log(response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            error()
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            console.log(response.uri);
            openLibrary();
            let source = {
                uri: response.uri,
                name: response.fileName,
                type: 'image/*',
            };
            uploadImage(source, completeHandler, progressHandler, error);
        }
    });
}

/**
 * FUNCTION CHOICE VIDEO FROM LIBRARY
 * @param func
 */
export let choiceVideo = (openLibrary, completeHandler, progressHandler, error) => {
    ImagePicker.showImagePicker(optionsVideo, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            error();
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            openLibrary();
            let source = {
                uri: response.uri,
                name: response.fileName,
                type: 'video/mp4',
            };
            uploadVideo(source, completeHandler, progressHandler, error);
        }
    });
}
