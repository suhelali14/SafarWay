import { Helmet } from 'react-helmet-async';

import { NewPackagePage } from './new';

export const PackageCreatePage = () => {
  return (
    <>
      <Helmet>
        <title>Create New Package | SafarWay Agency</title>
      </Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Package</h1>
        <NewPackagePage />
      </div>
    </>
  );
}; 