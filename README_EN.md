# [Weekly Report](https://weeklyreport.avemaria.fun/)


This project generate weekly report with simple sentence for you using AI.

[![Weekly Report](./public/screenshot.jpg)](https://weeklyreport.avemaria.fun/zh)

## How it works

This project uses the [OpenAI GPT-3 API](https://openai.com/api/) (specifically, text-davinci-003) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. It constructs a prompt based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://vercel.com/new/clone?repository-url=https://github.com/guaguaguaxia/weekly_report&env=OPENAI_API_KEY,NEXT_PUBLIC_USE_USER_KEY&project-name=weekly_report&repo-name=weekly_report)

NEXT_PUBLIC_USE_USER_KEY = false

## Docker Deployment

```bash
docker run -d -p 3000:3000 --name weekly_report-docker -e OPENAI_API_KEY=sk-xxxxx ihxrainbow/weekly_report-docker
```

docker-compose.yml
```yaml
services:
  weekly_report-docker:
    container_name: weekly_report-docker
    ports:
      - '3000:3000'
    image: ihxrainbow/weekly_report-docker
    environment:
      # API key
      - OPENAI_API_KEY=sk-xxxxx
```

<!-- https://www.seotraininglondon.org/gpt3-business-email-generator/ -->

## Credits

Inspired by [TwtterBio](https://github.com/Nutlope/twitterbio) and [zhengbangbo](https://github.com/zhengbangbo/chat-simplifier).


