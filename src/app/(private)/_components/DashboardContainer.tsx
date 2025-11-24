"use client";

import DashboardClient from "./DashboardClient";

const DashboardContainer = () => {
  return (
    <div className="overflow-auto p-0">
      <div className="flex flex-col p-6 pt-0 gap-4">
        <DashboardClient />
      </div>
    </div>
  );
};

export default DashboardContainer;
