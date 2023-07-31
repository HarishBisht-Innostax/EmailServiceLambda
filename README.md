# EmailServiceLambda
Email Service Lambda Code


Sample Event JSON when triggered via queue

 ```
    {
  "eventSourceArn": "arn:aws:mq:ap-south-1:669028435072:broker:rabbitmqinno:b-aca54ccf-f004-4b40-9880-a186022724e7",
  "rmqMessagesByQueue": {
    "demo-queue::/": [
      {
        "basicProperties": {
          "contentType": null,
          "contentEncoding": null,
          "headers": [],
          "deliveryMode": null,
          "priority": null,
          "correlationId": "724fc196-dfb7-4324-9eee-4e04f0c87f40",
          "replyTo": "amq.gen-Vg0bI45gjBd5r9LVanukRA",
          "expiration": "10",
          "messageId": null,
          "timestamp": null,
          "type": null,
          "userId": null,
          "appId": null,
          "clusterId": null,
          "bodySize": 39
        },
        "redelivered": false,
        "data": "eyJvcGVyYXRpb24iOiJzdW0iLCJudW0xIjoxMCwibnVtMiI6MjV9"
      }
    ]
  },
  "eventSource": "aws:rmq"
}
 ```



