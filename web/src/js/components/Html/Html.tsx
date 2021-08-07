import React from 'react'

type IndexHTMLProps = {
    injection: string, // should pass rendered string here 
    styleSheets: string[]
    jsfile: string
}
// class only for react server side rendering 
export default function ({ injection, styleSheets, jsfile }: IndexHTMLProps) {
    return <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="description" content="App for sql tasks organize" />
            <meta name="keywords" content="SQL, Python, Application, Management" />
            <meta name="author" content="Maciej Hankus" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {styleSheets.map((item,index)=>{
                return <style id={`jss-server-side-${index}`} dangerouslySetInnerHTML={{ __html: item }} key={index}></style>
            })}
            <title>SQL Organizer</title>
        </head>
        <body>
            <div id="app" dangerouslySetInnerHTML={{ __html: injection }} className=""></div>
            <script type="text/javascript" src={"/public/js/"+jsfile}></script>
        </body>
    </html>
}