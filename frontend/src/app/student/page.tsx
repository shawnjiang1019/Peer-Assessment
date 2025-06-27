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

import { StudentService, Group } from "./studentlogic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { group } from "console";


const Student = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();
  const [ studentServiceInstance ] = useState(() => new StudentService());

  const [groups, setGroups] = useState<Group[]>([]);

  //get groups and set them
  useEffect(()=> {
    const fetchGroups = async () => {
      if (isAuthenticated && user?.sub){
        const response = await studentServiceInstance.getGroups(313785);
        
        if (response){
          setGroups(response);
        } 
      
      }
    };
    if (isAuthenticated && user?.sub) {
      fetchGroups();
    }

    
    

  }, [isAuthenticated, user?.sub, studentServiceInstance])
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-6">
        You have the following surveys to complete:
      </h2>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {groups.length > 0 ? (
                groups.map((group) => (
                    
                    
                        <Card key={`${group.id}`} className="hover:shadow-lg transition-shadow">
                        <button type="button" onClick={() => router.push(`student/survey/${group.id}/${group.courseID}/${group.courseCode}`)}>
                        <CardHeader>
                            <CardTitle>{group.courseCode}</CardTitle>
                            <CardDescription>Group {group.groupNumber} </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Group ID: {group.id}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <p>Begin Survey</p>
                        </CardFooter>
                        </button>
                    
                    </Card>

                
                    
                ))
            ) : (
                <div className="text-gray-500">No groups found for this student, ID = {user?.id}</div>
            )}
        </div>

      

      
      
      {/* <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between p-4">
        <button type="button" onClick={() => router.push(`student/course/`)}>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>STAC67</CardTitle>
            <CardDescription>Group 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Regression Analysis</p>
          </CardContent>
        </Card>
        </button>


        <button type="button" onClick={() => router.push(``)}>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>CSCC01</CardTitle>
            <CardDescription>Group: 4</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Intro to Software Engineering</p>
          </CardContent>
        </Card>
        </button>

        <button type="button" onClick={() => router.push(``)}>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>CSCC01</CardTitle>
            <CardDescription>Group: 4</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Intro to Software Engineering</p>
          </CardContent>
        </Card>
        </button>

      </div> */}
    </div>
  );
};

export default Student;