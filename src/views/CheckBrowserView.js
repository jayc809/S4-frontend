import React, { useEffect, useState } from 'react';

const CheckBrowserView = () => {

    const [supported, setSupported] = useState(true)

    useEffect(() => {
        // Opera 8.0+
        const isOpera = (!!window.opr) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        const isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

        // Edge 20+
        const isEdge = !!window.StyleMedia;

        // Chrome 1 - 79
        const isChrome = !!window.chrome

        // Edge (based on chromium) detection
        const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

        console.log(`isOpera: ${isOpera}`)
        console.log(`isFirefox: ${isFirefox}`)
        console.log(`isSafari: ${isSafari}`)
        console.log(`isEdge: ${isEdge}`)
        console.log(`isChrome: ${isChrome}`)
        console.log(`isEdgeChromium: ${isEdgeChromium}`)

        if (!isChrome) {
            setSupported(false)
        }
    }, [])

    return (
        <div>
            {
                supported ? 
                <div></div> :
                <div id='check-browser-container'>
                    <text>Browser not supported at the moment.<br/><br/>Chrome is recommended for the best experience.</text>
                </div>
            }
        </div>
    );
};

export default CheckBrowserView;