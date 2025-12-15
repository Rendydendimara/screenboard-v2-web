import { AdminGlobalComponentManager } from "@/components/AdminGlobalComponentManager";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminGlobalComponents() {
  return (
    <AdminLayout>
      <AdminGlobalComponentManager />
    </AdminLayout>
  );
}
