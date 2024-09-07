$(document).ready(function() {
    // 既存のsubmitイベントを解除してから新しくバインド
    $("#contact-form").off("submit").on("submit", submitToAPI);
});

function submitToAPI(e) {
    e.preventDefault();  // フォームのデフォルト送信動作を停止

    // 送信ボタンを無効化して二重送信を防止
    $("#submit-button").prop("disabled", true);

    var URL = "https://your-api-id.execute-api.your-region.amazonaws.com/your-stage/form-api";

    // フォームの入力値をチェック
    var namePattern = /.{2,}/;  // 2文字以上の名前をチェック
    if (!namePattern.test($("#name-input").val())) {
        alert("お名前は2文字以上記入してください。");
        $("#submit-button").prop("disabled", false);  // ボタンを再度有効化
        return;
    }

    var subjectPattern = /.{2,}/;
    if (!subjectPattern.test($("#subject").val())) {
        alert("件名は2文字以上記入してください。");
        $("#submit-button").prop("disabled", false);  // ボタンを再度有効化
        return;
    }

    if ($("#email-input").val() === "") {
        alert("メールアドレスを入力してください。");
        $("#submit-button").prop("disabled", false);  // ボタンを再度有効化
        return;
    }

    var emailPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
    if (!emailPattern.test($("#email-input").val())) {
        alert("正しいメールアドレスを入力してください。");
        $("#submit-button").prop("disabled", false);  // ボタンを再度有効化
        return;
    }

    // フォームの入力データを取得
    var name = $("#name-input").val();
    var subject = $("#subject").val();
    var email = $("#email-input").val();
    var desc = $("#description-input").val();

    // JSON形式のデータを作成 (body内に文字列化されたJSON)
    var requestBody = {
        body: JSON.stringify({
            name: name,
            subject: subject,
            email: email,
            desc: desc
        })
    };

    // Ajaxを使ってAPI GatewayにPOSTリクエストを送信
    $.ajax({
        type: "POST",
        url: URL,
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(requestBody),  // リクエスト全体をJSON文字列にして送信

        success: function() {
            alert("メッセージが送信されました！");
            document.getElementById("contact-form").reset();  // フォームをリセット
            location.reload();  // ページをリロード
        },
        error: function(xhr, status, error) {
            alert("メッセージ送信失敗！: " + xhr.responseText);
        },
        complete: function() {
            // 送信完了後に送信ボタンを再度有効化
            $("#submit-button").prop("disabled", false);
        }
    });
}
