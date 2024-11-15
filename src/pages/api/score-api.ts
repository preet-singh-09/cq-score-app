import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

const openAIClient = new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const requestJSON = JSON.parse(req.body);

    const githubURL = requestJSON.githubURL;
    const fileSHA = requestJSON.fileSHA;

    const tokens = githubURL.split('/');
    const domainIndex = tokens.indexOf('github.com') == -1 ? tokens.indexOf('www.github.com') : tokens.indexOf('github.com');

    const userName = tokens[domainIndex + 1];
    const repoName = tokens[domainIndex + 2];


    const response = await fetch('https://api.github.com/repos/' + userName + '/' + repoName + '/git/blobs/' + fileSHA, {
        method: 'GET',
    })


    if (response.status == 200) {
        const responseJson = await response.json();
        const fileContent = atob(responseJson.content);
        // console.log(fileContent);


        const output = await openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: "give an overall code quality score(on a scale of 1 to 10) and explanation in json format {score,explanation} for the code " + fileContent
                }
            ],
            stream: false,
        });

        // stream:true
        // for await (const chunk of stream) {
        //     process.stdout.write(chunk.choices[0]?.delta?.content || "");
        // }

        if (output) {
            if (output.choices) {
                if (output.choices.length > 0) {
                    if (output.choices[0].message) {
                        res.status(200).json({ fileContent: responseJson.content, message: output.choices[0].message });
                    }
                }
            }
        }
    }

    res.status(200).json({ error: true, message: 'error' });
}