import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  MapPin, 
  Thermometer, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const projects = [
    { id: 1, name: "Highway 101 Resurfacing", status: "In Progress", progress: 65, location: "San Francisco, CA" },
    { id: 2, name: "Downtown Street Repair", status: "Planning", progress: 25, location: "Oakland, CA" },
    { id: 3, name: "Airport Runway Maintenance", status: "Completed", progress: 100, location: "SFO, CA" },
  ];

  const kpis = [
    { title: "Active Projects", value: "12", icon: Activity, trend: "+2" },
    { title: "Completion Rate", value: "94%", icon: CheckCircle2, trend: "+3%" },
    { title: "Weather Delays", value: "3", icon: Thermometer, trend: "-1" },
    { title: "Scheduled Tasks", value: "45", icon: Calendar, trend: "+8" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-industrial transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-industrial-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-industrial-orange">{kpi.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-industrial-orange" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge 
                    variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "secondary" : "outline"}
                    className={project.status === "Completed" ? "bg-industrial-orange text-industrial-dark" : ""}
                  >
                    {project.status === "In Progress" && <Clock className="h-3 w-3 mr-1" />}
                    {project.status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {project.status === "Planning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {project.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-industrial-blue" />
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Temperature</span>
                <span className="font-medium text-foreground">72°F</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Humidity</span>
                <span className="font-medium text-foreground">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wind Speed</span>
                <span className="font-medium text-foreground">8 mph</span>
              </div>
              <div className="pt-2">
                <Badge className="bg-industrial-blue/20 text-industrial-blue border-industrial-blue">
                  Optimal Paving Conditions
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-industrial-orange" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projects This Month</span>
                <span className="font-medium text-foreground">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Completion</span>
                <span className="font-medium text-foreground">12.5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quality Score</span>
                <span className="font-medium text-foreground">98.2%</span>
              </div>
              <div className="pt-2">
                <Badge className="bg-industrial-orange/20 text-industrial-orange border-industrial-orange">
                  Above Target
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;