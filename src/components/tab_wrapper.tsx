import {FC} from 'react'
import React from 'react';
import Tab from 'react-bootstrap/Tab'

interface CustomTabProps extends React.ComponentProps<typeof Tab> {
  print?: boolean;
}

const CustomTab: React.FC<CustomTabProps> = ({print = false, ...tabProps }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
        {print && (
          <button className="btn btn-primary" onClick={handlePrint}>
            Print
          </button>
        )}
    
    <Tab {...tabProps} />
    </div>
  );
};

export default CustomTab