import { DashboardLayout } from '../components/DashboardLayout/DashboardLayout';
import { Header } from '../components/Header/Header';
import { ProjectProgressChart } from '../components/ProjectProgressChart/ProjectProgressChart';
import { TaskTable } from '../components/TaskTable/TaskTable';  


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