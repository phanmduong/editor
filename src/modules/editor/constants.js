export const injectScript = `
  (function () {
                    if (WebViewBridge) {
 
                      WebViewBridge.onMessage = function (dataReceive) {
                        var data = JSON.parse(dataReceive);
                        if (data.message === "image") {
                                 insertImage(data.link);
                        }
                        if (data.message === "video") {
                                 insertVideo(data.link);
                        }
                        if (data === "reset height screen"){
                        test();
                        }
                        if (data.message === "blur"){
                            blurEditor();
                        }
                        if (data.message === "focus"){
                            focusEditor();
                        }
                        if (data.message === "save"){
                            saveEditor();
                        }
                        if (data.message == "content"){
                            setContent(data.content);
                        }
                        if (data.message == "keyboardShow"){
                            keyboardShow();
                        }
                        if (data.message == "keyboardHide"){
                            keyboardHide();
                        }
                        if (data.message == "setSource"){
                            setSourceElement(data.link)
                        } 
                        if (data.message == "save selection"){
                                saveSelection();
                        }
                        if (data.message == "close library"){
                            onDivBlur();
                        }
                      };
                    }
                  }())
`;

export const UPLOAD_ERROR = "https://cdn.shopify.com/s/files/1/1380/9193/t/3/assets/no-image.svg?2375582141201571545";