import React, { FC, ReactNode } from 'react';

interface ShowOrHideProps {
    children: ReactNode;
    label: string;
    visible: boolean;
}

/**
 * A component that conditionally shows or hides its children based on the 'visible' prop.
 * If 'visible' is true, it renders the 'children'; otherwise, it renders nothing.
 */
const ShowOrHide: FC<ShowOrHideProps> = ({ children, label, visible }) => {
    /* Conditionally render children based on 'visible' */
    return (
        <>
            {visible && children}
        </>
    );
}

export default ShowOrHide;
