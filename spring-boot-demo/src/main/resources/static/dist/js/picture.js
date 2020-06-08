$(function () {

    $('#pictureModal').modal('hide');

    $('.alert-danger').css("display", "none");


    $('#pictureModal').on('hide.bs.modal', function () {
        reset();
    })
    $("#jqGrid").jqGrid({
        url: 'pictures/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, sortable: false, hidden: true, key: true},
            {label: 'Path', name: 'path', index: 'path', sortable: false, width: 105, formatter: imgFormatter},
            {label: 'Remark', name: 'remark', index: 'remark', sortable: false, width: 105},
            {label: 'Create time', name: 'createTime', index: 'createTime', sortable: true, width: 80}
        ],
        height: 585,
        rowNum: 10,
        rowList: [10, 30, 50],
        styleUI: 'Bootstrap',
        loadtext: 'Loading...',
        rownumbers: true,
        rownumWidth: 25,
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

    function imgFormatter(cellvalue) {
        return "<a href='" + cellvalue + "'> <img src='" + cellvalue + "' height=\"120\" width=\"135\" alt='lou.springboot'/></a>";
    }

    new AjaxUpload('#upload', {
        action: 'images/upload',
        name: 'file',
        autoSubmit: true,
        responseType: "json",
        onSubmit: function (file, extension) {
            if (!(extension && /^(jpg|jpeg|png|gif)$/.test(extension.toLowerCase()))) {
                swal('Only support jpg、png、gif！', {
                    icon: "error",
                });
                return false;
            }
        },
        onComplete: function (file, r) {
            if (r.resultCode == 200) {
                swal("Upload success", {
                    icon: "success",
                });
                $("#picturePath").val(r.data);
                $("#img").attr("src", r.data);
                $("#img").attr("style", "width: 100px;height: 100px;display:block;");
                return false;
            } else {
                swal(r.message, {
                    icon: "error",
                });
            }
        }
    });
    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});



$('#saveButton').click(function () {

    if (validObject()) {

        // ajax
        var id = $("#pictureId").val();
        var picturePath = $("#picturePath").val();
        var pictureRemark = $("#pictureRemark").val();
        var data = {"path": picturePath, "remark": pictureRemark};
        var url = 'pictures/save';
        var method = 'POST';

        if (id > 0) {
            data = {"id": id, "path": picturePath, "remark": pictureRemark};
            url = 'pictures/update';
            method = 'PUT';
        }
        $.ajax({
            type: method,
            dataType: "json",
            url: url,// url
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {

                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify(data),
            success: function (result) {
                checkResultCode(result.resultCode);
                if (result.resultCode == 200) {
                    $('#pictureModal').modal('hide');
                    swal("Save success", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#pictureModal').modal('hide');
                    swal("Save fail", {
                        icon: "error",
                    });
                }
                ;
            },
            error: function () {
                swal("Fail", {
                    icon: "error",
                });
            }
        });

    }
});

function pictureAdd() {
    reset();
    $('.modal-title').html('Add picture');
    $('#pictureModal').modal('show');
}

function pictureEdit() {
    reset();
    $('.modal-title').html('Edit picture');

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "pictures/info/" + id,
        contentType: "application/json",
        beforeSend: function (request) {

            request.setRequestHeader("token", getCookie("token"));
        },
        success: function (r) {
            checkResultCode(r.resultCode);
            if (r.resultCode == 200 && r.data != null) {

                $('#pictureId').val(r.data.id);
                $('#picturePath').val(r.data.path);
                $('#pictureRemark').val(r.data.remark);
            }
        }
    });

    $('#pictureModal').modal('show');
}


function validObject() {
    var picturePath = $('#picturePath').val();
    if (isNull(picturePath)) {
        showErrorInfo("Need picture!");
        return false;
    }
    var pictureRemark = $('#pictureRemark').val();
    if (isNull(pictureRemark)) {
        showErrorInfo("Need remark!");
        return false;
    }
    if (!validLength(pictureRemark, 150)) {
        showErrorInfo("context can not over 150!");
        return false;
    }
    if (!validLength(picturePath, 120)) {
        showErrorInfo("upload error!");
        return false;
    }
    return true;
}


function reset() {

    $('.alert-danger').css("display", "none");

    $('#pictureId').val(0);
    $('#picturePath').val('');
    $('#pictureRemark').val('');
    $("#img").attr("style", "display:none;");
}

function deletePicture() {
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
        if (flag) {
            $.ajax({
                type: "DELETE",
                url: "pictures/delete",
                contentType: "application/json",
                beforeSend: function (request) {

                    request.setRequestHeader("token", getCookie("token"));
                },
                data: JSON.stringify(ids),
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
    });
}


function reload() {
    reset();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}