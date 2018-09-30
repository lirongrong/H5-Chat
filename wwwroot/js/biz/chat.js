//封装方法    
$.extend({
    //获取当前时间 2019-02-12 12:00:00
    getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    /**
     * enu:0 是客服发送的消息
     * enu:1 是我发送的消息
     */
    pushData: function (obj, enu, options) {
        var obj = obj;
        var defaults = {
            userImage: '',
            msgtype:'',
            text: {
                content:''
            },
            image:{
                url:''
            },
            isAdmin: false, 
        }
        options = $.extend(defaults, options);
        options.time = $.getNowFormatDate();
        // options.time = 'dddd'; 
        if (enu == 0) {
            options.userImage = '/images/logo.png';
            options.isAdmin = false;
        } else if (enu == 1) {
            options.userImage = '/images/logo.png';
            options.isAdmin = true;
        }
        obj.push(options);
    },
    showToast: function (msg) {
        var objToast = "<div class='toast'>" + msg + "</div>"
        $(document.body).append(objToast);
        setTimeout(function () {
            $('.toast').remove();
        }, 1000)
    },
    /**
     * 图片文件转base64
     */
    getBase64Image:function(img,options){
        var defaults = {
            maxWidth : Number,
            maxHeight : Number
        };
        if(options != undefined && options != null){
            defaults = $.extend(defaults,options)
        };
        // 缩放图片需要的canvas
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        // 图片原始尺寸
        var originWidth = img.width;
        var originHeight = img.height;
        // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
        var maxWidth = defaults.maxWidth,
            maxHeight = defaults.maxHeight;
        // 目标尺寸
        var targetWidth = originWidth,
            targetHeight = originHeight;
        // 图片尺寸超过400x400的限制
        if(originWidth > maxWidth || originHeight > maxHeight) {
            if(originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);  
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);  
        /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
        //压缩后的图片base64 url
        /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
            * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
        dataURL = canvas.toDataURL('image/jpeg');
        //回调函数用以向数据库提交数据
        var base64 = dataURL.substr(dataURL.indexOf(",") + 1);
        return base64;
    }
})
//长连接
// websocket = new WebSocket("wss://localhost:44373/ws");
var setting = {
    //wsUrl: 'ws://chat.xiaohu.in/chatroom',
    wsUrl:'ws://localhost:5000',
    dev: {
        web: 1,
        mobile: 2,
        applet: 3
    }
}

//model原型
function ChatModel() {
    var self = this;
    self.chatList = ko.observableArray([]);//聊天内容
    self.isShowModelUp = ko.observable(false);//底部弹框显示true,隐藏为false 
    self.isAudio = ko.observable(false);//没有录音false,开始录音true
    self.audioText = ko.observable('按住说话');
    self.audioUrl = ko.observable('');//录音文件地址
    self.isShowAudio = ko.observable(false);//true为开始播放，false为取消播放
    self.chatInputValue = ko.observable('');//输入框内容 
    self.userName = ko.observable(window.localStorage.getItem('username'));
    //切换是否录音按钮
    self.btnRecord = function () {
        if (self.isAudio() == false) {
            self.isAudio(true);
        } else {
            self.isAudio(false);
            self.audioText = '按住说话'
        }
    };
    //打开底部弹框
    self.showModelUp = function () {
        if (self.isShowModelUp() == false) {
            self.isShowModelUp(true)
        } else {
            self.isShowModelUp(false)
        }
    };
    //关闭底部弹框
    self.closeModelUp = function () {
        self.isShowModelUp(false)
    };
    //上传图片
    self.chooseImage = function (e) { 
        if (!e) {
            return false;
        } 
        var files = e.target.files; 
        for (var i = 0; i < files.length; i++) {
            //判断上传的图片格式和大小
            var type = files[i].type.split('/')[0];
            if (type != 'image') {
                $.showToast('请上传图片');
                return false;
            }
            var size = Math.floor(files[i].size / 1024 / 1024);
            if (size > 3) {
                alert('图片大小不得超过3M');
                return false;
            }; 
            //上传图片
            var reader = new FileReader();
            reader.readAsDataURL(files[i]);
            reader.onloadstart = function () {
                //用以在上传前加入一些事件或效果，如载入中...的动画效果
            };
            var fileName = files[i].name; 
            reader.onloadend = function (e) { 
                var dataURL = this.result;
                var imaged = new Image();
                imaged.src = dataURL;
                imaged.onload = function () {  
                    var img = this;
                    //利用canvas对图片进行压缩
                    var base64 = $.getBase64Image(img,{
                        maxWidth:1000,
                        maxHeight:1000
                    });
                    var user = $.currentUser(); 
                    console.log(base64);
                    $.api({
                        url: "helper/image/upload",
                        type: "POST",
                        data: {
                            folder: 'chat',
                            userId: user ? user.id : 0,
                            userName: user ? user.name : "访客",
                            base64: base64,
                            fileName: fileName,
                        },
                        success: function (result) {
                            var url = $.imgHost + result.path; 
                            websocket.send("{touser:'@all',msgtype:'image',image:{url:'" + url + "'}}");
                        }
                    });
                    //self.uploadImgCallback(dataURL);
                    //关闭下面的输入框
                    self.closeModelUp();
                };
            };
        }
    }; 
    //上传附件
    self.chooseFile = function (model,e) {
        console.log(e);
        $(e.target).parents("form").submit();
        
        //if(!e){
        //    return false;
        //}
        //var files = e.target.files; 
        //console.log(files); 
        //var fileName = files[0].name; 
        //var user = $.currentUser();  
         
        //$.api({
        //    url: "helper/image/upload",
        //    type: "POST",
        //    data: {
        //        folder: 'chat',
        //        userId: user ? user.id : 0,
        //        userName: user ? user.name : "访客",
        //        files: files,
        //        fileName: fileName,
        //    },
        //    success: function (result) {
        //        console.log(result);
        //        // var url = $.imgHost + result.path; 
        //        // websocket.send("{touser:'@all',msgtype:'image',image:{url:'" + url + "'}}");
        //    }
        //});
    };
    //图片点击放大
    self.previewImage = function(){

    };
    //发送消息
    self.sendMessage = function (e) {  
        if(!e) return false; 
        if(e.keyCode == "13"){
            var value = $(e.target)[0].value ;
            websocket.send("{touser:'@all',msgtype:'text',text:{content:'" + value + "'}}"); 
            $(e.target)[0].value = '';
        } 
    };  
    //接收消息
    self.receiveMessage = function (fromUser, result) {
        var userName = self.userName(); 
        console.log(result);
        $.pushData(self.chatList, fromUser == userName ? 1 : 0, {
            fromUser: fromUser,
            msgtype: result.msgtype,
            text: {
                content: (result.text)?(result.text.content):''
            },
            image:{
                url:(result.image)?(result.image.url):''
            }, 
        })
    };
    //拍摄
    self.camera = function(){
        // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        
        // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia 
        // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
        
            // 首先，如果有getUserMedia的话，就获得它
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
        
            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
            }
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function(stream) {
            var video = document.querySelector('video');
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
            // 防止再新的浏览器里使用它，应为它已经不再支持了
                video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }
};
//创建实例
var vm = new ChatModel();
//加载完页面要执行的方法
$(function () {
    ko.applyBindings(vm);
    var init = function () {
        var userName = window.localStorage.getItem('username');
        //用户名为空
        if (!userName) {
            $("#modal_login").css({
                'display': 'block'
            })
            $("#modal_red").css({
                'display': 'block'
            });
        }
        //用户名不为空
        else {
            $("#modal_login").css({
                'display': 'none'
            })
            $("#modal_red").css({
                'display': 'none'
            });
            //长连接
            window.localStorage.setItem("username", userName);
            vm.userName(window.localStorage.getItem('username'));
            websocket = new WebSocket(setting.wsUrl + '?un=' + userName + '&dev=' + setting.dev.web)
            websocket.onopen = function (event) {
                console.log("websocket is opened.", event);
            };
            websocket.onclose = function (event) {
                console.log("websocket is closed.", event);
            };
            websocket.onmessage = function (event) {
                var data = event.data;
                var result = JSON.parse(data);
                console.log("websocket received message.", result);
                vm.receiveMessage(result.fromUser, result)
            };
            websocket.onerror = function (event) {
                console.log("websocket is error.", event);
            };
        };
    }
    init();
    $("#btnLogin").click(function () { 
        var userName = $.trim($("#txtUserName").val());
        window.localStorage.setItem("username", userName);
        init();
    }); 
})

 