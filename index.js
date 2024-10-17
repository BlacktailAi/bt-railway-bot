const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const router = express.Router();
const { Telegraf } = require("telegraf");

if (fs.existsSync(".env")) {
  dotenv.config();
}

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  throw new Error(
    "Please set the TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables"
  );
}

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function sendMessage(message, buttontext, buttonurl) {
  await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, {
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: buttontext,
            url: buttonurl,
          },
        ],
      ],
    },
  });
}

router.post("/webhook", (req, res) => {
  let data = req.body;
  console.log(data)
  if (data.type === "DEPLOY" && data.status === "SUCCESS") {
    sendMessage(
      `<b>Deployment: ${data.deployment.meta.repo}</b>\n\✅ Status: <code>${data.status}</code>\n🌳 Environment: <code>${data.environment.name}</code>\n👨‍💻 Creator: <code>${data.deployment.meta.commitAuthor}</code>`,
      "View Deployment",
      `https://railway.app/project/${data.project.id}/`
    );
  } else if (data.type === "DEPLOY" && data.status === "BUILDING") {
    sendMessage(
      `<b>Deployment: ${data.deployment.meta.repo}</b>\n\⚒️ Status: <code>${data.status}</code>\n🌳 Environment: <code>${data.environment.name}</code>\n👨‍💻 Creator: <code>${data.deployment.meta.commitAuthor}</code>`,
      "View Deployment",
      `https://railway.app/project/${data.project.id}/`
    );
  } else if (data.type === "DEPLOY" && data.status === "DEPLOYING") {
    sendMessage(
      `<b>Deployment: ${data.deployment.meta.repo}</b>\n\🚀 Status: <code>${data.status}</code>\n🌳 Environment: <code>${data.environment.name}</code>\n👨‍💻 Creator: <code>${data.deployment.meta.commitAuthor}</code>`,
      "View Deployment",
      `https://railway.app/project/${data.project.id}/`
    );
  } else if (data.type === "DEPLOY" && data.status === "CRASHED") {
    sendMessage(
      `<b>Deployment: ${data.deployment.meta.repo}</b>\n\❌ Status: <code>${data.status}</code>\n🌳 Environment: <code>${data.environment.name}</code>\n👨‍💻 Creator: <code>${data.deployment.meta.commitAuthor}</code>`,
      "View Deployment",
      `https://railway.app/project/${data.project.id}/`
    );
  } else if (data.type === "DEPLOY" && data.status === "NEEDS_APPROVAL") {
    sendMessage(
      `<b>Deployment: ${data.deployment.meta.repo}</b>\n⌛️ Status: <code>${data.status}</code>\n🌳 Environment: <code>${data.environment.name}</code>\n👨‍💻 Creator: <code>${data.deployment.meta.commitAuthor}</code>`,
      "View Deployment",
      `https://railway.app/project/${data.project.id}/`
    );
  } else {
    console.log("Unknown event: ", data);
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res
    .status(405)
    .send(
      "405 Method Not Allowed. Please see the README.md - https://github.com/agam778/github-to-telegram#readme"
    );
});

app.get("/webhook", (req, res) => {
  res
    .status(405)
    .send(
      "405 Method Not Allowed. Please see the README.md - https://github.com/agam778/github-to-telegram#readme"
    );
});

app.use("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening on port ${PORT}`);
});
