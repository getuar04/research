import { Kafka } from "kafkajs";
import { env } from "../config/env.js";

export const kafka = new Kafka({
  clientId: env.kafkaClientId,
  brokers: [env.kafkaBroker],
});