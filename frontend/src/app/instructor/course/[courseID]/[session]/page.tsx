"use client"
import { useEffect } from "react";


const data = [
  {
    Group: "group_1",
    Name: "Shawn",
    Email: "test1@gmail.com",
    factor: "1",
  },
  {
    Group: "group_1",
    Name: "Sean",
    Email: "test2@gmail.com",
    factor: "1",
  },
  {
    Group: "group_1",
    Name: "Shaun",
    Email: "test2@gmail.com",
    factor: "1",
  },
  
]

export default function Page({
  params,
}: {
  params: { courseID: string; session: string }
}) {


    
  return (
    <Table>
      <TableCaption>A list of your students in {params.courseID}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Group</TableHead>
          <TableHead className="text-right">Factor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datapoint) => (
          <TableRow key={datapoint.Group}>
            <TableCell className="font-medium">{datapoint.Name}</TableCell>
            <TableCell>{datapoint.Email}</TableCell>
            <TableCell>{datapoint.Group}</TableCell>
            <TableCell className="text-right">{datapoint.factor}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
  )
}


// interface Student {
//   id: number;
//   email: string;
//   name: string;
// }

// interface Group {
//   id: number;
//   courseCode: string;
// }

// const fetchGroups = async (courseID: string) => {
//   const groups = await fetch(`http://127.0.0.1:8080/groups/${courseID}`);
//   const



//   useEffect( () => {

//   }, [])
// }

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Group } from "lucide-react";




