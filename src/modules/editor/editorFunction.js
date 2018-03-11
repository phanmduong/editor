import ImagePicker from 'react-native-image-picker';
import {Platform} from "react-native";

let optionsImage = {
    mediaType: 'image',
    title: 'Select Image',
    takePhotoButtonTitle: null,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    rotation: 360
};

let optionsVideo = {
    mediaType: 'video',
    title: 'Select Video',
    takePhotoButtonTitle: null,
    storageOptions: {
        skipBackup: true,
        path: 'videos'
    }
};

const UPLOAD_IMAGE_URL = 'http://api.keetool.xyz/upload-image-public';

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
    formdata.append('image', file);
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.upload.onprogress = progressHandler;
    ajax.open("POST", UPLOAD_IMAGE_URL);
    ajax.send(formdata);
    ajax.addEventListener("error", error, false);
}
/**
 * FUNCTION CHOICE IMAGE FROM LIBRARY
 * @param func
 */
export let choiceImage = (openLibrary, completeHandler, progressHandler, error, closeLibrary) => {
    ImagePicker.showImagePicker(optionsImage, (response) => {
        console.log(response);
        if (response.didCancel) {
            closeLibrary();
        }
        else if (response.error) {
            error()
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            openLibrary(response.uri, 'image');
            let source = {
                uri: response.uri,
                name: response.fileName ? response.fileName : 'image.png',
                type: 'image/*',
            };
            uploadImage(source, completeHandler, progressHandler, error);
        }
    });
}

const isIOS = Platform.OS === 'ios';

/**
 * FUNCTION CHOICE VIDEO FROM LIBRARY
 * @param func
 */
export let choiceVideo = (openLibrary, completeHandler, progressHandler, error, closeLibrary) => {
    ImagePicker.showImagePicker(optionsVideo, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
            closeLibrary();
        }
        else if (response.error) {
            error();
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            openLibrary(isIOS ? response.uri : 'file://' + response.path, 'video');
            let source = {
                uri: response.uri,
                name: response.fileName ? response.fileName : "video.mp4",
                type: 'video/*',
            };
            uploadVideo(source, completeHandler, progressHandler, error);
        }
    });
}

export let formatData = (data) => {
    if (data) {
        return data.replace(/"/gi, "@keetool@").replace(/\\/gi, "#keetool#").replace(/'/gi, "%keetool%").replace(/\n/gi, "")
    }
    return null;
}
