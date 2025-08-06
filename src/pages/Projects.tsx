import React from 'react';
import Header from '@/components/Header';
import ProjectManagement from '@/components/ProjectManagement';

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <ProjectManagement />
      </div>
    </div>
  );
};

export default Projects;