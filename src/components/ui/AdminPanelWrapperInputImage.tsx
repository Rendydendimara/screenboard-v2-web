import { ReactNode } from 'react';

type AdminPanelLayoutType = {
  children: ReactNode;
};

function AdminPanelWrapperInputImage({ children }: AdminPanelLayoutType) {
  return (
    <div className="flex w-full items-start gap-6 sm:flex-col lg:flex-row">
      {children}
    </div>
  );
}

export default AdminPanelWrapperInputImage;
