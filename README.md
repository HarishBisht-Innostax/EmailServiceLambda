# EmailServiceLambda
Email Service Lambda Code


Sample Event JSON when triggered via queue

 ```
    {
  "eventSourceArn": "",
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
          "replyTo": "",
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
        "data": ""
      }
    ]
  },
  "eventSource": "aws:rmq"
}
 ```



