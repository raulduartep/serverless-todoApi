import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { v4 as uuid } from "uuid";

type IBody = {
  title: string;
  deadline: string;
};

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as IBody;

  try {
    const todos = {
      id: uuid(),
      title,
      done: false,
      deadline: new Date(deadline).toISOString(),
      userId,
    };

    await document
      .put({
        TableName: "todos",
        Item: todos,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Todo created",
        todo: todos,
      }),
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
