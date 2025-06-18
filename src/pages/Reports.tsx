import { DashboardLayout } from '../components/DashboardLayout';
import { Header } from '../components/Header';
import { ProjectProgressChart } from '../components/ProjectProgressChart';
import { TaskTable } from '../components/TaskTable';

export default function Reports() {
  return (
    <DashboardLayout>
      <Header title="Relatórios" />
      <div className="p-6 max-w-6xl mx-auto">
        <ProjectProgressChart />
        <TaskTable />
      </div>
    </DashboardLayout>
  );
} 