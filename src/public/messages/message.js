// (async function getMessages() {
//     try {
//         console.log(1)
//         $.ajax({
//             method: "GET",
//             url: "/tasks",
//             dataType: "json"
//         }).done(function (data) {
//             console.log(2)
//             $.each(data, function (i, tasks) {
//                 console.log(3)
//                 $("#addData")
//                     .append($("<tr>")
//                         .append($("<input>").val(tasks.description)))
//             });
//         })

//     } catch (error) {
//         console.log(error);
//     }

// })();

(async function getMessages() {
    try {
        console.log(1)
        fetch('/tasks', {

            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
            .then(response => response.json())
            .then(data => console.log(data));




    } catch (error) {
        console.log(error);
    }

})();



// (async function getMessages() {
//     try {
//         console.log(1)
//         fetch('/tasks', {

//             method: 'GET', // *GET, POST, PUT, DELETE, etc.
//         })
//             .then(response => response.json())
//             .then(data => console.log(data));




//     } catch (error) {
//         console.log(error);
//     }

// })();

// $(document).ready(function() {
//     getMessages()
// })