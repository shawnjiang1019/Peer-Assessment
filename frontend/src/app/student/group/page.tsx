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

import { useRouter } from "next/navigation";
const Group = () => {
  const router = useRouter();
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-6">
        You have the following group members to evaluate:
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between p-4">
        
        <Card className="flex-1">
          <button type="button" onClick={() => router.push(`/survey`)}>
          <CardHeader>
            <CardTitle>Group Member 1</CardTitle>
            <CardDescription>Group 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>STAC67</p>
          </CardContent>
            </button>
        </Card>
        


        
        <Card className="flex-1">
          <button type="button" onClick={() => router.push(`/survey/`)}>
          <CardHeader>
            <CardTitle>Group Member 2</CardTitle>
            <CardDescription>Group: 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>STAC67</p>
          </CardContent>
          </button>
        </Card>

       
        <Card className="flex-1">
           <button type="button" onClick={() => router.push(`/survey/`)}>
          <CardHeader>
            <CardTitle>Group Member 3</CardTitle>
            <CardDescription>Group: 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>STAC67</p>
          </CardContent>
          </button>
        </Card>
        
      </div>
    </div>
  );
};

export default Group;