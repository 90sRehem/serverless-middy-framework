import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Controller } from "../types/controller";
import { HttpRequest, HttpResponse } from "../types/http";

export class FileUploadTriggerController implements Controller<any> {
  constructor(private readonly dynamoClient: DynamoDBClient) {}
  async handler(request: HttpRequest<any>): Promise<HttpResponse> {}
}
