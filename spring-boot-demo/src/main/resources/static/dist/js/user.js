$(function () {

    $('.alert-danger').css("display", "none");


    $('#modalAdd').on('hide.bs.modal', function () {
        reset();
    })
    $('#modalEdit').on('hide.bs.modal', function () {
        reset();
    })

    $("#jqGrid").jqGrid({
        url: 'users/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, hidden: true, key: true},
            {label: 'User Name', name: 'userName', index: 'userName', sortable: false, width: 80},
            {label: 'Create time', name: 'createTime', index: 'createTime', sortable: false, width: 80}
        ],
        height: 485,
        rowNum: 10,
        rowList: [10, 30, 50],
        styleUI: 'Bootstrap',
        loadtext: 'Loading...',
        rownumbers: true,
        rownumWidth: 35,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "data.list",
            page: "data.currPage",
            total: "data.totalPage",
            records: "data.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {

            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});

function userAdd() {
    reset();
    $('#modalAddTitle').html('Add User');
    $('#modalAdd').modal('show');
}

function userEdit() {
    reset();

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    $('#userId').val(id);

    $('#modalEditTitle').html('Edit password');
    $('#modalEdit').modal('show');
}


$('#saveButton').click(function () {

    if (validObjectForAdd()) {

        // ajax
        var userName = $("#userName").val();
        var password = $("#password").val();
        var data = {"userName": userName, "password": password};
        $.ajax({
            type: 'POST',
            dataType: "json",
            url: 'users/save',// url
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            beforeSend: function (request) {

                request.setRequestHeader("token", getCookie("token"));
            },
            success: function (result) {
                console.log(result);
                checkResultCode(result.resultCode);
                if (result.resultCode == 200) {
                    swal("Save success", {
                        icon: "success",
                    });
                    $('#modalAdd').modal('hide');
                    // reload
                    reload();
                }
                else {
                    swal(result.message, {
                        icon: "error",
                    });
                }
                ;
            },
            error: function () {
                reset();
                swal("Fail", {
                    icon: "error",
                });
            }
        });

    }
});

$('#editButton').click(function () {

    if (validObjectForEdit()) {

        var password = $("#passwordEdit").val();
        var id = $("#userId").val();
        var data = {"id": id, "password": password};
        $.ajax({
            type: 'PUT',
            dataType: "json",
            url: 'users/updatePassword',// url
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            beforeSend: function (request) {

                request.setRequestHeader("token", getCookie("token"));
            },
            success: function (result) {
                checkResultCode(result.resultCode);
                console.log(result);
                if (result.resultCode == 200) {
                    swal("Edit success", {
                        icon: "success",
                    });
                    $('#modalEdit').modal('hide');
                    // reload
                    reload();
                }
                else {
                    swal(result.message, {
                        icon: "error",
                    });
                }
                ;
            },
            error: function () {
                reset();
                swal(result.message, {
                    icon: "error",
                });
            }
        });

    }
});


function userDel() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "Warning",
        text: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
            if(flag) {
                $.ajax({
                    type: "DELETE",
                    url: "users/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    beforeSend: function (request) {

                        request.setRequestHeader("token", getCookie("token"));
                    },
                    success: function (r) {
                        checkResultCode(r.resultCode);
                        if (r.resultCode == 200) {
                            swal("Delete success", {
                                icon: "success",
                            });
                            $("#jqGrid").trigger("reloadGrid");
                        } else {
                            swal(r.message, {
                                icon: "error",
                            });
                        }
                    }
                });
            }
        }
    );
}



function validObjectForAdd() {
    var userName = $('#userName').val();
    if (isNull(userName)) {
        showErrorInfo("Username can not be blank!");
        return false;
    }
    if (!validUserName(userName)) {
        showErrorInfo("username is wrong!");
        return false;
    }
    var password = $('#password').val();
    if (isNull(password)) {
        showErrorInfo("Password can not be blank!");
        return false;
    }
    if (!validPassword(password)) {
        showErrorInfo("password is wrong!");
        return false;
    }
    return true;
}


function validObjectForEdit() {
    var userId = $('#userId').val();
    if (isNull(userId) || userId < 1) {
        showErrorInfo("error！");
        return false;
    }
    var password = $('#passwordEdit').val();
    if (isNull(password)) {
        showErrorInfo("Password can not be blank!");
        return false;
    }
    if (!validPassword(password)) {
        showErrorInfo("password is wrong!");
        return false;
    }
    return true;
}


function reset() {

    $('.alert-danger').css("display", "none");

    $('#password').val('');
    $('#passwordEdit').val('');
    $('#userName').val('');
    $('#userId').val(0);
}


function reload() {
    reset();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}