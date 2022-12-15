import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getTodoById } from '../../businessLogic/todos';


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const user_id = getUserId(event)
    const todoId = event.pathParameters.todoId

    console.log(" start getTodosForUser")
    console.log(" user_id: " + user_id)
    console.log(" todoId: " + todoId)
    const todo = await getTodoById(user_id, todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: todo
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
