(async function getPractice() {
    try {
        console.log(1)
        $.ajax({
            method: "GET",
            url: "/tasks",
            dataType: "json"
        }).done(function (data) {

            $.each(data, function (i, tasks) {
                console.log(3)
                $("#addData")
                    .append($("<tr>")
                        .append($("<input>").val(tasks.description)))
            });
        })

    } catch (error) {
        console.log(error);
    }

})();

// $(document).ready(function() {
//     getPractice()
// })