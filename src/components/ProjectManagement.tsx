import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, MapPin, DollarSign, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  project_type: 'sealcoating' | 'asphalt_paving' | 'line_striping' | 'crack_sealing' | 'pothole_repair' | 'overlay' | 'maintenance';
  start_date: string;
  end_date: string;
  site_address: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  estimated_cost: number;
  actual_cost: number;
  created_at: string;
  created_by: string;
}

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  target_date: string;
  completed_date: string;
  tasks: string[];
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    project_type: 'asphalt_paving' as const,
    start_date: '',
    end_date: '',
    site_address: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    estimated_cost: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones(selectedProject.id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  };

  const fetchMilestones = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('target_date', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const createProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create projects",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...newProject, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setIsCreatingProject(false);
      setNewProject({
        name: '',
        description: '',
        project_type: 'asphalt_paving',
        start_date: '',
        end_date: '',
        site_address: '',
        client_name: '',
        client_phone: '',
        client_email: '',
        estimated_cost: 0
      });

      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status } : p
      ));

      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: "Success",
        description: "Project status updated",
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'on_hold': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'asphalt_paving': return 'Asphalt Paving';
      case 'sealcoating': return 'Sealcoating';
      case 'crack_filling': return 'Crack Filling';
      case 'line_striping': return 'Line Striping';
      case 'patching': return 'Patching';
      default: return type;
    }
  };

  const calculateProgress = (project: Project) => {
    const projectMilestones = milestones.filter(m => m.project_id === project.id);
    if (projectMilestones.length === 0) return 0;
    
    const completedMilestones = projectMilestones.filter(m => m.status === 'completed');
    return (completedMilestones.length / projectMilestones.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Project Management</h2>
          <p className="text-muted-foreground">Manage asphalt projects from start to finish</p>
        </div>
        <Button 
          onClick={() => setIsCreatingProject(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground">
                      {projects.filter(p => p.status === 'in_progress').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {projects.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card className="bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedProject(project)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getProjectTypeLabel(project.project_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{project.client_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.site_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${project.estimated_cost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {calculateProgress(project).toFixed(0)}% Complete
                      </p>
                      <Progress value={calculateProgress(project)} className="w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.status === 'in_progress').map((project) => (
              <Card key={project.id} className="bg-card border-border shadow-industrial hover:shadow-glow transition-shadow cursor-pointer" onClick={() => setSelectedProject(project)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.client_name}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{calculateProgress(project).toFixed(0)}%</span>
                    </div>
                    <Progress value={calculateProgress(project)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(project.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(project.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Estimated Cost</span>
                    <span className="font-semibold text-primary">${project.estimated_cost?.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProjectStatus(project.id, 'completed');
                      }}
                    >
                      Mark Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProjectStatus(project.id, 'on_hold');
                      }}
                    >
                      Hold
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedProject ? (
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-industrial">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">{selectedProject.name}</CardTitle>
                      <p className="text-muted-foreground">{selectedProject.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {selectedProject.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {getProjectTypeLabel(selectedProject.project_type)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Client Information
                      </h3>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Name:</span> {selectedProject.client_name}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {selectedProject.client_phone}</p>
                        <p><span className="text-muted-foreground">Email:</span> {selectedProject.client_email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Project Details
                      </h3>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Site Address:</span> {selectedProject.site_address}</p>
                        <p><span className="text-muted-foreground">Start Date:</span> {new Date(selectedProject.start_date).toLocaleDateString()}</p>
                        <p><span className="text-muted-foreground">End Date:</span> {new Date(selectedProject.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        Financial Information
                      </h3>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Estimated Cost:</span> ${selectedProject.estimated_cost?.toLocaleString()}</p>
                        <p><span className="text-muted-foreground">Actual Cost:</span> ${selectedProject.actual_cost?.toLocaleString() || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Overall Progress</span>
                          <span className="font-medium">{calculateProgress(selectedProject).toFixed(0)}%</span>
                        </div>
                        <Progress value={calculateProgress(selectedProject)} />
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  {milestones.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Project Milestones</h3>
                      <div className="space-y-3">
                        {milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                            <div className={`h-3 w-3 rounded-full ${milestone.status === 'completed' ? 'bg-green-500' : milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{milestone.title}</p>
                              <p className="text-sm text-muted-foreground">{milestone.description}</p>
                              <p className="text-xs text-muted-foreground">Target: {new Date(milestone.target_date).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Project Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Select a project from the overview or active projects tab to view detailed information.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground">Create New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select value={newProject.project_type} onValueChange={(value) => setNewProject(prev => ({ ...prev, project_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asphalt_paving">Asphalt Paving</SelectItem>
                      <SelectItem value="sealcoating">Sealcoating</SelectItem>
                      <SelectItem value="crack_filling">Crack Filling</SelectItem>
                      <SelectItem value="line_striping">Line Striping</SelectItem>
                      <SelectItem value="patching">Patching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    value={newProject.client_name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Client Phone</Label>
                  <Input
                    id="client-phone"
                    value={newProject.client_phone}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client_phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-email">Client Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newProject.client_email}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-address">Site Address</Label>
                <Input
                  id="site-address"
                  value={newProject.site_address}
                  onChange={(e) => setNewProject(prev => ({ ...prev, site_address: e.target.value }))}
                  placeholder="Project site address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated-cost">Estimated Cost</Label>
                  <Input
                    id="estimated-cost"
                    type="number"
                    value={newProject.estimated_cost || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, estimated_cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                  Cancel
                </Button>
                <Button onClick={createProject} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;