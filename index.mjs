import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
const ses = new AWS.SES();

// 入力データをサニタイズする関数
const sanitizeInput = (input) => {
    // XSS対策として <, >, &, ", ' のエスケープ処理
    return input.replace(/[<>&"'\/]/g, (char) => {
        const escapeChars = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return escapeChars[char] || char;
    });
};

// メール送信用の関数
export const handler = async (event) => {
    // リクエストボディをJSONとしてパース
    const body = JSON.parse(event.body);

    // サニタイズ処理を適用
    const sanitizedBody = {
        name: sanitizeInput(body.name),
        subject: sanitizeInput(body.subject),
        email: sanitizeInput(body.email),
        desc: sanitizeInput(body.desc)
    };

    // メール送信のパラメータ
    const params = {
        Destination: {
            // 宛先のメールアドレスを設定（一般化されたアドレスに変更する必要あり）
            ToAddresses: ['your-email@domain.com']
        },
        Message: {
            Body: {
                Text: {
                    // サニタイズされたデータをメール本文に使用
                    Data: `● お名前: ${sanitizedBody.name}\n● 件名: ${sanitizedBody.subject}\n● メール: ${sanitizedBody.email}\n● 内容: ${sanitizedBody.desc}`,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                // サニタイズされたデータを件名に使用
                Data: `お問い合わせフォーム：${sanitizedBody.name}`,
                Charset: 'UTF-8'
            }
        },
        // 送信元のメールアドレス（SESで認証済みのアドレスに変更する必要あり）
        Source: 'your-ses-verified-email@domain.com'
    };

    try {
        // SES経由でメールを送信
        const data = await ses.sendEmail(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'メール送信に成功しました！' }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        };
    } catch (err) {
        console.error("メール送信に失敗しました:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'メール送信に失敗しました。' }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        };
    }
};
