import React, { FC } from 'react';
import { NoDataComponentProps } from '../../store/types';
import NODATAICON from '../../style/images/img-no-data.svg';

const NoData: FC<NoDataComponentProps> = ({
  message,
  className,
  description = '',
  showErrorIcon = false,

}) => (
  <div className="">
    
        {showErrorIcon && (
          <img
            src={NODATAICON}
            alt="no-data"
            role="presentation"
            className="w-20 h-20 mb-4 block font-normal mx-auto mt-[2%] text-center [&>span]:block"
          />
        )}
      
    <div className="text-sm font-semibold text-slate-800">
      {message}
    </div>
    {
        description && <div className="text-sm font-semibold text-slate-800 pt-2">{description}</div>
      }
  </div>
);

export default NoData;

