
function isNull(obj) {
    if (obj == null || obj == undefined || obj.trim() == "") {
        return true;
    }
    return false;
}


function validLength(obj, length) {
    if (obj.trim().length < length) {
        return true;
    }
    return false;
}


function validUserName(userName) {
    var pattern = /^[a-zA-Z0-9_-]{4,16}$/;
    if (pattern.test(userName.trim())) {
        return (true);
    } else {
        return (false);
    }
}


function validPassword(password) {
    var pattern = /^[a-zA-Z0-9]{6,20}$/;
    if (pattern.test(password.trim())) {
        return (true);
    } else {
        return (false);
    }
}



function login() {
    var userName = $("#userName").val();
    var password = $("#password").val();
    if (isNull(userName)) {
        showErrorInfo("Need username!");
        return;
    }
    if (!validUserName(userName)) {
        showErrorInfo("username is wrong!");
        return;
    }
    if (isNull(password)) {
        showErrorInfo("Need password!");
        return;
    }
    if (!validPassword(password)) {
        showErrorInfo("password is wrong!");
        return;
    }
    var data = {"userName": userName, "password": password}
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "users/login",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.resultCode == 200) {
                $('.alert-danger').css("display", "none");
                setCookie("token", result.data.userToken);
                window.location.href = "/";
            }
            ;
            if (result.resultCode == 500) {
                showErrorInfo("login fail");
                return;
            }
        },
        error: function () {
            $('.alert-danger').css("display", "none");
            showErrorInfo("error");
            return;
        }
    });
}


function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";

}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function checkCookie() {
    if (getCookie("token") == null) {
        swal("Need login", {
            icon: "error",
        });
        window.location.href = "login.html";
    }
}


function checkResultCode(code) {
    if (code == 402) {
        window.location.href = "login.html";
    }
}



function showErrorInfo(info) {
    $('.alert-danger').css("display", "block");
    $('.alert-danger').html(info);
}


function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        swal("Choose one", {
            icon: "error",
        });
        return;
    }
    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        swal("Only one", {
            icon: "error",
        });
        return;
    }
    return selectedIDs[0];
}


function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        swal("Choose one", {
            icon: "error",
        });
        return;
    }
    return grid.getGridParam("selarrrow");
}