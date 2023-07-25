import React, { FC } from "react"

/* 
This element provides a fallback state for the router element
It is displayed when the router encounters an error and cannot render the requested page
This should be used when there is no other way to recover from the error and a component fails to render
*/
const RouterErrorElement: FC = () => {
    return (
        <div>
            <h1>An Unexpected Error Has Occurred</h1>
            <p>
                To recover, try the following:
                <ul>
                    <li>Refresh the browser</li>
                    <li>Go back to the <a href="/">home screen</a></li>
                </ul>
            </p>
        </div>
    )
}

export default RouterErrorElement