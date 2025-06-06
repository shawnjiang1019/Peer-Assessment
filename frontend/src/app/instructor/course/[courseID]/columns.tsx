"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}


export type StudentData = {
    utorid: string;
    fname: string;
    lname: string;
    email: string;
    status: "pending" | "submitted" | "not finished"
    studentNumber: number;
}
export const columns: ColumnDef<StudentData>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "utorid",
    header: "UTORID",
  },

  {
    accessorKey: "student_id",
    header: "Student Number",
  },

  {
    accessorKey: "firstname",
    header: "First Name",
  },

  {
    accessorKey: "lastname",
    header: "Last Name",
  },
]