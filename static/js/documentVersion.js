$(document).ready(function() {
    var documentId = getIdFromUrl();
    $("#viewVersionsButton").click(function() {
        window.location.href = '/get_version' + '/' + documentId + '/' + 1;
    });
});