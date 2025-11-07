import { Spin } from "antd";
import { Suspense, type ComponentType, type LazyExoticComponent, type ReactElement } from "react";

const withSuspense = (Component: LazyExoticComponent<ComponentType>): ReactElement => {
  return (
    <Suspense fallback={<div className="text-center"><Spin/> Đang tải trang...</div>}>
      <Component />
    </Suspense>
  );
};

export default withSuspense;