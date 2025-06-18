import { DashboardLayout } from '../components/DashboardLayout';
import { Header } from '../components/Header';
import { TaskStats } from '../components/TaskStats';
import { TaskList } from '../components/TaskList';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Header title="Minhas Tarefas" />
      <TaskStats />
      <TaskList />
    </DashboardLayout>
  );
} 