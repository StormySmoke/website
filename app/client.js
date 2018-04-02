//window.sent2VecId = null;
$(document).ajaxStart(function() {
  $(".loading").show();
});
$(document).ajaxStop(function() {
  $(".loading").hide();
});
$(document).ready(function(){
  $.ajaxSetup({
    timeout: 0
  });
  // On clicking "Query" button, make POST to /knn with query sentence
  $("#submit-query").click(function(){
    if (window.sessionStorage.sent2VecId == null) {
      alert("Please encode some text first.");
      $("#input-text").focus();
    } else {
      $.post("knn",
              { query: $("#input-query").val(), id: window.sessionStorage.sent2VecId },
              function(data, status, xhr) {
                if (xhr.status == "200") {
                  html = formatKnnResult(JSON.parse(data));
                  $("#output-result").html(html);
                  $("#div-result").show();
                }
                else
                  alert("Server error: " + xhr.status);
             });
    }
  });

  // On clicking "Encode" button, make POST to /encode with text
  $("#submit-text").click(function(){
    $("#output-result").text("");
    $("#div-result").hide();
    $.post("encode",
            { text: $("#input-text").val() },
            function(data, status, xhr){
              if (xhr.status == "200")
                window.sessionStorage.sent2VecId = JSON.parse(data)['id']
              else if (xhr.status == "503")
                // This is NOT reached when the Heroku request timeout is hit
                alert("Request timeout. Try with a shorter text.");
              else
                alert("Server error: " + xhr.status);
            }
    );
  });

  function formatKnnResult(result) {
    html = '<ol id="result-list">'
    for (var i = 0; i < result.sent.length; i++) {
      html += '<li>' + result.sent[i] + '<ul><li>Distance: ' + Math.round(result.dist[i] * 1000000)/1000000 + '</li></ul>';
    }
    html += '</ol>';
    return html;
  }

});
