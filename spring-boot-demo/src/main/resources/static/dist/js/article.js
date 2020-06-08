
$('#articleModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

var editor;
$(function () {
    
    $('.alert-danger').css("display", "none");

    
    editor = KindEditor.create('textarea[id="editor"]', {
        items: ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'multiimage',
            'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink'],
        uploadJson: 'images/upload',
        filePostName: 'file'
    });

    $('#articleModal').on('hidden.bs.modal', function () {
        editor.html('Pls enter...');
    })

    $('#articleModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'articles/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, key: true, hidden: true},
            {label: 'Article Title', name: 'articleTitle', index: 'articleTitle', width: 240},
            {label: 'Add Name', name: 'addName', index: 'addName', width: 120},
            {label: 'Create time', name: 'createTime', index: 'createTime', width: 120},
            {label: 'Update time', name: 'updateTime', index: 'updateTime', width: 120}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50],
        styleUI: 'Bootstrap',
        loadtext: 'Loading...',
        rownumbers: false,
        rownumWidth: 20,
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
            order: "order",
        },
        gridComplete: function () {

            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});


$('#saveButton').click(function () {

    if (validObject()) {

        // ajax
        var id = $("#articleId").val();
        var title = $("#articleName").val();
        var addName = $("#articleAuthor").val();
        var content = editor.html();
        var data = {"articleTitle": title, "articleContent": content, "addName": addName};
        var url = 'articles/save';
        var method = 'POST';

        if (id > 0) {
            data = {"id": id, "articleTitle": title, "articleContent": content, "addName": addName};
            url = 'articles/update';
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
                    $('#articleModal').modal('hide');
                    swal("Success", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#articleModal').modal('hide');
                    swal("Fail", {
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

function articleAdd() {
    reset();
    $('.modal-title').html('Add');
    $('#articleModal').modal('show');
}

function articleEdit() {
    reset();
    $('.modal-title').html('Edit');

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    $.get("articles/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {

            $('#articleId').val(r.data.id);
            $('#articleName').val(r.data.articleTitle);
            $('#articleAuthor').val(r.data.addName);
            editor.html('');
            editor.html(r.data.articleContent);
        }
    });

    $('#articleModal').modal('show');
}


function validObject() {
    var articleName = $('#articleName').val();
    if (isNull(articleName)) {
        showErrorInfo("Title can not be blank!");
        return false;
    }
    if (!validLength(articleName, 120)) {
        showErrorInfo("Article name can above 120!");
        return false;
    }
    var articleAuthor = $('#articleAuthor').val();
    if (isNull(articleAuthor)) {
        showErrorInfo("Author can not be blank!");
        return false;
    }
    if (!validLength(articleAuthor, 10)) {
        showErrorInfo("error");
        return false;
    }
    var ariticleContent = editor.html();
    if (isNull(ariticleContent) || ariticleContent == 'Enter...') {
        showErrorInfo("error");
        return false;
    }
    if (!validLength(ariticleContent, 8000)) {
        showErrorInfo("error");
        return false;
    }
    return true;
}


function reset() {

    $('.alert-danger').css("display", "none");

    $('#articleId').val(0);
    $('#articleName').val('');
    $('#articleAuthor').val('');
    $('#ariticleContent').val('');
}

function deleteArticle() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "Elert",
        text: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            $.ajax({
                type: "DELETE",
                url: "articles/delete",
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