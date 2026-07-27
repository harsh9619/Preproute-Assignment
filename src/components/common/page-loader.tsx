import React from 'react';

interface PageLoaderComponentProps {
  isLoading?: boolean;
}

const PageLoaderComponent: React.FC<PageLoaderComponentProps> = ({
  isLoading = true,
}) => (
  <>
    {isLoading && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div className="flex items-center justify-center">
          <div className="h-24 w-24 animate-spin rounded-full border-8 border-gray-200 border-t-blue-600" />
        </div>
      </div>
    )}
  </>
);

export default PageLoaderComponent;