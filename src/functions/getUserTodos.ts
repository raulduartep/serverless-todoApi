import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;

  try {
    const todosResponse = await document
      .query({
        TableName: "todos",
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(todosResponse.Items),
      headers: {
        "Content-type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
  }
};
