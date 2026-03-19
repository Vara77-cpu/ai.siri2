export default function Leaderboard(){

  const users = [
    {name:"Ravi",score:120},
    {name:"Anjali",score:100},
    {name:"Kiran",score:80}
  ]

  return(

    <div>

      <h2 className="text-xl font-bold mb-4">
        Leaderboard
      </h2>

      {users.map((u,i)=>(
        <div key={i} className="flex justify-between p-2 border-b">

          <span>{u.name}</span>
          <span>{u.score}</span>

        </div>
      ))}

    </div>
  )
}