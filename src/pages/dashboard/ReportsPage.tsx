import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Download, FileText } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: "Monthly Revenue Report",
      type: "Financial",
      date: "March 2024",
      status: "Generated",
      size: "2.5 MB",
    },
    {
      id: 2,
      name: "Tour Performance Analysis",
      type: "Analytics",
      date: "February 2024",
      status: "Generated",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Vehicle Usage Report",
      type: "Operations",
      date: "January 2024",
      status: "Generated",
      size: "3.2 MB",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Select>
            <option value="">All Types</option>
            <option value="financial">Financial</option>
            <option value="analytics">Analytics</option>
            <option value="operations">Operations</option>
          </Select>
          <Select>
            <option value="">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-year">Last Year</option>
          </Select>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{report.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Generate Custom Report Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Generate Custom Report</h2>
          <p className="text-gray-600">
            Need a specific report? Select your parameters and generate a custom report
            tailored to your needs.
          </p>
          <div className="flex gap-4">
            <Select className="flex-1">
              <option value="">Select Report Type</option>
              <option value="revenue">Revenue Report</option>
              <option value="tours">Tours Report</option>
              <option value="vehicles">Vehicles Report</option>
              <option value="employees">Employees Report</option>
            </Select>
            <Button>Generate Custom Report</Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 