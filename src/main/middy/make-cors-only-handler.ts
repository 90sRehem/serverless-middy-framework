import middy from "@middy/core";

export function makeCorsOnlyHandler() {
  return middy().handler(async () => {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: "",
    };
  });
}
