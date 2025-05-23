import { useEffect } from "react";

export default function Page({
  params,
}: {
  params: { courseID: string; session: string }
}) {


    
  return (
    <div>
      <h1>Course ID: {params.courseID}</h1>
      <h2>Session ID: {params.session}</h2>
    </div>
  )
}


interface Student {
  id: number;
  email: string;
  name: string;
}

const fetchGroups = async (courseID: string) => {
  const groups = await fetch(`http://127.0.0.1:8080/groups/${courseID}`);



  useEffect( () => {

  }, [])
}