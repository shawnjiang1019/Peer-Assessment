"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Student = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-6">
        You have the following surveys to complete:
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between p-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>STAC67</CardTitle>
            <CardDescription>Group 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Regression Analysis</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>CSCC01</CardTitle>
            <CardDescription>Group: 4</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Intro to Software Engineering</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>CSCC01</CardTitle>
            <CardDescription>Group: 4</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Intro to Software Engineering</p>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default Student;