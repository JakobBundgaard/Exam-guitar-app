(async function getMessages() {
    try {
        $.ajax({
            method: "GET",
            url: "/tasks",
            dataType: "json"
        }).done(function (data) {
            $.each(data, function (i, tasks) {
                $("#addData")
                    .append($("<tr>")
                        .append($("<input>").val(tasks.description)))
            });
        })

    } catch (error) {
        console.log(error);
    }

})();
