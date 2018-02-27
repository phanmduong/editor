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
                        if (data.message === "save"){
                            saveEditor();
                        }
                        if (data.message == "content"){
                            setContent(data.content);
                        }
                      };
                    }
                  }())
`;