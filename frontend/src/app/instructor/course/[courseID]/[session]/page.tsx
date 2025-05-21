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