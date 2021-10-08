(async function getProfile() {
    console.log(1)
    try {
        console.log(2)
        $.ajax({
            method: "GET",
            url: "/users/me",
            dataType: "json"
        }).done(function (user) {
            console.log(3)

            $("#name").text(user.name);
            $("#email").text(user.email);
            $("#password").text(user.password);
            // $("#addData")
            //          .append($("<tr>")
            //          .append($("<input>").text(user.name)))
            //          .append($("<input>").text(user.email))
            //          .append($("<input>").text(user.password))

            // $.each(user, function(i, user) {
            //     console.log(3)
            //     $("#addData")
            //         .append($("<tr>")
            //         .append($("<input>").text(user.name)))
            //         .append($("<input>").text(user.email))
            //         .append($("<input>").text(user.password))
            // });
        })
    } catch (error) {
        console.log(error);
    }
})();

//Getting the user data
// (async function getProfile() {
//     console.log(1)
//     try {
//         $.ajax({
//             method: "GET",
//             url: "/users/me",
//             dataType: "json",
//         }).done(function (user) {
//             console.log(2)

//             // Adding profile info for profile page
//             $("#name").val(user.name);
//             $("#email").val(user.email);
//             $("#password").val(user.email);


//         });

//     } catch (error) {
//         console.log(error);
//     }

// })();

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


