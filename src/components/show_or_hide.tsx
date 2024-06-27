import React, { FC, ReactNode } from 'react';

interface ShowOrHideProps {
    children: ReactNode;
    label: string;
    visible: boolean;
}

/**
 * A component that conditionally shows or hides its children based on the 'visible' prop.
 * If 'visible' is true, it renders the 'children'; otherwise, it renders nothing.
 * @param props The component props containing 'children', 'label', and 'visible'.
 */
const ShowOrHide: FC<ShowOrHideProps> = ({ children, label, visible }) => {
    // Use ternary operator to conditionally render children based on 'visible'
    const contentToBeShown = visible ? children : "";

    return (
        <>
            {contentToBeShown}
        </>
    );
}

export default ShowOrHide;
