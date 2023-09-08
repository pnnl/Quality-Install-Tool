import React, { FC } from 'react';

interface ConditionalProps {
    condition: boolean;
    children: React.ReactNode
}

const Conditional: FC<ConditionalProps> = ({ condition, children }) => {
    return condition ? <>{children}</> : null;
};

export default Conditional;