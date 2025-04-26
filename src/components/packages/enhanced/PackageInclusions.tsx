import React, { useState } from "react";
import { Check, X } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PackageInclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export const PackageInclusions: React.FC<PackageInclusionsProps> = ({
  inclusions = [],
  exclusions = [],
}) => {
  const [activeTab, setActiveTab] = useState<string>("inclusions");

  const formatItems = (items: string[]) => {
    return items.map((item, index) => (
      <div key={index} className="flex items-start space-x-2 mb-2">
        {activeTab === "inclusions" ? (
          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <span>{item}</span>
      </div>
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Package Details</CardTitle>
        <CardDescription>
          What's included and excluded in this package
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="inclusions"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inclusions">
              Inclusions ({inclusions.length})
            </TabsTrigger>
            <TabsTrigger value="exclusions">
              Exclusions ({exclusions.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inclusions">
            <div className="mt-4 space-y-1">
              {inclusions.length > 0 ? (
                formatItems(inclusions)
              ) : (
                <p className="text-muted-foreground italic">
                  No inclusions specified for this package.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="exclusions">
            <div className="mt-4 space-y-1">
              {exclusions.length > 0 ? (
                formatItems(exclusions)
              ) : (
                <p className="text-muted-foreground italic">
                  No exclusions specified for this package.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PackageInclusions; 