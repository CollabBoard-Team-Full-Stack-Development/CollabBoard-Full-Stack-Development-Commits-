import React from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  BarChart3,
  Activity,
  Users,
  Sparkles,
} from 'lucide-react';

import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import DashboardHeader from '../components/layout/DashboardHeader';
import StatsCard from '../components/layout/StatsCard';
import TaskColumn from '../components/layout/TaskColumn';
import ActivityItem from '../components/layout/ActivityItem';
import TeamMember from '../components/layout/TeamMember';
import NewTaskModal from '../components/modals/NewTaskModal';

import { useApp } from '../context/AppContext';

export const Dashboard = () => {
  const {
    tasks,
    activities,
    members,
    isSidebarCollapsed,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
  } = useApp();

  // Task Column Filter Groups
  const todoTasks = tasks.filter((t) => t.status === 'To Do');
  const doingTasks = tasks.filter((t) => t.status === 'Doing');
  const doneTasks = tasks.filter((t) => t.status === 'Done');

  // Stats Metrics
  const totalTasks = tasks.length;
  const todoCount = todoTasks.length;
  const doingCount = doingTasks.length;
  const doneCount = doneTasks.length;

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar />

        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Header Banner */}
          <DashboardHeader />

          {/* Statistics Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="To Do"
              count={todoCount}
              icon={ListTodo}
              color="#F59E0B"
              percentage="+2 new"
              description="pending execution"
            />
            <StatsCard
              title="In Progress"
              count={doingCount}
              icon={Clock}
              color="#8B5CF6"
              percentage="4 active"
              description="in development"
            />
            <StatsCard
              title="Completed"
              count={doneCount}
              icon={CheckCircle2}
              color="#22C55E"
              percentage="100%"
              description="verified sprint backlog"
            />
            <StatsCard
              title="Total Tasks"
              count={totalTasks}
              icon={BarChart3}
              color="#3B82F6"
              percentage="Sprint 1"
              description="tracked items"
            />
          </section>

          {/* Core Content Grid: Kanban Board + Feeds */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* Kanban Columns (Spans 3 Columns) */}
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={todoTasks}
                count={todoCount}
                statusColor="#F59E0B"
              />
              <TaskColumn
                title="Doing"
                tasks={doingTasks}
                count={doingCount}
                statusColor="#8B5CF6"
              />
              <TaskColumn
                title="Done"
                tasks={doneTasks}
                count={doneCount}
                statusColor="#22C55E"
              />
            </div>

            {/* Sidebar Feed Widgets (Spans 1 Column) */}
            <div className="space-y-6">
              {/* Recent Activity Section */}
              <div className="glass-card rounded-2xl p-5 border border-border shadow-card-glow">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple" />
                    <h3 className="text-sm font-bold text-text-primary">
                      Recent Activity
                    </h3>
                  </div>
                  <span className="text-[10px] bg-purple/10 text-purple font-semibold px-2 py-0.5 rounded-full border border-purple/20">
                    Live
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Team Members Section */}
              <div className="glass-card rounded-2xl p-5 border border-border shadow-card-glow">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple" />
                    <h3 className="text-sm font-bold text-text-primary">
                      Team Members
                    </h3>
                  </div>
                  <span className="text-[10px] text-text-muted font-medium">
                    {members.length} Active
                  </span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {members.map((member) => (
                    <TeamMember key={member.id} member={member} />
                  ))}
                </div>
              </div>

              {/* Pro Workspace Banner Card */}
              <div className="glass-card rounded-2xl p-5 border border-purple/30 bg-gradient-to-br from-purple/10 to-transparent relative overflow-hidden">
                <div className="flex items-center gap-2 text-purple text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Pro Plan Active</span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Real-time sync disabled in Week 1 frontend mock environment.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Global New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;