import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateNoteItem } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('updateNote event is running: ', event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // DONE_TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event)
    await updateNoteItem(userId, todoId, updatedTodo)
    
    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
