/**缓存 */
$.cache = {
    //获取
    get: function (key) {
        var obj = window.localStorage.getItem(key);
        if (obj)
            return JSON.parse(obj);
        else
            return null;
    },
    //设置
    set : function (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    //移除
    remove: function (key) {
        window.localStorage.removeItem(key);
    }
}

//当前登录用户
$.currentUser = function (val) {
    if (val == undefined) {
        var str = window.localStorage.getItem("currentUser");
        if (str) {
            var user = JSON.parse(str);
            return user;
        } else {
            return null;
        }
    }
    else {
        if (val == null) {
            window.localStorage.removeItem("currentUser");
        }
        else {
            var value = JSON.stringify(val);
            window.localStorage.setItem("currentUser", value);
        }
    }
};

//图片服务器
$.imgHost = "http://img.feiwuwl.com/1/";

//当前域名
$.domain = function () {
    return location.protocol + "//" + location.host + "/";
}

///**
// * 路由加载
// *   例如：$.load("提交成功！");
// */
$.load = function (url, cache) {
    location.href = url;
};

/**
 * 消息提示
 *   例如：$.alert("提交成功！");
 */
$.alert = function (msg, callback) {
    //alert(msg);
    //if (callback)
    //    callback();
    var promise = swal({
        title: "提示",
        text: msg,
        type: 'info',
        timer: 2000,
    }).then(callback ? callback : false);
}

/**
 * 确认提示
 *   例如：$.confirm("提交成功！");
 */
$.confirm = function (msg, callback) {
    if (confirm(msg))
        callback();

    //swal({
    //    title: '警示',
    //    text: msg,
    //    type: 'warning',
    //    showCancelButton: true,
    //    confirmButtonText: '确定',
    //    cancelButtonText: '取消'
    //}, function (isConfirm) {
    //    if (isConfirm) {
    //        callback();
    //    }
    //});
}

/**
 * 错误提示
 *   例如：$.error("手机号码不正确！"); 或者 $.error(err);
 */
$.error = function (msg, callback) {
    msg = msg.responseText || msg.statusText || msg;

    if (msg == "Unauthorized") {
        var type = $.cache.get("type");
        $.alert("请先登录！", function () {
            $.load('/home/index?type=' + type);
        });
    }
    else {
        //$.alert(msg, callback);
        var promise = swal({
            title: '错误',
            text: msg,
            type: 'error',
            timer: 3000,
        }).then(callback ? callback : false);
    }
}

/**
 * 清除tml标签，并截取字符串
 *   例如：$.clearHtml(msg,20);
 */
$.clearHtml = function (content, len) {
    if (!content)
        return "";
    //content = content.replace(/<br \/>/g, '\r\n').replace(/<br\/>/g, '\r\n');
    content = content.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
    //content = content.replace(/[|]*\n/, '') //去除行尾空格
    content = content.replace(/&npsp;/ig, ''); //去掉npsp
    if (!len)
        return content;
    return $.showLen(content, len);
}

/**
 * 是否是图片
 *   例如：$.isImg('jpg');
 */
$.isImg = function (postfix) {
    var postfixs = ['jpg', 'jpeg', 'png', 'gif'];
    if (postfixs.indexOf(postfix) >= 0) {
        return true;
    } else
        return false;
}

/**
 * 显示日期
 */
$.showDate = function (date) {
    return new Date(date).toDateString();
};

/**
 * 显示星星
 */
$.showStar = function (star) {
    var html = "";
    for (var i = 0; i < star; i++)
        html += "★";
    return html;
}

/**
 * 显示性别
 */
$.showSex = function (sex) {
    var html = "未知";
    switch (sex) {
        default:
        case -1:
        case "-1":
            html = "未知";
            break;
        case 1:
        case "1":
            html = "男";
            break;
        case 0:
        case "0":
            html = "女";
            break;
    }
    return html;
}

/**
 * 显示图片
 *    img:图片路径
 *    defImg:默认图片，img若无则显示默认图片
 */
$.showImg = function (img, defImg) {
    if (!img)
        return defImg;
    if (img.indexOf("http") >= 0)
        return img;
    else
        return $.imgHost + img;
}

/**
 *  显示友好时间，如 刚刚，3小时前
 *     time:要计算的时间
 */
$.showFriendlyTime = function (time) {
    if (!time) return new Date();
    var dt = new Date(time);
    var now = new Date();
    var delta = now.getTime() - dt.getTime();

    if (delta <= 6000) {
        return "刚刚";
    }
    else if (delta < 60 * 60 * 1000) {
        return Math.floor(delta / (60 * 1000)) + "分钟前";
    }
    else if (delta < 24 * 60 * 60 * 1000) {
        return Math.floor(delta / (60 * 60 * 1000)) + "小时前";
    }
    else if (delta < 3 * 24 * 60 * 60 * 1000) {
        return Math.floor(delta / (24 * 60 * 60 * 1000)) + "天前";
    }
    else if (now.getFullYear() > dt.getFullYear()) {
        return now.getFullYear() - dt.getFullYear() + "年前";
    }
    return time;
}

/**
 *  显示产品图片
 *     item:产品实体
 */
$.showProductImg = function (item) {
    var html = $.imgHost;
    if (item.userCard)
        html += item.userCard;
    else if (item.userImage)
        html += item.userImage;
    else if (item.image)
        html += item.image;
    return html;
}

/**
 * 截取字符串
 *   例如：$.showLen(cont,20)
 */
$.showLen = function (cont, len) {
    if (cont) {
        if (cont.length > len)
            cont = cont.substr(0, len) + "...";
        return cont;
    }
    return "";
}

/**
 * 获取url参数
 *   例如： $.getParm("id"); 
 */
$.getParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2])); return null;
}

/**
 * 调用 API 数据
 *   例如: $.api({
 *             url:"common/area",
 *             success:function(result){
 *                 $.alert(result);
 *             }
 *         });
 */
$.apiDomain = function () {
    return "/api/";
}
$.apiHeader = function () {
    return {};
};
$.api = function (opts) {
    opts.url = $.apiDomain() + opts.url;
    var optsHeader = $.apiHeader();
    if (!opts.headers)
        opts.headers = {};
    $.extend(opts.headers, optsHeader);

    opts.dataType = opts.dataType || "json";
    if (!opts.type)
        opts.type = "GET";
    opts.contentType = "application/json";
    if (opts.data && opts.type) {
        var type = opts.type.toUpperCase();
        if (type == "POST" || type == "PUT")
            opts.data = JSON.stringify(opts.data);
    }
    var funComplete = opts.complete;
    opts.complete = function (xhr, status) {
        if (funComplete)
            funComplete();
        if (xhr.status == 250) {
            $.alert(xhr.responseText);
        } else if (xhr.status == 401) {
            var type = $.cache.get("type") || 20021;
            $.load('/auth/index?type=' + type);
        } else if (xhr.status == 403) {
            $.alert("请求出错：" + xhr.responseText);
        } else if (xhr.status >= 500) {
            $.alert("服务器出错：" + xhr.responseText);
        }
    }
    opts.traditional = true;

    //ajax
    $.ajax(opts);
};

/**
 * 表单重置
 *   例如: $("form").reset();
 *   
 */
$.fn.reset = function (options) {
    var form = this;

    //所有表单元素
    var items = form.find("input[type=hidden]," +
        "input[type=text]," +
        "input[type=password]," +
        "textarea," +
        "input[type=radio]:checked," +
        "input[type=checkbox]:checked");

    items.each(function (index, item) {
        if ($(item).attr("type") != "radio" || $(item).attr("type") != "radio")
            $(item).val("");
    });
    if (form.find("select").children("option").length > 0)
        form.find("select").val(form.find("select").children("option")[0].attr("value"));
};

/**
 * 表单异步提交
 *   例如: $("form").ajaxSubmit();
 *   注意不要用表单的submit方法，改用事件请求
 */
$.fn.ajaxSubmit = function (options) {
    var form = this;
    //请求地址
    var url = form.attr('action');
    var method = form.attr("method");
    options.type = options.type || method || "POST";
    options.url = options.url || url;

    //组合参数
    var params = {};
    var items = form.find("input[type=hidden]," +
        "input[type=text]," +
        "input[type=number]," +
        "input[type=password]," +
        "textarea," +
        "select," +
        "input[type=radio]:checked," +
        "input[type=checkbox]:checked");

    items.each(function (index) {
        params[this.name] = this.value;
    });
    $.extend(params, options.data);
    options.data = params;

    //验证表单
    var errors = [];
    form.find("[required]").each(function (index, item) {
        var val = $(item).val();
        var dataName = $(item).data("name");
        if (!val) {
            var errMsg = dataName + "不能为空！";
            errors.push({ target: item, errMsg: errMsg });
        }
    });
    form.find("[data-validate='mobile']").each(function (index, item) {
        var val = $(item).val();
        var dataName = $(item).data("name");
        if (!/1\d{10}/.test(val)) {
            var errMsg = dataName + "手机号码不正确！";
            errors.push({ target: item, errMsg: errMsg });
        }
    });
    if (errors.length > 0) {
        $.error(errors[0].errMsg);
        return errors;
    }

    $.api(options);
};

/**
 * 表单异步提交
 *   例如: $("form").ajaxSubmit();
 *   注意不要用表单的submit方法，改用事件请求
 */
$.fn.loadForm = function (data) {
    var getValue = function (item) {
        var name = $(item).attr("name");
        var val = data[name];
        //日期转换
        if ($(item).attr("data-type") === "datetime")
            val = $.showDate(val);
        return val;
    }
    if (JSON.stringify(data) != "{}" && JSON.stringify(data) != "") {
        this.find("input[name]").each(function (index, item) {
            var name = $(item).attr("name");
            var type = $(item).attr("type");
            var val = getValue(item);
            if (type === "radio") {
                if (val) {
                    if (val.toString() === $(item).val()) {
                        $(item).prop("checked", "checked");
                    } else {
                        $(item).removeAttr("checked");
                    }
                }
            }
            else if (type === "checkbox") {
                var dataType = $(item).attr("data-type");
                if (dataType == "bool") {
                    if (val != null) {
                        if (val.toString() == "true") {
                            $(item)[0].checked = true
                            $(item).val(true);
                        } else {
                            $(item).removeAttr("checked");
                            $(item).val(false);
                        }
                    }
                }
                else if (dataType == "wei") {  //位运算
                    if (val & $(item).val()) {
                        $(item).attr("checked", "checked");
                        $(item).parent().addClass("checked");
                    } else {
                        $(item).parent().removeClass("checked");
                    }
                }
                else {
                    if (val != null) {
                        var s = val.toString(); // '1,2,3,' 
                        if (s.substr(s.length - 1, 1) != ",") s += ",";
                        if (s.indexOf($(item).val() + ",") >= 0) {
                            $(item).attr("checked", "checked");
                        } else {
                            $(item).removeAttr("checked");
                        }
                    }
                }
            } else if (type == "file") {
            } else if (type == "reset") {
            } else if (type == "submit") {
            } else if (type == "button") {
            } else if (type == "hidden") {
                //图标logo位运算规则
                if ($(item).attr("data-name")) {
                    val = data[$(item).attr("data-name")];
                    if ((val & parseInt($(this).val())) == parseInt($(this).val())) {
                        $(this).parent().addClass("active");
                    }
                }
                else
                    $(item).val(val);
            }
            else if (type == "datetime-local") {
                $(item).val(val);
            }
            else {
                $(item).val(val);
            }
        });
        this.find("select[name]").each(function (index, item) {
            var name = $(item).attr("name");
            var val = getValue(item);

            if (val != null && val != undefined) {
                $(item).children("option").each(function (i, option) {
                    if (val.toString() === $(option).val()) {
                        $(option).prop("selected", "selected");
                    } else {
                        $(option).removeAttr("selected");
                    }
                });
            }
        });
        this.find("textarea[name]").each(function (index, item) {
            var name = $(item).attr("name");
            var val = getValue(item);
            $(item).val(val);

        });
        this.find("div[contenteditable='true']").each(function (index, item) {
            var name = $(item).attr("name");
            var val = getValue(item);
            $(item).html(val);
        });
        this.find("img[data-form='true']").each(function (index, item) {
            var name = $(item).attr("name");
            var val = getValue(item);
            $(item).attr("data-src", val).attr("src", $.hostFileUrl() + val);
        });
        //富文本框
        this.find("div[data-opertype='editor']").each(function (index, item) {
            var name = $(item).attr("name");
            var val = getValue(item);
            $(item).eq(index).summernote('code', val);
        });
    }
}

/**
 * 绑定下拉选择框
 *   注意：如果有 data 绑定 data的数据 
 */
$.fn.bindSelect = function (options) {
    var self = this;
    //默认值
    var defaults = {
        defValue: "",
        url: "",
        async: true,
        data: null,
        placeholder: "-请选择-"
    };
    var opts = $.extend(defaults, options);

    //渲染
    var render = function (data) {
        var optionStr = '<option value>' + opts.placeholder + '</option>';
        $(data).each(function (index, item) {
            if (item.id == opts.defValue) {
                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
            } else {
                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
            }
        });
        self.html(optionStr);
    }
    //绑定数据
    if (opts.data) {
        render(opts.data);
    } else {  //绑定api
        $.api({
            url: opts.url,
            async: opts.async,
            success: function (data) {
                render(data);
            }
        });
    }
};

/**
 * 上传文件
 *    参数：
 *      success的参数：{"name":"1.png","type":"product","path":"product/2018/93f6adc0-eeb0-46cf-9320-d72e8adcb599.png","postfix":"png","size":12505}
 */
$.fn.upload = function (options) {
    var defaults = {
        folder: "default",
        size: 10,
        type: ['image', 'word', 'pdf', 'zip', 'rar', 'sheet', 'text'],
        success: false,
        beforeSend: false,
    };
    var opts = $.extend(defaults, options);
    $(this).on("change", function (event) {
        var file = event.target.files[0];
        if (file.size > defaults.size * 1024 * 1024) {
            $.alert("上传文件大于" + defaults.size + "M!");
            return;
        }
        if (opts.beforeSend) {
            opts.beforeSend();
        }
        //var valiType = false;
        //for (var i = 0; i < defaults.type.length; i++) {
        //    var item = defaults.type[i];
        //    if (file.type.indexOf(item) >= 0) {
        //        valiType = true;
        //        break;
        //    }
        //}
        //if (!valiType) {
        //    $.alert("上传文件类型不正确！");
        //    return;
        //}
        var reader = new FileReader();  //本地预览
        reader.onload = function () {
            var base64 = reader.result.substr(reader.result.indexOf(",") + 1);
            var user = $.currentUser();
            $.api({
                url: "helper/image/upload",
                type: "POST",
                data: {
                    folder: opts.folder,
                    userId: user ? user.id : 0,
                    userName: user ? user.name : "访客",
                    base64: base64,
                    fileName: file.name,
                },
                success: function (result) {
                    opts.success(result);
                }
            });
        }
        reader.readAsDataURL(file);    //Base64
    });
};