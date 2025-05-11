import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "../../application/clients/dynamo-client";

export async function handler(event) {
  const records = event.Records;
  const commands = records.map((record) => {
    return new UpdateItemCommand({
      TableName: process.env.PROFILE_PICTURE_TABLE,
      Key: {
        fileKey: { S: decodeURIComponent(record.s3.object.key) },
      },
      UpdateExpression: "SET #status = :status REMOVE #expiresAt = :expiresAt",
      ExpressionAttributeNames: {
        "#status": "status",
        "#expiresAt": "expiresAt",
      },
      ExpressionAttributeValues: {
        ":status": { S: "UPLOADED" },
      },
    });
  });

  await Promise.all(commands.map((command) => dynamoClient.send(command)));
}
