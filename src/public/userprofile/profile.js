(async function getProfile() {
    console.log(1)
    try {
        console.log(2)
        $.ajax({
            method: "GET",
            url: "/users/me",
            dataType: "json"
        }).done(function (user) {

            console.log("get " + 3)
            $("#addData")
                .append($("<tr>"))
                .append($("<input>").val(user.name))
                .append($("<tr>"))
                .append($("<input>").val(user.email))
                .append($("<tr>"))
                .append($("<input>").val(user.password))
                ;
        })
    } catch (error) {
        console.log(error);
    }
})();

(async function editProfile() {
    try {
        $.ajax({
            method: "POST",
            url: "/users/me",
            dataType: "json"
        }).done(function (user) {
            $("#addData")
                .append($("<tr>"))
                .append($("<input>").val(user.name))
                .append($("<tr>"))
                .append($("<input>").val(user.email))
                .append($("<tr>"))
                .append($("<input>").val(user.password))
                ;
        })
    } catch (error) {
        console.log(error);
    }
})();

// Delete the user
function deleteUser() {
    console.log(1)
    try {
        console.log(2)
        $.ajax({
            method: "DELETE",
            url: "/users/me",
            dataType: "json"
        }).done(
            console.log(3)
        );

    } catch (error) {
        alert("Error occured when deleting user - Please try again");
        console.log(error);
    }
};

// Button function logout all users
function logoutAll() {
    try {
        $.ajax({
            method: "POST",
            url: "/users/logoutAll",
            dataType: "json"
        }).done(

        );

    } catch (error) {
        alert("Error occured when login out - Please try again");
        console.log(error);
    }
};