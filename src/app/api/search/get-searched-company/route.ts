
import prisma from "../../../../constants/prisma";


export  async function GET (req : Request){
  const {searchParams}= new URL(req.url)

  const queryParam = {
    query : searchParams.get("query")
  }
   
    if (!queryParam.query) {
        throw new Error("Invalid Query Parameter")
    }
    const searchedCompanies  = await prisma.company.findMany({
        where : {
           OR : [
            {
                email : {
                    contains : queryParam.query
                }
            } ,
            {
                name : {
                    contains : queryParam.query
                }
            }
           ]
        } ,
        select : {
            sokcetRoomName: true,
            createdAt: true,
            name: true,
            email: true,
            id: true,
            avatar: true,
            headline : true
        }
    })

   
    

    if (!searchedCompanies) {
        return Response.json({
            success : false ,
            message  : "cant find any Companies with this query"
        })
    }

    return Response.json({
        success : true ,
        message : "Companies fetched with this query",
        companies : searchedCompanies
    })
   

    }