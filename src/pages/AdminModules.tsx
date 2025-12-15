import { AdminModuleManager } from "@/components/AdminModuleManager";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminModules() {
  return (
    <AdminLayout>
      <AdminModuleManager />
    </AdminLayout>
  );
}
