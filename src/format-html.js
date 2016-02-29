export default function(script) {
    return `
        <!DOCTYPE html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">

                <title>Quik Playground</title>
            </head>
            <body>
                <div id="root"></div>

                <script src="${script}"></script>
            </body>
        </html>
    `;
}
