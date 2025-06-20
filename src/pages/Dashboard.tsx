import { DashboardLayout } from '../components/DashboardLayout/DashboardLayout';
import { Header } from '../components/Header/Header';
import { TaskStats } from '../components/TaskStats/TaskStats';
import { TaskList } from '../components/TaskList/TaskList';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Header title="Minhas Tarefas" />
      <TaskStats />
      <TaskList />
    </DashboardLayout>
  );
} 