import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    //to get path of the current url
    const { pathname } = useLocation();
    useEffect(() => {
        //scroll to top everytime we change the path or page
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default ScrollToTop;
