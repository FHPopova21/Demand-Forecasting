import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleData = [
  { id: "FOODS_1_001", store: "CA_1", dept: "FOODS_1", sales: 142, price: 3.97 },
  { id: "FOODS_1_002", store: "CA_2", dept: "FOODS_1", sales: 98, price: 2.49 },
  { id: "HOBBIES_1_001", store: "TX_1", dept: "HOBBIES_1", sales: 215, price: 12.99 },
  { id: "HOUSEHOLD_1_001", store: "WI_1", dept: "HOUSEHOLD_1", sales: 76, price: 5.49 },
  { id: "FOODS_2_001", store: "CA_3", dept: "FOODS_2", sales: 189, price: 4.29 },
];

const DataExplorer = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Browse and analyze M5 competition dataset
        </p>
      </div>

      <Card className="shadow-sm border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Sample Data Preview</h3>
          <p className="text-sm text-muted-foreground mt-1">Recent sales records across hierarchy</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.store}</TableCell>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell className="text-right">{row.sales}</TableCell>
                  <TableCell className="text-right">${row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">Dataset Size</h4>
          <p className="text-3xl font-bold text-primary">30,490</p>
          <p className="text-sm text-muted-foreground mt-1">Total records</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">Date Range</h4>
          <p className="text-3xl font-bold text-primary">1,941</p>
          <p className="text-sm text-muted-foreground mt-1">Days of data</p>
        </Card>
        <Card className="p-6 shadow-sm border-border">
          <h4 className="font-semibold text-foreground mb-2">Features</h4>
          <p className="text-3xl font-bold text-primary">45+</p>
          <p className="text-sm text-muted-foreground mt-1">Engineered features</p>
        </Card>
      </div>
    </div>
  );
};

export default DataExplorer;
