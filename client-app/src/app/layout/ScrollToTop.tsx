import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const ScrollToTopComponent: React.FC<RouteComponentProps> = ({ 
    children, 
    location: { pathname }
}: any) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
};

export const ScrollToTop = withRouter(ScrollToTopComponent);